require('dotenv').config()
const inquirer = require('inquirer')
const mysql = require('mysql')
const Table = require('cli-table3')

// connect to database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.PASS,
    database: 'bamazon'
})

connection.connect( err => {
    if (err) throw err 
    askSupervisor()
})


function askSupervisor() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Select an option',
            choices: ['View Product Sales by Department', 'Create New Department', 'Exit'],
            name: 'choice'
        }
    ])
    .then( answer => {
        if (answer.choice === 'View Product Sales by Department') {
            viewProductSales()
        } else if (answer.choice === 'Create New Department') {
            createNewDepartment()
        } else {
            connection.end()
            process.exit()
        }
    })
}

function viewProductSales() {

}

function createNewDepartment() {
    
}