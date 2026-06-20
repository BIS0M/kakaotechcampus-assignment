# 카카오 테크 캠퍼스 3차 과제 — Next.js + FastAPI Todo 앱

2차 과제의 React(Vite) 기반 Todo 앱을 **Next.js(App Router) + FastAPI** 풀스택 구조로 다시 만든 프로젝트입니다.
2차의 **날짜(주간/일간 뷰)·날짜별 Todo** 기능을 그대로 유지하면서, 데이터 저장을 **로컬스토리지 → FastAPI 서버(SQLite)** 로 전환했습니다.

## 기술 스택

| Frontend | Backend |
| --- | --- |
| Next.js 16 (App Router) | FastAPI |
| React 19 / TypeScript | Uvicorn |
| Tailwind CSS v4 | SQLAlchemy + SQLite |
| (fetch 기반 연동) | Pydantic v2 |

## 프로젝트 구조

```
kakaoassingmentweek3/
├── frontend/
│   ├── app/
│   │   ├── api/todos/route.ts              # API Route (목록/생성 프록시)
│   │   ├── api/todos/[todoId]/route.ts     # API Route (단건/수정/삭제 프록시)
│   │   ├── todos/
│   │   │   ├── [todoId]/page.tsx           # Todo 수정 페이지 (Server)
│   │   │   ├── new/page.tsx                # Todo 생성 페이지 (Server)
│   │   │   ├── error.tsx                   # 에러 화면 (Client)
│   │   │   ├── loading.tsx                 # 로딩 화면
│   │   │   └── page.tsx                    # Todo 목록 페이지 (Server)
│   │   ├── actions.ts                      # 서버에서 FastAPI 직접 호출(읽기)
│   │   ├── layout.tsx · page.tsx · globals.css
│   ├── components/                         # WeekView·DayView·FilterTabs·SearchBar·TodoList·TodoItem·TodoForm·EditTodoForm
│   ├── lib/                                # date·types·url 유틸
│   └── .env.local
└── backend/
    ├── main.py                             # FastAPI 앱 + 모델/스키마/CRUD 일체
    ├── requirements.txt
    └── .env.local
```

## 실행 방법

### 1) 백엔드 (FastAPI · 포트 8000)
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
### 2) 프론트엔드 (Next.js · 포트 3000)

```
cd frontend
npm install
npm run dev
```