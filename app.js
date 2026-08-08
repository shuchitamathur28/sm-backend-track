const express = require('express');
const res = require('express/lib/response');
const app = express();
const port =3000;

// app.get('/',(req,res)=>{
//     res.send('Hello Server!');
// });

app.get('/',(req,res)=>{
    return res.json({ "name": "Task API", "version": "1.0", "endpoints": ["/tasks"] });
});

app.get('/health',(req,res)=>{
    return res.json({ "status": "ok" });
});

app.listen(port,()=>{
    console.log("Server is listening at port 3000");
});