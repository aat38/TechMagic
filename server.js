const express = require('express');
const path = require('path');
const app = express();
const fetch = require('node-fetch');
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

app.post("/pages/sendNames", (request, response) => {
  console.log(request);
  client.connect();
  client.query("insert into" + "test(testid, name, description) values("+request.query.id+","+ request.query.name+","+ request.query.desc+")")
      .then(function(resp){
    response.locals.updatedData = resp.rows;
    response.render('database', {data : response.locals.updatedData.rows  })
        console.log(response.locals.updatedData.rows );
  },function(err){
    console.log(err);
  });                                              
});

//      fetch("/pages/sendNames", {
//         method: "POST",
//         // mode: "cors",
//         // cache: "no-cache", 
//         // credentials: "same-origin", 
//         headers: {
//             "Content-Type": "application/json; charset=utf-8",
//         },
       
//         // redirect: "follow", 
//         // referrer: "no-referrer", 
//         // body: JSON.stringify(data)
//     }).then(function (response) {
       
//         return response.json();
//     },function(err){
//               console.log("hey");
//      });


 
// app.post("/pages/sendNames", (request, response) => {
//   console.log("hey");
//   client.connect();
//   client.query("insert into" + "test(testid, name, description) values(request.query.id, request.query.name, request.query.desc)")
//       .then(function(resp){
//         console.log("hey");
//     response.locals.updatedData = resp.rows;
//     response.render('database', {data : response.locals.updatedData.rows  })
//         console.log(response.locals.updatedData.rows );
//   },function(err){
//     console.log(err);
//   });                                              
// });

app.listen(3000);