"use client";

// =====================================================================
//  SearchBar — 검색창 (Client Component) [도전 미션]
//
//  - 입력값을 URL(?search=) 로 관리한다. 실제 검색은 서버(FastAPI)에서 처리.
//  - 키 입력마다 요청하지 않도록 300ms 디바운스를 적용해 요청 수를 줄인다.
//  - useSearchParams 를 사용하므로 부모 페이지에서 <Suspense> 로 감싸야 한다.
// =====================================================================
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 입력값 로컬 상태 (URL 의 현재 search 값으로 초기화)
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    // URL 이 바뀌면(예: 뒤로가기) 입력값도 동기화
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (value === current) return; // 변화 없으면 라우팅하지 않음

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("search", value);
      else params.delete("search");
      router.replace(`/todos?${params.toString()}`);
    }, 300); // 디바운스

    return () => clearTimeout(timer);
  }, [value, searchParams, router]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="할 일 검색"
      autoComplete="off"
      className="mt-4 w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-primary"
    />
  );
}
