# =====================================================================
#  main.py — FastAPI Todo API (DB 모델 · 스키마 · CRUD 엔드포인트 일체)
#
#  [2차 과제와 비교]
#  - 2차(React+Vite): 데이터를 브라우저 localStorage에 저장했다.
#  - 3차(FastAPI)   : 데이터를 서버(SQLite DB)가 직접 관리하고, 프론트엔드는
#                     HTTP 요청을 통해서만 데이터에 접근한다.
#  - 날짜(date) 필드를 그대로 유지해 "날짜별 Todo" 기능을 서버에서 관리한다.
#  - 필터(filter)·검색(search)은 클라이언트가 아닌 서버(DB 조회)에서 처리한다.
# =====================================================================
import os

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import Boolean, Column, Integer, String, create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

# ---------------------------------------------------------------------
# 환경변수 로드 (.env.local)
# ---------------------------------------------------------------------
load_dotenv(".env.local")

# ---------------------------------------------------------------------
# DB 설정
# ---------------------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ---------------------------------------------------------------------
# DB 모델 (테이블 구조 정의)
# ---------------------------------------------------------------------
class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    # "YYYY-MM-DD" 문자열 키. 2차 과제의 날짜별 Todo 기능을 서버에서 그대로 유지한다.
    date = Column(String, index=True, nullable=False)


# ---------------------------------------------------------------------
# Pydantic 스키마 (요청/응답 데이터 구조 정의)
# ---------------------------------------------------------------------
class TodoBase(BaseModel):
    text: str
    date: str


class TodoCreate(TodoBase):
    """생성 요청 본문: text + date"""


class TodoUpdate(BaseModel):
    """수정 요청 본문: 전달된 필드만 부분 수정 (text / completed)"""

    text: str | None = None
    completed: bool | None = None


class TodoResponse(TodoBase):
    id: int
    completed: bool

    # SQLAlchemy ORM 객체를 그대로 응답 모델로 변환할 수 있게 함
    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------
# 테이블 생성
# ---------------------------------------------------------------------
Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------------------
# FastAPI 앱 + CORS
# ---------------------------------------------------------------------
app = FastAPI(title="Todo API")

# route.ts(서버) 프록시를 거치는 게 기본 흐름이지만, 개발 중 브라우저가
# 직접 호출하는 경우(CORS)도 막히지 않도록 localhost:3000 을 허용한다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------
# DB 세션 의존성
# ---------------------------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------------------
# 엔드포인트
# ---------------------------------------------------------------------
@app.get("/")
def root():
    return {"message": "Hello World"}


@app.get("/todos", response_model=list[TodoResponse])
def list_todos(
    db: Session = Depends(get_db),
    date: str | None = Query(None, description='"YYYY-MM-DD" 날짜로 조회'),
    filter: str | None = Query(None, description="all | active | completed"),
    search: str | None = Query(None, description="text 부분 일치 검색"),
):
    """전체 Todo 목록 조회.

    - date   : 해당 날짜의 Todo만 (날짜별 보기)
    - filter : active(진행 중) / completed(완료) / all(전체)
    - search : text 에 키워드가 포함된 Todo만
    필터링·검색은 모두 DB 쿼리(서버)에서 처리된다.
    """
    query = db.query(Todo)

    if date:
        query = query.filter(Todo.date == date)

    if filter == "active":
        query = query.filter(Todo.completed.is_(False))
    elif filter == "completed":
        query = query.filter(Todo.completed.is_(True))

    if search:
        query = query.filter(Todo.text.contains(search))

    return query.order_by(Todo.id.asc()).all()


@app.get("/todos/counts")
def counts_by_date(db: Session = Depends(get_db)):
    """날짜별 Todo 개수 맵 반환. 주간 뷰의 날짜 배지에 사용한다.

    예: {"2026-06-20": 3, "2026-06-21": 1}
    """
    rows = db.query(Todo.date).all()
    counts: dict[str, int] = {}
    for (d,) in rows:
        counts[d] = counts.get(d, 0) + 1
    return counts


@app.get("/todos/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    """단일 Todo 조회 (수정 페이지에서 기존 값 로드용)."""
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.post("/todos", response_model=TodoResponse, status_code=201)
def create_todo(payload: TodoCreate, db: Session = Depends(get_db)):
    """새 Todo 생성."""
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")

    todo = Todo(text=text, date=payload.date, completed=False)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, payload: TodoUpdate, db: Session = Depends(get_db)):
    """Todo 수정. text(내용)와 completed(완료 여부)를 부분 수정한다."""
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    if payload.text is not None:
        text = payload.text.strip()
        if not text:
            raise HTTPException(status_code=400, detail="text cannot be empty")
        todo.text = text

    if payload.completed is not None:
        todo.completed = payload.completed

    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """Todo 삭제."""
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(todo)
    db.commit()
    return None
