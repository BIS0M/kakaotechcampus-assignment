import { useState } from "react";

// 텍스트 입력창 + 추가 버튼.
// 입력값은 컴포넌트 내부 state(text)로 관리하고, 제출 시 부모의 onAdd로 전달한다.
// 빈 입력 안내(inputAlert)는 부모(App)가 관리하므로 alert 메시지를 props로 받는다.
function TodoForm({ onAdd, alert }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); // 새로고침 방지
    onAdd(text); // 빈 값 검사는 App.addTodo에서 처리
    setText(""); // 입력창 비우기 (생성 실패해도 1차 과제와 동일하게 비움)
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

      {/* 입력값이 비었을 때 보여줄 안내 메시지 (높이를 고정해 레이아웃 흔들림 방지) */}
      <p className="mx-0.5 mt-2 min-h-5 text-[13px] text-danger">{alert}</p>
    </>
  );
}

export default TodoForm;
