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

//--------------------- Routes -------------------------------

app.get("/", (req, res) => {
  res.render("index");
});

// app.get("/pages/database", (request, response) => {
//   client.connect();
//   client.query("select * from test").then(function(resp){
//     //^use THEN because we are writing a "promise
//     console.log(resp.rows);
//     response.render('database', {data : resp.rows })
//   },function(err){
//     console.log(err);
//   });
// });

app.get("/pages/names", (request, response) => {
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

app.post("/pages/new/", (request, response) => {
  const addressQuery =
    "INSERT INTO address(addressid, city, state, streetaddress, streetaddress2, zip) VALUES($1,$2,$3,$4,$5,$6)";
  const addressValues = [
    request.addId,
    request.city,
    request.state,
    request.streetaddress,
    request.streetaddress2,
    request.zip
  ];
  ("INSERT INTO employee(addressid, email, employeeid, firstname, lastname, phone, title) VALUES($1, $2 $3 ,$4 $5, $6, $7 )");

  const employeeQuery =
    "INSERT INTO employee(addressid, email, employeeid, firstname, lastname, phone, title) VALUES($1, $2 $3 ,$4 $5, $6, $7 )";
  const employeeValues = [
    request.addId,
    request.email,
    request.empId,
    request.firstname,
    request.lastname,
    request.phone,
    request.title
  ];
  client.connect();
  client
    .query(addressQuery, addressValues)
    .then(
      res => {
        console.log("Successfully added address values." + res.rows[0]);
        //call employee query inside resolution of address promise
        client
          .query(employeeQuery, employeeValues)
          .then(res => {
            console.log("Employee successfully added.");
          })
          .catch();
      },
      err => {
        console.log(
          "Failed to add address. Emplyee will not be added since it is dependent on address."
        );
      }
    )
    .catch(e => console.error(e.stack));
});

// app.post("/pages/names", (request, response) => {
// const text = 'INSERT INTO test(testid, name, description) VALUES($1, $2)'
// const values = [request.body.firstname, request.body.lastname]
//   client.connect();
//   client
//     .query(text, values)
//     .then(res => {
//       console.log(res.rows)
//     })
//     .catch(e => console.error(e.stack))
// });

app.listen(3000);
