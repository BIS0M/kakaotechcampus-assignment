// =====================================================================
//  FilterTabs — 상태별 필터 탭 (전체 / 진행 중 / 완료)
//
//  [마이그레이션]
//  - Vanilla: filterTabs에 이벤트 위임으로 클릭을 받고, classList.toggle("is-active")로
//             선택 탭 스타일을 직접 바꾸며 currentFilter 전역 변수를 갱신했다.
//  - React  : 현재 필터 값(currentFilter)은 App이 state로 갖고, 여기서는 표시와
//             클릭 전달(onChange)만 한다. 활성 스타일도 currentFilter 비교로 자동 결정.
// =====================================================================
const FILTERS = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

function FilterTabs({ currentFilter, onChange }) {
  return (
    <div className="mt-4 flex gap-1.5">
      {FILTERS.map((filter) => {
        // [마이그레이션] Vanilla처럼 클래스를 직접 토글하지 않고, 현재 필터와 비교해
        //   활성 여부(isActive)를 계산한 뒤 className을 조건부로 적용한다.
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
