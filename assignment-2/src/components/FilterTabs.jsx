// 상태별 필터 탭 (전체 / 진행 중 / 완료).
// 현재 필터 값은 App이 useState로 관리하고, 여기서는 표시 + 클릭 전달만 한다.
const FILTERS = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

function FilterTabs({ currentFilter, onChange }) {
  return (
    <div className="mt-4 flex gap-1.5">
      {FILTERS.map((filter) => {
        const isActive = currentFilter === filter.value;
        return (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={
              "flex-1 rounded-lg border py-2 text-[13px] font-semibold transition-colors " +
              (isActive
                ? "border-primary bg-primary text-white"
                : "border-border bg-transparent text-muted hover:border-primary hover:text-primary")
            }
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;
