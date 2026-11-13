# KERT 웹 백엔드 스터디 - 3주차

## 실행 방법
1. 패키지 설치
 - npm install 
 - npm install sqlite3 --- 위 명령어로 안되면 아래 명령어 사용
2. 서버 실행
 - node app.js
3. 웹브라우저 열고 접속
 - http://localhost:3000
## 관리자 계정 만드는 법
1. 웹사이트 접속 후 회원가입 페이지에서 새로운 계정을 생성한다. (ex. mickey)
2. 터미널을 열고 week03 폴더 경로에서 관리자 권한 부여 스크립트를 실행한다.
 - node make-admin.js mickey
## 구현한 라우트
GET / : 메인 페이지 (누구나)

GET /register : 회원가입 페이지 (누구나)

POST /register : 회원가입 처리 (중복 아이디 가입 불가)

GET /login : 로그인 페이지 (누구나)

POST /login : 로그인 처리 (성공 시 상단에 아이디 표시)

GET /logout : 로그아웃 처리 (로그인한 사용자)

GET /posts : 게시글 목록 조회 (누구나)

GET /posts/new : 글쓰기 페이지 (로그인한 사용자만)

POST /posts : 글쓰기 처리 (세션의 사용자 아이디를 작성자로 기록)

POST /posts/:id/delete : 게시글 삭제 (작성자 본인 및 관리자만 가능)

GET /admin : 회원 목록 조회 (관리자만 접근 가능)
## 점검 결과
필수 22 / 22 통과
도전 2 / 3 통과
(FAIL  POST /admin/users/:id/role 로 관리자가 role 을 바꾼다 /admin 으로 redirect 해야 합니다. 실제: 500)
(실제로는 역할을 바꿀 수 있는데 자꾸 통과가 안됩니다..)
## (도전) 구현한 것
내 글 모아보기
회원 권한 바꾸기
댓글