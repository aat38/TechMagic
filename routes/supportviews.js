const express = require("express");
const supportviewsrouter = express.Router();
const axios = require("axios");
const headers = {
  "Access-Control-Allow-Origin": "*" //not necessary. really only needed if calling api from outside our application
};

const baseURL = "https://techmagic.glitch.me";

//Render SUPPORTNAV page ------------------------------------------------
supportviewsrouter.get("/supportnav", (req, res) => { 
  res.render("supportnav",{
  });
}); 

//Render Login page------------------------------------------------------
supportviewsrouter.get("/login", (req, res) => { 
  res.render("employeelogin",{});
});

//////////////////////////////////CLAIMS//////////////////////////////////
//Render Employee claims from login page --------------------------------
supportviewsrouter.get("/employeeclaims", function(req, res, next) {
  var employeeid = [require("url").parse(req.url, true).query.employeeid];
  axios
    .get("https://techmagic.glitch.me/supportapi/claims/employees/" + employeeid, { headers })
    .then(function(response) {
      res.render("supportclaims", {
        claims: response.data,
        claimtype: "employeeclaims",
        id: employeeid,
        title: "Employee"
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});

//Render Employee claims from "All Claims" button-----------------------
supportviewsrouter.get("/employeeclaims/:employeeid", function(req, res, next) {
  var employeeid = req.params.employeeid;
  axios
    .get("https://techmagic.glitch.me/supportapi/claims/employees/" + employeeid, { headers })
    .then(function(response) {
      res.render("supportclaims", {
        claims: response.data,
        claimtype: "employeeclaims",
        id: employeeid,
        title: "Employee"
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});

//Render Employee claims by open or closed status-----------------------
supportviewsrouter.get("/employeeclaims/:employeeid/status", function(req, res, next) {
  var status = require("url").parse(req.url, true).query.status;
  var employeeid = req.params.employeeid;
  
  axios
    .get("https://techmagic.glitch.me/supportapi/claims/employees/status/"+ employeeid + "/" + status, { headers })
    .then(function(response) {
      res.render("supportclaims", {
        claims: response.data,
        claimtype: "employeeclaims",
        id: employeeid,
        title: "Employee"
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});

//Render Employee claims by ASC or DESC Date Opened-----------------------
supportviewsrouter.get("/employeeclaims/:employeeid/date", function(req, res, next) {
  var order = require("url").parse(req.url, true).query.order;
  var employeeid = req.params.employeeid;
  axios
    .get("https://techmagic.glitch.me/supportapi/claims/employees/date/"+employeeid+"/"+order, { headers })
    .then(function(response) {
    
      res.render("supportclaims", {
        claims: response.data,
        claimtype: "employeeclaims",
        id: employeeid,
        title: "Employee"
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});

//Render specific Claim for an employee--------------------------------------------------
supportviewsrouter.get("/employeeclaims/claim/:claimid", function(req, res, next) {
  var claimid = req.params.claimid;
  var claims;
  console.log(claimid);
  axios
    .get("https://techmagic.glitch.me/supportapi/claims/" + claimid, { headers })
    .then(function(response) {
    claims =response.data
    axios
      .get(baseURL +"/api/resolutions")
      .then(function(response) {
    
      res.render("supportclaim", {
        data: claims,
        claimtype: "employeeclaims",
        id: claims[0].employeeid,
        title: "Employee",
        resolutions:response.data
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});
});


//Render page where users can add comments ----------------------------
supportviewsrouter.get("/createcomment/:employeeid/:claimid", (req, res) => { 
  res.render("createcomment",{
    employeeid: req.params.employeeid,
    claimid: req.params.claimid,
    claimtype :"employees"
  });
});

/////////////////////////////////PRODUCTS//////////////////////////////////
//Render all Products page------ --------------------------------
supportviewsrouter.get("/products", function(req, res, next) {
  axios
    .get("https://techmagic.glitch.me/supportapi/products", { headers })
    .then(function(response) {
      res.render("supportproducts", {
        products: response.data
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});

//Render all products in either ascending or descending order by number of claims
supportviewsrouter.get("/products/claimnumber", function(req, res, next) {
  var order = require("url").parse(req.url, true).query.order;
  axios
    .get("https://techmagic.glitch.me/supportapi/products/order/" +order, { headers })
    .then(function(response) {
      res.render("supportproducts", {
        products: response.data
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});

//Render all claims for a specific product--------------------------------------------------
supportviewsrouter.get("/productclaims/:productid", function(req, res, next) {
  var productid = req.params.productid;
  console.log(productid);
  axios
    .get("https://techmagic.glitch.me/supportapi/claims/products/" + productid, { headers })
    .then(function(response) {
      res.render("supportclaims", {
        claims: response.data,
        claimtype: "productclaims",
        id: productid,
        title: "Product"
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});

//Render Product claims by open or closed status-----------------------
supportviewsrouter.get("/productclaims/:productid/status", function(req, res, next) {
  var status = require("url").parse(req.url, true).query.status;
  var productid = req.params.productid;
  
  axios
    .get("https://techmagic.glitch.me/supportapi/claims/products/status/"+ productid + "/" + status, { headers })
    .then(function(response) {
      res.render("supportclaims", {
        claims: response.data,
        claimtype: "productclaims",
        id: productid,
        title: "Product"
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});

//Render Product claims by ASC or DESC Date Opened-----------------------
supportviewsrouter.get("/productclaims/:productid/date", function(req, res, next) {
  var order = require("url").parse(req.url, true).query.order;
  var productid = req.params.productid;
  axios
    .get("https://techmagic.glitch.me/supportapi/claims/products/date/"+productid+"/"+order, { headers })
    .then(function(response) {
    
      res.render("supportclaims", {
        claims: response.data,
        claimtype: "productclaims",
        id: productid,
        title: "Product"
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});

//Render specific Claim for a PRODUCT-------------------------------------------------
supportviewsrouter.get("/productclaims/claim/:claimid", function(req, res, next) {
  var claimid = req.params.claimid;
  console.log(claimid);
  axios
    .get("https://techmagic.glitch.me/supportapi/claims/" + claimid, { headers })
    .then(function(response) {
      res.render("supportclaim", {
        data: response.data,
        claimtype: "productclaims",
        id: response.data[0].productid,
        title: "Product"
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});



module.exports = supportviewsrouter;