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
  roles = showRoles();
// inquirer prompt to find out user info
inquirer.prompt([
    {
        type: "list",
        message: "What would you like to do?",
        choices: ['Add Employee', 'View Employees', 'Update Employee Role',  'Add Role', 'View Roles', 'Add Department', 'View Departments', 'Exit'],
        name: "choice"
    }
]).then((res) => {
  // capturing all of the responses and directing user to correct function
  if(res.choice === 'Exit') {
    connection.end();
  } else if (res.choice === 'Add Employee') {
    addEmployee();
  } else if (res.choice === 'View Employees') {
    viewEmployees();
  } else if (res.choice === 'Update Employee Role') {
    updateEmployees();
  }
})
}

// array for roles
const showRoles = () => {
  let roleArr = new Array();
  connection.query('Select title FROM role', (err, results) =>{
    if(err) throw err;
    for (let i = 0; i < results.length; i++) {
      roleArr.push(results[i].title);
    }
  })
  return roleArr;
}

let roles = showRoles();

// function for adding an employee
function addEmployee () {
  inquirer.prompt([
    {
      type: 'input',
      message: 'Employee first name?',
      name: 'firstName'
    }, 
    {
      type: 'input',
      message: 'Employee last name?',
      name: 'lastName'
    }
  ])
}
