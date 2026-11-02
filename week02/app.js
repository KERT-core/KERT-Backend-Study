const express = require('express');
const app = express();
const PORT = 3000;

// EJS 템플릿 엔진 설정
app.set('view engine', 'ejs');

// 폼 데이터를 객체(req.body)로 파싱하기 위한 미들웨어 설정
app.use(express.urlencoded({ extended: false }));

// 초기 게시물 데이터
let posts = [
  { id: 1, title: 'Express 설치했어요', author: 'kim', content: 'npm install express 끝!' },
  { id: 2, title: '서버가 안 켜져요', author: 'lee', content: 'EADDRINUSE 에러가 나요' },
  { id: 3, title: 'EJS 질문', author: 'park', content: '<%= %> 랑 <%- %> 차이가 뭔가요?' }
];

// Helper: 글 찾기
function findPost(posts, id) {
  return posts.find((post) => post.id === id) ?? null;
}

// Helper: 새 글 추가 (가장 큰 ID + 1로 중복 방지)
function addPost(posts, title, author, content) {
  const maxId = posts.reduce((max, post) => Math.max(max, post.id), 0);
  const post = { id: maxId + 1, title, author, content };
  posts.push(post);
  return post;
}

// 0. 첫 화면 진입 시 /posts 로 리다이렉트
app.get('/', (req, res) => {
  res.redirect('/posts');
});

// 1. 글 목록 보기
app.get('/posts', (req, res) => {
  res.render('list', { posts });
});

// 2. 글쓰기 폼 페이지 (주의: /posts/:id 보다 위에 위치해야 함)
app.get('/posts/new', (req, res) => {
  res.render('new');
});

// 3. 새 글 저장하기
app.post('/posts', (req, res) => {
  const { title, author, content } = req.body;
  const post = addPost(posts, title, author, content);
  res.redirect(`/posts/${post.id}`);
});

// 4. 글 상세 보기
app.get('/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = findPost(posts, id);
  if (!post) {
    return res.status(404).send('글이 없습니다');
  }
  res.render('detail', { post });
});

// 5. 글 삭제하기
app.post('/posts/:id/delete', (req, res) => {
  const id = Number(req.params.id);
  const index = posts.findIndex((post) => post.id === id);
  if (index !== -1) {
    posts.splice(index, 1);
  }
  res.redirect('/posts');
});

app.listen(PORT, () => {
  console.log(`서버가 실행되었습니다: http://localhost:${PORT}`);
});