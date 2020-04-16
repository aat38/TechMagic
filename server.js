//***********SETUP****************//
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

app.use("/public", express.static(path.join(__dirname)));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));// parse application/json from RESPONSE.body
app.use(bodyParser.json());
//*****************************//

// ----------Load routes to api-info and routes to page displays----------

const apiRouter = require("./routes/api");
const viewsRouter = require("./routes/views");

app.use("/", viewsRouter);
app.use("/api/", apiRouter);

//----------------------------ROUTER-------------------------------------

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});







