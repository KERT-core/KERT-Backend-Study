
const express = require('express');
const { DatabaseSync } = require('node:sqlite');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));



const db = new DatabaseSync('board.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL
);
`);


app.use(session({
  secret: 'kert-week03-secret',
  resave: false,
  saveUninitialized: false
}));


app.use((req, res, next) => {
  res.locals.user = req.session.user ?? null;
  next();
});

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  next();
}

function requireAdmin(req, res, next) {
  if (
    !req.session.user ||
    req.session.user.role !== 'admin'
  ) {
    return res.status(403).send('관리자만 볼 수 있습니다');
  }

  next();
}

app.get('/', (req, res) => {
  res.redirect('/posts');
});



app.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});


app.post('/signup', (req, res) => {
  const { username, password } = req.body;


  if (!username || !password) {
    return res.render('signup', {
      error: '아이디와 비밀번호를 입력해주세요'
    });
  }


  const exists = db.prepare(`
    SELECT id
    FROM users
    WHERE username = ?
  `).get(username);

  if (exists) {
    return res.render('signup', {
      error: '이미 있는 아이디입니다'
    });
  }


  const hash = bcrypt.hashSync(password, 10);


  db.prepare(`
    INSERT INTO users (username, password)
    VALUES (?, ?)
  `).run(username, hash);

  res.redirect('/login');
});



app.get('/login', (req, res) => {
  res.render('login', { error: null });
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;


  const user = db.prepare(`
    SELECT *
    FROM users
    WHERE username = ?
  `).get(username);


  if (
    !user ||
    !bcrypt.compareSync(password, user.password)
  ) {
    return res.render('login', {
      error: '아이디 또는 비밀번호가 틀렸습니다'
    });
  }

  req.session.user = {
    id: user.id,
    username: user.username,
    role: user.role
  };

  res.redirect('/posts');
});



app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/posts');
  });
});


app.get('/posts', (req, res) => {
  const posts = db.prepare(`
    SELECT
      posts.id,
      posts.title,
      users.username
    FROM posts
    JOIN users
      ON posts.user_id = users.id
    ORDER BY posts.id
  `).all();

  res.render('list', { posts });
});


app.get('/posts/new', requireLogin, (req, res) => {
  res.render('new');
});


app.post('/posts', requireLogin, (req, res) => {
    const { title, content } = req.body;

    const result = db
        .prepare(
            'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)'
        )
        .run(title, content, req.session.user.id);

    const postId = result.lastInsertRowid;

    res.redirect(`/posts/${postId}`);
});



app.get('/posts/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).send('글이 없습니다');
  }

  const post = db.prepare(`
    SELECT
      posts.id,
      posts.title,
      posts.content,
      posts.user_id,
      users.username
    FROM posts
    JOIN users
      ON posts.user_id = users.id
    WHERE posts.id = ?
  `).get(id);

  if (!post) {
    return res.status(404).send('글이 없습니다');
  }

  const comments = db.prepare(`
        SELECT comments.*, users.username
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.post_id = ?
        ORDER BY comments.id ASC
    `).all(id);

  res.render('detail', { post, comments });
});

app.post(
  '/posts/:id/delete',
  requireLogin,
  (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(404).send('글이 없습니다');
    }

   
    const post = db.prepare(`
      SELECT *
      FROM posts
      WHERE id = ?
    `).get(id);

    if (!post) {
      return res.status(404).send('글이 없습니다');
    }

    const me = req.session.user;

    if (
      post.user_id !== me.id &&
      me.role !== 'admin'
    ) {
      return res.status(403).send(
        '내 글만 삭제할 수 있습니다'
      );
    }

    db.prepare(`
      DELETE FROM posts
      WHERE id = ?
    `).run(id);

    res.redirect('/posts');
  }
);

app.post('/posts/:id/comments', requireLogin, (req, res) => {
    const postId = Number(req.params.id);
    const { content } = req.body;

    const post = db
        .prepare('SELECT id FROM posts WHERE id = ?')
        .get(postId);

    if (!post) {
        return res.status(404).send('글이 없습니다');
    }

    if (!content || !content.trim()) {
        return res.redirect(`/posts/${postId}`);
    }

    db.prepare(`
        INSERT INTO comments (content, post_id, user_id)
        VALUES (?, ?, ?)
    `).run(content.trim(), postId, req.session.user.id);

    res.redirect(`/posts/${postId}`);
});


app.get('/admin', requireAdmin, (req, res) => {
  const users = db.prepare(`
    SELECT id, username, role
    FROM users
    ORDER BY id
  `).all();

  res.render('admin', { users });
});

app.post('/admin/users/:id/role', requireAdmin, (req, res) => {
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).send('잘못된 사용자 ID입니다');
  }

  const target = db.prepare(`
    SELECT id, role
    FROM users
    WHERE id = ?
  `).get(userId);

  if (!target) {
    return res.status(404).send('사용자를 찾을 수 없습니다');
  }

  const newRole = target.role === 'admin' ? 'user' : 'admin';

  db.prepare(`
    UPDATE users
    SET role = ?
    WHERE id = ?
  `).run(newRole, userId);

  // 내 세션의 권한도 변경되는 경우 갱신
  if (req.session.user.id === userId) {
    req.session.user.role = newRole;
  }

  res.redirect('/admin');
});


app.get('/my', requireLogin, (req, res) => {
    const posts = db.prepare(`
        SELECT posts.id, posts.title, users.username
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.user_id = ?
        ORDER BY posts.id DESC
    `).all(req.session.user.id);

    res.render('list', { posts });
});





app.listen(PORT, () => {
  console.log(`서버 실행: http://localhost:${PORT}`);
});
