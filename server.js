const express = require('express');
const path = require('path');
const app = express();
const { Client } = require("pg");
// import {Client} from "pg"; ^^^ is what line above is absically saying
const client = new Client({
  connectionString:process.env.DATABASE_URL,
  //database url is stored in env 
  ssl: true
  //^ssl is true bc heroku reqires this 
});

app.use('/public',express.static(path.join(__dirname)));
app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.render('index')
});

app.get('/:userQuery',(req,res)=>{
    res.render('search',{data : {userQuery: req.params.userQuery,
                               searchResults : ['book1','book2','book3'],
                               loggedIn : true,
                               username : 'lkjslkjdf'}});
});

app.get('/pages/database',(req,res)=>{
    res.render('database', {data : })
});



app.listen(3000);