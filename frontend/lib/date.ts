// =====================================================================
//  date.ts — 날짜 유틸 (2차 과제 utils/date.js 를 TypeScript로 이식)
//  로직은 동일하되, URL 파라미터 기반(YYYY-MM-DD 문자열) 흐름에 맞춰 보강했다.
// =====================================================================

export const WEEKDAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

// Date → "YYYY-MM-DD" 키 문자열
export function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// "YYYY-MM-DD" → Date (로컬 자정). 잘못된 값이면 오늘 날짜.
export function parseDateKey(key?: string | null): Date {
  if (!key) return new Date();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return new Date();
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

// 두 날짜가 같은 날인지 (키로 비교)
export function isSameDate(a: Date, b: Date): boolean {
  return getDateKey(a) === getDateKey(b);
}

// 주어진 날짜가 속한 주의 '월요일' Date
export function getMonday(date: Date): Date {
  const monday = new Date(date);
  const day = monday.getDay(); // 0(일)~6(토)
  const diffToMonday = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diffToMonday);
  return monday;
}

// 기준 날짜가 속한 주의 7개 날짜(월~일)
export function getWeekDates(baseDate: Date): Date[] {
  const monday = getMonday(baseDate);
  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    week.push(date);
  }
  return week;
}

// 새 Date를 반환하는 날짜 이동 (불변)
export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

// "6월 9일 (월)" 형태 라벨
export function formatDayLabel(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAY_NAMES[date.getDay()]})`;
}

// "6월 1일 - 6월 7일" 형태 주간 범위 라벨
export function formatWeekRange(weekDates: Date[]): string {
  const first = weekDates[0];
  const last = weekDates[6];
  return (
    `${first.getMonth() + 1}월 ${first.getDate()}일` +
    ` - ${last.getMonth() + 1}월 ${last.getDate()}일`
  );
}
