// =====================================================================
//  VanillaJS Todo 앱
//  - DOM 조작 + 이벤트 핸들링 + localStorage 영속화
// =====================================================================

/* ---------- 1. DOM 요소 참조 ---------- */
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const filters = document.getElementById("filters");
const emptyMessage = document.getElementById("empty-message");
const todoCount = document.getElementById("todo-count");
const clearCompletedBtn = document.getElementById("clear-completed");

/* ---------- 2. 상태(State) ---------- */
const STORAGE_KEY = "todo-vanilla.items";

// todos: { id: number, text: string, completed: boolean }[]
let todos = loadTodos();
let currentFilter = "all"; // "all" | "active" | "completed"

/* ---------- 3. localStorage 입출력 ---------- */
function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("저장된 할 일을 불러오지 못했습니다:", e);
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

/* ---------- 4. 상태 변경 함수 ---------- */
function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  todos.push({
    id: Date.now(), // 간단한 고유 ID
    text: trimmed,
    completed: false,
  });
  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  render();
}

/* ---------- 5. 필터링 ---------- */
function getFilteredTodos() {
  switch (currentFilter) {
    case "active":
      return todos.filter((todo) => !todo.completed);
    case "completed":
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
}

/* ---------- 6. 렌더링 ---------- */
function render() {
  const filtered = getFilteredTodos();

  // 목록 비우고 다시 그리기
  list.innerHTML = "";

  filtered.forEach((todo) => {
    list.appendChild(createTodoElement(todo));
  });

  // 빈 상태 안내 토글
  emptyMessage.classList.toggle("is-hidden", filtered.length > 0);

  // 진행 중 개수 표시
  const remaining = todos.filter((todo) => !todo.completed).length;
  todoCount.textContent = `${remaining}개 진행 중`;
}

// 할 일 1개에 대한 <li> 생성
function createTodoElement(todo) {
  const li = document.createElement("li");
  li.className = "todo-item" + (todo.completed ? " is-completed" : "");
  li.dataset.id = todo.id;

  // 완료 체크박스
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-item__checkbox";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => toggleTodo(todo.id));

  // 할 일 텍스트 (클릭해도 완료 토글)
  const span = document.createElement("span");
  span.className = "todo-item__text";
  span.textContent = todo.text;
  span.addEventListener("click", () => toggleTodo(todo.id));

  // 삭제 버튼
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "todo-item__delete";
  deleteBtn.textContent = "✕";
  deleteBtn.setAttribute("aria-label", "삭제");
  deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

  li.append(checkbox, span, deleteBtn);
  return li;
}

/* ---------- 7. 이벤트 바인딩 ---------- */
// 새 할 일 추가
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo(input.value);
  input.value = "";
  input.focus();
});

// 필터 버튼 (이벤트 위임)
filters.addEventListener("click", (e) => {
  const button = e.target.closest(".filters__button");
  if (!button) return;

  currentFilter = button.dataset.filter;

  // 활성 버튼 스타일 갱신
  filters.querySelectorAll(".filters__button").forEach((btn) => {
    btn.classList.toggle("is-active", btn === button);
  });

  render();
});

// 완료 항목 일괄 삭제
clearCompletedBtn.addEventListener("click", clearCompleted);

/* ---------- 8. 초기 렌더 ---------- */
render();
