//  requiring appropriate modules
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // My port
  port: 3306,

  // My username
  user: "root",

  // My password and db name
  password: "rootroot",
  database: "employeetracker_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

const start = () => {

}