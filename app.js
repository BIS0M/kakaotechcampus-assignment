// =====================================================================
//  Vanilla JS Todo - CRUD + 상태 필터 + 주간 뷰 + 로컬스토리지
//  todos 배열을 단일 상태로 두고, 변경될 때마다 화면을 다시 그린다.
//  상태가 바뀔 때마다 로컬스토리지에 저장하고, 시작 시 불러온다.
// =====================================================================

/* ---------- 1. DOM 요소 참조 ---------- */
const todoForm = document.getElementById("todoForm"); // 입력 폼
const todoInput = document.getElementById("todoInput"); // 텍스트 입력창
const inputAlert = document.getElementById("inputAlert"); // 빈 입력 안내 메시지
const filterTabs = document.getElementById("filterTabs"); // 필터 탭 영역
const todoList = document.getElementById("todoList"); // Todo 목록(ul)
const emptyState = document.getElementById("emptyState"); // 빈 상태 안내
const prevWeekButton = document.getElementById("prevWeekButton"); // 이전 주차 버튼
const nextWeekButton = document.getElementById("nextWeekButton"); // 다음 주차 버튼
const weekRangeLabel = document.getElementById("weekRangeLabel"); // 주차 기간 표시
const weekDays = document.getElementById("weekDays"); // 7개 날짜 칸이 들어갈 영역

/* ---------- 2. 상태(State) ---------- */
// 로컬스토리지에 데이터를 저장할 때 사용할 키
const STORAGE_KEY = "todos";

// 각 Todo: { id, text, completed, isEditing, date }
//  - date: "YYYY-MM-DD" 형식의 날짜 키 (이 Todo가 속한 날짜)
// 시작할 때 로컬스토리지에서 저장된 Todo를 불러온다.
let todos = loadTodos();

// 현재 선택된 필터: "all"(전체) | "active"(진행 중) | "completed"(완료)
let currentFilter = "all";

// 현재 선택된 날짜 (주간 뷰에서 클릭한 날짜). 오늘 날짜로 시작.
let selectedDate = new Date();

/* ---------- 날짜 유틸 ---------- */
// Date 객체 → "YYYY-MM-DD" 키 문자열 (Todo 저장/비교에 사용)
function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 두 Date가 같은 날짜인지 비교 (날짜 키로 비교)
function isSameDate(dateA, dateB) {
  return getDateKey(dateA) === getDateKey(dateB);
}

// 주어진 날짜가 속한 주의 '월요일' Date를 반환
function getMonday(date) {
  const monday = new Date(date);
  const day = monday.getDay(); // 0(일) ~ 6(토)
  // 일요일이면 6일 전, 그 외에는 (요일-1)일 전이 월요일
  const diffToMonday = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diffToMonday);
  return monday;
}

// 선택된 날짜를 기준으로 같은 주 안의 7개 날짜(월~일) 배열 생성
function getWeekDates() {
  const monday = getMonday(selectedDate);
  const week = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    week.push(date);
  }
  return week;
}

// 선택 주차를 weekOffset(주 단위)만큼 이동 (선택 날짜를 7일씩 옮김)
function moveWeek(weekOffset) {
  selectedDate.setDate(selectedDate.getDate() + weekOffset * 7);
  render();
}

// 특정 날짜를 선택 (주간 뷰에서 날짜 칸 클릭 시)
function selectDate(date) {
  selectedDate = date;
  render();
}

/* ---------- 로컬스토리지 연동 ---------- */
// 현재 todos 배열을 JSON 문자열로 변환해 로컬스토리지에 저장
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 로컬스토리지에서 데이터를 읽어와 배열로 복원
function loadTodos() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  // 저장된 데이터가 없으면 빈 배열로 시작
  if (!savedData) return [];

  // 데이터가 손상돼 파싱에 실패해도 앱이 멈추지 않도록 예외 처리한다.
  try {
    // JSON 문자열을 다시 배열로 변환.
    // 수정 모드(isEditing)는 저장하지 않고 항상 false로 복원한다.
    const parsedTodos = JSON.parse(savedData);
    return parsedTodos.map((todo) => ({ ...todo, isEditing: false }));
  } catch {
    return [];
  }
}

/* ---------- 3. 상태 변경 함수 (Create / Update / Delete) ---------- */

// [Create] 새 Todo 추가
function addTodo(text) {
  const trimmedText = text.trim();

  // 입력값이 비어 있으면 생성하지 않고 안내 메시지 표시
  if (trimmedText === "") {
    showInputAlert("할 일을 입력해주세요.");
    return;
  }

  todos.push({
    id: Date.now(), // 시간값으로 간단히 고유 ID 생성
    text: trimmedText,
    completed: false,
    isEditing: false,
    date: getDateKey(selectedDate), // 현재 선택된 날짜를 함께 저장
  });

  saveTodos(); // 변경 사항을 로컬스토리지에 저장
  clearInputAlert();
  render(); // 목록 + 주간 뷰 개수 배지 갱신
}

// [Update] 완료 상태 토글
function toggleCompleted(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos(); // 변경 사항을 로컬스토리지에 저장
  renderTodos();
}

// [Update] 수정 모드로 전환
function startEditing(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, isEditing: true } : todo
  );
  renderTodos();
}

// [Update] 수정 내용 저장
function saveEditing(id, newText) {
  const trimmedText = newText.trim();

  // 수정 내용이 비어 있으면 안내만 하고 수정 모드 유지
  if (trimmedText === "") {
    showInputAlert("내용을 입력해주세요.");
    return;
  }

  todos = todos.map((todo) =>
    todo.id === id
      ? { ...todo, text: trimmedText, isEditing: false }
      : todo
  );

  saveTodos(); // 변경 사항을 로컬스토리지에 저장
  clearInputAlert();
  renderTodos();
}

// [Delete] Todo 삭제
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos(); // 변경 사항을 로컬스토리지에 저장
  render(); // 목록 + 주간 뷰 개수 배지 갱신
}

/* ---------- 4. 안내 메시지 헬퍼 ---------- */
function showInputAlert(message) {
  inputAlert.textContent = message;
}

function clearInputAlert() {
  inputAlert.textContent = "";
}

/* ---------- 5. 필터링 ---------- */
// 선택된 날짜 + 선택된 상태 필터를 모두 만족하는 Todo만 골라서 반환
function getFilteredTodos() {
  const selectedDateKey = getDateKey(selectedDate);

  // 1) 먼저 현재 보고 있는 날짜의 Todo만 추린다.
  const todosOfSelectedDate = todos.filter(
    (todo) => todo.date === selectedDateKey
  );

  // 2) 그다음 상태 필터(전체/진행 중/완료)를 적용한다.
  switch (currentFilter) {
    case "active": // 진행 중(미완료)만
      return todosOfSelectedDate.filter((todo) => !todo.completed);
    case "completed": // 완료만
      return todosOfSelectedDate.filter((todo) => todo.completed);
    default: // 전체
      return todosOfSelectedDate;
  }
}

// 특정 날짜 키에 해당하는 Todo 개수 (주간 뷰 배지에 사용)
function countTodosByDate(dateKey) {
  return todos.filter((todo) => todo.date === dateKey).length;
}

/* ---------- 6. 렌더링 ---------- */
// 화면 전체를 다시 그린다 (주간 뷰 + 목록).
function render() {
  renderWeekView();
  renderTodos();
}

// 주간 뷰: 기간 라벨 + 월~일 7개 날짜 칸을 그린다.
function renderWeekView() {
  const weekDates = getWeekDates();
  const today = new Date();

  // 기간 라벨 (예: "6월 1일 - 6월 7일")
  const firstDay = weekDates[0];
  const lastDay = weekDates[6];
  weekRangeLabel.textContent =
    `${firstDay.getMonth() + 1}월 ${firstDay.getDate()}일` +
    ` - ${lastDay.getMonth() + 1}월 ${lastDay.getDate()}일`;

  // 날짜 칸 다시 그리기
  weekDays.innerHTML = "";
  weekDates.forEach((date) => {
    weekDays.appendChild(createWeekDayElement(date, today));
  });
}

// 주간 뷰의 날짜 한 칸(요일/날짜/개수) 생성
function createWeekDayElement(date, today) {
  const weekdayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dateKey = getDateKey(date);
  const todoCount = countTodosByDate(dateKey);

  const dayButton = document.createElement("button");
  dayButton.className = "week-day";
  if (isSameDate(date, today)) dayButton.classList.add("is-today"); // 오늘 강조
  if (isSameDate(date, selectedDate)) dayButton.classList.add("is-selected"); // 선택 강조

  // 요일
  const weekday = document.createElement("span");
  weekday.className = "week-day__weekday";
  weekday.textContent = weekdayNames[date.getDay()];

  // 날짜(일)
  const dateNumber = document.createElement("span");
  dateNumber.className = "week-day__date";
  dateNumber.textContent = date.getDate();

  // Todo 개수 배지 (0개면 빈 배지로 자리만 유지)
  const countBadge = document.createElement("span");
  countBadge.className = "week-day__count" + (todoCount === 0 ? " is-empty" : "");
  countBadge.textContent = todoCount;

  // 날짜 칸을 클릭하면 그 날짜를 선택
  dayButton.addEventListener("click", () => selectDate(date));

  dayButton.append(weekday, dateNumber, countBadge);
  return dayButton;
}

function renderTodos() {
  // 목록을 비우고 현재 필터에 맞는 Todo만 다시 그린다.
  todoList.innerHTML = "";

  const filteredTodos = getFilteredTodos();
  filteredTodos.forEach((todo) => {
    todoList.appendChild(createTodoElement(todo));
  });

  // 표시할 Todo가 없으면 빈 상태 안내를 보여준다.
  emptyState.classList.toggle("is-hidden", filteredTodos.length > 0);
}

// Todo 하나에 대한 <li> 요소 생성
function createTodoElement(todo) {
  const li = document.createElement("li");
  li.className = "todo-item" + (todo.completed ? " is-completed" : "");

  // 수정 모드면 입력창, 아니면 텍스트를 보여준다.
  if (todo.isEditing) {
    li.appendChild(createEditInput(todo));
  } else {
    li.appendChild(createTextSpan(todo));
  }

  li.appendChild(createButtonGroup(todo));
  return li;
}

// 일반 모드: 할 일 텍스트
function createTextSpan(todo) {
  const span = document.createElement("span");
  span.className = "todo-item__text";
  span.textContent = todo.text;
  return span;
}

// 수정 모드: 인라인 입력창 (Enter로 저장)
function createEditInput(todo) {
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "todo-item__edit-input";
  editInput.value = todo.text;

  // Enter 키를 누르면 저장
  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      saveEditing(todo.id, editInput.value);
    }
  });

  // 수정 모드 진입 시 자동으로 포커스되도록 약간의 지연 후 focus
  setTimeout(() => editInput.focus(), 0);

  return editInput;
}

// 항목별 버튼 그룹 (수정/저장 · 완료 · 삭제)
function createButtonGroup(todo) {
  const buttonGroup = document.createElement("div");
  buttonGroup.className = "todo-item__buttons";

  // 수정 또는 저장 버튼 (수정 모드에 따라 역할이 바뀐다)
  const editButton = document.createElement("button");
  editButton.className = "todo-item__button todo-item__button--edit";

  if (todo.isEditing) {
    // 수정 모드: '저장' 버튼 → 같은 li 안의 입력값을 읽어 저장
    editButton.textContent = "저장";
    editButton.addEventListener("click", () => {
      const editInput = editButton
        .closest(".todo-item")
        .querySelector(".todo-item__edit-input");
      saveEditing(todo.id, editInput.value);
    });
  } else {
    // 일반 모드: '수정' 버튼 → 수정 모드로 전환
    editButton.textContent = "수정";
    editButton.addEventListener("click", () => startEditing(todo.id));
  }

  // 완료 버튼 (완료/취소 토글)
  const completeButton = document.createElement("button");
  completeButton.className = "todo-item__button todo-item__button--complete";
  completeButton.textContent = todo.completed ? "취소" : "완료";
  completeButton.addEventListener("click", () => toggleCompleted(todo.id));

  // 삭제 버튼
  const deleteButton = document.createElement("button");
  deleteButton.className = "todo-item__button todo-item__button--delete";
  deleteButton.textContent = "삭제";
  deleteButton.addEventListener("click", () => deleteTodo(todo.id));

  buttonGroup.append(editButton, completeButton, deleteButton);
  return buttonGroup;
}

/* ---------- 7. 이벤트 바인딩 ---------- */
// 폼 제출(추가 버튼 클릭 또는 Enter)로 새 Todo 생성
todoForm.addEventListener("submit", (e) => {
  e.preventDefault(); // 새로고침 방지
  addTodo(todoInput.value);
  todoInput.value = "";
  todoInput.focus();
});

// 필터 탭 클릭 (이벤트 위임: 탭이 늘어도 리스너 하나로 처리)
filterTabs.addEventListener("click", (e) => {
  const clickedTab = e.target.closest(".filter-tabs__tab");
  if (!clickedTab) return;

  // 선택된 필터 값 갱신 (data-filter 속성에서 읽음)
  currentFilter = clickedTab.dataset.filter;

  // 선택된 탭에만 활성 스타일(is-active) 적용
  filterTabs.querySelectorAll(".filter-tabs__tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab === clickedTab);
  });

  renderTodos();
});

// 주차 이동: 이전 주(-1주) / 다음 주(+1주)
prevWeekButton.addEventListener("click", () => moveWeek(-1));
nextWeekButton.addEventListener("click", () => moveWeek(1));

/* ---------- 8. 초기 렌더 ---------- */
render();
