// =====================================================================
//  DayView — 일간 뷰 헤더 (Server Component)
//  선택 날짜 표시 + 이전/다음 날짜 이동(Link). 오늘이면 '오늘' 배지.
// =====================================================================
import Link from "next/link";
import { getDateKey, isSameDate, addDays, formatDayLabel } from "@/lib/date";
import { buildTodosHref } from "@/lib/url";
import type { FilterValue } from "@/lib/types";

interface DayViewProps {
  selectedDate: Date;
  filter: FilterValue;
  search: string;
}

export default function DayView({ selectedDate, filter, search }: DayViewProps) {
  const isToday = isSameDate(selectedDate, new Date());
  const prevHref = buildTodosHref({ date: getDateKey(addDays(selectedDate, -1)), filter, search });
  const nextHref = buildTodosHref({ date: getDateKey(addDays(selectedDate, 1)), filter, search });

  return (
    <div className="mb-4 flex items-center justify-between">
      <Link href={prevHref} aria-label="이전 날짜" className="flex h-8 w-8 items-center justify-center rounded-lg text-xl leading-none text-primary transition-colors hover:bg-surface">
        ‹
      </Link>
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-text">{formatDayLabel(selectedDate)}</span>
        {isToday && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-white">오늘</span>
        )}
      </div>
      <Link href={nextHref} aria-label="다음 날짜" className="flex h-8 w-8 items-center justify-center rounded-lg text-xl leading-none text-primary transition-colors hover:bg-surface">
        ›
      </Link>
    </div>
  );
}
