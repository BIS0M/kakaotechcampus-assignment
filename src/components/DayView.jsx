// =====================================================================
//  DayView — 일간 뷰 헤더 (선택 날짜 표시 + 이전/다음 날짜 이동)
//
//  [마이그레이션]
//  - Vanilla: 별도 일간 헤더가 없고 주간 뷰 클릭으로만 날짜를 바꿨다.
//  - React  : 선택 날짜를 "6월 9일 (월)" 형태로 보여주고, 화살표로 하루 단위 이동(onMoveDay).
//             selectedDate가 바뀌면 App의 visibleTodos가 다시 계산되어 목록도 함께 바뀐다.
// =====================================================================
import { isSameDate, WEEKDAY_NAMES } from "../utils/date.js";

function DayView({ selectedDate, onMoveDay }) {
  const isToday = isSameDate(selectedDate, new Date());
  const label =
    `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일` +
    ` (${WEEKDAY_NAMES[selectedDate.getDay()]})`;

  return (
    <div className="mb-4 flex items-center justify-between">
      <button
        onClick={() => onMoveDay(-1)}
        aria-label="이전 날짜"
        className="h-8 w-8 rounded-lg text-xl leading-none text-primary transition-colors hover:bg-surface"
      >
        ‹
      </button>

      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-text">{label}</span>
        {/* 오늘이면 '오늘' 배지 표시 (조건부 렌더링) */}
        {isToday && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-white">
            오늘
          </span>
        )}
      </div>

      <button
        onClick={() => onMoveDay(1)}
        aria-label="다음 날짜"
        className="h-8 w-8 rounded-lg text-xl leading-none text-primary transition-colors hover:bg-surface"
      >
        ›
      </button>
    </div>
  );
}

export default DayView;
