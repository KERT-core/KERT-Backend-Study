# KERT 웹 백엔드 스터디 - 2주차

Express + EJS로 만든 간단한 게시판입니다. 글 목록·작성·상세·삭제와 검색, 빈 제목 막기, 404 페이지를 구현했습니다.

## 실행 방법

1. 레포를 clone 하고 2주차 폴더로 이동합니다.
   ```bash
   git clone https://github.com/zlnzzaro/KERT-Backend-Study
   cd KERT-Backend-Study/week02
   ```
2. 패키지를 설치합니다.
   ```bash
   npm install
   ```
3. 서버를 실행합니다.
   ```bash
   npm run dev
   ```
   (`npm run dev`는 `node --watch app.js`로, 파일을 저장하면 서버가 자동 재시작됩니다. `node app.js`로 실행해도 됩니다.)

4. 브라우저에서 접속합니다.
   ```
   http://localhost:3000/posts
   ```

## 구현한 라우트

| 메서드 | 주소 | 하는 일 |
|---|---|---|
| GET | `/posts` | 글 목록 (글이 없으면 '글이 없습니다'), `?keyword=` 로 제목 검색 |
| GET | `/posts/new` | 글쓰기 폼 |
| POST | `/posts` | 글 저장 후 새 글 상세 페이지로 redirect (빈 제목이면 400 + 글쓰기 화면) |
| GET | `/posts/:id` | 글 상세 페이지 (없는 id는 404 페이지) |
| POST | `/posts/:id/delete` | 글 삭제 후 목록으로 redirect |
| 그 외 | 없는 주소 | 404 페이지 |

### 그 밖에 정리한 것

- **id 중복 막기**: `nextId` 변수로 다음 id를 관리합니다. 값이 늘어나기만 하므로 글을 삭제한 뒤 새로 써도 id가 재사용되지 않습니다.
- **공통 파일 분리**: `views/partials/header.ejs`, `views/partials/footer.ejs`로 분리하고 각 페이지에서 `include` 합니다.

## 점검 결과

필수 14 / 14 통과
도전 3 / 3 통과

## (도전) 구현한 것

- **① 검색**: `/posts?keyword=Express` 처럼 접속하면 제목에 keyword가 들어간 글만 보여줍니다. keyword가 없으면 전체 목록을 보여줍니다.
- **② 빈 제목 막기**: 제목이 비어 있거나 공백뿐이면 저장하지 않고, 상태 코드 400과 함께 글쓰기 화면을 다시 보여줍니다.
- **③ 나만의 404 페이지**: 없는 글(`/posts/999`)이나 없는 주소(`/abc`)에 접속하면 `views/404.ejs`를 렌더합니다. (상태 코드 404)