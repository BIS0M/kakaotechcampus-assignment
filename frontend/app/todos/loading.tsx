// 데이터 로딩 중 보여줄 화면 (App Router 의 자동 로딩 UI)
export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-[440px] px-4 py-12">
      <h1 className="mb-4 text-[28px] font-bold text-primary">Todo</h1>
      <div className="animate-pulse space-y-3">
        <div className="h-24 rounded-[10px] bg-border" />
        <div className="h-10 rounded-[10px] bg-border" />
        <div className="h-12 rounded-[10px] bg-border" />
        <div className="h-12 rounded-[10px] bg-border" />
      </div>
      <p className="mt-6 text-center text-sm text-muted">불러오는 중...</p>
    </main>
  );
}
