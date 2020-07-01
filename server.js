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
  database: "employeetracker_db",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

const start = () => {
  roles = showRoles();
  // inquirer prompt to find out user info
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: [
          "Add Employee",
          "View Employees",
          "Update Employee Role",
          "Add Role",
          "View Roles",
          "Add Department",
          "View Departments",
          "Exit",
        ],
        name: "choice",
      },
    ])
    .then((res) => {
      // capturing all of the responses and directing user to correct function
      if (res.choice === "Exit") {
        connection.end();
      } else if (res.choice === "Add Employee") {
        addEmployee();
      } else if (res.choice === "View Employees") {
        viewEmployees('employee.id');
      } else if (res.choice === "Update Employee Role") {
        updateEmployees('role');
      } else if (res.choice === "Add Role") {
        addRole();
      } else if (res.choice === "View Roles") {
        viewRoles();
      }
    });
};

// array for roles
const showRoles = () => {
  let roleArr = new Array();
  connection.query("Select title FROM role", (err, results) => {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      roleArr.push(results[i].title);
    }
  });
  return roleArr;
};

let roles = showRoles();

// function for adding an employee
function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Employee first name?",
        name: "firstName",
      },
      {
        type: "input",      
        message: "Employee last name?",
        name: "lastName",
      },
      {
        type: "list",
        message: "Role?",
        choices: roles,
        name: "role",
      },
    ])
    .then((res) => {
      // setting role id
      let roleId = roles.indexOf(res.role) + 1;
      // adding new employee to the database
      connection.query(
        "INSERT INTO employee set ?",
        {
          first_name: res.firstName,
          last_name: res.lastName,
          role_id: roleId,
        },
        function (error) {
          if (error) throw err;
        }
      );
      console.log('Employee Added!');
      start();
    });
}

// function for viewing employees

const viewEmployees = (query) => {
  // Joining all three tables
connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id = department.id ORDER BY ${query}`, (err, results) => {
  if(err) throw err;
  if(results.length ===0) {
    console.log('Nothing to display');
    start();
  } else {
  console.table(results);
  start();
  }
})
}

// Update employees
const updateEmployees = (query) => {
  //Grab database entries
  connection.query('SELECT * FROM employee', (err, result) => {
    if(err) throw err;
    //Find out which employee they want to edit, similar to the remove function
    inquirer.prompt([{
        type: 'list',
        message: 'Which employee do you want to update?',
        name: 'choice',
        choices: () => {
            let choiceArr = [];
            for(let i = 0; i < result.length; i++) {
                choiceArr.push(`${result[i].id}) ${result[i].first_name} ${result[i].last_name}`);
            }
            return choiceArr;
        }
    }]).then((response) => {
        let choiceId = parseInt(response.choice.split(" ")[0]);
        //If they wanted to switch the role
        if(query === 'role') {
            inquirer.prompt([{
                type: 'list',
                message: 'What role should this person be updated to?',
                choices: roles,
                name: 'role'
            }]).then((response) => {
                //Grab id like the remove function
                let roleId = roles.indexOf(response.role) + 1;
                //Update the employee entry
                connection.query('UPDATE employee SET role_id=? WHERE id=?', [roleId, choiceId], (err) => {
                    if (err) throw err;
                })
                //Launch main menu
                start();
            })
        }
    })
})
}

// Add Role
const addRole = () => {
  connection.query('SELECT * FROM department', (err, result) => {
      if(err) throw err;
      inquirer.prompt([{
          type: 'input',
          message: 'Role title:',
          name: 'title'
      },{
          type: 'input',
          message: 'Salary:',
          name: 'salary'
      },{
          type: 'list',
          message: 'Department',
          name: 'department',
          choices: () => {
              let deptChoices = [];
              for(let i = 0; i < result.length; i++) {
                  deptChoices.push(`${result[i].id}) ${result[i].name}`);
              }
              return deptChoices;
          }
      }]).then((response) => {
          let depChoiceId = parseInt(response.department.split(' ')[0]);
          connection.query('INSERT INTO role SET ?', {
              title: response.title,
              salary: response.salary,
              department_id: depChoiceId
          }, (err) => {
              if(err) throw err;
              roles = showRoles();
          })
          start();
      })
  })
}
// Views all roles
const viewRoles = () => {
  connection.query('SELECT * FROM role', (err, result) => {
      if(err) throw err;
      console.table(result);
      start();
  })
}