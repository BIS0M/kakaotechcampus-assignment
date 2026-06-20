// =====================================================================
//  FilterTabs — 상태 필터 탭 (전체 / 진행 중 / 완료)
//
//  [도전 미션] 필터 상태를 URL(?filter=) 로 관리한다.
//  Link 로 이동하므로 새로고침·공유·뒤로가기에도 필터가 유지된다.
//  실제 필터링은 서버(FastAPI)에서 처리된다.
// =====================================================================
import Link from "next/link";
import { buildTodosHref } from "@/lib/url";
import type { FilterValue } from "@/lib/types";

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

interface FilterTabsProps {
  date: string;
  current: FilterValue;
  search: string;
}

export default function FilterTabs({ date, current, search }: FilterTabsProps) {
  return (
    <div className="mt-4 flex gap-1.5">
      {FILTERS.map((f) => {
        const isActive = current === f.value;
        return (
          <Link
            key={f.value}
            href={buildTodosHref({ date, filter: f.value, search })}
            className={
              "flex-1 rounded-lg border py-2 text-center text-[13px] font-semibold transition-colors " +
              (isActive
                ? "border-primary bg-primary text-white"
                : "border-border bg-transparent text-muted hover:border-primary hover:text-primary")
            }
          >
            {f.label}
          </Link>
        );
      })}
    </div>
  );
}
