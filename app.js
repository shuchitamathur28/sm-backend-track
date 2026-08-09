const express = require('express');
const res = require('express/lib/response');
const app = express();
const port =3198;

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
    const taskById = tasks.find((task) => task.id === id);
    if(!taskById || taskById == "undefined"){
       return res.status(404).json({ error: 'Task ${id} not found' });
    }
    res.json(taskById);
});

app.listen(port,()=>{
    console.log("Server is listening at port ",port);
});