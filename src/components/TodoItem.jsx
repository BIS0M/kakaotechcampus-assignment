// =====================================================================
//  TodoItem — Todo 한 항목 (Vanilla의 createTodoElement / createButtonGroup을 이전)
//
//  [마이그레이션]
//  - Vanilla: createElement로 li/span/input/button을 직접 만들고, 수정은 prompt() 또는
//             동적으로 만든 입력창 + addEventListener로 처리했다.
//  - React  : todo.isEditing 값에 따라 텍스트/입력창을 JSX로 조건부 렌더링하고,
//             버튼 클릭은 부모가 내려준 콜백(onToggle/onStartEdit/onSaveEdit/onDelete)을 호출한다.
// =====================================================================
import { useState, useEffect, useRef } from "react";
import { PencilIcon, CheckIcon, XIcon } from "./icons.jsx";

function TodoItem({ todo, onToggle, onStartEdit, onSaveEdit, onDelete }) {
  // 수정 입력창의 임시 값. Vanilla는 입력창 DOM의 value를 직접 읽었지만 여기선 state로 관리.
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef(null);

  // [마이그레이션] Vanilla는 setTimeout(() => input.focus()) 로 포커스를 줬는데,
  //   React는 수정 모드 진입 시 useEffect에서 입력값을 맞추고 자동 포커스한다.
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
      {/* [확인 포인트 - isEditing 상태] isEditing이 true면 인라인 입력창을, false면 텍스트를
          보여준다. 즉 isEditing 값 하나로 '보기 ↔ 수정' UI가 자동으로 전환된다.
          [마이그레이션] Vanilla의 prompt() 팝업을 이 인라인 전환 방식으로 대체했다. */}
      {todo.isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave(); // Vanilla와 동일하게 Enter로 저장
          }}
          className="flex-1 rounded-md border border-primary px-2 py-1.5 text-[15px] outline-none"
        />
      ) : (
        // 완료 항목은 취소선 + 흐린 색 (Vanilla의 .is-completed 스타일을 클래스 조건부로 이전)
        <span
          className={
            "flex-1 break-all text-[15px] " +
            (todo.completed ? "text-muted line-through" : "")
          }
        >
          {todo.text}
        </span>
      )}

      {/* 버튼 그룹: 수정/저장 · 완료 · 삭제. Vanilla처럼 addEventListener를 붙이지 않고
          onClick에 부모 콜백을 연결한다. */}
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
