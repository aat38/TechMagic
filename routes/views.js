//////////////////////////// Client side routing /////////////////////////
////////////////////////// all routes begin with "/" /////////////////////
const express = require("express");
const clientrouter = express.Router();
const axios = require("axios");
const headers = {
  "Access-Control-Allow-Origin": "*" //not necessary. really only needed if calling api from outside our application
};

const baseURL = "https://ejs-views-practice.glitch.me";

/////////////////////////////////ROUTES//////////////////////////////////

clientrouter.get("/", (req, res) => { 
  res.render("index");
}); 


clientrouter.get("/claims", function(req, res, next) {
axios
  .get(baseURL +"/api/claims")
    .then(function(response) {
      res.render("claims", { claims: response.data });
    })
    .catch(function(error) {
      console.log(error);
    });
});


clientrouter.get("/customers", function(req, res, next) {
  axios
    .get(baseURL +"/api/customers")
    .then(function(response) {
      res.render("customers", { customers: response.data });
    })
    .catch(function(error) {
      console.log(error);
    });
});


clientrouter.get("/employees", function(req, res, next) {
  axios
    .get(baseURL +"/api/employees")
    .then(function(response) {
      res.render("employees", { employees: response.data });
    })
    .catch(function(error) {
      console.log(error);
    });
});


clientrouter.get("/products", function(req, res, next) {
  axios
    .get(baseURL +"/api/products")
    .then(function(response) {
      res.render("products", { products: response.data });
    })
    .catch(function(error) {
      console.log(error);
    });
});

clientrouter.get("/products/claims/:productid", function(req, res, next) {
  axios
    .get(baseURL +"/api/claims/products/"+req.params.productid)
    .then(function(response) {
      console.log(response.data)
      res.render("product-claims", { claims: response.data });
    })
    .catch(function(error) {
      console.log(error);
    });
});

clientrouter.get("/edit/:claimid", function(req, res, next) {
  axios
    .get(baseURL +"/api/claims/search/"+req.params.claimid)
    .then(function(response) {
    
    axios
        .get(baseURL + "/issues")
        .then(function(secondresponse) {
            res.render("partials/claim-edit", { data: response.data, 
                                                issues: secondresponse.data});
        })
        .catch(function(error) {
          console.log(error);
        });
    })
    .catch(function(error) {
      console.log(error);
    });
});
  

module.exports = clientrouter;
