///////////////////////////////// API ///////////////////////////////////
//////////////////////// all routes begin with /api /////////////////////
const express = require("express");
const apirouter = express.Router();
const { Client } = require("pg"); // import {Client} from "pg"; is what line is absically saying

const client = new Client({
  connectionString: process.env.DATABASE_URL, //database url is stored in env
  ssl: true //ssl needs to be set to true bc heroku reqires this
});

//not for real use - just to clean DB
apirouter.post("/remove", (request, response) => {
  client.connect();
  return client.query("delete from productpurchase where purchaseid=31").then(
    function(resp) {
      console.log("Sucessful Delete");
    },
    function(err) {
      console.log(err);
    }
  );
});

/////////////////////////////// ROUTES//////////////////////////////////
//-------------------------------GETS----------------------------------
//GET all issues {
apirouter.get("/issues", (request, response) => {
  client.connect();
  return client.query("select * from issue ").then(
    function(resp) {
      console.log("Successfully retrieved issue types");
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//get all resolutions
apirouter.get("/resolutions", (request, response) => {
  client.connect();
  return client.query("select * from resolution").then(
    function(resp) {
      console.log("Successfully retrieved resolutions");
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

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

// get SORTED claims
apirouter.get("/claims/sortby/:var", (request, response) => {
  client.connect();
  client
    .query("select * from all_claims order by " + request.params.var + " asc")
    .then(
      function(resp) {
        console.log("Successfully retrieved sorted claims");
        // console.log(resp.rows)
        response.send(resp.rows);
      },
      function(err) {
        console.log("ERROR" + err);
      }
    );
});

// get claim based on products //////NEEEEEEEEEWWWWWWW
apirouter.get("/claims/products/:productid", (request, response) => {
  var productid = [request.params.productid];
  var query = "select * from all_claims where productid=$1";
  client.connect();
  client.query(query, productid).then(
    function(resp) {
      console.log(
        "Successfully retrieved all claims for productid=" + productid
      );
      // console.log(resp.rows)
      response.send(resp.rows);
    },
    function(err) {
      console.log("ERROR" + err);
    }
  );
});

// get SORTED claim based on products //////NEEEEEEEEEWWWWWWW
apirouter.get("/claims/:productid/sortby/:var", (request, response) => {
  client.connect();
  client
    .query(
      "select * from all_claims where productid=" +
        request.params.productid +
        " order by " +
        request.params.var +
        " asc"
    )
    .then(
      function(resp) {
        console.log(
          "Successfully retrieved sorted claims for productid=" +
            request.params.productid
        );
        // console.log(resp.rows)
        response.send(resp.rows);
      },
      function(err) {
        console.log("ERROR" + err);
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

//GET claim comment information based on claimId ----------------------------
apirouter.get("/claims/comments/:claimid", (request, response) => {
  var claimid = [request.params.claimid];
  var query = "select * from comment where claimid= $1";
  client.connect();
  client.query(query, claimid).then(
    function(resp) {
      console.log(
        "Successfully retrieved claim information from claimId=" + claimid
      );
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claim based on claimId ----------------------------
apirouter.get("/claims/search/:claimid", (request, response) => {
  var claimid = [request.params.claimid];
  var query = "select * from all_claims where claimid=$1";
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
      // console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claims by customer name ---------------------------------------
apirouter.get("/claims/customer/:name", (request, response) => {
  client.connect();
  client
    .query(
      "select * from all_claims where customer='" + request.params.name + "'"
    )
    .then(
      function(resp) {
        //console.log("Successfully retrieved all claims for customer "+request.params.name);
        // console.log(resp.rows);
        response.send(resp.rows);
      },
      function(err) {
        console.log(err);
      }
    );
});
//GET list of SORTED customers --------------------------------------
apirouter.get("/customers/:sort", (request, response) => {
  var sortby = request.params.sort;
  if (sortby === "asc" || sortby === "desc") {
    client.connect();
    client.query("select * from customer order by lastname " + sortby).then(
      function(resp) {
        response.send(resp.rows);
      },
      function(err) {
        console.log(err);
      }
    );
  }
  if (sortby === "greatest") {
    client.connect();
    client.query("select * from customer ORDER BY income desc").then(
      function(resp) {
        response.send(resp.rows);
      },
      function(err) {
        console.log(err);
      }
    );
  }
  if (sortby === "least") {
    client.connect();
    client.query("select * from customer ORDER BY income asc").then(
      function(resp) {
        response.send(resp.rows);
      },
      function(err) {
        console.log(err);
      }
    );
  }
});

//EMPLOYEES
//GET list of employees ----------------------------------------------
apirouter.get("/employees", (request, response) => {
  client.connect();
  client.query("SELECT * from employee").then(
    function(resp) {
      // console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET list of SORTED employees ---------------------------------------
apirouter.get("/employees/:sort", (request, response) => {
  var sortby = request.params.sort;
  if (sortby === "asc" || sortby === "desc") {
    client.connect();
    client.query("select * from employee order by lastname " + sortby).then(
      function(resp) {
        response.send(resp.rows);
      },
      function(err) {
        console.log(err);
      }
    );
  }
  if (sortby === "title") {
    client.connect();
    client.query("select * from employee order by title asc").then(
      function(resp) {
        response.send(resp.rows);
      },
      function(err) {
        console.log(err);
      }
    );
  }
});

//PRODUCTS
//GET list of products ----------------------------------------------
apirouter.get("/products", (request, response) => {
  client.connect();
  client.query("SELECT * from product").then(
    function(resp) {
      // console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET list of SORTED products --------------------------------------
apirouter.get("/products/:sort", (request, response) => {
  var sortby = request.params.sort;
  if (sortby === "asc" || sortby === "desc") {
    client.connect();
    client.query("select * from product order by name " + sortby).then(
      function(resp) {
        response.send(resp.rows);
      },
      function(err) {
        console.log(err);
      }
    );
  }
  if (sortby === "greatest") {
    client.connect();
    client.query("select * from product order by unitcost desc").then(
      function(resp) {
        response.send(resp.rows);
      },
      function(err) {
        console.log(err);
      }
    );
  }
  if (sortby === "least") {
    client.connect();
    client.query("select * from product order by unitcost asc").then(
      function(resp) {
        response.send(resp.rows);
      },
      function(err) {
        console.log(err);
      }
    );
  }
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

//GET list of purchases from purchase table---------------------------
apirouter.get("/purchases", (request, response) => {
  client.connect();
  client.query("SELECT * from purchase").then(
    function(resp) {
      // console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET list of productpurchases ---------------------------------------
apirouter.get("/productpurchases", (request, response) => {
  client.connect();
  client.query("SELECT * from productpurchase").then(
    function(resp) {
      // console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET list of productpurchases ---------------------------------------
apirouter.get("/productpurchases/:purchaseid", (request, response) => {
  client.connect();
  console.log(request);
  var val = [request.params.purchaseid];
  let query =
    "select * from customer join purchase on customer.customerid = purchase.customerid join productpurchase on purchase.purchaseid = productpurchase.purchaseid join product on productpurchase.productid = product.productid WHERE purchase.purchaseid =$1";
  client.connect();
  client.query(query, val).then(
    function(resp) {
      console.log("Successfully retrieved productpurchases ");
      // console.log(resp.rows);
      console.log(resp);
      response.send(resp.rows);
    },
    function(err) {
      console.log("err! unsuccessful retrieval of joined table");
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
    "insert into claim(productpurchaseid, issueid, status, dateopened, description, employeeid, resolutionid )  values($1,$2,'Open',current_timestamp,$3,$4,6)";

  const vals = [
    request.body.productpurchaseid,
    request.body.issueid,
    "" + request.body.description,
    request.body.employeeid
  ];
  client.connect();
  client
    .query(quer, vals)
    .then(
      res => {
        console.log("Successfully added claim" + vals);
      },
      err => {
        console.log("Failed to add claim." + vals);
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

//POST new CUSTOMER WITH new address ---------------------------------
//[needs to be a nested promise where address is added first and then second promise actually adds employee]
apirouter.post("/customers/address", (request, response) => {
  const addressQuery =
    "INSERT INTO address(city, state, streetaddress, streetaddress2, zip) VALUES($1,$2,$3,$4,$5) RETURNING addressid";
  const addressValues = [
    request.body.city,
    request.body.state,
    request.body.streetaddress,
    request.body.streetaddress2,
    request.body.zip
  ];
  const customerQuer =
    "INSERT INTO customer(addressid, income, email, firstname, lastname, phone) VALUES($1, $2, $3 ,$4, $5, $6)";
  client.connect();
  client
    .query(addressQuery, addressValues)
    .then(
      res => {
        console.log("Successfully added address values.");
        //call employee query inside res(aka resolution) of returned address promise
        client
          .query(customerQuer, [
            res.rows[0].addressid,
            0,
            request.body.email,
            request.body.firstname,
            request.body.lastname,
            request.body.phone
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

//PURCHASES
//[needs to be a nested promise where purchase is added first, followed by product pruchases and then update customerincome
apirouter.post("/purchases", (request, response) => {
  const purchasequer =
    "INSERT INTO purchase(totalcost, customerid, date) VALUES($1,$2, current_timestamp) RETURNING purchaseid";
  const purchasevals = [request.body.totalcost, request.body.customerid];
  const productpurchase =
    "INSERT INTO productpurchase(productid,purchaseid) VALUES($1, $2)";
  client.connect();
  client
    .query(purchasequer, purchasevals)
    .then(
      res => {
        // console.log((request.body.productids).length)
        // console.log(request.body.productids[0])
        console.log("Successfully added to purchase.");
        for (var i = 0; i < request.body.productids.length; i++) {
          client
            .query(productpurchase, [
              request.body.productids[i],
              res.rows[0].purchaseid
            ])
            .then(res => {
              console.log("Successful add to purchase and productpurchases");
            })
            .catch(e => {
              console.error(e.stack);
              console.log("catching1.");
            });
        }
      },
      err => {
        console.log("Failed to add purchases.");
      }
    )
    .catch(e => {
      console.error(e.stack);
      console.log("catching2.");
    });
  const selectquer = "SELECT * from customer where customerid=$1";
  const putquer = "UPDATE customer set income=$1 where customerid=$2";
  console.log("LOGGGGG" + request.body.customerid)
  client
    .query(selectquer, [request.body.customerid])
    .then(
      res => {
        console.log("Successfully retrieved income.");
        let currentVal = res.rows[0].income;
        let cost = request.body.totalcost;
        let newVal = Number(currentVal.replace(/[^0-9.-]+/g, "")) + cost;
        client
          .query(putquer, [newVal, request.body.customerid])
          .then(res => {
            console.log("Successful update to income");
          })
          .catch(err => {
            console.log(err);
          });
      },
      err => {
        console.log(err);
      }
    )
    .catch(e => {
      console.log("catching4.");
    });
});

//-------------------------------PUTS----------------------------------

//PUT// edit ENTIRE claim ---------------------------------------------
apirouter.put("/claims/admin", (request, response) => {
  var quer =
    "UPDATE claim SET issueid = $1, status= $2, description =$3, employeeid =$4, resolutionid =$5 WHERE claimid = $6"; //unchanged
  if (request.body.changeOfStatus === "oc") {
    //open->close
    quer =
      "UPDATE claim SET issueid = $1, status= $2, description =$3, employeeid =$4, resolutionid =$5, dateclosed=current_timestamp  WHERE claimid = $6";
  }
  if (request.body.changeOfStatus === "co") {
    //close->open
    quer =
      "UPDATE claim SET issueid = $1, status= $2, description =$3, employeeid =$4, dateclosed=current_timestamp, dateopened=current_timestamp, resolutionid =$5  WHERE claimid = $6";
  }
  var vals = [
    request.body.issueid,
    request.body.status,
    request.body.description,
    request.body.employeeid,
    request.body.resolutionid,
    request.body.claimid
  ];
  console.log(vals);
  client.connect();
  client
    .query(quer, vals)
    .then(
      res => {
        console.log(
          "-----------------Successfully updated ENTIRE claim -------------------------"
        );
      },
      err => {
        console.log(
          "Failed to update entire claim.*****************************************************"
        );
      }
    )
    .catch(e => {
      console.error(e.stack);
    });
});

//PUT// close a claim and submit a resolution in one request ----------
apirouter.put("/resolutions/update/close", (request, response) => {
  const quer =
    "update claim set resolutionid = $1, status = 'Closed', dateclosed = current_timestamp where claimid = $2";
  const vals = [request.body.resolutionid, request.body.claimid];
  client.connect();
  client
    .query(quer, vals)
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

//update JUST claim resolution
apirouter.put("/claims/resolution", (request, response) => {
  const quer = "update claim set resolutionid = $1, where claimid = $2";
  const vals = [request.body.resolutionid, request.body.claimid];
  client.connect();
  client
    .query(quer, vals)
    .then(
      res => {
        // client.end();
        console.log("Successfully added resolution");
      },
      err => {
        // client.end();
        console.log("Failed to add resolution.");
      }
    )
    .catch(e => {
      console.error(e.stack);
    });
});

//PUT// change status of claims -----------------------------------------
apirouter.put("/claims/update", (request, response) => {
  console.log([request.body.claimid, request.body.status]);
  var quer = "";
  if (request.body.status === "Open") {
    quer =
      "UPDATE claim SET status = 'Open', dateopened = current_timestamp, dateclosed = NULL WHERE claimid = $1";
  } else {
    quer =
      "UPDATE claim SET status = 'Closed', dateclosed = current_timestamp WHERE claimid = $1";
  }
  var vals = [request.body.claimid];
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
