///////////////////////////////// API ///////////////////////////////////
//////////////////////// all routes begin with /api /////////////////////
const express = require("express");
const apirouter = express.Router();
const { Client } = require("pg");// import {Client} from "pg"; is what line is absically saying

const client = new Client({
  connectionString: process.env.DATABASE_URL,//database url is stored in env
  ssl: true//ssl needs to be set to true bc heroku reqires this
});


/////////////////////////////// ROUTES//////////////////////////////////
//-------------------------------GETS----------------------------------

//CLAIMS
//GET all claims (independent of claim status)-------------------------
apirouter.get("/claims", (request, response) => {
  client.connect();
  return client.query("Select * from all_claims").then(
    function(resp) {
      console.log("Successfully retrieved ALL claims and claims information");
      // console.log(resp.rows);
      response.send(resp.rows);
      //this info can be further parsed on frontend ie: can view only issues from claims table, only employees or whatever combo of things. the important thing is that the data is here and ready to be manipulated
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET all open claims -------------------------------------------------
apirouter.get("/claims/open", (request, response) => {
  client.connect();
  client.query("select * from all_claims where status = 'Open'").then(
    function(resp) {
      console.log("Successfully retrieved all open claims");
      // console.log(resp.rows)
      response.send(resp.rows);
    },
    function(err) {
      console.log("Could not retrieve all open claims");
      console.log(err);
      return err;
    }
  );
});

//GET all closed claims ----------------------------------------------
apirouter.get("/claims/closed", (request, response) => {
  client.connect();
  client.query("select * from all_claims where status = 'Closed'").then(
    function(resp) {
      console.log("Successfully retrieved all closed claims");
      // console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claims by oldest -----------------------------------------------
apirouter.get("/claims/oldest", (request, response) => {
  client.connect();
  client.query("select * from all_claims order by dateopened ASC").then(
    function(resp) {
      console.log("Successfully retrieved claims in order of oldest");
      // console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claims by newest -----------------------------------------------
apirouter.get("/claims/newest", (request, response) => {
  client.connect();
  client.query("select * from all_claims order by dateopened DESC").then(
    function(resp) {
      console.log("Successfully retrieved claims in order of newest");
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claim information based on STATUS DESC ---------shows open first 
apirouter.get("/claims/status/desc", (request, response) => {
  client.connect();
  client.query("select * from all_claims order by status DESC").then(
    function(resp) {
      console.log("Successfully retrieved claims by status");
      // console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claim information based on STATUS ASC ----------shows closed first 
apirouter.get("/claims/status/asc", (request, response) => {
  client.connect();
  client.query("select * from all_claims order by status ASC").then(
    function(resp) {
      console.log("Successfully retrieved claims by status");
      // console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

// get claim based on products //////NEEEEEEEEEWWWWWWW
apirouter.get("/claims/products", (request, response) => {
  var productid = [response.body.productid];
  var query =("select * from all_claims where productid=$1")
  client.connect();
  client.query(query, productid).then(
    function(resp) {
      console.log("Successfully retrieved all claims for productid=" + productid);
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});



//GET all claims belonging to an EMPLOYEE based on their ID passed to this endpoint
//(independent of claim status) ---------------------------------------------------
apirouter.get("/claims/employees/:employeeid", (request, response) => {
  // console.log(request.params.employeeId)
  var employeeid = [request.params.employeeid];
  var query =
    "SELECT concat_ws(' ', customer.firstname, customer.lastname) AS customer, product.name AS product, issue.name AS issue, claim.status, claim.description, concat_ws(' ',  employee.firstname, employee.lastname) AS employee, claim.dateopened, resolution.name AS resolution, claim.dateclosed FROM claim, productpurchase, purchase, product, customer, employee, issue, resolution WHERE claim.productpurchaseid = productpurchase.productpurchaseid AND productpurchase.productid = product.productid AND productpurchase.purchaseid = purchase.purchaseid AND purchase.customerid = customer.customerid AND claim.employeeid = employee.employeeid AND claim.issueid = issue.issueid AND claim.resolutionid = resolution.resolutionid AND employee.employeeid = $1";
  client.connect();
  client.query(query, employeeid).then(
    function(resp) {
      console.log(
        "Successfully retrieved ALL claims belonging to " + employeeid
      );
      // console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claim information based on claimId ----------------------------
apirouter.get("/claims/comments/:commentid", (request, response) => {
  var claimid = [request.params.claimid];
  var query =
    "select claim.claimid, claim.description as claim, comment.description as comment, claim.status from claim left join comment on claim.claimid = comment.claimid where claim.claimid = $1";
  client.connect();
  client.query(query, claimid).then(
    function(resp) {
      console.log(
        "Successfully retrieved claim information from claimId=" + claimid
      );
      // console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//CUSTOMERS
//GET all customers --------------------------------------------------
apirouter.get("/customers", (request, response) => {
  client.connect();
  client.query("select * from customer").then(
    function(resp) {
      console.log("Successfully retrieved all customers");
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//EMPLOYEES
//GET list of employees ----------------------------------------------
apirouter.get("/employees", (request, response) => {
  client.connect();
  client.query("SELECT * from employee").then(
    function(resp) {
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//PRODUCTS
//GET list of products ----------------------------------------------
apirouter.get("/products", (request, response) => {
  client.connect();
  client.query("SELECT * from product").then(
    function(resp) {
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//PURCHASES
//GET purchase history by customer --DOESNT WORK because "item count" needs to be changed to "itemcount" first
apirouter.get("/purchases/customer/:customerid", (request, response) => {
  var vars = [request.params.customerid];
  var query =
    "select concat_ws(' ', customer.firstname, customer.lastname)AS customer, purchase.date, count(productpurchase.purchaseid) as itemcount, purchase.totalcost from customer left join purchase on customer.customerid = purchase.customerid left join productpurchase on purchase.purchaseid = productpurchase.purchaseid where customer.customerid = $1 group by purchase.purchaseid, customer.customerid order by purchase.date desc";
  client.connect();
  client.query(query, vars).then(
    function(resp) {
      console.log(
        "Successfully retrieved purchase history of customer " +
          request.params.customerid
      );
      // console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//RESOLUTIONS
//GET resolutions by product ----------------------------------------
apirouter.get("/resolutions/product/:productname", (request, response) => {
  var prod = ["" + request.params.productname];
  var query =
    "select product.name as product, resolution.name as resolution, claim.description as Claim from resolution, claim, productpurchase, product where resolution.resolutionid = claim.resolutionid and claim.productpurchaseid = productpurchase.productpurchaseid and productpurchase.productid = product.productid and product.name = $1";
  client.connect();
  client.query(query, prod).then(
    function(resp) {
      console.log(
        "Successfully retrieved resolutions for " + request.params.productname
      );
      // console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//-------------------------------POSTS--------------------------------

//CLAIMS
//POST a new claim ---------------------------------------------------
apirouter.post("/claims", (request, response) => {
  const quer =
    "insert into claim(productpurchaseid, status, description, dateopened, resolutionid)  values($1,$2,$3,$4,$5)";
  const vals = [
    request.body.productpurchaseid,
    request.body.status,
    request.body.description,
    request.body.dateopened,
    request.body.resolutionid
  ];
  client.connect();
  client
    .query(quer, vals)
    .then(
      res => {
        console.log(
          "Successfully added claim,(" +
            request.body.productpurchaseid +
            ", " +
            request.body.status +
            ", " +
            request.body.description +
            ", " +
            request.body.dateopened +
            ", " +
            request.body.resolutionid
        );
        // response.send(res.rows);
      },
      err => {
        console.log("Failed to add claim.");
      }
    )
    .catch(e => {
      console.error(e.stack);
    });
});

//POST claim comments -----------------------------------------------
apirouter.post("/claims/comments", (request, response) => {
  const quer =
    "insert into comment (claimid, description, date, employeeid) values($1, $2, current_timestamp, $3)";
  const vals = [
    request.body.claimid,
    "" + request.body.description,
    request.body.employeeid
  ];
  client.connect();
  client
    .query(quer, vals)
    .then(
      res => {
        console.log("Successfully added comments");
      // response.send(res.rows);
      },
      err => {
        console.log("Failed to add comments.");
      }
    )
    .catch(e => {
      console.error(e.stack);
    });
});

//CUSTOMERS
//POST// create a customer -------------------------------------------
apirouter.post("/customers", (request, response) => {
  const quer =
    "INSERT INTO customer (firstname, lastname, addressid, income, email, phone) VALUES ($1, $2, $3, $4, $5, $6)";
  const vals = [
    "" + request.body.firstname,
    "" + request.body.lastname,
    request.body.addressid,
    request.body.income,
    "" + request.body.email,
    request.body.phone
  ];
  client.connect();
  client
    .query(quer, vals)
    .then(
      res => {
        console.log("Successfully added comments");
      },
      err => {
        console.log("Failed to add comments.");
      }
    )
    .catch(e => {
      console.error(e.stack);
    });
});

//ISSUES
//POST new issue type ------------------------------------------------
apirouter.post("/issues", (request, response) => {
  const vars = [request.body.issue, request.body.description];
  const quer = "INSERT INTO issue(name, description) VALUES ($1, $2)";
  client.connect();
  client
    .query(quer, vars)
    .then(
      res => {
        console.log("Successfully added issue");
      },
      err => {
        console.log("Failed to add issue.");
      }
    )
    .catch(e => {
      console.error(e.stack);
    });
});

//PRODUCTS
//POST new product ---------------------------------------------------
apirouter.post("/products", (request, response) => {
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
        console.log("Failed to add item.");
      }
    )
    .catch(e => {
      console.error(e.stack);
    });
});

//EMPLOYEES
//POST new employee given existing address -------------------------
apirouter.post("/employees", (request, response) => {
  // console.log(request.body)
  const employeeQuery =
    "INSERT INTO employee(addressid, email, firstname, lastname, phone, title) VALUES($1, $2,$3, $4, $5, $6 )";
  const employeeValues = [
    request.body.addressid,
    request.body.email,
    request.body.firstname,
    request.body.lastname,
    request.body.phone, //varchar
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
        console.log("Failed to add employee.");
      }
    )
    .catch(e => {
      console.error(e.stack);
    });
});

//POST new employee WITH new address ---------------------------------
//[needs to be a nested promise where address is added first and then second promise actually adds employee]
apirouter.post("/employees/address", (request, response) => {
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
        //call employee query inside res(aka resolution) of returned address promise
        client
          .query(employeeQuery, [
            res.rows[0].addressid,
            request.body.email,
            request.body.firstname,
            request.body.lastname,
            request.body.phone,
            request.body.title
          ])
          .then(res => {
            console.log("Employee successfully added with new address.");
          })
          .catch(e => {
            console.error(e.stack);
            console.log("catching1.");
          });
      },
      err => {
        console.log(
          "Failed to add address. Employee will not be added since it is dependent on address."
        );
      }
    )
    .catch(e => {
      console.error(e.stack);
      console.log("catching2.");
    });
});

//ADDRESSES
//POST new address --------------------------------------------------
apirouter.post("/addresses", (request, response) => {
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
        console.log(res.rows[0].addressid);
      },
      err => {
        // client.end();
        console.log("Failed to add address.");
      }
    )
    .catch(e => {
      console.error(e.stack);
    });
});

//-------------------------------PUTS----------------------------------

//PUT// close a claim and submit a resolution in one request ----------
apirouter.put("/resolutions/update/close", (request, response) => {
  const quer =
    "update claim set resolutionid = $1, status = 'Closed', dateclosed = current_timestamp where claimid = $2";
  const vals = [request.body.resolutionid, request.body.claimid];
  client.connect();
  client
    .query(quer)
    .then(
      res => {
        console.log("Successfully added resolution and closed claim ");
      },
      err => {
        console.log("Failed to add resolution and close claim.");
      }
    )
    .catch(e => {
      console.error(e.stack);
    });
});

//PUT// change status of claims -----------------------------------------
apirouter.put("/claims/update", (request, response) => {
  const quer =
    "UPDATE claim SET status = 'Closed', dateclosed = current_timestamp WHERE claimid = $1";
  const vals = [request.body.claimid];
  client.connect();
  client
    .query(quer, vals)
    .then(
      res => {
        console.log("Successfully updated claim ");
      },
      err => {
        console.log("Failed to update claim.");
      }
    )
    .catch(e => {
      console.error(e.stack);
    });
});

/////////////////////////TEST TABLE ENDPOINTS/////////////////////////////////////
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

module.exports = apirouter;
