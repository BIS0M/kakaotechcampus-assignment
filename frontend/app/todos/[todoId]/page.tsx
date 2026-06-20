// =====================================================================
//  app/todos/[todoId]/page.tsx — Todo 수정 페이지 (Server Component)
//  [todoId] 동적 세그먼트로 id 를 받아 actions.ts 로 기존 값을 불러온 뒤,
//  수정 폼(Client)에 내려준다. 없는 id 면 에러 경계(error.tsx)가 처리.
// =====================================================================
import Link from "next/link";
import EditTodoForm from "@/components/EditTodoForm";
import { getTodo } from "@/app/actions";

type Params = Promise<{ todoId: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditTodoPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { todoId } = await params;
  const sp = await searchParams;
  const backHref = first(sp.from) ?? "/todos";

  // 서버에서 기존 Todo 로드 (없으면 throw → error.tsx)
  const todo = await getTodo(Number(todoId));

  return (
    <main className="mx-auto w-full max-w-[440px] px-4 py-12">
      <Link href={backHref} className="text-sm text-muted transition-colors hover:text-primary">
        ‹ 목록으로
      </Link>
      <h1 className="mb-5 mt-3 text-[24px] font-bold text-primary">할 일 수정</h1>

      <EditTodoForm todo={todo} backHref={backHref} />
    </main>
  );
}
