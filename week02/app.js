const express = require('express');
const app = express();
const PORT = 3000;

// EJS 템플릿 엔진 설정
app.set('view engine', 'ejs');

// 폼 입력 데이터(req.body) 처리를 위한 미들웨어 설정
app.use(express.urlencoded({ extended: false }));

// 게시글 메모리 저장소
const posts = [
  { id: 1, title: 'Express 설치했어요', author: 'kim', content: 'npm install express 끝!' },
  { id: 2, title: '서버가 안 켜져요', author: 'lee', content: 'EADDRINUSE 에러가 나요' },
  { id: 3, title: 'EJS 질문', author: 'park', content: '<%= %> 랑 <%- %> 차이가 뭔가요?' },
];

// Helper: 특정 ID의 게시글 찾기
function findPost(posts, id) {
  return posts.find((post) => post.id === id) ?? null;
}

// Helper: 새 게시글 추가 (가장 큰 ID + 1)
function addPost(posts, title, author, content) {
  const maxId = posts.reduce((max, post) => Math.max(max, post.id), 0);
  const post = { id: maxId + 1, title, author, content };
  posts.push(post);
  return post;
}

// 첫 화면 접속 시 /posts 로 이동
app.get('/', (req, res) => {
  res.redirect('/posts');
});

// 1. 글 목록 보기 (도전 과제 ①: 검색 기능 구현)
app.get('/posts', (req, res) => {
  const keyword = req.query.keyword ? req.query.keyword.trim() : '';
  let filteredPosts = posts;

  if (keyword) {
    filteredPosts = posts.filter((post) => post.title.includes(keyword));
  }

  res.render('list', { posts: filteredPosts, keyword });
});

// 2. 글쓰기 폼 화면
app.get('/posts/new', (req, res) => {
  res.render('new');
});

// 3. 새 글 저장 (도전 과제 ②: 빈 제목 방지)
app.post('/posts', (req, res) => {
  const { title, author, content } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).send('제목을 입력해 주세요.');
  }

  const post = addPost(posts, title.trim(), author, content);
  res.redirect(`/posts/${post.id}`);
});

// 4. 글 상세 보기 (도전 과제 ③: 없는 글일 때 404 페이지)
app.get('/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = findPost(posts, id);

  if (!post) {
    return res.status(404).render('404');
  }

  res.render('detail', { post });
});

// 5. 글 삭제
app.post('/posts/:id/delete', (req, res) => {
  const id = Number(req.params.id);
  const index = posts.findIndex((post) => post.id === id);
  if (index !== -1) {
    posts.splice(index, 1);
  }
  res.redirect('/posts');
});

// 6. 없는 주소 처리 (도전 과제 ③: 나만의 404 페이지)
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});