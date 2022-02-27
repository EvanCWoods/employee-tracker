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
                "update an employee role"
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
        const db = await connect();
        db.query("SELECT * FROM employees WHERE manager_id IS NOT NULL", (err, result) => {
            if (err) {
                console.log(err);
            } else {
                for (let i=0; i<result.length; i++) {
                    managerList.push(result[i].first_name + " " + result[i].last_name);
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
            }
        ]).then( userChoice => {
            console.log(userChoice);
        
        })
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