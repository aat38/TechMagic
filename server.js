//***********SETUP****************//
const express = require("express");
const path = require("path");
const app = express();

app.use("/public", express.static(path.join(__dirname)));
app.use('/', __dirname + "/routes/")
app.set("view engine", "ejs");
app.set("views", __dirname + "/views/");//tell express where to get views and which template engine to use
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json from RESPONSE.body
app.use(bodyParser.json())
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


