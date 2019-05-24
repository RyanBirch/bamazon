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


function homePage() {
    let results = displayAllProducts()
    console.log('results: ' + results)

    console.log('\n\n\n')
    inquirer
        .prompt([
            {
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
        .then( answers => {
            let selectedItem

            results.forEach( item => {
                if (item.item_id === answers.id) selectedItem = item
            })

            if (selectedItem.stock_quantity < answers.amount) console.log('Insufficient quantity')
        })
}

function displayAllProducts() {
    let resArr = []
    connection.query('SELECT * FROM products', (err, results) => {
        if (err) throw err 

        let table = new Table({
            head: ['id', 'name', 'department', 'price', 'stock quantity']
        })
        results.forEach( item => {
            table.push([item.item_id, item.product_name, item.department_name, item.price, item.stock_quantity])
            resArr.push(item)
        })

        console.log('\n' + table.toString())
    })

    connection.end()
    return resArr
}

