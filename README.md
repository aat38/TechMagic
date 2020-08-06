## TechMagic
This project references a Heroku hosted PostgresSQL database via the RESTful API architectural style. My classmate and I built the site together, I worked on the Admin side while they worked on the Support side.

Writen with:
  Node.js, Bootstrap, Fetch and AXIOS HTTP Calls, EJS, JavaScript

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




- //removed the dateopen paramater from create claim endpoint


- //PURCHASES
apirouter.post("/purchases", (request, response) => {
  const quer =
    "INSERT INTO purchase(totalcost, customerid, date) VALUES($1,$2,current_timestamp) RETURNING purchaseid";


- //GET list of productpurchases ---------------------------------------
apirouter.get("/productpurchases/:purchaseid", (request, response) => {
  client.connect();
  select * from purchase where purchaseid=purchaseid return customerid, productid
select * from customer where customerid=customerid 
select * from customer where productid=productid 
select * from productpurchase where purchaseid=purchaseid
