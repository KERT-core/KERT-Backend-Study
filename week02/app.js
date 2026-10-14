const express = require('express');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

const posts = [
  { id: 1, title: 'Express 설치했어요', author: 'kim', content: 'npm install express 끝!' },
  { id: 2, title: '서버가 안 켜져요', author: 'lee', content: 'EADDRINUSE 에러가 나요' },
  { id: 3, title: 'EJS 질문', author: 'park', content: '<%= %> 랑 <%- %> 차이가 뭔가요?' },
];

/*05. id중복 막기 - 글을 삭제한 뒤 새로 써도 id가 겹치지 않게
    글을 삭제한 뒤 새로 써도 id가 재사용되지 않음.*/
let nextId = posts.reduce((max, post) => Math.max(max, post.id), 0) + 1;

function findPost(posts,id) {
    return posts.find((post) => post.id === id) ?? null;
}

function addPost(posts,title,author,content) {
    const post = { id:nextId,title,author,content}; //id = 가장 큰 id + 1
    nextId++;
    posts.push(post);
    return post;
}

// 루트 주소로 들어오면 목록으로 보내기
app.get('/', (req, res) => {
    res.redirect('/posts');
});

//01.목록을 EJS로 렌더.글이 없으면 '글이 없습니다'
//도전 1: 제목에 keyword가 들어간 글만 목록에 보여주기
app.get('/posts',(req,res) => {
    const keyword = (req.query.keyword ?? '').trim();

    //keyword가 있을 때만 거르고, 없으면 전체 목록으로
    const result = keyword ? posts.filter((post) => post.title.includes(keyword)) : posts;
    res.render('list', { posts: result,keyword });
});

//02. 글쓰기 폼과 저장. 저장 후 새 글 상세로 redirect
app.get('/posts/new',(req,res)=> {
    res.render('new');
});

app.post('/posts',(req,res) => {
    const {title,author,content} = req.body;
    //도전 2: 빈 제목 막기 - 제목이 비어 있거나 공백뿐이면 저장하지 않기
    if (!title || title.trim() === '') {
        return res.status(400).render('new'); //400 응답 + 다시 글쓰기 화면
    }

    const post = addPost(posts,title,author,content);
    res.redirect(`/posts/${post.id}`); //글 저장->redirect
});

//03. 상세 페이지.없는 id는 404
app.get('/posts/:id',(req,res) => {
    const id = Number(req.params.id);
    const post = findPost(posts,id);
    if (!post) {
        return res.status(404).render('404');
    }
    res.render('detail',{ post });
});


//04. 삭제 후 목록으로 redirect
app.post('/posts/:id/delete',(req,res)=> {
    const id = Number(req.params.id);
    const index = posts.findIndex((post) => post.id === id);
    if (index !== -1) {
        posts.splice(index, 1);
    }
    res.redirect('/posts');
});

//도전 3: 없는 주소, 없는 글일 때 views/404.ejs를 렌더(상태 코드는 404)
app.use((req,res) => {
    res.status(404).render('404');
});

app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}/posts`);
});