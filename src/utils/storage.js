// =====================================================================
//  storage.js — localStorage 연동 유틸
//
//  [마이그레이션]
//  - Vanilla: add/toggle/delete 함수마다 localStorage.setItem을 직접 호출했다.
//  - React  : 저장은 App의 useEffect([todos])가 saveTodos로 한 번에 처리하고,
//             불러오기는 useState 함수형 초기화에서 loadTodos를 호출한다.
//             (JSON.stringify / JSON.parse로 직렬화·복원하는 건 동일)
// =====================================================================

export const STORAGE_KEY = "todos";

// localStorage에서 todos 복원. useState(() => loadTodos())로 최초 1회만 실행된다.
export function loadTodos() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) return [];

  // 데이터가 손상돼 파싱에 실패해도 앱이 멈추지 않도록 예외 처리
  try {
    const parsedTodos = JSON.parse(savedData);
    // 수정 모드(isEditing)는 저장하지 않고 항상 false로 복원
    return parsedTodos.map((todo) => ({ ...todo, isEditing: false }));
  } catch {
    return [];
  }
}

// todos 배열을 JSON 문자열로 저장
export function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
