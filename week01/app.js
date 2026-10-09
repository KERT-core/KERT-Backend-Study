const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('<h1>Hello Express!</h1>');
});

app.get('/about', (req, res) => {
    res.send('<h1>나는누구</h1><p>KERT 웹백엔드스터디1기</p>');
});


app.get('/photo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'photo.jpg'));
});

app.get('/time', (req, res) => {
    const now = new Date();
    res.send(`<h1>현재 시각</h1><p>${now}</p>`);
});

app.use((req, res) => {
    res.status(404).send('<h1>404 Page Not Found</h1>');
});

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`서버 실행중: http://localhost:${PORT}`);
});