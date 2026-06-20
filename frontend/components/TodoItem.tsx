"use client";

// =====================================================================
//  TodoItem — Todo 한 항목 (Client Component)
//
//  [2차 과제와 비교]
//  - 2차: 부모가 내려준 콜백으로 localStorage 상태를 바꿨다.
//  - 3차: 완료 토글/삭제를 route.ts(/api/todos/:id) 로 요청해 서버 DB를 바꾸고,
//         router.refresh() 로 Server Component(목록)를 다시 불러온다.
//  - 수정은 별도 페이지(/todos/:id) 로 이동(Link)한다.
// =====================================================================
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { CheckIcon, PencilIcon, XIcon } from "./icons";
import type { Todo } from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

interface TodoItemProps {
  todo: Todo;
  backHref: string; // 수정 페이지에서 돌아올 목록 주소(날짜/필터/검색 유지)
}

export default function TodoItem({ todo, backHref }: TodoItemProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggleCompleted() {
    setBusy(true);
    await fetch(`${API}/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    router.refresh(); // 서버 컴포넌트 목록 갱신
    setBusy(false);
  }

  async function remove() {
    setBusy(true);
    await fetch(`${API}/todos/${todo.id}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  const editHref = `/todos/${todo.id}?from=${encodeURIComponent(backHref)}`;

  return (
    <li className="flex items-center gap-2.5 rounded-[10px] border border-border bg-surface px-3.5 py-3">
      <span className={"flex-1 break-all text-[15px] " + (todo.completed ? "text-muted line-through" : "")}>
        {todo.text}
      </span>

      <div className="flex flex-shrink-0 gap-1.5">
        <Link
          href={editHref}
          aria-label="수정"
          title="수정"
          className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-border bg-white px-2 text-text transition-colors hover:border-primary hover:text-primary"
        >
          <PencilIcon />
        </Link>

        <button
          onClick={toggleCompleted}
          disabled={busy}
          aria-label={todo.completed ? "완료 취소" : "완료"}
          title={todo.completed ? "완료 취소" : "완료"}
          className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-success bg-success px-2 text-white transition-colors hover:border-success-dark hover:bg-success-dark disabled:opacity-50"
        >
          <CheckIcon />
        </button>

        <button
          onClick={remove}
          disabled={busy}
          aria-label="삭제"
          title="삭제"
          className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-danger bg-danger px-2 text-white transition-colors hover:border-danger-dark hover:bg-danger-dark disabled:opacity-50"
        >
          <XIcon />
        </button>
      </div>
    </li>
  );
}
