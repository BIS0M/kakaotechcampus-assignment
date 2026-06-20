// =====================================================================
//  app/todos/page.tsx — Todo 목록 페이지 (Server Component)
//
//  URL 검색 파라미터(date/filter/search)를 읽어 서버(actions.ts)에서
//  FastAPI를 직접 호출해 데이터를 가져온 뒤 렌더링한다.
//  - 데이터 표시(WeekView/DayView/FilterTabs/TodoList)는 Server Component
//  - 사용자 입력이 필요한 검색창(SearchBar)만 Client + Suspense
// =====================================================================
import Link from "next/link";
import { Suspense } from "react";
import WeekView from "@/components/WeekView";
import DayView from "@/components/DayView";
import FilterTabs from "@/components/FilterTabs";
import SearchBar from "@/components/SearchBar";
import TodoList from "@/components/TodoList";
import { getTodos, getCounts } from "@/app/actions";
import { getDateKey, parseDateKey } from "@/lib/date";
import { buildTodosHref } from "@/lib/url";
import type { FilterValue } from "@/lib/types";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TodosPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  // 날짜 기본값은 '오늘'. 필터 기본값은 'all', 검색 기본값은 빈 문자열.
  const date = first(sp.date) ?? getDateKey(new Date());
  const filterRaw = first(sp.filter);
  const filter: FilterValue =
    filterRaw === "active" || filterRaw === "completed" ? filterRaw : "all";
  const search = first(sp.search) ?? "";

  const selectedDate = parseDateKey(date);

  // 서버에서 FastAPI 직접 호출 (목록 + 날짜별 개수)
  const [todos, counts] = await Promise.all([
    getTodos({ date, filter, search }),
    getCounts(),
  ]);

  const backHref = buildTodosHref({ date, filter, search });
  const newHref = `/todos/new?date=${date}&from=${encodeURIComponent(backHref)}`;

  return (
    <main className="mx-auto w-full max-w-[440px] px-4 py-12">
      <h1 className="mb-4 text-[28px] font-bold text-primary">Todo</h1>

      <WeekView selectedDate={selectedDate} filter={filter} search={search} counts={counts} />
      <DayView selectedDate={selectedDate} filter={filter} search={search} />

      <Link
        href={newHref}
        className="block rounded-[10px] bg-primary py-3 text-center text-[15px] font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        + 새 할 일 추가
      </Link>

      {/* useSearchParams 를 쓰는 검색창은 Suspense 로 감싼다 */}
      <Suspense fallback={<div className="mt-4 h-[42px]" />}>
        <SearchBar />
      </Suspense>

      <FilterTabs date={date} current={filter} search={search} />

      <TodoList todos={todos} backHref={backHref} />
    </main>
  );
}
