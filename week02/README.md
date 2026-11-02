# KERT 웹 백엔드 스터디 - 2주차



## 실행 방법

1. 패키지 설치: `npm install`
2. 서버 실행: `node app.js`

## 구현한 라우트

- `GET /` : `/posts`로 리다이렉트
- `GET /posts` : 글 목록 조회
- `GET /posts/new` : 글 작성 폼 조회
- `POST /posts` : 새 글 작성 후 생성된 글 상세 페이지로 리다이렉트 (PRG 패턴)
- `GET /posts/:id` : 글 상세 조회
- `POST /posts/:id/delete` : 글 삭제 후 목록 페이지로 리다이렉트

## 점검 결과

필수 13 / 14 통과
도전 3 / 3 통과

## (도전) 구현한 것

- 검색: `/posts?keyword=...`
- 빈 제목/공백 제목 400 응답
- 나만의 404 페이지 (`views/404.ejs`)
