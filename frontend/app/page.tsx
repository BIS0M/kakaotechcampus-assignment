import { redirect } from "next/navigation";

// 루트 경로 접속 시 Todo 목록 페이지로 이동시킨다.
export default function Home() {
  redirect("/todos");
}
