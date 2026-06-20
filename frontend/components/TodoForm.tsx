"use client";

// =====================================================================
//  TodoForm — Todo 생성 폼 (Client Component, /todos/new 에서 사용)
//
//  제출 시 route.ts(/api/todos) 로 POST → FastAPI 가 DB에 저장.
//  성공하면 해당 날짜의 목록 페이지로 이동(router.push) 후 새로고침.
// =====================================================================
import { useRouter } from "next/navigation";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

interface TodoFormProps {
  date: string; // 새 Todo가 속할 날짜 "YYYY-MM-DD"
  backHref: string; // 저장 후 돌아갈 목록 주소
}

export default function TodoForm({ date, backHref }: TodoFormProps) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [alert, setAlert] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setAlert("할 일을 입력해주세요.");
      return;
    }

    setBusy(true);
    const res = await fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed, date }),
    });
    setBusy(false);

    if (!res.ok) {
      setAlert("저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
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
        placeholder="할 일을 입력하세요"
        autoComplete="off"
        autoFocus
        className="w-full rounded-[10px] border border-border px-3.5 py-3 text-[15px] outline-none transition-colors focus:border-primary"
      />
      <p className="mx-0.5 mt-2 min-h-5 text-[13px] text-danger">{alert}</p>

      <div className="mt-2 flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="flex-1 rounded-[10px] bg-primary py-3 text-[15px] font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          추가
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
