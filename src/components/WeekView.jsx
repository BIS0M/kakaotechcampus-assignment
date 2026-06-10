// =====================================================================
//  WeekView — 주간 뷰 (도전 미션). Vanilla의 renderWeekView / createWeekDayElement를 이전
//
//  [마이그레이션]
//  - Vanilla: weekDays.innerHTML="" 후 createElement로 날짜 칸 7개를 직접 만들고,
//             is-today / is-selected 클래스를 직접 붙였다.
//  - React  : selectedDate가 속한 주의 7개 날짜를 map으로 렌더링하고, 오늘/선택 강조도
//             isSameDate 비교로 className을 조건부 적용한다. 날짜 클릭/주차 이동은
//             부모(App)의 콜백(onSelectDate / onMoveWeek)을 호출한다.
// =====================================================================
import {
  getDateKey,
  isSameDate,
  getWeekDates,
  WEEKDAY_NAMES,
} from "../utils/date.js";

function WeekView({ selectedDate, onSelectDate, onMoveWeek, countByDate }) {
  // 선택 날짜가 속한 주의 월~일 7개 날짜
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
      {/* 주차 이동 헤더: Vanilla의 prevWeekButton/nextWeekButton 리스너 → onMoveWeek 호출 */}
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

      {/* 7개 날짜 칸을 map으로 렌더링 (Vanilla의 forEach + appendChild 대체) */}
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date) => {
          const dateKey = getDateKey(date);
          const todoCount = countByDate(dateKey); // 날짜별 Todo 개수 배지
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
              <span className="text-[11px] text-muted">
                {WEEKDAY_NAMES[date.getDay()]}
              </span>
              <span
                className={
                  "text-[15px] font-semibold " +
                  (isToday ? "text-primary" : "text-text")
                }
              >
                {date.getDate()}
              </span>
              {/* 개수 0이면 투명 처리해 자리만 유지 (Vanilla의 .is-empty 배지 처리와 동일) */}
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
