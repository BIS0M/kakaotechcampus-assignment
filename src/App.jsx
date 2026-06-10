// =====================================================================
//  App.jsx — 앱의 최상위 컴포넌트 (Vanilla JS app.js의 "두뇌" 역할을 이전)
//
//  [마이그레이션 개요]
//  - Vanilla: 전역 변수 todos / currentFilter / selectedDate 를 두고, 변경 때마다
//             render()를 직접 호출해 화면을 다시 그렸다.
//  - React  : 위 값들을 useState로 관리한다. 상태가 바뀌면 React가 자동으로 리렌더하므로
//             render() 호출이 사라졌다. CRUD·필터·날짜·저장 로직을 App에 모으고,
//             표시는 하위 컴포넌트에 props로 값/함수를 내려 담당시킨다.
// =====================================================================
import { useState, useEffect } from "react";
import WeekView from "./components/WeekView.jsx";
import DayView from "./components/DayView.jsx";
import TodoForm from "./components/TodoForm.jsx";
import FilterTabs from "./components/FilterTabs.jsx";
import TodoList from "./components/TodoList.jsx";
import { getDateKey, addDays } from "./utils/date.js";
import { loadTodos, saveTodos } from "./utils/storage.js";

const SELECTED_DATE_KEY = "selectedDate";

// 선택 날짜 초기값을 localStorage에서 복원 (없거나 잘못되면 오늘 날짜)
function loadSelectedDate() {
  const saved = localStorage.getItem(SELECTED_DATE_KEY);
  if (!saved) return new Date();
  const parsed = new Date(saved);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function App() {
  // [확인 포인트 - useState 선언 위치/역할] 앱의 모든 상태를 App 한 곳에서 선언해 관리한다.
  //  - todos: 할 일 목록(배열). 최초 마운트 시 localStorage에서 불러온다.
  //  - currentFilter: 상태 필터 값 ("all" | "active" | "completed")
  //  - selectedDate: 현재 보고 있는 날짜 (일간/주간 뷰의 기준)
  //  - inputAlert: 빈 입력 등 안내 메시지
  // [마이그레이션] Vanilla의 전역 변수 3개 → React의 useState로 이전. 추가로 빈 입력 안내도
  //   Vanilla에선 DOM(inputAlert.textContent)에 직접 썼지만 여기선 inputAlert 상태로 관리한다.
  const [todos, setTodos] = useState(() => loadTodos());
  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() => loadSelectedDate());
  const [inputAlert, setInputAlert] = useState("");

  // [확인 포인트 - useEffect 의존성 배열] 의존성 배열에 todos를 넣는다.
  // todos가 바뀔 때마다(추가/수정/완료/삭제) 자동으로 localStorage에 저장하기 위함이다.
  // [마이그레이션] Vanilla는 add/toggle/delete 함수마다 saveTodos()를 직접 호출했지만,
  //   React는 이 useEffect 하나로 모든 변경을 자동 저장한다.
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  // [확인 포인트 - 주간 뷰 새로고침 유지(도전)] 선택한 날짜/주차를 localStorage에 저장한다.
  // 초기값을 loadSelectedDate()로 복원하므로 새로고침 후에도 선택한 주차가 그대로 유지된다.
  useEffect(() => {
    localStorage.setItem(SELECTED_DATE_KEY, getDateKey(selectedDate));
  }, [selectedDate]);

  // [Create] 새 Todo 추가
  // [마이그레이션] Vanilla: todos.push(...) → saveTodos() → render().
  //   React: setTodos로 새 배열을 만들어 교체(불변 업데이트)하면 저장/렌더는 자동.
  function addTodo(text) {
    const trimmedText = text.trim();

    // 빈 입력이면 생성하지 않고 안내 메시지만 표시
    if (trimmedText === "") {
      setInputAlert("할 일을 입력해주세요.");
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: trimmedText,
      completed: false,
      isEditing: false,
      // [확인 포인트 - Todo 날짜 저장 형태] date는 "YYYY-MM-DD" 문자열 키로 저장된다.
      // 생성 시 현재 선택된 날짜가 함께 저장되어, 날짜별로 Todo가 따로 관리된다.
      date: getDateKey(selectedDate),
    };

    setTodos((prev) => [...prev, newTodo]);
    setInputAlert("");
  }

  // [Update] 완료 토글
  // [마이그레이션] Vanilla의 todos.map(...) + renderTodos()를 setTodos 하나로 대체.
  function toggleCompleted(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  // [Update] 수정 모드 진입
  // [마이그레이션] Vanilla는 prompt() 팝업으로 수정했지만, React는 isEditing 상태를 켜서
  //   해당 항목만 인라인 입력창으로 전환한다. (한 번에 하나만 수정되도록 나머지는 false)
  function startEditing(id) {
    setTodos((prev) =>
      prev.map((todo) => ({ ...todo, isEditing: todo.id === id }))
    );
  }

  // [Update] 수정 내용 저장
  function saveEditing(id, newText) {
    const trimmedText = newText.trim();

    if (trimmedText === "") {
      setInputAlert("내용을 입력해주세요.");
      return;
    }

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, text: trimmedText, isEditing: false }
          : todo
      )
    );
    setInputAlert("");
  }

  // [Delete] 삭제
  // [마이그레이션] Vanilla의 todos.filter(...) + render()를 setTodos로 대체.
  function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  // 일/주 단위 날짜 이동
  // [마이그레이션] Vanilla는 selectedDate.setDate(...)로 같은 객체를 직접 수정했지만,
  //   React는 addDays로 '새 Date 객체'를 만들어 setSelectedDate에 넣는다(불변 업데이트).
  function moveDay(dayOffset) {
    setSelectedDate((prev) => addDays(prev, dayOffset));
  }

  function moveWeek(weekOffset) {
    setSelectedDate((prev) => addDays(prev, weekOffset * 7));
  }

  const selectedDateKey = getDateKey(selectedDate);

  // [확인 포인트 - 필터 변경 시 TodoList 재렌더] currentFilter나 selectedDate가 바뀌면
  // App이 다시 렌더되면서 visibleTodos가 새로 계산되고, 그 값이 TodoList로 내려가
  // 목록이 자동으로 다시 그려진다. (DOM을 직접 숨기고 보여주지 않는다)
  // [마이그레이션] Vanilla는 querySelectorAll로 DOM을 찾아 직접 숨기고 보여줬지만,
  //   React는 "선택 날짜로 추리고 → 상태 필터 적용"한 파생 배열만 만들면 끝이다.
  const visibleTodos = todos
    .filter((todo) => todo.date === selectedDateKey)
    .filter((todo) => {
      if (currentFilter === "active") return !todo.completed;
      if (currentFilter === "completed") return todo.completed;
      return true;
    });

  // 주간 뷰 배지용: 특정 날짜의 Todo 개수
  function countTodosByDate(dateKey) {
    return todos.filter((todo) => todo.date === dateKey).length;
  }

  return (
    <main className="mx-auto w-full max-w-[440px] px-4 py-12">
      <h1 className="mb-4 text-[28px] font-bold text-primary">Todo</h1>

      <WeekView
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onMoveWeek={moveWeek}
        countByDate={countTodosByDate}
      />

      <DayView selectedDate={selectedDate} onMoveDay={moveDay} />

      <TodoForm onAdd={addTodo} alert={inputAlert} />

      <FilterTabs currentFilter={currentFilter} onChange={setCurrentFilter} />

      <TodoList
        todos={visibleTodos}
        onToggle={toggleCompleted}
        onStartEdit={startEditing}
        onSaveEdit={saveEditing}
        onDelete={deleteTodo}
      />
    </main>
  );
}

export default App;
