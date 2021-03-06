//////////////////////////// Client side routing /////////////////////////
////////////////////////// all routes begin with "/" /////////////////////
const express = require("express");
const clientrouter = express.Router();
const axios = require("axios");
const headers = {
  "Access-Control-Allow-Origin": "*" //not necessary. really only needed if calling api from outside our application
};

const baseURL = "https://techmagic.glitch.me";

/////////////////////////////////ROUTES//////////////////////////////////

clientrouter.get("/", (req, res) => { 
  res.render("home");
}); 

clientrouter.get("/admin", (req, res) => { 
  res.render("index");
}); 
                 

clientrouter.get("/purchases/:purchaseid", (req, res) => { 
  var claims
  var issues
  var employees
    axios
     .get(baseURL +"/api/claims")
     .then(function(response) {
      claims=response.data
        axios
         .get(baseURL +"/api/issues")
         .then(function(response) {
          issues=response.data
            axios
             .get(baseURL +"/api/employees")
             .then(function(response) {
              employees=response.data
                  axios
                 .get(baseURL +"/api/productpurchases/"+ req.params.purchaseid)
                 .then(function(response) {
                    res.render("partials/vieworder", { response: response.data, employees: employees, issues: issues, claims:claims});
                  })
                  .catch(function(error) {
                  console.log("error!!!1");
                 });
              })
              .catch(function(error) {
              console.log("error!!!2");
             }); 
        
          })
          .catch(function(error) {
          console.log("error!!!3");
         }); 
     
     })
      .catch(function(error) {
      console.log("error!!!4");
     }); 
})
//example return of "response" var
// {
//     "customerid": 1,
//     "firstname": "David",
//     "lastname": "Ball",
//     "addressid": 4,
//     "income": "$3,045.00",
//     "email": "David@email.com",
//     "phone": "8001115555",
//     "purchaseid": 15,
//     "totalcost": "$3,000.00",
//     "date": "2020-04-21T20:57:52.507Z",
//     "productpurchaseid": 29,
//     "productid": 1,
//     "name": "Desktop",
//     "description": "Really fast computer with lots of storage space",
//     "unitcost": "$1,000.00"
// }


clientrouter.get("/orders", (req, res) => { 
  var purchaseTable
  var customers
   axios
   .get(baseURL +"/api/purchases")
   .then(function(response) {
    purchaseTable = response.data
       axios
          .get(baseURL +"/api/customers")
          .then(function(response) {
           customers = response.data
             axios
                .get(baseURL +"/api/products")
                .then(function(response) {
                res.render("orders", { purchase: purchaseTable, customers:customers, products: response.data});
                })
                .catch(function(error) {
                  console.log(error);
                }); 
           })
          .catch(function(error) {
            console.log(error);
          }); 
      })
    .catch(function(error) {
      console.log(error);
    }); 
});

clientrouter.get("/claims", function(req, res, next) {
  var claims
   axios
    .get(baseURL +"/api/claims")
    .then(function(response) {
      claims = response.data
      axios
      .get(baseURL +"/api/resolutions")
      .then(function(response) {
        res.render("claims", { claims: claims, resolutions:response.data });
      })
      .catch(function(error) {
        console.log(error);
      }); 
    })
    .catch(function(error) {
      console.log(error);
    }); 
});


clientrouter.get("/claims/:var", function(req, res, next) {
axios
  .get(baseURL +"/api/claims/sortby/"+req.params.var)
    .then(function(response) {
      res.render("claims", { claims: response.data , sort: req.params.var});
    })
    .catch(function(error) {
      console.log(error);
    });
});

clientrouter.get("/claims/filter/:type/:var", function(req, res, next) {
  if (req.params.type === 'customer'){
   axios
  .get(baseURL +"/api/claims/customer/"+req.params.var)
    .then(function(response) {
      res.send(response.data);
    })
    .catch(function(error) {
      console.log(error);
    }); 
  }
});


clientrouter.get("/claims/:productid/sortby/:var", function(req, res, next) {
  var claims
   axios
    .get(baseURL +"/api/claims/"+req.params.productid+"/sortby/"+req.params.var)
    .then(function(response) {
      claims = response.data
      axios
      .get(baseURL +"/api/resolutions")
      .then(function(response) {
        res.render("claims", { claims: claims, resolutions:response.data , sort: req.params.var });
      })
      .catch(function(error) {
        console.log(error);
      }); 
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

clientrouter.get("/customers/:sort", function(req, res, next) {
  //can sort by lastname asc or desc. and also by total expenditure most or least
  axios
    .get(baseURL +"/api/customers/"+req.params.sort)
    .then(function(response) {
      res.render("customers", { customers: response.data , sort: req.params.sort});
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

clientrouter.get("/employees/:sort", function(req, res, next) {
  axios
    .get(baseURL +"/api/employees/"+req.params.sort)
    .then(function(response) {
      res.render("employees", { employees: response.data , sort: req.params.sort});
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

clientrouter.get("/products/:sort", function(req, res, next) {
  //can sort by asc or desc. and also by most or least expensive
  axios
    .get(baseURL +"/api/products/"+req.params.sort)
    .then(function(response) {
      res.render("products", { products: response.data , sort: req.params.sort});
    })
    .catch(function(error) {
      console.log(error);
    });
});

clientrouter.get("/products/claims/:productid", function(req, res, next) {
  var claims
   axios
    .get(baseURL +"/api/claims/products/"+req.params.productid)
    .then(function(response) {
      claims = response.data
      axios
      .get(baseURL +"/api/resolutions")
      .then(function(response) {
        res.render("claims", { claims: claims, resolutions:response.data });
      })
      .catch(function(error) {
        console.log(error);
      }); 
    })
    .catch(function(error) {
      console.log(error);
    }); 
  });

clientrouter.get("/edit/:claimid/:derivationpage", function(req, res, next) {
  var response1;
  var response2;
  var response3;
  var response4;
  var response5;
  axios
    .get(baseURL +"/api/claims/search/"+req.params.claimid)
    .then(function(response) {
      response1=response.data;
      axios
        .get(baseURL + "/api/issues")
        .then(function(response) {
          response2=response.data
          axios
            .get(baseURL + "/api/claims/comments/"+req.params.claimid)
            .then(function(response) {
              response3=response.data
              axios
                .get(baseURL + "/api/employees/")
                .then(function(response) {
                  response4=response.data
                  axios
                    .get(baseURL + "/api/resolutions/")
                    .then(function(response) {
                      response5=response.data
                      // console.log([response1, response3])
                      res.render("partials/claim-edit", { claimdata: response1, issues: response2, comments:response3, employees: response4, resolutions: response5, returnpg: req.params.derivationpage}) 
                     })
                    .catch(function(error) {
                      console.log(error);
                    });
                  })
                  .catch(function(error) {
                    console.log(error);
                  });
                })
            .catch(function(error) {
              console.log(error);
            });
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
