const express = require('express');
const res = require('express/lib/response');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');
const app = express();
const port =3978;

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
    res.json(tasks);
});

app.get('/tasks/:id',(req,res)=>{
    const id= req.params.id;
    if(!taskById || taskById == "undefined"){
       return res.status(404).json({ error: 'Task ${id} not found' });
    }
    const taskById = tasks.find((task) => task.id === id);
    res.json(taskById);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (title === undefined || title === null || String(title).trim() === '') {
    return res.status(400).json({ error: 'Task title is required and cannot be empty' });
  }

  const id = tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1;
  const task = { id, title: String(title).trim(), done: false };

  tasks.push(task);
  res.status(201).json(task);
});

app.put('/tasks:id',(req,res)=>{
    const { title } = req.body;
    if(req.params.id === undefined || id === null || id === ''){
        return res.status(404).json({ error: "Invalid Task ID" } );
    }
    if (title === undefined || title === null || String(title).trim() === '') {
        return res.status(400).json({ error: 'Task title is required and cannot be empty' });
    }
    const taskById = tasks.find((task) => task.id === req.params.id);
    taskById.title = String(title).trim();
    res.json(taskById);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.find((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task ${id} not found' });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});

app.listen(port,()=>{
    console.log("Server is listening at port ",port);
});