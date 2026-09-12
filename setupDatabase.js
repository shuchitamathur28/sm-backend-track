const db = require('./database');

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        done BOOLEAN
    )
`);

const result = db
    .prepare('SELECT COUNT(*) as count from tasks')
    .get();

if (result.count === 0) {
    const insert = db.prepare(`
        INSERT INTO tasks (title, done)
        VALUES (?, ?)
    `);

    insert.run('Learn Node.js', 0);
    insert.run('Build an API', 0);
    insert.run('Learn SQLite', 0);

    console.log('Example tasks inserted.');
} else {
    console.log('Tasks already exist. No seed data inserted.');
}

console.log('Database setup complete.');