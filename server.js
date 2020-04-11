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
  console.log(response.body)
//   const addressQuery =
//     "SET transaction_read_only = off;INSERT INTO address(addressid, city, state, streetaddress, streetaddress2, zip) VALUES($1,$2,$3,$4,$5,$6)";
//   const addressValues = [
//     response.body.addId,
//     response.body.city,
//     response.body.state,
//     response.body.streetaddress,
//     response.body.streetaddress2,
//     response.body.zip
//   ];
//   ("INSERT INTO employee(addressid, email, employeeid, firstname, lastname, phone, title) VALUES($1, $2 $3 ,$4 $5, $6, $7 )");

//   const employeeQuery =
//     "INSERT INTO employee(addressid, email, employeeid, firstname, lastname, phone, title) VALUES($1, $2 $3 ,$4 $5, $6, $7 )";
//   const employeeValues = [
//     response.body.addId,
//     response.body.email,
//     response.body.empId,
//     response.body.firstname,
//     response.body.lastname,
//     response.body.phone,
//     response.body.title
//   ];
//   client.connect();
//   client
//     .query(addressQuery, addressValues)
//     .then(
//       res => {
//         client.end();
//         console.log("Successfully added address values." + res.rows[0]);
//         //call employee query inside resolution of address promise
//         client.connect();
//         client
//           .query(employeeQuery, employeeValues)
//           .then(res => {
//             console.log("Employee successfully added.");
//           })
//           .catch();
//           client.end();
//       },
//       err => {
//         client.end();
//         console.log(
//           "Failed to add address. Emplyee will not be added since it is dependent on address."
//         );
//       }
//     )
//     .catch(e => console.error(e.stack));
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
