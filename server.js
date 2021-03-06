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
const clientRouter = require("./routes/views");
const supportApiRouter = require("./routes/supportapi");
const supportViewsRouter = require("./routes/supportviews");

app.use(express.static(__dirname + '/static'));
app.use("/", clientRouter);
app.use("/api/", apiRouter);
app.use("/supportapi", supportApiRouter);
app.use("/supportviews", supportViewsRouter);

//----------------------------ROUTER-------------------------------------

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});







