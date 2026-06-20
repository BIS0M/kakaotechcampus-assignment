import type { FilterValue } from "./types";

// /todos 의 검색 파라미터 모음
export interface TodoQuery {
  date: string;
  filter?: FilterValue;
  search?: string;
}

// 객체 → "/todos?date=...&filter=...&search=..." 문자열 생성.
// 기본값(all 필터, 빈 검색)은 URL을 깔끔히 유지하기 위해 생략한다.
export function buildTodosHref(query: TodoQuery): string {
  const params = new URLSearchParams();
  params.set("date", query.date);
  if (query.filter && query.filter !== "all") params.set("filter", query.filter);
  if (query.search) params.set("search", query.search);
  return `/todos?${params.toString()}`;
}
