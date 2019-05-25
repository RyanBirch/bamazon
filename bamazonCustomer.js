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
    homePage()
})

// home page 
function homePage() {
    displayAllProducts().then(askUser)
}

// show the user all of the products in the store
function displayAllProducts() {
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

// ask user what they want to buy
function askUser() {
    console.log('\n')
    inquirer
        .prompt([{
                type: 'input',
                message: 'Type the id of the product you would like to buy',
                name: 'id'
            },
            {
                type: 'input',
                message: 'How many units of the product would you like to buy?',
                name: 'amount'
            }
        ])
        .then(answers => {
            let resArr = []
            let selected

            // check the database to see if the store has enough of the item
            connection.query('SELECT * FROM products', (err, results) => {
                if (err) throw err

                results.forEach(item => {
                    resArr.push(item)
                    if (item.item_id === parseInt(answers.id)) selected = item
                })

                if (selected.stock_quantity < answers.amount) console.log('Insufficient quantity')
                else {
                    console.log('Total cost: $' + selected.price * answers.amount)
                }
            })
        })
}

// update the database after a purchase
function updateProducts(item) {

}

