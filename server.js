const express = require('express');
const path = require('path');
const app = express();
const { Client } = require("pg");
// import {Client} from "pg"; ^^^ is what line above is absically saying
const client = new Client({
  connectionString:process.env.DATABASE_URL,
  //database url is stored in env 
  ssl: true
  //^ssl needs to be set to true bc heroku reqires this 
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
    
app.get("/pages/database", (request, response) => {
  client.connect();
  client.query("select * from test").then(function(resp){
    //^use THEN because we are writing a "promise
    console.log(resp.rows);
    response.render('database', {data : resp.rows })
  },function(err){
    console.log(err);
  });                                              
});

app.get("/pages/getNames", (request, response) => {
  console.log("hi");
  client.connect();
  client.query("select * from test").then(function(resp){

    response.locals.names = resp.rows;
    response.render('index', {names : response.locals.names  })
  },function(err){
    console.log(err);
  });     
});

app.get("/pages/names", (request, response) => {
  client.connect();
  client.query("SELECT firstname, lastname from employee").then(function(resp){

    response.locals.emp = resp.rows;
    response.render('index', {emp : response.locals.emp  })
  },function(err){
    console.log(err);
  });     
});


//-------------------figuring out how to post:------------------------

app.post("/pages/sendNames", (request, response) => {
const text = 'INSERT INTO test(testid, name, description) VALUES($1, $2, $3)'
const values = [7, request.name, request.desc]
  console.log("in pages/sendNames");
  console.log(request.query.id)
  client.connect();
  client
    .query(text, values)
    .then(res => {
      console.log(res.rows[0])
//     response.locals.updatedData = resp.rows;
//     response.render('database', {data : response.locals.updatedData.rows  })
//     console.log(response.locals.updatedData.rows );
    })
    .catch(e => console.error(e.stack))                                      
});


app.listen(3000);