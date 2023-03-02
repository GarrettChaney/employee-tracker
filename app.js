const inquirer = require("inquirer");
const db = require("./config/connection.js");
const cTable = require("console.table");

const handleViewAllEmployees = () => {
  let sql = `SELECT employee.id,
                  employee.first_name,
                  employee.last_name,
                  role.title,
                  department.department_name AS 'department',
                  role.salary,
                  employee.manager_id AS manager 
                  FROM employee, role, department
                  WHERE department.id = role.department_id
                  AND role.id = employee.role_id
                  ORDER BY employee.id`;
  return new Promise((resolve, reject) => {
    db.query(sql, (error, response) => {
      if (error) reject(error);
      console.table(response);
      resolve(response);
      mainPrompt();
    });
  });
};

const handleViewAllRoles = () => {
  const query = "SELECT * FROM role";
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainPrompt();
  });
};

const handleViewAllDepartments = () => {
  const query = "SELECT * FROM department";
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainPrompt();
  });
};

const handleAddEmployee = () => {
  db.query("SELECT * FROM role", (err, roles) => {
    if (err) console.log(err);
    roles = roles.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "Enter Employee First Name",
        },
        {
          type: "input",
          name: "lastName",
          message: "Enter Employee Last Name",
        },
        {
          type: "list",
          name: "role",
          message: "Enter Employee Role:",
          choices: roles,
        },
        {
          //redo managers.
          type: "list",
          name: "managerId",
          message: "Provide Manager ID:",
          choices: [1, 3, 6],
        },
      ])
      .then((data) => {
        db.query(
          "INSERT INTO employee SET ?",
          {
            first_name: data.firstName,
            last_name: data.lastName,
            role_id: data.role,
            manager_id: data.managerId,
          },
          (err) => {
            if (err) throw err;
            console.log("Updated Employees.");
            handleViewAllEmployees();
          }
        );
      });
  });
};

const handleAddRole = () => {
  db.query("SELECT * FROM department", (err, departments) => {
    if (err) console.log(err);
    departments = departments.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "input",
          name: "newRole",
          message: "Enter Role Title.",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter Role Salary.",
        },
        {
          type: "list",
          name: "departmentId",
          message: "Enter Role Department.",
          choices: departments,
        },
      ])
      .then((data) => {
        db.query(
          "INSERT INTO role SET ?",
          {
            title: data.newRole,
            salary: data.salary,
            department_id: data.departmentId,
          },
          function (err) {
            if (err) throw err;
          }
        );
        console.log("Added New Role.");
        handleViewAllRoles();
      });
  });
};

const handleUpdateEmployeeRole = () => {
  db.query("SELECT * FROM employee", (err, employees) => {
    if (err) console.log(err);
    employees = employees.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    db.query("SELECT * FROM role", (err, roles) => {
      if (err) console.log(err);
      roles = roles.map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "selectEmployee",
            message: "Select employee to update...",
            choices: employees,
          },
          {
            type: "list",
            name: "selectNewRole",
            message: "Select new employee role...",
            choices: roles,
          },
        ])
        .then((data) => {
          db.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                role_id: data.selectNewRole,
              },
              {
                id: data.selectEmployee,
              },
            ],
            function (err) {
              if (err) throw err;
            }
          );
          console.log("Employee Role Updated.");
          handleViewAllEmployees();
        });
    });
  });
};

const handleAddDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDepartment",
        message: "Enter New Department:",
      },
    ])
    .then((data) => {
      db.query(
        "INSERT INTO department SET ?",
        {
          department_name: data.newDepartment,
        },
        function (err) {
          if (err) throw err;
        }
      );
      console.log("New Department Added.");
      handleViewAllDepartments();
    });
};

const actions = {
  "View All Employees": handleViewAllEmployees,
  "Add Employee": handleAddEmployee,
  "Update Employee Role": handleUpdateEmployeeRole,
  "View All Roles": handleViewAllRoles,
  "Add Role": handleAddRole,
  "View All Departments": handleViewAllDepartments,
  "Add Department": handleAddDepartment,
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
        handler();
      } else {
        console.log("Invalid action");
      }
    });
};

mainPrompt();
