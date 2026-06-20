// =====================================================================
//  app/todos/new/page.tsx — Todo 생성 페이지 (Server Component)
//  URL 의 ?date= 로 어떤 날짜에 추가할지 받고, 입력 폼(Client)을 렌더링한다.
// =====================================================================
import Link from "next/link";
import TodoForm from "@/components/TodoForm";
import { getDateKey, parseDateKey, formatDayLabel } from "@/lib/date";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewTodoPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const date = first(sp.date) ?? getDateKey(new Date());
  const backHref = first(sp.from) ?? `/todos?date=${date}`;

  return (
    <main className="mx-auto w-full max-w-[440px] px-4 py-12">
      <Link href={backHref} className="text-sm text-muted transition-colors hover:text-primary">
        ‹ 목록으로
      </Link>
      <h1 className="mb-1 mt-3 text-[24px] font-bold text-primary">새 할 일</h1>
      <p className="mb-5 text-sm text-muted">{formatDayLabel(parseDateKey(date))}에 추가됩니다.</p>

      <TodoForm date={date} backHref={backHref} />
    </main>
  );
}
