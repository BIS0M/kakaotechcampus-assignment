export function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isSameDate(dateA, dateB) {
  return getDateKey(dateA) === getDateKey(dateB);
}

export function getMonday(date) {
  const monday = new Date(date);
  const day = monday.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diffToMonday);
  return monday;
}

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

export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export const WEEKDAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
