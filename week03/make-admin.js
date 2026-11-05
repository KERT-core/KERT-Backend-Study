const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync('board.db');
const username = process.argv[2];

if (!username) {
  console.error('사용법: node make-admin.js <아이디>');
  process.exit(1);
}

const user = db.prepare(
  'SELECT id, username FROM users WHERE username = ?'
).get(username);

if (!user) {
  console.error(`사용자를 찾을 수 없습니다: ${username}`);
  db.close();
  process.exit(1);
}

db.prepare(
  "UPDATE users SET role = 'admin' WHERE id = ?"
).run(user.id);

console.log(`${user.username} 계정이 관리자로 변경되었습니다.`);

db.close();