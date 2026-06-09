import {
  getDateKey,
  isSameDate,
  getWeekDates,
  WEEKDAY_NAMES,
} from "../utils/date.js";

// 주간 뷰 (도전 미션).
// selectedDate가 속한 주의 월~일 7칸을 보여주고, 날짜 클릭 시 일간 뷰의 선택 날짜를 바꾼다.
// 주차 이동(이전/다음)도 선택 날짜를 7일씩 옮기는 방식으로 처리한다.
function WeekView({ selectedDate, onSelectDate, onMoveWeek, countByDate }) {
  const weekDates = getWeekDates(selectedDate);
  const today = new Date();

  // 기간 라벨 (예: "6월 1일 - 6월 7일")
  const firstDay = weekDates[0];
  const lastDay = weekDates[6];
  const rangeLabel =
    `${firstDay.getMonth() + 1}월 ${firstDay.getDate()}일` +
    ` - ${lastDay.getMonth() + 1}월 ${lastDay.getDate()}일`;

  return (
    <section className="mb-5 rounded-[10px] border border-border bg-surface px-3 pb-3 pt-2.5">
      {/* 주차 이동 헤더 (이전 ‹ / 기간 / 다음 ›) */}
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => onMoveWeek(-1)}
          aria-label="이전 주"
          className="h-[30px] w-[30px] rounded-lg text-xl leading-none text-primary transition-colors hover:bg-bg"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-text">{rangeLabel}</span>
        <button
          onClick={() => onMoveWeek(1)}
          aria-label="다음 주"
          className="h-[30px] w-[30px] rounded-lg text-xl leading-none text-primary transition-colors hover:bg-bg"
        >
          ›
        </button>
      </div>

      {/* 월~일 7칸을 가로로 균등 배치 */}
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date) => {
          const dateKey = getDateKey(date);
          const todoCount = countByDate(dateKey);
          const isToday = isSameDate(date, today);
          const isSelected = isSameDate(date, selectedDate);

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(date)}
              className={
                "flex flex-col items-center gap-1 rounded-lg border py-1.5 transition-colors " +
                (isSelected ? "border-primary " : "border-transparent ") +
                (isToday ? "bg-[#efe7fc] " : "hover:bg-bg")
              }
            >
              {/* 요일 */}
              <span className="text-[11px] text-muted">
                {WEEKDAY_NAMES[date.getDay()]}
              </span>
              {/* 날짜(일) — 오늘이면 메인 컬러로 강조 */}
              <span
                className={
                  "text-[15px] font-semibold " +
                  (isToday ? "text-primary" : "text-text")
                }
              >
                {date.getDate()}
              </span>
              {/* Todo 개수 배지 (0개면 투명 처리해 자리만 유지) */}
              <span
                className={
                  "h-4 min-w-4 rounded-lg px-1 text-[10px] leading-4 " +
                  (todoCount === 0
                    ? "bg-transparent text-transparent"
                    : "bg-primary text-white")
                }
              >
                {todoCount}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default WeekView;
