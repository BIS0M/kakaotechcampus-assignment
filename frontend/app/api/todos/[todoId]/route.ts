// =====================================================================
//  app/api/todos/[todoId]/route.ts — id 단위 프록시 (조회/수정/삭제)
//  클라이언트 → /api/todos/:id → FastAPI(/todos/:id)
// =====================================================================
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

type Context = { params: Promise<{ todoId: string }> };

// 단건 조회
export async function GET(_request: NextRequest, { params }: Context) {
  const { todoId } = await params;
  const res = await fetch(`${BACKEND_URL}/todos/${todoId}`, { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// 수정 (text / completed 부분 수정)
export async function PUT(request: NextRequest, { params }: Context) {
  const { todoId } = await params;
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}/todos/${todoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// 삭제
export async function DELETE(_request: NextRequest, { params }: Context) {
  const { todoId } = await params;
  const res = await fetch(`${BACKEND_URL}/todos/${todoId}`, { method: "DELETE" });
  // 204 No Content 는 본문이 없으므로 그대로 상태만 반환
  return new NextResponse(null, { status: res.status });
}
