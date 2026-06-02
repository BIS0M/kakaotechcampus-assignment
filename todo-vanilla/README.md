# 📝 VanillaJS Todo 앱

`HTML`, `CSS`, `Vanilla JS`, `Web Storage API(localStorage)`만으로 만든 Todo 앱입니다.
별도의 빌드 도구나 프레임워크 없이, 브라우저에서 `index.html`만 열면 바로 동작합니다.

## 🚀 실행 방법

1. 이 폴더(`todo-vanilla/`)를 내려받습니다.
2. `index.html` 파일을 브라우저로 엽니다. (더블 클릭)

> 별도의 서버나 설치 과정이 필요 없습니다.

## ✨ 기능

- **할 일 추가**: 입력창에 내용을 적고 `추가` 버튼 또는 `Enter`로 등록
- **완료 토글**: 체크박스 또는 텍스트 클릭으로 완료/미완료 전환
- **삭제**: 각 항목의 `✕` 버튼으로 개별 삭제
- **필터**: `전체 / 진행 중 / 완료`로 목록 보기 전환
- **완료 항목 일괄 삭제**: 하단 `완료 항목 삭제` 버튼
- **진행 중 개수 표시**: 하단에 남은 할 일 개수 표시
- **자동 저장**: `localStorage`에 저장되어 새로고침/재방문해도 데이터 유지

## 📁 파일 구조

```
todo-vanilla/
├── index.html   # 화면 구조 (마크업)
├── style.css    # 스타일
├── app.js       # 동작 로직 (DOM 조작 · 이벤트 · localStorage)
└── README.md    # 설명 문서
```

## 🧠 구현 포인트

### 1. HTML / CSS / JS의 역할 분리
- `index.html`은 구조만, `style.css`는 디자인만, `app.js`는 동작만 담당하도록 분리했습니다.

### 2. DOM 조작과 이벤트 핸들링
- `document.createElement`로 할 일 항목을 동적으로 생성합니다.
- 필터 버튼은 **이벤트 위임(event delegation)** 으로 처리해, 버튼마다 따로 리스너를 달지 않습니다.
- 폼 `submit` 이벤트에서 `preventDefault()`로 새로고침을 막고 직접 처리합니다.

### 3. localStorage를 활용한 데이터 영속화
- 상태가 바뀔 때마다 `JSON.stringify`로 직렬화하여 `localStorage`에 저장합니다.
- 앱이 처음 로드될 때 `JSON.parse`로 복원합니다.
- 데이터 구조: `{ id, text, completed }[]`

### 4. 단방향 렌더링 흐름
- `상태 변경 → saveTodos() → render()` 순서로 동작합니다.
- 상태(`todos` 배열)를 "단일 진실 공급원"으로 삼고, 화면은 항상 상태로부터 다시 그립니다.

## 🛠 사용 스택

- HTML5
- CSS3 (Flexbox, CSS 변수)
- Vanilla JavaScript (ES6+)
- Web Storage API (`localStorage`)
