const express = require('express');
const res = require('express/lib/response');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');
const db = require('./database');
const app = express();
const port =3978;

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

app.get('/',(req,res)=>{
    return res.json({ "name": "Task API", "version": "1.0", "endpoints": ["/tasks"] });
});

app.get('/health',(req,res)=>{
    return res.json({ "status": "ok" });
});

const tasks = [
    {"id":"1", "title":"start learning backend", "done": true},
    {"id":"2", "title":"learn backend", "done": false},
    {"id":"3", "title": "complete assignment one", "done": false}
];

app.get('/tasks',(req,res)=>{
    const tasks = db.prepare('SELECT * FROM tasks').all();
    res.json(tasks);
});

app.get('/tasks/:id',(req,res)=>{
    const id= req.params.id;
    const task = db
        .prepare('SELECT * FROM tasks WHERE id = ?')
        .get(id);

    if (!task) {
        return res.status(404).json({
            error: 'Task not found'
        });
    }
    res.json(task);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (title === undefined || title === null || String(title).trim() === '') {
    return res.status(400).json({ error: 'Task title is required and cannot be empty' });
  }

  const result = db
    .prepare('INSERT INTO tasks (title, done) VALUES (?, ?)')
    .run(title, 0);

  const task = db
        .prepare('SELECT * FROM tasks WHERE id = ?')
        .get(result.lastInsertRowid);

  res.status(201).json(task);
});

app.put('/tasks/:id',(req,res)=>{
    const id = req.params.id;
    const { title } = req.body;
    if(id === undefined || id === null || id === ''){
        return res.status(404).json({ error: "Invalid Task ID" } );
    }
    if (title === undefined || title === null || String(title).trim() === '') {
        return res.status(400).json({ error: 'Task title is required and cannot be empty' });
    }
    const result = db
    .prepare('UPDATE tasks SET title = ? WHERE id = ?')
    .run(String(title).trim(), id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: 'Task not found'
        });
    }

    const task = db
    .prepare('SELECT * FROM tasks WHERE id = ?')
    .get(id);
    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;

  const result = db
    .prepare('DELETE FROM tasks WHERE id = ?')
    .run(id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: 'Task not found'
    });
  }
  res.status(204).send();
});

app.listen(port,()=>{
    console.log("Server is listening at port ",port);
});