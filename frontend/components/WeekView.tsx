// =====================================================================
//  WeekView — 주간 뷰 (Server Component)
//
//  [2차 과제와 비교]
//  - 2차: onClick + setState 로 selectedDate 를 바꿨다(클라이언트 상태).
//  - 3차: 상태를 URL(?date=) 로 관리하므로, 클릭 대신 <Link> 로 이동만 한다.
//         따라서 "use client" 가 필요 없는 Server Component 로 둘 수 있다.
//         (현재 필터/검색은 링크에 그대로 실어 유지한다)
// =====================================================================
import Link from "next/link";
import {
  getDateKey,
  isSameDate,
  getWeekDates,
  addDays,
  formatWeekRange,
  WEEKDAY_NAMES,
} from "@/lib/date";
import { buildTodosHref } from "@/lib/url";
import type { FilterValue } from "@/lib/types";

interface WeekViewProps {
  selectedDate: Date;
  filter: FilterValue;
  search: string;
  counts: Record<string, number>;
}

export default function WeekView({ selectedDate, filter, search, counts }: WeekViewProps) {
  const weekDates = getWeekDates(selectedDate);
  const today = new Date();

  const prevWeekHref = buildTodosHref({ date: getDateKey(addDays(selectedDate, -7)), filter, search });
  const nextWeekHref = buildTodosHref({ date: getDateKey(addDays(selectedDate, 7)), filter, search });

  return (
    <section className="mb-5 rounded-[10px] border border-border bg-surface px-3 pb-3 pt-2.5">
      <div className="mb-2 flex items-center justify-between">
        <Link href={prevWeekHref} aria-label="이전 주" className="flex h-[30px] w-[30px] items-center justify-center rounded-lg text-xl leading-none text-primary transition-colors hover:bg-bg">
          ‹
        </Link>
        <span className="text-sm font-semibold text-text">{formatWeekRange(weekDates)}</span>
        <Link href={nextWeekHref} aria-label="다음 주" className="flex h-[30px] w-[30px] items-center justify-center rounded-lg text-xl leading-none text-primary transition-colors hover:bg-bg">
          ›
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date) => {
          const dateKey = getDateKey(date);
          const todoCount = counts[dateKey] ?? 0;
          const isToday = isSameDate(date, today);
          const isSelected = isSameDate(date, selectedDate);

          return (
            <Link
              key={dateKey}
              href={buildTodosHref({ date: dateKey, filter, search })}
              className={
                "flex flex-col items-center gap-1 rounded-lg border py-1.5 transition-colors " +
                (isSelected ? "border-primary " : "border-transparent ") +
                (isToday ? "bg-[#efe7fc] " : "hover:bg-bg")
              }
            >
              <span className="text-[11px] text-muted">{WEEKDAY_NAMES[date.getDay()]}</span>
              <span className={"text-[15px] font-semibold " + (isToday ? "text-primary" : "text-text")}>
                {date.getDate()}
              </span>
              <span
                className={
                  "h-4 min-w-4 rounded-lg px-1 text-center text-[10px] leading-4 " +
                  (todoCount === 0 ? "bg-transparent text-transparent" : "bg-primary text-white")
                }
              >
                {todoCount}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
