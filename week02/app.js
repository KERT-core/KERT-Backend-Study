const express = require('express');
const app = express();
const PORT = 3000;

// EJS 템플릿 엔진 및 폼 데이터(req.body) 파싱 설정
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// 초기 게시글 메모리 데이터
let posts = [
  { id: 1, title: 'Express 설치했어요', author: 'kim', content: 'npm install express 끝!' },
  { id: 2, title: '서버가 안 켜져요', author: 'lee', content: 'EADDRINUSE 에러가 나요' },
  { id: 3, title: 'EJS 질문', author: 'park', content: '<%= %> 랑 <%- %> 차이가 뭔가요?' },
];

// Helper: 글 찾기
function findPost(posts, id) {
  return posts.find((post) => post.id === id) ?? null;
}

// Helper: 새 글 추가 (id 중복 방지 - 가장 큰 id + 1)
function addPost(posts, title, author, content) {
  const maxId = posts.reduce((max, post) => Math.max(max, post.id), 0);
  const post = { id: maxId + 1, title, author, content };
  posts.push(post);
  return post;
}

// --- 라우트 작성 ---

// 0. 첫 화면 -> 목록으로 redirect
app.get('/', (req, res) => {
  res.redirect('/posts');
});

// 1. 글 목록 (도전 1: keyword 검색 적용)
app.get('/posts', (req, res) => {
  const keyword = req.query.keyword;
  let filteredPosts = posts;

  if (keyword) {
    filteredPosts = posts.filter((post) => post.title.includes(keyword));
  }

  res.render('list', { posts: filteredPosts });
});

// 2. 글쓰기 폼 (⚠️ :id 라우트보다 위에 위치)
app.get('/posts/new', (req, res) => {
  res.render('new');
});

// 3. 글 저장 (POST) (도전 2: 빈 제목/공백 제목 400 에러 처리)
app.post('/posts', (req, res) => {
  const { title, author, content } = req.body;

  // 제목이 없거나 공백 문자열인 경우 400 에러 반환
  if (!title || title.trim() === '') {
    return res.status(400).send('제목을 입력해주세요.');
  }

  const post = addPost(posts, title, author, content);
  res.redirect(`/posts/${post.id}`);
});

// 4. 글 상세 페이지 (도전 3: 없는 글일 때 404 페이지 렌더링)
app.get('/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = findPost(posts, id);
  if (!post) {
    return res.status(404).render('404');
  }
  res.render('detail', { post });
});

// 5. 글 삭제 (POST)
app.post('/posts/:id/delete', (req, res) => {
  const id = Number(req.params.id);
  const index = posts.findIndex((post) => post.id === id);
  if (index !== -1) {
    posts.splice(index, 1);
  }
  res.redirect('/posts');
});

// 도전 3: 미 정의된 모든 경로 처리 (나만의 404 페이지)
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});