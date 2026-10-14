
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));


// 게시글 데이터 (PDF 6쪽 예시)
const posts = [
  {
    id: 1,
    title: 'Express 설치했어요',
    author: 'kim',
    content: 'npm install express 끝!'
  },
  {
    id: 2,
    title: '서버가 안 켜져요',
    author: 'lee',
    content: 'EADDRINUSE 에러가 나요'
  },
  {
    id: 3,
    title: 'EJS 질문',
    author: 'park',
    content: '<%= %> 랑 <%- %> 차이가 뭔가요?'
  }
];

// 게시글 찾기 (PDF 16쪽)
function findPost(posts, id) {
  return posts.find((post) => post.id === id) ?? null;
}

// 게시글 추가 (PDF 21쪽)
// 가장 큰 id + 1을 사용해 ID 중복 방지

function addPost(posts, title, author, content) {
  const maxId = posts.reduce(
    (max, post) => Math.max(max, post.id),
    0
  );

  const post = {
    id: maxId + 1,
    title,
    author,
    content
  };

  posts.push(post);
  return post;
}


app.get('/', (req, res) => {
  res.redirect('/posts');
});

  
app.get('/posts', (req, res) => {
  const keyword = req.query.keyword || '';

  const filteredPosts = posts.filter((post) =>
    post.title.includes(keyword)
  );

  res.render('list', { posts: filteredPosts });
});


// 2. 글쓰기 화면 (PDF 19쪽)
// 반드시 /posts/:id 라우트보다 먼저 작성
app.get('/posts/new', (req, res) => {
  res.render('new');
});

// 3. 게시글 등록 (PDF 21쪽)
app.post('/posts', (req, res) => {
  const { title, author, content } = req.body;

  // 제목이 없거나 공백뿐이면 등록하지 않음
  if (!title || !title.trim()) {
    return res.status(400).send('제목을 입력해 주세요.');
  }

  const post = addPost(posts, title, author, content);

  res.redirect(`/posts/${post.id}`);
});

// 4. 게시글 상세 페이지 (PDF 16쪽)
app.get('/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = findPost(posts, id);

  if (!post) {
    return res.status(404).render('404');
  }

  res.render('detail', { post });
});

// 5. 게시글 삭제 (PDF 24쪽)
app.post('/posts/:id/delete', (req, res) => {
  const id = Number(req.params.id);
  const index = posts.findIndex((post) => post.id === id);

  if (index !== -1) {
    posts.splice(index, 1);
  }

  res.redirect('/posts');
});

app.use((req, res) => {
  res.status(404).render('404');
});

// 서버 실행
app.listen(3000, () => {
  console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
});
