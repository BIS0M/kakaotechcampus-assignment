// =====================================================================
//  date.js — 날짜 유틸 모음
//
//  [마이그레이션]
//  - Vanilla: app.js 안에 날짜 함수들이 섞여 있었다.
//  - React  : 컴포넌트에서 공통으로 쓰도록 utils로 분리했다. 로직 자체는 동일하되,
//             addDays처럼 '새 Date를 반환'하는 함수를 추가해 상태 불변 업데이트에 쓴다.
// =====================================================================

// Date → "YYYY-MM-DD" 키 문자열 (Todo의 date, 날짜 비교에 사용)
export function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 두 날짜가 같은 날인지 (키로 비교)
export function isSameDate(dateA, dateB) {
  return getDateKey(dateA) === getDateKey(dateB);
}

// 주어진 날짜가 속한 주의 '월요일' Date 반환
export function getMonday(date) {
  const monday = new Date(date);
  const day = monday.getDay(); // 0(일)~6(토)
  const diffToMonday = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diffToMonday);
  return monday;
}

// 기준 날짜가 속한 주의 7개 날짜(월~일) 배열
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

// [마이그레이션] Vanilla는 selectedDate.setDate(...)로 같은 객체를 직접 수정했지만,
//   React는 상태 불변성을 위해 '새 Date 객체'를 만들어 반환한다.
export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export const WEEKDAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
