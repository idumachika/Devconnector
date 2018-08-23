const express = require("express");
const mongoose = require ("mongoose");


const users = require('./app/routes/api/users');
const profile = require('./app/routes/api/profile');
const posts = require('./app/routes/api/posts');

const app =express();


//DB config 
const db =require('./config/key').mongoURI;

// Connect to MongoDB
mongoose.connect(db)
.then(()=> console.log('MongoDB Connected'))
.catch(err =>console.log(err));


app.get('/',(req, res)=>res.send('Hello World'));

//use Routes
app.use('/api/users',users);
app.use('/api/profile', profile);
app.use('/api/posts',posts);


const port =process.env.PORT || 5000;

app.listen(port,()=>console.log(`Server running on port ${port}`));