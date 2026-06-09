import { useState, useEffect } from "react";
import WeekView from "./components/WeekView.jsx";
import DayView from "./components/DayView.jsx";
import TodoForm from "./components/TodoForm.jsx";
import FilterTabs from "./components/FilterTabs.jsx";
import TodoList from "./components/TodoList.jsx";
import { getDateKey, addDays } from "./utils/date.js";
import { loadTodos, saveTodos } from "./utils/storage.js";

// =====================================================================
//  App: 모든 상태를 한 곳에서 관리하는 최상위 컴포넌트.
//  1차 과제의 전역 변수(todos / currentFilter / selectedDate)를 useState로 옮겼고,
//  렌더링은 상태가 바뀌면 React가 자동으로 다시 그린다. (render() 호출 불필요)
//
//  각 Todo: { id, text, completed, isEditing, date }
//   - date: "YYYY-MM-DD" 형식의 날짜 키 (이 Todo가 속한 날짜)
// =====================================================================

const SELECTED_DATE_KEY = "selectedDate";

// 선택 날짜 초기값: 로컬스토리지에 저장된 날짜가 있으면 복원, 없으면 오늘.
// (도전 미션: 새로고침 후에도 선택한 주차/날짜가 유지되도록 함)
function loadSelectedDate() {
  const saved = localStorage.getItem(SELECTED_DATE_KEY);
  if (!saved) return new Date();
  const parsed = new Date(saved);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function App() {
  // 함수형 초기화: localStorage 접근/파싱은 최초 마운트 시 딱 한 번만 실행
  const [todos, setTodos] = useState(() => loadTodos());
  const [currentFilter, setCurrentFilter] = useState("all"); // all | active | completed
  const [selectedDate, setSelectedDate] = useState(() => loadSelectedDate());
  const [inputAlert, setInputAlert] = useState(""); // 빈 입력 안내 메시지

  // todos가 바뀔 때마다 자동으로 로컬스토리지에 저장.
  // 1차 과제처럼 함수마다 saveTodos를 호출하지 않고 여기 한 곳에서 처리한다.
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  // 선택 날짜가 바뀔 때마다 저장 (새로고침 후 같은 날짜/주차 유지)
  useEffect(() => {
    localStorage.setItem(SELECTED_DATE_KEY, getDateKey(selectedDate));
  }, [selectedDate]);

  /* ---------- 상태 변경 함수 (Create / Update / Delete) ---------- */

  // [Create] 새 Todo 추가 — 현재 선택된 날짜에 저장
  function addTodo(text) {
    const trimmedText = text.trim();

    // 입력값이 비어 있으면 생성하지 않고 안내 메시지 표시
    if (trimmedText === "") {
      setInputAlert("할 일을 입력해주세요.");
      return;
    }

    const newTodo = {
      id: Date.now(), // 시간값으로 간단히 고유 ID 생성
      text: trimmedText,
      completed: false,
      isEditing: false,
      date: getDateKey(selectedDate), // 현재 선택된 날짜를 함께 저장
    };

    setTodos((prev) => [...prev, newTodo]);
    setInputAlert("");
  }

  // [Update] 완료 상태 토글
  function toggleCompleted(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  // [Update] 수정 모드로 전환 (한 번에 하나만 수정하도록 나머지는 false)
  function startEditing(id) {
    setTodos((prev) =>
      prev.map((todo) => ({ ...todo, isEditing: todo.id === id }))
    );
  }

  // [Update] 수정 내용 저장
  function saveEditing(id, newText) {
    const trimmedText = newText.trim();

    // 수정 내용이 비어 있으면 안내만 하고 수정 모드 유지
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

  // [Delete] Todo 삭제
  function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  /* ---------- 날짜 이동 ---------- */
  function moveDay(dayOffset) {
    setSelectedDate((prev) => addDays(prev, dayOffset));
  }

  function moveWeek(weekOffset) {
    setSelectedDate((prev) => addDays(prev, weekOffset * 7));
  }

  /* ---------- 파생 데이터 (선택 날짜 + 필터 적용) ---------- */
  const selectedDateKey = getDateKey(selectedDate);

  // 1) 현재 보고 있는 날짜의 Todo만 추리고  2) 상태 필터를 적용
  const visibleTodos = todos
    .filter((todo) => todo.date === selectedDateKey)
    .filter((todo) => {
      if (currentFilter === "active") return !todo.completed;
      if (currentFilter === "completed") return todo.completed;
      return true; // all
    });

  // 주간 뷰 배지용: 특정 날짜 키에 해당하는 Todo 개수
  function countTodosByDate(dateKey) {
    return todos.filter((todo) => todo.date === dateKey).length;
  }

  return (
    <main className="mx-auto w-full max-w-[440px] px-4 py-12">
      <h1 className="mb-4 text-[28px] font-bold text-primary">Todo</h1>

      {/* 주간 뷰 (도전 미션): 날짜 클릭 시 선택 날짜 변경 */}
      <WeekView
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onMoveWeek={moveWeek}
        countByDate={countTodosByDate}
      />

      {/* 일간 뷰 헤더: 선택 날짜 표시 + 이전/다음 날짜 이동 */}
      <DayView selectedDate={selectedDate} onMoveDay={moveDay} />

      {/* 입력 폼 + 빈 입력 안내 */}
      <TodoForm onAdd={addTodo} alert={inputAlert} />

      {/* 상태별 필터 탭 */}
      <FilterTabs currentFilter={currentFilter} onChange={setCurrentFilter} />

      {/* 선택 날짜 + 필터에 맞는 Todo 목록 */}
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
