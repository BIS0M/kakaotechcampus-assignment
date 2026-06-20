// =====================================================================
//  app/api/todos/route.ts — API Route (백엔드 프록시)
//
//  클라이언트 → /api/todos (route.ts) → FastAPI(/todos)
//  클라이언트가 FastAPI를 직접 부르지 않고 이 서버 라우트를 거치게 하여
//  - FastAPI 실제 주소(BACKEND_URL)를 숨기고
//  - CORS 문제를 피한다.
// =====================================================================
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

// 목록 조회 프록시 (date/filter/search 쿼리를 그대로 전달)
export async function GET(request: NextRequest) {
  const search = request.nextUrl.search; // "?date=...&filter=..."
  const res = await fetch(`${BACKEND_URL}/todos${search}`, { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// 새 Todo 생성 프록시
export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
