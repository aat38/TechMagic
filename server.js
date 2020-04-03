const path = require("path");
const express = require("express");
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];


// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.render('in')
});

// send the default array of dreams to the webpage
app.get("/", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
