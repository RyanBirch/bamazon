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
    console.log('\n')
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
                viewProducts().then(askManager)
            } else if (answer.homeChoice === 'View Low Inventory') {
                viewLowInventory().then(askManager)
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
    return new Promise((resolve, reject) => {
        // retrieve all items from the database to display to the user
        connection.query('SELECT * FROM products', (err, results) => {
            if (err) throw err 
    
            // display the items in a table
            let table = new Table({
                head: ['id', 'name', 'department', 'price', 'stock quantity']
            })
            results.forEach( item => {
                table.push([item.item_id, item.product_name, item.department_name, item.price, item.stock_quantity])
            })
    
            // print the table to the console
            resolve(console.log('\n' + table.toString()))
        })
    })
}

function viewLowInventory() {
    return new Promise((resolve, reject) => {
        // retrieve all items from the database to display to the user
        connection.query('SELECT * FROM products WHERE stock_quantity < ?', [5],
            (err, results) => {
                if (err) throw err

                // display the items in a table
                let table = new Table({
                    head: ['id', 'name', 'department', 'price', 'stock quantity']
                })
                results.forEach(item => {
                    table.push([item.item_id, item.product_name, item.department_name, item.price, item.stock_quantity])
                })

                // print the table to the console
                resolve(console.log('\n' + table.toString()))
            })
    })
}

function addToInventory() {

}

function addNewProduct() {

}