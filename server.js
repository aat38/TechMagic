const express = require("express");
const path = require("path");
const app = express();
const { Client } = require("pg");
// import {Client} from "pg"; ^^^ is what line above is absically saying
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  //database url is stored in env
  ssl: true
  //^ssl needs to be set to true bc heroku reqires this
});

app.use("/public", express.static(path.join(__dirname)));
app.set("view engine", "ejs");
var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.render("index");
});

/////////////////////////REAL DATA ENDPOINTS////////////////////////////////////
///////////////////just api endpoints-use with postman////////////////////////////
/////////////////clickable frontend buttons havent been setup////////////////////

//GET
app.get("/data/employeenames", (request, response) => {
  client.connect();
  client.query("SELECT firstname, lastname from employee").then(
    function(resp) {
      response.locals.emp = resp.rows;
      response.render("index", { emp: response.locals.emp });
    },
    function(err) {
      console.log(err);
    }
  );
});


app.post("/data/newItem", (request, response) => {
  // console.log(request.body)
  const quer =
    "INSERT INTO product(name, description, unitcost) VALUES($1,$2,$3)";
  const vals = [
    request.body.name,
    request.body.des,
    request.body.cost
    ];
  client.connect();
  client
    .query(quer, vals)
    .then(
      res => {
        // client.end();
        console.log("Successfully added item");
      },
      err => {
        // client.end();
        console.log(
          "Failed to add item."
        );
      }
    )
    .catch(e =>  { console.error(e.stack)});
});

//POST new employee given existing address 
app.post("/data/newEmployee", (request, response) => {
  // console.log(request.body)
  const employeeQuery =
    "INSERT INTO employee(addressid, email, firstname, lastname, phone, title) VALUES($1, $2,$3, $4, $5, $6 )";
  const employeeValues = [
    request.body.addId,
    request.body.email,
    request.body.firstname,
    request.body.lastname,
    request.body.phone,
    request.body.title
  ];
  client.connect();
  client
    .query(employeeQuery, employeeValues)
    .then(
      res => {
        // client.end();
        console.log("Successfully added employee");
      },
      err => {
        // client.end();
        console.log(
          "Failed to add employee."
        );
      }
    )
    .catch(e =>  { console.error(e.stack)});
});




app.post("/data/newAddress", (request, response) => {
  const quer =
    "INSERT INTO address(city, state, streetaddress, streetaddress2, zip) VALUES($1,$2,$3,$4,$5) RETURNING addressid";
  const addressValues = [
    request.body.city,
    request.body.state,
    request.body.streetaddress,
    request.body.streetaddress2,
    request.body.zip
  ];
  client.connect();
  client
    .query(quer, addressValues)
    .then(
      res => {
        // client.end();
        console.log("Successfully added address");
        console.log(res.rows[0].addressid)
      },
      err => {
        // client.end();
        console.log(
          "Failed to add address."
        );
      }
    )
    .catch(e =>  { console.error(e.stack)});
});




//POST new employee WITH new address -- still in the works 
//[needs to be a nested promise where address is added first and then second promise actually adds employee]
app.post("/data/newEmployee/newAddress", (request, response) => {
  const addressQuery =
    "INSERT INTO address(city, state, streetaddress, streetaddress2, zip) VALUES($1,$2,$3,$4,$5) RETURNING addressid";
  const addressValues = [
    request.body.city,
    request.body.state,
    request.body.streetaddress,
    request.body.streetaddress2,
    request.body.zip
  ];

  const employeeQuery =
    "INSERT INTO employee(addressid, email, firstname, lastname, phone, title) VALUES($1, $2, $3 ,$4, $5, $6)";
  client.connect();
  client
    .query(addressQuery, addressValues)
    .then(
      res => {
        console.log("Successfully added address values.");
        //call employee query inside resolution of address promise
        client
          .query(employeeQuery, [ res.rows[0].addressid,
              request.body.email,
              request.body.firstname,
              request.body.lastname,
              request.body.phone,
              request.body.title])
          .then(res => {
            console.log("Employee successfully added with new address.");
          })
          .catch(e =>  {console.error(e.stack);console.log("catching1.")});
      },
      err => {
        console.log(
          "Failed to add address. Employee will not be added since it is dependent on address."
        );
      }
    )
    .catch(e =>  {console.error(e.stack);console.log("catching2.");});
});



/////////////////////////TEST TABLE ENDPOINTS////////////////////////////////////
///////////////////just api endpoints-use with postman////////////////////////////
// https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en

//GET all test data
app.get("/test", (request, response) => {
  client.connect();
  client.query("select * from test")
    .then(function(resp){
    //^use THEN because we are writing a "promise
    console.log(resp.rows);
    response.render('database', {data : resp.rows })
  },function(err){
    console.log(err);
  });
});

//POST new test entry
app.post("/test/post", (request, response) => {
const text = 'INSERT INTO test(testid, name, description) VALUES($1, $2, $3)'
const values = [request.body.testid, request.body.name, request.body.description]
  client.connect();
  client
    .query(text, values)
    .then(res => {
      console.log(res.rows)
    })
    .catch(e => console.error(e.stack))
});

//DELETE test entry based on testid
app.post("/test/delete", (request, response) => {
const id = [request.body.testid]
const text = 'DELETE FROM test WHERE testid = $1';
client.connect();
  client
    .query(text, id)
    .then(res => {
      console.log(res.rows)
    })
    .catch(e => console.error(e.stack))
});

app.listen(3000);
