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
                showAllDepartments();
        }

    });
}

promptUser();

// Function to show all databases on seleciton in inquirer
const showAllDepartments = async () => {
    const data = await connect();   // Get the database connection

    // Query the database to get all departments in the department table
    data.query("SELECT * FROM departments", (err, result) => {
        if (err) {
            console.log(err);   //Hanlde errors
        } else {
            console.table(result);  // Handle data
        }
    });
}