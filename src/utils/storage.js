// =====================================================================
//  로컬스토리지 연동 유틸
//  1차 과제에서는 함수마다 setItem을 직접 호출했지만,
//  React에서는 App의 useEffect 한 곳에서 저장한다. (saveTodos 참고)
// =====================================================================

export const STORAGE_KEY = "todos";

// 로컬스토리지에서 데이터를 읽어와 배열로 복원.
// useState의 함수형 초기화에서 호출되어 최초 마운트 시 딱 한 번만 실행된다.
export function loadTodos() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  // 저장된 데이터가 없으면 빈 배열로 시작
  if (!savedData) return [];

  // 데이터가 손상돼 파싱에 실패해도 앱이 멈추지 않도록 예외 처리한다.
  try {
    const parsedTodos = JSON.parse(savedData);
    // 수정 모드(isEditing)는 저장하지 않고 항상 false로 복원한다.
    return parsedTodos.map((todo) => ({ ...todo, isEditing: false }));
  } catch {
    return [];
  }
}

// 현재 todos 배열을 JSON 문자열로 변환해 로컬스토리지에 저장
export function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
