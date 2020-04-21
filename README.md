## referenced: 
- [NodeJS For Beginners: Getting Started With EJS Templates With Express](https://www.youtube.com/watch?v=VM-2xSaDxJc)
- [noobcoder1137/ejs_templates_express](https://github.com/noobcoder1137/ejs_templates_express)
- [JSON Stringify](https://stackoverflow.com/questions/47066222/can-i-render-json-parse-data-to-ejs)
- ['formaction' instead of 'action'](https://stackoverflow.com/questions/38512402/ejs-form-action-is-not-working-with-node-js)
- [Why certificates need to be disabled - heroku specific](https://stackoverflow.com/questions/45088006/nodejs-error-self-signed-certificate-in-certificate-chain/45088585)
- [Writing parameterized queries](https://node-postgres.com/features/queries)
- [Set transaction to read/write(postgres)](https://www.postgresql.org/docs/9.3/sql-set-transaction.html)
- [Postgres query language](https://www.postgresqltutorial.com/postgresql-insert/)
- [PG package docs](https://node-postgres.com/api/client)
- [Parse date](https://stackoverflow.com/questions/9363263/how-to-format-json-date)
- [Screen position of mouse](https://www.kirupa.com/html5/getting_mouse_click_position.htm)
- [Dropdown menu to forefront](https://stackoverflow.com/questions/16149701/bootstrap-dropdowns-menus-appearing-behind-other-elements-ie7)
- [Create div on button press](https://stackoverflow.com/questions/33154928/creating-div-on-button-click-with-javascript-not-working)

get products
// get claim based on products //////NEEEEEEEEEWWWWWWW
apirouter.get("/claims/search/:claimid", (request, response) => {
//added get all issue types
//change d//GET claim information based on claimId ----------------------------
//get all resolutions 
//apirouter.get("/employees/:sort", (request, response) => {  //sorts by last name OR title depending on your input
clientrouter.get("/claims/:productid/sortby/:var", function(req, res, next) {
//get claims for a customer  apirouter.get("/claims/customer/:first/:last", (request, response) => {
//update JUST claim resolution --not using anymore
//PUT// edit ENTIRE claim ---------------------------------------------claims/admin

//GET list of productpurchases ---------------------------------------
apirouter.get("/productpurchases/:purchaseid", (request, response) => {


//removed the dateopen paramater from create claim endpoint


//PURCHASES
apirouter.post("/purchases", (request, response) => {
  const quer =
    "INSERT INTO purchase(totalcost, customerid, date) VALUES($1,$2,current_timestamp) RETURNING purchaseid";

