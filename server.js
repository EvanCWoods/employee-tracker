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
        }

    });
}

promptUser();


// Function to show all elements in a given table based on selection in inquirer
const showTable = async (table) => {
    const db = await connect();   // Get the database connection

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
    if (table == "departments") {
        inquirer.prompt([
            {
                type: "input",
                name: "name",
                mesasge: "Name of department:"
            }
        ]).then(userChoice => {
            addValues("departments", ("department_name"), `"${userChoice.name}"`);
        });
    } else if (table == "roles") {
        inquirer.prompt([
            {
                type: "input",
                name: "department",
                mesasge: "department id of role:"
            },
            {
                type: "input",
                name: "name",
                mesasge: "name of role:"
            },
            {
                type: "input",
                name: "salary",
                mesasge: "salary of role:"
            }
        ]).then( userChoice => {
            console.log(userChoice);
            addValues("roles", "department_id, title, salary", `${userChoice.department}, "${userChoice.name}", ${userChoice.salary}`)
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