import { useState, useEffect, useRef } from "react";
import { PencilIcon, CheckIcon, XIcon } from "./icons.jsx";

// Todo 한 항목.
// 1차 과제의 createTodoElement / createButtonGroup 을 하나의 컴포넌트로 옮겼다.
// todo.isEditing 상태 하나로 "텍스트 보기" ↔ "인라인 입력창"이 자동 전환된다.
function TodoItem({ todo, onToggle, onStartEdit, onSaveEdit, onDelete }) {
  // 수정 모드일 때 입력창의 값. 수정 시작 시 기존 텍스트로 초기화한다.
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef(null);

  // 수정 모드로 들어오면 입력값을 현재 텍스트로 맞추고 자동 포커스
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
        // 수정 모드: 인라인 입력창 (Enter로 저장)
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
        // 일반 모드: 할 일 텍스트 (완료 시 취소선 + 흐린 색)
        <span
          className={
            "flex-1 break-all text-[15px] " +
            (todo.completed ? "text-muted line-through" : "")
          }
        >
          {todo.text}
        </span>
      )}

      {/* 항목별 버튼 그룹 (수정/저장 · 완료 · 삭제) */}
      <div className="flex flex-shrink-0 gap-1.5">
        {todo.isEditing ? (
          // 수정 모드: '저장' 버튼
          <button
            onClick={handleSave}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-border bg-white px-2 text-[13px] font-semibold text-text transition-colors hover:border-primary hover:text-primary"
          >
            저장
          </button>
        ) : (
          // 일반 모드: 연필 아이콘 → 수정 모드로 전환
          <button
            onClick={() => onStartEdit(todo.id)}
            aria-label="수정"
            title="수정"
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-border bg-white px-2 text-text transition-colors hover:border-primary hover:text-primary"
          >
            <PencilIcon />
          </button>
        )}

        {/* 완료 버튼 (초록색 + 체크 아이콘) */}
        <button
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? "완료 취소" : "완료"}
          title={todo.completed ? "완료 취소" : "완료"}
          className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-success bg-success px-2 text-white transition-colors hover:border-success-dark hover:bg-success-dark"
        >
          <CheckIcon />
        </button>

        {/* 삭제 버튼 (빨간색 + X 아이콘) */}
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
