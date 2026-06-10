// =====================================================================
//  TodoForm — 입력창 + 추가 버튼 (Vanilla의 todoForm submit 핸들러를 이전)
//
//  [마이그레이션]
//  - Vanilla: todoInput.value를 직접 읽고, addEventListener("submit", ...)로 처리했다.
//  - React  : 입력값을 컴포넌트 내부 state(text)로 관리(제어 컴포넌트)하고,
//             제출 시 부모(App)의 onAdd로 값을 올려보낸다. 빈 값 검사는 App이 담당.
// =====================================================================
import { useState } from "react";

function TodoForm({ onAdd, alert }) {
  // [마이그레이션] Vanilla는 DOM input의 value를 그때그때 읽었지만,
  //   React는 입력값을 state로 들고 value/onChange로 동기화한다(제어 컴포넌트).
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); // Vanilla와 동일하게 새로고침 방지
    onAdd(text);
    setText(""); // 제출 후 입력창 비우기
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="할 일을 입력하세요"
          autoComplete="off"
          className="flex-1 rounded-[10px] border border-border px-3.5 py-3 text-[15px] outline-none transition-colors focus:border-primary"
        />
        <button
          type="submit"
          className="rounded-[10px] bg-primary px-5 text-[15px] font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          추가
        </button>
      </form>

      {/* 빈 입력 안내. Vanilla는 inputAlert.textContent에 직접 썼지만, 여기선 props로 받아 표시 */}
      <p className="mx-0.5 mt-2 min-h-5 text-[13px] text-danger">{alert}</p>
    </>
  );
}

export default TodoForm;
