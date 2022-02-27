const inquirer = require('inquirer');
const express = require('express');
const sql = require('mysql2');

require('dotenv').config()

const connect = async () => {
    try {
        return sql.createConnection({
            host: 'localhost',
            database: 'my_company',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        })
    } catch (err) {
        console.log(err);
    }
}



const promptUser = async () => {
    return inquirer.prompt([
        {
            type: "list",
            name: "prompts",
            mesasge: "Select from the options below: \n",
            choices: [
                "view all departments", 
                "view all roles", 
                "view all employees", 
                "add a department", 
                "add a role", 
                "add an employee", 
                "update an employee role",
                "view budgets"
            ],
        }
    ]).then(async userChoice => {
        switch(userChoice.prompts) {
            case "view all departments":
                showTable("departments");
                return;
            
            case "view all roles":
                showTable("roles");
                return;
            
            case "view all employees":
                showTable("employees");
                return;
            
            case "add a department":
                addToTable("departments");
                return;

            case "add a role":
                addToTable("roles");
                return;

            case "add an employee":
                addToTable("employees");
                return;
            
            case "update an employee role":
                updateEmployee();
                return;

            case "view budgets":
                viewBudget();
                return;
        }

    });
}

promptUser();


// Function to show all elements in a given table based on selection in inquirer
const showTable = async (table) => {
    const db = await connect();
    db.query(`SELECT * FROM ${table}`, (err, result) => {
        if (err) {
            console.log(err);   //Hanlde errors
            promptUser();
        } else {
            console.table(result);  // Handle data
            console.log("\n");
            promptUser();
        }
    });
}

const addToTable = async (table) => {
    let departmentsList = [];
    if (table == "departments") {
        inquirer.prompt([
            {
                type: "input",
                name: "name",
                mesasge: "Name of department:"
            }
        ]).then(userChoice => {
            addValues("departments", ("name"), `"${userChoice.name}"`);
        });
    } else if (table == "roles") {
        const db = await connect();
        db.query("SELECT * FROM departments", (err, result) => {
            if (err) {
                console.log(err);
            } else {
                for (let i=0; i<result.length; i++) {
                    departmentsList.push(result[i].name);
                }
            }
        });
        inquirer.prompt([
            {
                type: "input",
                name: "name",
                mesasge: "name of role:"
            },
            {
                type: "input",
                name: "salary",
                mesasge: "salary of role:"
            },
            {
                type: "list",
                name: "department",
                choices: departmentsList
            }
        ]).then( userChoice => {
            for (let i=0; i<departmentsList.length; i++) {
                if (userChoice.department == departmentsList[i]) {
                    userChoice.department = i+1;
                }
            }
            console.log(userChoice);
            addValues("roles", "title, salary, department_id", `"${userChoice.name}", ${userChoice.salary}, ${userChoice.department}`)
        });
    } else if (table == "employees") {
        let managerList = ["none"];
        let roleList = [];
        const db = await connect();
        db.query("SELECT * FROM employees WHERE manager_id IS NULL", (err, result) => {
            if (err) {
                console.log(err);
            } else {
                for (let i=0; i<result.length; i++) {
                    managerList.push(result[i].first_name + " " + result[i].last_name);
                }
            }
        })
        db.query("SELECT * FROM roles", (err, result) => {
            if (err) {
                console.log(err);
            } else {
                for (let i=0; i<result.length; i++) {
                    roleList.push(result[i].title);
                }
            }
        })
        inquirer.prompt([
            {
                type: "input",
                name: "fName",
                mesasge: "First Name:"
            },
            {
                type: "input",
                name: "lName",
                mesasge: "Last Name:"
            },
            {
                type: "list",
                name: "manager",
                choices: managerList
            },
            {
                type: "list",
                name: "role",
                choices: roleList
            }
        ]).then( userChoice => {
            for (let i=0; i<managerList.length; i++) {
                if (userChoice.manager == "none") {
                    userChoice.manager = "NULL"
                } else if (userChoice.manager == managerList[i]) {
                    userChoice.manager = i;
                }
            }
            for (let i=0; i<roleList.length; i++) {
                if (userChoice.role == roleList[i]) {
                    userChoice.role = i+1;
                }
            }
            console.log(userChoice);
            addValues("employees", "first_name, last_name, manager_id, role_id", `"${userChoice.fName}", "${userChoice.lName}", ${userChoice.manager}, ${userChoice.role}`);
        });
    }
};

const addValues = async (table, rows, values) => {
    const db = await connect();
    db.query(`INSERT INTO ${table}(${rows}) VALUES (${values})`, (err, result) => {
        if (err) {
            console.log(err);
            promptUser();
        } else {
            promptUser();
        }
    });
}

const updateEmployee = async () => {
    const employeeList = [];
    const db = await connect();
    db.query("SELECT * from employees", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            for (let i=0; i<result.length; i++) {
                employeeList.push(result[i].first_name + " " + result[i].last_name)
            }
        }
        inquirer.prompt([
            {
                type: "list",
                message: "Select an an employee:",
                name: "employee",
                choices: employeeList
            }
        ]).then( userChoice => {
            const employee = userChoice.employee;
            const names = employee.split(" ");
            db.query(`SELECT * FROM employees WHERE first_name = '${names[0]}' AND last_name = '${names[1]}'`, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    let roleList = [];
                    db.query("SELECT * FROM  roles", (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            for (let i=0; i<result.length; i++) {
                                roleList.push(result[i].title);
                            }
                        }
                        inquirer.prompt([
                            {
                                type: "list",
                                name: "roles",
                                message: "select a new role",
                                choices: roleList
                            }
                        ]).then( userChoice => {
                            let roleId;
                            for (let i=0; i<roleList.length; i++) {
                                if (userChoice.roles == roleList[i]) {
                                    roleId = i+1;
                                }
                            }
                            db.query(`UPDATE employees SET role_id = ${roleId} WHERE first_name = '${names[0]}' AND last_name = '${names[1]}'`);
                            promptUser();
                        })
                    })
                }
            })
        })
    })
}

// const viewBudgets = async () => {
//     let department;
//     let total_cost = 0;
//     const db = await connect();
//     db.query("SELECT * FROM departments", (err, result) => {
//         if (err) {
//             console.log(err);
//         } else {
//             for (let i=0; i<result.length; i++) {
//                 console.log(result[i].name);
//                 db.query(`SELECT * FROM roles WHERE department_id = ${result[i].id}`, (err, result) => {
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         for (let j=0; j<result.length; j++) {
//                             total_cost += parseFloat(result[j].salary);
//                             db.query(`INSERT INTO budget (department, total_cost) VALUES ("${department}", ${total_cost})`);
//                         }
//                     }
//                 })
//             }
//         }
//     });
//     db.query(`SELECT * FROM budget`, (err, result) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.table(result)
//         }
//     })
// }

viewBudget = async () => { 
    const sql = `SELECT department_id AS id, 
                        departments.name AS department,
                        SUM(salary) AS budget
                 FROM  roles  
                 JOIN departments ON roles.department_id = departments.id GROUP BY  department_id`;
    
    db = await connect();
    db.query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows);
  
      promptUser(); 
    });            
  };