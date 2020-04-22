///////////////////////////////// API ///////////////////////////////////
//////////////////////// all routes begin with /api /////////////////////
const express = require("express");
const supportapirouter = express.Router();
const { Client } = require("pg"); // import {Client} from "pg"; is what line is absically saying

const client = new Client({
  connectionString: process.env.DATABASE_URL, //database url is stored in env
  ssl: true //ssl needs to be set to true bc heroku reqires this
});

//PRODUCTS
//GET all products-----------------------------------------------------
supportapirouter.get("/products", (req, response) => {
  client.connect();
  client.query("SELECT product.*, (SELECT COUNT(*) FROM all_claims WHERE all_claims.productid = product.productid) AS claimcount FROM product").then(
    function(resp) {
      console.log(
        "Successfully retrieved ALL products and products information"
      );
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET products and order by fewest claims to most
supportapirouter.get("/products/order/asc", (request, response) => {
  
  client.connect();
  client.query("SELECT product.*, (SELECT COUNT(*) FROM all_claims WHERE all_claims.productid = product.productid) AS claimcount FROM product Order by claimcount ASC").then(
    function(resp) {
      console.log("Successfully retrieved claims in order");
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET products and order by most claims to least
supportapirouter.get("/products/order/desc", (request, response) => {
  
  client.connect();
  client.query("SELECT product.*, (SELECT COUNT(*) FROM all_claims WHERE all_claims.productid = product.productid) AS claimcount FROM product Order by claimcount DESC").then(
    function(resp) {
      console.log("Successfully retrieved claims in order");
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//CLAIMS///////////////////////////////////////////////////////////
//GET all claims belonging to an EMPLOYEE based on their EMPLOYEEID passed to this endpoint
supportapirouter.get("/claims/employees/:employeeid", (request, response) => {
  // console.log(request.params.employeeId)
  var employeeid = [request.params.employeeid];
  var query ="Select * From all_claims WHERE employeeid = $1";
  client.connect();
  client.query(query, employeeid).then(
    function(resp) {
      console.log(
        "Successfully retrieved ALL claims belonging to " + employeeid
      );
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claims for specific EMPLOYEE based on status from radio button  -------------------------------------------------
supportapirouter.get("/claims/employees/status/:employeeid/:status", (request, response) => {
  
  var values = [request.params.employeeid, request.params.status];
  
  client.connect();
  client.query("select * from all_claims WHERE employeeid = $1 AND status = $2", values).then(
    function(resp) {
      console.log("Successfully retrieved all open claims");
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log("Could not retrieve open claims by employee");
      console.log(err);
      return err;
    }
  );
});

//GET claims for a specific EMPLOYEE and order by ascending from radio button
supportapirouter.get("/claims/employees/date/:employeeid/asc", (request, response) => {
  var values = [request.params.employeeid];
  
  client.connect();
  client.query("select * from all_claims WHERE employeeid = $1 order by dateopened ASC", values).then(
    function(resp) {
      console.log("Successfully retrieved claims in order");
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claims for a specific EMPLOYEE and order by descending date opened from radio button
supportapirouter.get("/claims/employees/date/:employeeid/desc", (request, response) => {
  var values = [request.params.employeeid];
  
  client.connect();
  client.query("select * from all_claims WHERE employeeid = $1 order by dateopened DESC", values).then(
    function(resp) {
      console.log("Successfully retrieved claims in order");
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claim information based on claimId////////////////////////////////////
supportapirouter.get("/claims/:claimid", (request, response) => {
  var claimid = [request.params.claimid];
  console.log(request.params.claimid);
  var query = "select customer, product, productid, issue, status, all_claims.description as claimdescription, employee, dateopened, resolution, dateclosed, all_claims.claimid, all_claims.employeeid, comment.description as commentdescription, comment.date from all_claims left join comment on all_claims.claimid = comment.claimid where all_claims.claimid = $1";
  client.connect();
  client.query(query, claimid).then(
    function(resp) {
      console.log(
        "Successfully retrieved claim " + claimid
      );
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claims for a specific PRODUCT by productid---------------------------------------------
supportapirouter.get("/claims/products/:productid", (req, response) => {

  var product = [req.params.productid];
  var query = "Select * from all_claims where productid = $1";
  client.connect();
  client.query(query, product).then(
    function(resp) {
      console.log("Successfully retrieved product: " + product);
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claims for specific PRODUCT based on status from radio button  -------------------------------------------------
supportapirouter.get("/claims/products/status/:productid/:status", (request, response) => {
  
  var values = [request.params.productid, request.params.status];
  
  client.connect();
  client.query("select * from all_claims WHERE productid = $1 AND status = $2", values).then(
    function(resp) {
      console.log("Successfully retrieved all open claims");
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log("Could not retrieve open claims by employee");
      console.log(err);
      return err;
    }
  );
});

//GET claims for a specific EMPLOYEE and order by ascending from radio button
supportapirouter.get("/claims/products/date/:productid/asc", (request, response) => {
  var values = [request.params.productid];
  
  client.connect();
  client.query("select * from all_claims WHERE productid = $1 order by dateopened ASC", values).then(
    function(resp) {
      console.log("Successfully retrieved claims in order");
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//GET claims for a specific EMPLOYEE and order by descending date opened from radio button
supportapirouter.get("/claims/products/date/:productid/desc", (request, response) => {
  var values = [request.params.productid];
  
  client.connect();
  client.query("select * from all_claims WHERE productid = $1 order by dateopened DESC", values).then(
    function(resp) {
      console.log("Successfully retrieved claims in order");
      console.log(resp.rows);
      response.send(resp.rows);
    },
    function(err) {
      console.log(err);
    }
  );
});

//-------------------------------POSTS--------------------------------
//CLAIMS
//POST claim comments as signed in employee ------------------------------------ 
supportapirouter.post("/claims/employees/newcomment/:employeeid/:claimid", (request, response) => {
  const quer =
    "insert into comment (claimid, description, date, employeeid) values($1, $2, current_timestamp, $3)";
  const vals = [
    request.params.claimid,
    "" + request.body.description,
    request.params.employeeid
  ];
  console.log(vals);
  client.connect();
  client
    .query(quer, vals)
    .then(
      res => {
        console.log("Successfully added comments");
        response.redirect("/supportviews/employeeclaims/claim/"+request.params.claimid)
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



module.exports = supportapirouter;
