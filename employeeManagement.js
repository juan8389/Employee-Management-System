const mysql = require("mysql")
const inquirer = require("inquirer")
const cTable = require('console.table');

// connect to the database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "8128",
    port: 3306,
    database: "employeetracker_db"
});

connection.connect((err) => {
    if (err) throw err;
    askFirstQuestions();
});

const askFirstQuestions = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: ["ADD DEPT. ROLES, EMPLOYEES", "VIEW DEPARTMENTS, ROLES, OR EMPLOYEES", "UPDATE EMPLOYEE ROLES"]

        }
    ]
    )
        .then(answers => {
            const { choice } = answers;
            if (choice === "ADD DEPT. ROLES, EMPLOYEES") {
                inquirer.prompt([
                    {
                        type: "list",
                        message: "What would you like to add?",
                        name: "choice",
                        choices: ["Department", "Role", "Employee"]

                    }
                ])
                    .then(answers => {
                        const { choice } = answers;
                        if (choice == "Department") {
                            inquirer.prompt([
                                {
                                    type: "input",
                                    message: "Enter the name of the department: ",
                                    name: "department_name",
                                }
                            ])
                                .then(answers => {
                                    const { department_name } = answers;
                                    connection.query('INSERT INTO department (name) VALUES (?)', [department_name], function (error, results, fields) {
                                        if (error) throw error;
                                        askFirstQuestions();
                                    });
                                })

                        } else if (choice == 'Role') {

                            connection.query('SELECT * FROM department', function (error, results, fields) {
                                const departments = [];
                                for (let i = 0; i < results.length; i++) {
                                    departments.push(results[i].name);
                                }

                                if (error) throw error;
                                inquirer.prompt([
                                    {
                                        type: "input",
                                        message: "Enter title of role: ",
                                        name: "role_name",
                                    },
                                    {
                                        type: "input",
                                        message: "Enter salary of role: ",
                                        name: "role_salary",
                                    },
                                    {
                                        type: "list",
                                        message: "Select the department you belong to ",
                                        name: "department_name",
                                        choices: departments

                                    }
                                ])
                                    .then(answers => {
                                        const { role_name, role_salary, department_name } = answers;
                                        const department = results.find(department => {
                                            return department.name == department_name;
                                        })
                                        const departmentId = department.id;
                                        connection.query('INSERT INTO role (title, salary, department_id) VALUES(?,?,?)', [role_name, role_salary, departmentId], function (error, results, fields) {
                                            console.log('Role has been added.');
                                            askFirstQuestions();
                                        })
                                    })
                            })
                        } else {
                            connection.query('SELECT * FROM role', function (error, role_results, fields) {
                                const roles = [];
                                for (let i = 0; i < role_results.length; i++) {
                                    roles.push(role_results[i].title);
                                }
                                connection.query('SELECT * FROM employee', function (error, employee_results, fields) {
                                    const employees = [];
                                    for (let i = 0; i < employee_results.length; i++) {
                                        employees.push(employee_results[i].first_name + ' ' + employee_results[i].last_name);
                                    }
                                    employees.push('None');
                                    inquirer.prompt([
                                        {
                                            type: "input",
                                            message: "Enter your first name: ",
                                            name: "first_name",
                                        },
                                        {
                                            type: "input",
                                            message: "Enter your last name: ",
                                            name: "last_name",
                                        },
                                        {
                                            type: "list",
                                            message: "Select your role: ",
                                            name: "employee_role",
                                            choices: roles
                                        },
                                        {
                                            type: "list",
                                            message: "Select your manager: ",
                                            name: "employee_manager",
                                            choices: employees
                                        },
                                    ])
                                        .then(answers => {
                                            const { first_name, last_name, employee_role, employee_manager } = answers;
                                            const role = role_results.find(role => {
                                                return role.title === employee_role;
                                            })
                                            const roleId = role.id;
                                            const manager = employee_results.find(employee => {
                                                return employee.first_name + ' ' + employee.last_name === employee_manager;
                                            })
                                            let managerId = null;
                                            if (manager != null) {
                                                managerId = manager.id;
                                            }
                                          
                                            connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)', [first_name, last_name, roleId, managerId ], function (error, results, fields) {
                                                if (error) console.log(error)
                                                console.log('Employee has been added.');
                                                askFirstQuestions();
                                            })
                                        })
                                })




                            });


                        }
                    })
            }
            // QUestion to ask which table they want to view

            else if (choice === "VIEW DEPARTMENTS, ROLES, OR EMPLOYEES") {
                inquirer.prompt([

                    {
                        type: "list",
                        message: "What would you like to view?",
                        name: "choice",
                        choices: ["Departments", "Roles", "Employees"]

                    }
                ])
                    .then(answers => {
                        const { choice } = answers;
                        console.log(choice)
                        if (choice === "Departments") {
                            // Tell mysql to go and grab the departments
                            console.log("here")
                            connection.query('SELECT * FROM department', function (error, results) {
                                console.table(results);
                                askFirstQuestions()
                            })
                        } else if (choice == "Roles") {
                            connection.query('SELECT role.id, title, department.name FROM role INNER JOIN department ON role.department_id = department.id', function (error, results) {
                                console.table(results);
                                askFirstQuestions()
                            })


                        } else {
                            connection.query('SELECT e.id, e.first_name, e.last_name, title, salary, m.first_name as manager FROM employee e INNER JOIN role ON e.role_id = role.id LEFT JOIN employee m ON e.manager_id = m.id', function (error, results) {
                                if (error) console.log(error);
                                console.table(results);
                                askFirstQuestions()
                            })

                        }
                    });



                // Depending on what table they want to view, tell your mySQL database to SELECT from that table 
            }
            else if (choice === "UPDATE EMPLOYEE ROLES") {
                connection.query('SELECT * FROM role', function (error, role_results, fields) {
                    const roles = [];
                    for (let i = 0; i < role_results.length; i++) {
                        roles.push(role_results[i].title);
                    }
                    connection.query('SELECT * FROM employee', function (error, employee_results, fields) {
                        const employees = [];
                        for (let i = 0; i < employee_results.length; i++) {
                            employees.push(employee_results[i].first_name + ' ' + employee_results[i].last_name);
                        }
                        inquirer.prompt([
                            {
                                type: "list",
                                message: "Which employee do you want to update ",
                                name: "employee_name",
                                choices: employees
                            },
                            {
                                type: "list",
                                message: "Select the new role: ",
                                name: "employee_role",
                                choices: roles
                            },
                        ])
                            .then(answers => {
                                const { employee_name, employee_role } = answers;
                                const role = role_results.find(role => {
                                    return role.title === employee_role;
                                })
                                const roleId = role.id;
                                const employeeFound = employee_results.find(employee => {
                                    return employee.first_name + ' ' + employee.last_name === employee_name;
                                })
                                const employeeId = employeeFound.id;
                                connection.query("UPDATE employee set role_id = ? WHERE id = ?", [roleId, employeeId], function (err, results) {
                                    if (error) console.log(error)
                                    console.log('Employee role has been updated.');
                                    askFirstQuestions();
                                })
                            })
                    })

             
                 
                })
            }
            else {
                connection.end();
                console.log("Goodbye");
            }
        });

}