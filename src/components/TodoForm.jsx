import { useState } from "react";

function TodoForm({ onAdd, alert }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onAdd(text);
    setText("");
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

      <p className="mx-0.5 mt-2 min-h-5 text-[13px] text-danger">{alert}</p>
    </>
  );
}

export default TodoForm;
