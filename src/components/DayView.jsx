import { isSameDate, WEEKDAY_NAMES } from "../utils/date.js";

// 일간 뷰 헤더.
// 선택된 날짜를 "6월 9일 (월)" 형태로 보여주고, 이전/다음 날짜로 이동할 수 있다.
// 오늘이면 "오늘" 배지를 함께 표시한다.
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
