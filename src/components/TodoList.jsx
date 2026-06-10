// =====================================================================
//  TodoList — 필터링된 Todo 목록 (Vanilla의 renderTodos를 컴포넌트로 이전)
//
//  [마이그레이션]
//  - Vanilla: todoList.innerHTML="" 후 createTodoElement로 li를 직접 만들어 appendChild,
//             빈 상태는 emptyState.classList.toggle로 보였다 숨겼다 했다.
//  - React  : 부모가 내려준 todos 배열을 map으로 렌더링하고, 비어 있으면 빈 상태 문구를
//             대신 반환한다. DOM 직접 조작이 전혀 없다.
// =====================================================================
import TodoItem from "./TodoItem.jsx";

// props 기본값(todos = [])으로 "Cannot read properties of undefined" 에러를 예방
function TodoList({
  todos = [],
  onToggle,
  onStartEdit,
  onSaveEdit,
  onDelete,
}) {
  // 빈 상태: Vanilla의 emptyState 토글 대신, 항목이 없으면 안내 문구를 반환한다.
  if (todos.length === 0) {
    return (
      <p className="mt-6 py-6 text-center text-sm text-muted">
        표시할 할 일이 없어요.
      </p>
    );
  }

  return (
    <ul className="mt-4 flex flex-col gap-2">
      {/* [확인 포인트 - 필터 변경 시 재렌더] 부모(App)에서 내려준 todos(필터링된 목록)가
          바뀌면 이 map이 다시 실행되어 목록이 새로 그려진다.
          key={todo.id}로 각 항목을 추적해 변경된 항목만 효율적으로 갱신한다. */}
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
