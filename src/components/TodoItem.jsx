import { useState, useEffect, useRef } from "react";
import { PencilIcon, CheckIcon, XIcon } from "./icons.jsx";

function TodoItem({ todo, onToggle, onStartEdit, onSaveEdit, onDelete }) {
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (todo.isEditing) {
      setEditText(todo.text);
      inputRef.current?.focus();
    }
  }, [todo.isEditing, todo.text]);

  function handleSave() {
    onSaveEdit(todo.id, editText);
  }

  return (
    <li className="flex items-center gap-2.5 rounded-[10px] border border-border bg-surface px-3.5 py-3">
      {todo.isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
          className="flex-1 rounded-md border border-primary px-2 py-1.5 text-[15px] outline-none"
        />
      ) : (
        <span
          className={
            "flex-1 break-all text-[15px] " +
            (todo.completed ? "text-muted line-through" : "")
          }
        >
          {todo.text}
        </span>
      )}

      <div className="flex flex-shrink-0 gap-1.5">
        {todo.isEditing ? (
          <button
            onClick={handleSave}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-border bg-white px-2 text-[13px] font-semibold text-text transition-colors hover:border-primary hover:text-primary"
          >
            저장
          </button>
        ) : (
          <button
            onClick={() => onStartEdit(todo.id)}
            aria-label="수정"
            title="수정"
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-border bg-white px-2 text-text transition-colors hover:border-primary hover:text-primary"
          >
            <PencilIcon />
          </button>
        )}

        <button
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? "완료 취소" : "완료"}
          title={todo.completed ? "완료 취소" : "완료"}
          className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-success bg-success px-2 text-white transition-colors hover:border-success-dark hover:bg-success-dark"
        >
          <CheckIcon />
        </button>

        <button
          onClick={() => onDelete(todo.id)}
          aria-label="삭제"
          title="삭제"
          className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-danger bg-danger px-2 text-white transition-colors hover:border-danger-dark hover:bg-danger-dark"
        >
          <XIcon />
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
