// =====================================================================
//  actions.ts — 서버에서 FastAPI를 "직접" 호출하는 읽기 함수 모음
//
//  [역할 구분]
//  - actions.ts : Server Component가 직접 호출하는 서버 함수 (여기서는 목록/단건 조회)
//  - route.ts   : 클라이언트의 HTTP 요청(생성/수정/삭제)을 FastAPI로 전달하는 프록시
//
//  BACKEND_URL 은 NEXT_PUBLIC_ 접두사가 없으므로 서버에서만 읽을 수 있다.
//  → FastAPI 주소가 브라우저로 노출되지 않는다.
// =====================================================================
import type { Todo } from "@/lib/types";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

interface GetTodosParams {
  date?: string;
  filter?: string;
  search?: string;
}

// 목록 조회 (날짜 / 필터 / 검색을 FastAPI 쿼리로 전달 → 서버에서 필터링)
export async function getTodos(params: GetTodosParams = {}): Promise<Todo[]> {
  const query = new URLSearchParams();
  if (params.date) query.set("date", params.date);
  if (params.filter && params.filter !== "all") query.set("filter", params.filter);
  if (params.search) query.set("search", params.search);

  const res = await fetch(`${BACKEND_URL}/todos?${query.toString()}`, {
    cache: "no-store", // 항상 최신 데이터를 받도록 캐시 비활성화
  });
  if (!res.ok) throw new Error("Todo 목록을 불러오지 못했습니다.");
  return res.json();
}

// 단건 조회 (수정 페이지에서 기존 값 로드용)
export async function getTodo(id: number): Promise<Todo> {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, { cache: "no-store" });
  if (res.status === 404) throw new Error("존재하지 않는 Todo입니다.");
  if (!res.ok) throw new Error("Todo를 불러오지 못했습니다.");
  return res.json();
}

// 날짜별 개수 맵 (주간 뷰 배지용)
export async function getCounts(): Promise<Record<string, number>> {
  const res = await fetch(`${BACKEND_URL}/todos/counts`, { cache: "no-store" });
  if (!res.ok) throw new Error("개수 정보를 불러오지 못했습니다.");
  return res.json();
}
