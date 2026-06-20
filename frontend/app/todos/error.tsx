"use client";

// 에러 발생 시 보여줄 화면. App Router 의 에러 경계(Error Boundary).
// FastAPI 서버가 꺼져 있거나 요청이 실패하면 이 화면이 표시된다.
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-[440px] px-4 py-12 text-center">
      <h1 className="mb-2 text-[22px] font-bold text-danger">문제가 발생했어요</h1>
      <p className="mb-6 text-sm text-muted">
        데이터를 불러오지 못했습니다. 백엔드 서버(localhost:8000)가 실행 중인지 확인해주세요.
      </p>
      <button
        onClick={reset}
        className="rounded-[10px] bg-primary px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        다시 시도
      </button>
    </main>
  );
}
