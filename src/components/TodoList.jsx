import TodoItem from "./TodoItem.jsx";

function TodoList({
  todos = [],
  onToggle,
  onStartEdit,
  onSaveEdit,
  onDelete,
}) {
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
