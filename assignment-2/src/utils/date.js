// =====================================================================
//  날짜 유틸 (1차 과제 app.js의 날짜 함수들을 그대로 옮김)
//  Todo는 "YYYY-MM-DD" 형식의 date 키로 어느 날짜에 속하는지 구분한다.
// =====================================================================

// Date 객체 → "YYYY-MM-DD" 키 문자열 (Todo 저장/비교에 사용)
export function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 두 Date가 같은 날짜인지 비교 (날짜 키로 비교)
export function isSameDate(dateA, dateB) {
  return getDateKey(dateA) === getDateKey(dateB);
}

// 주어진 날짜가 속한 주의 '월요일' Date를 반환
export function getMonday(date) {
  const monday = new Date(date);
  const day = monday.getDay(); // 0(일) ~ 6(토)
  // 일요일이면 6일 전, 그 외에는 (요일-1)일 전이 월요일
  const diffToMonday = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diffToMonday);
  return monday;
}

// 기준 날짜가 속한 주의 7개 날짜(월~일) 배열 생성
export function getWeekDates(baseDate) {
  const monday = getMonday(baseDate);
  const week = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    week.push(date);
  }
  return week;
}

// 날짜를 days일만큼 이동한 새 Date 반환 (상태를 직접 변경하지 않도록 새 객체로 반환)
export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export const WEEKDAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
