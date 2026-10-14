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
let nextId = 1;

function findPost(posts,id) {
    return posts.find((post) => post.id === id) ?? null;
}

function addPost(posts,title,author,content) {
    const maxid = posts.reduce((max,post)=>Math.max(max,post.id),0);
    const post = { id:maxid+1,title,author,content}; //id = 가장 큰 id + 1
    posts.push(post);
    return post;
}

//01.목록을 EJS로 렌더.글이 없으면 '글이 없습니다'
app.get('/posts',(req,res) => {
    res.render('list', { posts });
});

//02. 글쓰기 폼과 저장. 저장 후 새 글 상세로 redirect
app.get('/posts/new',(req,res)=> {
    res.render('new');
});

app.post('/posts',(req,res) => {
    console.log(req.body);
    const {title,author,content} = req.body;
    const post = addPost(posts,title,author,content);
    res.redirect(`/posts/${post.id}`); //글 저장->redirect
});

//03. 상세 페이지.없는 id는 404
app.get('/posts/:id',(req,res) => {
    const id = Number(req.params.id);
    const post = findPost(posts,id);
    if (!post) {
        return res.status(404).send('글이 없습니다.');
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

app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}/posts`);
});