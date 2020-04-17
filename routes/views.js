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
    .get(baseURL +"/api/claims", { headers })
    .then(function(response) {
      res.render("claims", { claims: response.data });
    })
    .catch(function(error) {
      console.log(error);
    });
});

clientrouter.get("/customers", function(req, res, next) {
  axios
    .get(baseURL +"/api/customers", { headers })
    .then(function(response) {
      res.render("customers", { cust: response.data });
    })
    .catch(function(error) {
      console.log(error);
    });
});

clientrouter.get("/employees", function(req, res, next) {
  axios
    .get(baseURL +"/api/employees", { headers })
    .then(function(response) {
      res.render("employees", { techs: response.data });
    })
    .catch(function(error) {
      console.log(error);
    });
});

clientrouter.get("/prod", function(req, res, next) {
  axios
    .get(baseURL +"/api/employees", { headers })
    .then(function(response) {
      res.render("employees", { techs: response.data });
    })
    .catch(function(error) {
      console.log(error);
    });
});

module.exports = clientrouter;
