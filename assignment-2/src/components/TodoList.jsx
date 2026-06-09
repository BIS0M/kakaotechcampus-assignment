import TodoItem from "./TodoItem.jsx";

// 필터링된 Todo 목록을 렌더링.
// props 기본값(todos = [])으로 "Cannot read properties of undefined" 에러를 예방한다.
function TodoList({
  todos = [],
  onToggle,
  onStartEdit,
  onSaveEdit,
  onDelete,
}) {
  // 표시할 Todo가 없으면 빈 상태 안내를 보여준다.
  if (todos.length === 0) {
    return (
      <p className="mt-6 py-6 text-center text-sm text-muted">
        표시할 할 일이 없어요.
      </p>
    );
  }

  return (
    <ul className="mt-4 flex flex-col gap-2">
      {todos.map((todo) => (
        // index 대신 고유한 id를 key로 사용한다.
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onStartEdit={onStartEdit}
          onSaveEdit={onSaveEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TodoList;
