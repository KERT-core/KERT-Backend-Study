const express = require('express');
const app = express();
const PORT = 3000;

// EJS 템플릿 엔진 및 폼 데이터(req.body) 파싱 설정
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false })); //[cite: 23]

// 초기 게시글 메모리 데이터[cite: 9]
let posts = [
  { id: 1, title: 'Express 설치했어요', author: 'kim', content: 'npm install express 끝!' },
  { id: 2, title: '서버가 안 켜져요', author: 'lee', content: 'EADDRINUSE 에러가 나요' },
  { id: 3, title: 'EJS 질문', author: 'park', content: '<%= %> 랑 <%- %> 차이가 뭔가요?' },
];

// Helper: 글 찾기[cite: 19]
function findPost(posts, id) {
  return posts.find((post) => post.id === id) ?? null;
}

// Helper: 새 글 추가 (id 중복 방지 - 가장 큰 id + 1)[cite: 24, 28]
function addPost(posts, title, author, content) {
  const maxId = posts.reduce((max, post) => Math.max(max, post.id), 0);
  const post = { id: maxId + 1, title, author, content };
  posts.push(post);
  return post;
}

// --- 라우트 작성 ---

// 0. 첫 화면 -> 목록으로 redirect[cite: 9]
app.get('/', (req, res) => {
  res.redirect('/posts');
});

// 1. 글 목록[cite: 9]
app.get('/posts', (req, res) => {
  res.render('list', { posts });
});

// 2. 글쓰기 폼
app.get('/posts/new', (req, res) => {
  res.render('new');
});

// 3. 글 저장 (POST)[cite: 9, 24]
app.post('/posts', (req, res) => {
  const { title, author, content } = req.body;
  const post = addPost(posts, title, author, content);
  res.redirect(`/posts/${post.id}`); // PRG 패턴 적용[cite: 24, 25]
});

// 4. 글 상세 페이지[cite: 9, 19]
app.get('/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = findPost(posts, id);
  if (!post) {
    return res.status(404).send('글이 없습니다');
  }
  res.render('detail', { post });
});

// 5. 글 삭제 (POST)[cite: 9, 27]
app.post('/posts/:id/delete', (req, res) => {
  const id = Number(req.params.id);
  const index = posts.findIndex((post) => post.id === id);
  if (index !== -1) {
    posts.splice(index, 1);
  }
  res.redirect('/posts');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});