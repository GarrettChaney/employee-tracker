const inquirer = require("inquirer");
const db = require("./config/connection.js");
const {
  handleViewAllEmployees,
} = require("./controllers/employee/employee.js");

const actions = {
  "View All Employees": handleViewAllEmployees,
  "Add Employee": handleAddEmployee,
  "Update Employee Role": handleUpdateEmployeeRole,
  "View All Roles": handleViewAllRoles,
  "Add Role": handleAddRole,
  "View All Departments": handleViewAllDepartments,
  "Add Department": handleAddDepartment,
  "View All Managers": handleViewAllManagers,
};

const mainPrompt = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do",
      choices: Object.keys(actions),
    })
    .then((answer) => {
      const { action } = answer;
      const handler = actions[action];

      if (handler) {
        handler().then(() => {
          mainPrompt();
        });
      } else {
        console.log("Invalid action");
      }
    });
};

mainPrompt();
