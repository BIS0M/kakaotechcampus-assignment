import { useState, useEffect } from "react";
import WeekView from "./components/WeekView.jsx";
import DayView from "./components/DayView.jsx";
import TodoForm from "./components/TodoForm.jsx";
import FilterTabs from "./components/FilterTabs.jsx";
import TodoList from "./components/TodoList.jsx";
import { getDateKey, addDays } from "./utils/date.js";
import { loadTodos, saveTodos } from "./utils/storage.js";

const SELECTED_DATE_KEY = "selectedDate";

function loadSelectedDate() {
  const saved = localStorage.getItem(SELECTED_DATE_KEY);
  if (!saved) return new Date();
  const parsed = new Date(saved);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function App() {
  const [todos, setTodos] = useState(() => loadTodos());
  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() => loadSelectedDate());
  const [inputAlert, setInputAlert] = useState("");

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(SELECTED_DATE_KEY, getDateKey(selectedDate));
  }, [selectedDate]);

  function addTodo(text) {
    const trimmedText = text.trim();

    if (trimmedText === "") {
      setInputAlert("할 일을 입력해주세요.");
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: trimmedText,
      completed: false,
      isEditing: false,
      date: getDateKey(selectedDate),
    };

    setTodos((prev) => [...prev, newTodo]);
    setInputAlert("");
  }

  function toggleCompleted(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function startEditing(id) {
    setTodos((prev) =>
      prev.map((todo) => ({ ...todo, isEditing: todo.id === id }))
    );
  }

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

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function moveDay(dayOffset) {
    setSelectedDate((prev) => addDays(prev, dayOffset));
  }

  function moveWeek(weekOffset) {
    setSelectedDate((prev) => addDays(prev, weekOffset * 7));
  }

  const selectedDateKey = getDateKey(selectedDate);

  const visibleTodos = todos
    .filter((todo) => todo.date === selectedDateKey)
    .filter((todo) => {
      if (currentFilter === "active") return !todo.completed;
      if (currentFilter === "completed") return todo.completed;
      return true;
    });

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
