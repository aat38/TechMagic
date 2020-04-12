//***********SETUP****************//
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
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json from RESPONSE.body
app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.render("index");
});//*****************************//


//-------------------------------GETS-----------------------------------

//GET list of employees/////////////////////////////////////////////////
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

//GET all claims (independent of claim status)//////////////////////////
app.get("/data/claims", (request, response) => {
  client.connect();
  client.query("Select * from all_claims").then(
    function(resp) {
      console.log("Successfully retrieved ALL claims and claims information");
      console.log(resp.rows)
      //this info can be further parsed on frontend ie: can view only issues from claims table, only employees or whatever combo of things. the important thing is that the data is here and ready to be manipulated
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET all open claims//////////////////////////////////////////////////
app.get("/data/claims/open", (request, response) => {
  client.connect();
  client.query("select * from claim where status = 'Open'").then(
    function(resp) {
      console.log("Successfully retrieved all open claims");
      console.log(resp.rows)
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET all closed claims//////////////////////////////////////////////////
app.get("/data/claims/closed", (request, response) => {
  client.connect();
  client.query("select * from claim where status = 'Closed'").then(
    function(resp) {
      console.log("Successfully retrieved all closed claims");
      console.log(resp.rows)
    },
    function(err) {
      console.log(err);
    }
  );
});


//GET all claims belonging to an EMPLOYEE based on their ID passed to this endpoint
//(independent of claim status)/////////////////////////////////////////////////////
app.get("/data/claims/:employeeid", (request, response) => {
  // console.log(request.params.employeeId)
  var employeeid= [request.params.employeeid];
  var query=("SELECT concat_ws(' ', customer.firstname, customer.lastname) AS customer, product.name AS product, issue.name AS issue, claim.status, claim.description, concat_ws(' ',  employee.firstname, employee.lastname) AS employee, claim.dateopened, resolution.name AS resolution, claim.dateclosed FROM claim, productpurchase, purchase, product, customer, employee, issue, resolution WHERE claim.productpurchaseid = productpurchase.productpurchaseid AND productpurchase.productid = product.productid AND productpurchase.purchaseid = purchase.purchaseid AND purchase.customerid = customer.customerid AND claim.employeeid = employee.employeeid AND claim.issueid = issue.issueid AND claim.resolutionid = resolution.resolutionid AND employee.employeeid = $1");
  client.connect();
  client.query(query, employeeid)
    .then(
    function(resp) {
      console.log("Successfully retrieved ALL claims belonging to "+ employeeid);
      console.log(resp.rows)
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claim information based on claimId////////////////////////////////////
app.get("/data/claims/comments/:claimid", (request, response) => {
  var claimid= [request.params.claimid];
  var query=("select claim.claimid, claim.description as claim, comment.description as comment, claim.status from claim left join comment on claim.claimid = comment.claimid where claim.claimid = $1");
  client.connect();
  client.query(query, claimid)
    .then(
    function(resp) {
      console.log("Successfully retrieved claim information from claimId="+ claimid);
      console.log(resp.rows)
    },
    function(err) {
      console.log(err);
    }
  );
});


//GET claim information based on STATUS DESC/////////////shows open first//////////////////
app.get("/data/claims/status/desc", (request, response) => {
  client.connect();
  client.query("select * from all_claims order by status DESC").then(
    function(resp) {
      console.log("Successfully retrieved claims by status");
      console.log(resp.rows)
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claim information based on STATUS ASC/////////////shows closed first////////////////
app.get("/data/claims/status/asc", (request, response) => {
  client.connect();
  client.query("select * from all_claims order by status ASC").then(
    function(resp) {
      console.log("Successfully retrieved claims by status");
      console.log(resp.rows)
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET all customers//////////////////////////////////////////////////
app.get("/data/customers", (request, response) => {
  client.connect();
  client.query("select * from customer").then(
    function(resp) {
      console.log("Successfully retrieved all customers");
      console.log(resp.rows)
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claims by oldest//////////////////////////////////////////////////
app.get("/data/claims/opendate/oldest", (request, response) => {
  client.connect();
  client.query("select * from claim order by dateopened ASC").then(
    function(resp) {
      console.log("Successfully retrieved claims in order of oldest");
      console.log(resp.rows)
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claims by newest//////////////////////////////////////////////////
app.get("/data/claims/opendate/newest", (request, response) => {
  client.connect();
  client.query("select * from claim order by dateopened DESC").then(
    function(resp) {
      console.log("Successfully retrieved claims in order of newest");
      console.log(resp.rows)
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET purchase history by customer --DOESNT WORK because "item count" needs to be changed to "itemcount" first
app.get("/data/purchases/:customerid", (request, response) => {
  var vars= [request.params.customerid];
  var query =("select concat_ws(' ', customer.firstname, customer.lastname)AS customer, purchase.date, count(productpurchase.purchaseid) as itemcount, purchase.totalcost from customer left join purchase on customer.customerid = purchase.customerid left join productpurchase on purchase.purchaseid = productpurchase.purchaseid where customer.customerid = $1 group by purchase.purchaseid, customer.customerid order by purchase.date desc")
  client.connect();
  client.query(query, vars)
    .then(
    function(resp) {
      console.log("Successfully retrieved purchase history of customer "+ request.params.customerid);
      console.log(resp.rows)
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET resolutions by product////////////////////////////////////////////
app.get("/data/resolutions/:productname", (request, response) => {
  var prod= [''+ request.params.productname];
var query=("select product.name as product, resolution.name as resolution, claim.description as Claim from resolution, claim, productpurchase, product where resolution.resolutionid = claim.resolutionid and claim.productpurchaseid = productpurchase.productpurchaseid and productpurchase.productid = product.productid and product.name = $1");
  client.connect();
  client.query(query, prod)
    .then(
    function(resp) {
      console.log("Successfully retrieved resolutions for "+ request.params.productname);
      console.log(resp.rows)
    },
    function(err) {
      console.log(err);
    }
  );
});

//-------------------------------POSTS-----------------------------------
//POST// close a claim and submit a resolution in one request////////////
// update claim
// set resolutionid = 2, status = 'Closed', dateclosed = current_timestamp
// where claimid = 7
//POST a new resolution/////////////////////////////////////////////////
app.post("/data/addresolution", (request, response) => {
  const quer =("INSERT INTO resolution (name, description) VALUES ($1, $2)");
  const vals =[
    request.body.name, 
    request.body.description
  ];
  client.connect();
  client
    .query(quer,vals)
    .then(
      res => {
        console.log("Successfully added resolution,("+request.body.name+ ", " + request.body.description + ", " + request.body.description);
      },
      err => {
        console.log(
          "Failed to add resolution."
        );
      }
    )
    .catch(e =>  { console.error(e.stack)});
});

//POST a new claim///////////////////////////////////////////////////////
app.post("/data/newclaim", (request, response) => {
  const quer =("insert into claim(productpurchaseid, status, description, dateopened, resolutionid)  values($1,$2,$3,$4,$5)");
  const vals =[
    request.body.productpurchaseid, 
    request.body.status, 
    request.body.description, 
    request.body.dateopened, 
    request.body.resolutionid
  ];
  client.connect();
  client
    .query(quer,vals)
    .then(
      res => {
        console.log("Successfully added claim,("+request.body.productpurchaseid+ ", " + request.body.status + ", " + request.body.description+ ", " + request.body.dateopened+ ", " +  request.body.resolutionid);
      },
      err => {
        console.log(
          "Failed to add claim."
        );
      }
    )
    .catch(e =>  { console.error(e.stack)});
});

//POST new issue type////////////////////////////////////////////////////
app.post("/data/newissue", (request, response) => {
  const vars=[request.body.issue, request.body.description]
  const quer =("INSERT INTO issue(name, description) VALUES ($1, $2)")
  client.connect();
  client
    .query(quer, vars)
    .then(
      res => {
        console.log("Successfully added issue");
      },
      err => {
        console.log(
          "Failed to add issue."
        );
      }
    )
    .catch(e =>  { console.error(e.stack)});
});

// POST new product//////////////////////////////////////////////////////
app.post("/data/newitem", (request, response) => {
  const quer =
    "INSERT INTO product(name, description, unitcost) VALUES($1,$2,$3)";
  const vals = [
    request.body.name,
    request.body.description,
    request.body.unitcost
    ];
  client.connect();
  client
    .query(quer, vals)
    .then(
      res => {
        console.log("Successfully added item");
      },
      err => {
        console.log(
          "Failed to add item."
        );
      }
    )
    .catch(e =>  { console.error(e.stack)});
});

//POST new employee given existing address//////////////////////////////
app.post("/data/newEmployee", (request, response) => {
  // console.log(request.body)
  const employeeQuery =
    "INSERT INTO employee(addressid, email, firstname, lastname, phone, title) VALUES($1, $2,$3, $4, $5, $6 )";
  const employeeValues = [
    request.body.addressid,
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

//POST new address///////////////////////////////////////////////////
app.post("/data/newaddress", (request, response) => {
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

//POST new employee WITH new address/////////////////////////////////////////
//[needs to be a nested promise where address is added first and then second promise actually adds employee]
app.post("/data/newemployee/newaddress", (request, response) => {
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

//-------------------------------PUTS------------------------------------
//PUT//CLOSE claims/////////////////////////////////////////////////////
app.put("/data/update/claim", (request, response) => {
  const quer =("UPDATE claim SET status = 'Closed', dateclosed = current_timestamp WHERE claimid = $1");
  const vals =[request.body.claimid];
  client.connect();
  client
    .query(quer,vals)
    .then(
      res => {
        console.log("Successfully updated claim ");
      },
      err => {
        console.log(
          "Failed to update claim."
        );
      }
    )
    .catch(e =>  { console.error(e.stack)});
});


//------------------------------DELETES----------------------------------


/////////////////////////TEST TABLE ENDPOINTS/////////////////////////////////////
///////////////////just api endpoints-use with postman////////////////////////////
// https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en (chrome extension)
// //GET all test data
// app.get("/test", (request, response) => {
//   client.connect();
//   client.query("select * from test")
//     .then(function(resp){
//     //^use THEN because we are writing a "promise
//     console.log(resp.rows);
//     response.render('database', {data : resp.rows })
//   },function(err){
//     console.log(err);
//   });
// });
// //POST new test entry
// app.post("/test/post", (request, response) => {
// const text = 'INSERT INTO test(testid, name, description) VALUES($1, $2, $3)'
// const values = [request.body.testid, request.body.name, request.body.description]
//   client.connect();
//   client
//     .query(text, values)
//     .then(res => {
//       console.log(res.rows)
//     })
//     .catch(e => console.error(e.stack))
// });
// //DELETE test entry based on testid
// app.post("/test/delete", (request, response) => {
// const id = [request.body.testid]
// const text = 'DELETE FROM test WHERE testid = $1';
// client.connect();
//   client
//     .query(text, id)
//     .then(res => {
//       console.log(res.rows)
//     })
//     .catch(e => console.error(e.stack))
// });

app.listen(3000);
