// 서버(FastAPI)와 주고받는 Todo 데이터 타입
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string; // "YYYY-MM-DD"
}

// 상태 필터 값
export type FilterValue = "all" | "active" | "completed";
