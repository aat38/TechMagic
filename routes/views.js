//////////////////////////// Client side routing /////////////////////////
////////////////////////// all routes begin with "/" /////////////////////
const express = require("express");
const clientrouter = express.Router();
const axios = require("axios");
const headers = {
  "Access-Control-Allow-Origin": "*" //not necessary. really only needed if calling api from outside our application
};


/////////////////////////////////ROUTES//////////////////////////////////

clientrouter.get("/", (req, res) => { 
  res.render("index");
}); 

clientrouter.get("/openclaims", function(req, res, next) {
  axios
    .get("/api/claims/open", { headers })
    .then(function(response) {
      res.render("openclaims", { claims: response.data });
    })
    .catch(function(error) {
      console.log(error);
    });
});

clientrouter.get("/closedclaims", function(req, res, next) {
  axios
    .get("/api/claims/closed", { headers })
    .then(function(response) {
      res.render("closedclaims", { claims: response.data });
    })
    .catch(function(error) {
      console.log(error);
    });
});

module.exports = clientrouter;
