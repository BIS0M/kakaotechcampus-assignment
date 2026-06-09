# Assignment 2 — React Todo

1차 과제(Vanilla JS Todo)를 **React Function Component** 구조로 마이그레이션한 프로젝트입니다.

## 활용 스택

- React 18 + Vite 5
- Tailwind CSS v4 (`@tailwindcss/vite` 플러그인)
- Web Storage API (localStorage)

## 실행 방법

```bash
cd assignment-2
npm install
npm run dev
# → http://localhost:5173
```

빌드: `npm run build` / 빌드 미리보기: `npm run preview`

## 폴더 구조

```
assignment-2/
├─ index.html
├─ vite.config.js          # tailwindcss() + react() 플러그인
└─ src/
   ├─ main.jsx             # 진입점
   ├─ App.jsx              # 모든 상태(todos/filter/selectedDate)를 관리하는 최상위 컴포넌트
   ├─ index.css            # @import "tailwindcss" + @theme 디자인 토큰
   ├─ components/
   │  ├─ WeekView.jsx      # 주간 뷰 (도전 미션)
   │  ├─ DayView.jsx       # 일간 뷰 헤더 (선택 날짜 + 이전/다음 날짜 이동)
   │  ├─ TodoForm.jsx      # 입력창 + 추가 버튼
   │  ├─ FilterTabs.jsx    # 전체 / 진행 중 / 완료 필터 탭
   │  ├─ TodoList.jsx      # 필터링된 목록 + 빈 상태 안내
   │  ├─ TodoItem.jsx      # 항목 하나 (보기 ↔ 인라인 수정 전환)
   │  └─ icons.jsx         # 연필/체크/X SVG 아이콘
   └─ utils/
      ├─ date.js           # 날짜 키 변환, 주간 날짜 계산 등
      └─ storage.js        # localStorage 불러오기/저장
```

## 구현한 기능

### 필수 미션

- **CRUD**: 추가 / 목록 표시 / 인라인 수정 / 완료 토글(취소선) / 삭제
  - 빈 입력은 생성되지 않고 안내 메시지를 표시합니다.
  - 1차 과제의 `prompt()` 수정 방식을 `isEditing` 상태 기반 **인라인 입력창**으로 대체했습니다.
- **상태별 필터링**: 전체 / 진행 중 / 완료 탭. 현재 탭은 시각적으로 강조되고, 탭 전환 후 새 Todo를 추가해도 필터가 유지됩니다.
- **일간 뷰**: 선택한 날짜를 표시하고 이전/다음 날짜로 이동. Todo는 생성 시 현재 선택된 날짜(`date` 키)에 저장되어 날짜별로 따로 관리됩니다.
- **로컬스토리지 연동**: `useEffect`로 `todos`가 바뀔 때마다 자동 저장하고, `useState` 함수형 초기화로 새로고침 후에도 데이터가 유지됩니다.

### 도전 미션

- **주간 뷰**: 이번 주 월~일 날짜 목록 표시, 이전/다음 주차 이동, 날짜별 Todo 개수 배지, 오늘 날짜 강조. 날짜를 클릭하면 일간 뷰의 선택 날짜와 연결됩니다. 선택한 날짜/주차는 localStorage에 저장되어 새로고침 후에도 유지됩니다.

## Vanilla JS와의 주요 차이

| 항목 | 1차 (Vanilla JS) | 2차 (React) |
| --- | --- | --- |
| 화면 갱신 | `render()` 직접 호출 | 상태 변경 시 자동 리렌더 |
| 수정 UI | `prompt()` 팝업 | `isEditing` 상태로 인라인 입력창 전환 |
| 필터링 | `querySelectorAll`로 DOM 직접 조작 | 필터 상태에 따라 목록 재계산 |
| 저장 | 함수마다 `localStorage.setItem()` 호출 | `useEffect` 한 곳에서 자동 저장 |
