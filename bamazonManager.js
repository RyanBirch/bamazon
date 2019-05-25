require('dotenv').config()
const inquirer = require('inquirer')
const mysql = require('mysql')
const Table = require('cli-table3')

// connect
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.PASS,
    database: 'bamazon'
})

connection.connect( err => {
    if (err) throw err 
    askManager()
})


function askManager() {
    inquirer 
        .prompt([
            {
                type: 'list',
                message: 'Select an option',
                choices: ['View Products For Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
                name: 'homeChoice'
            }
        ])
        .then( answer => {
            if (answer.homeChoice === 'View Products For Sale') {
                viewProducts()
            } else if (answer.homeChoice === 'View Low Inventory') {
                viewLowInventory()
            } else if (answer.homeChoice === 'Add to Inventory') {
                addToInventory()
            } else if (answer.homeChoice === 'Add New Product') {
                addNewProduct()
            } else {
                connection.end()
                process.exit()
            }
        })
}

function viewProducts() {

}

function viewLowInventory() {

}

function addToInventory() {

}

function addNewProduct() {

}