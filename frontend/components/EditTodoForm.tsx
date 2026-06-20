"use client";

// =====================================================================
//  EditTodoForm — Todo 수정 폼 (Client Component, /todos/:id 에서 사용)
//
//  기존 값은 Server Component(page.tsx)가 actions.ts 로 불러와 prop 으로 내려준다.
//  저장 시 route.ts(/api/todos/:id) 로 PUT → 목록으로 돌아간 뒤 새로고침.
// =====================================================================
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Todo } from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

interface EditTodoFormProps {
  todo: Todo;
  backHref: string;
}

export default function EditTodoForm({ todo, backHref }: EditTodoFormProps) {
  const router = useRouter();
  const [text, setText] = useState(todo.text);
  const [completed, setCompleted] = useState(todo.completed);
  const [alert, setAlert] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setAlert("내용을 입력해주세요.");
      return;
    }

    setBusy(true);
    const res = await fetch(`${API}/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed, completed }),
    });
    setBusy(false);

    if (!res.ok) {
      setAlert("수정에 실패했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    router.push(backHref);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoComplete="off"
        autoFocus
        className="w-full rounded-[10px] border border-border px-3.5 py-3 text-[15px] outline-none transition-colors focus:border-primary"
      />
      <p className="mx-0.5 mt-2 min-h-5 text-[13px] text-danger">{alert}</p>

      <label className="mt-1 flex items-center gap-2 text-[14px] text-text">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          className="h-4 w-4 accent-[var(--color-primary)]"
        />
        완료됨으로 표시
      </label>

      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="flex-1 rounded-[10px] bg-primary py-3 text-[15px] font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          저장
        </button>
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="rounded-[10px] border border-border px-5 text-[15px] font-semibold text-muted transition-colors hover:border-primary hover:text-primary"
        >
          취소
        </button>
      </div>
    </form>
  );
}
