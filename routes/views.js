//////////////////////////// Client side routing /////////////////////////
const express = require("express");
const clientrouter = express.Router();
const axios = require("axios");
const headers = {
  "Access-Control-Allow-Origin": "*"
};//not necessary. really only needed if calling api from outside our application
/////////////////////////////////////////////////////////////////////////

clientrouter.get("/", (req, res) => {
  res.render("index");
}); 

clientrouter.get("/test", function(req, res, next) {
  axios
    .get("https://ejs-views-practice.glitch.me/api/claims/open", { headers })
    .then(function(response) {
      res.render("test", { claims: response.data });
    })
    .catch(function(error) {
      console.log(error);
    });
});

module.exports = clientrouter;