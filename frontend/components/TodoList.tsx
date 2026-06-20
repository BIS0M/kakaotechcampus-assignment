// =====================================================================
//  TodoList — 필터링된 Todo 목록 (Server Component)
//  부모(page.tsx)가 서버에서 받아온 todos 배열을 렌더링한다.
//  데이터가 없으면 빈 상태 문구를 보여준다.
// =====================================================================
import TodoItem from "./TodoItem";
import type { Todo } from "@/lib/types";

interface TodoListProps {
  todos: Todo[];
  backHref: string;
}

export default function TodoList({ todos, backHref }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="mt-6 py-6 text-center text-sm text-muted">표시할 할 일이 없어요.</p>;
  }

  return (
    <ul className="mt-4 flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} backHref={backHref} />
      ))}
    </ul>
  );
}
