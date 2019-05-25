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
    displayAllProducts()
        .then(() => {
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

                    connection.query('SELECT * FROM products', (err, results) => {
                        console.log('answers.id: ' + answers.id)
                        results.forEach(item => {
                            resArr.push(item)
                            if (item.item_id === answers.id) selected = item
                            console.log('item id: ' + item.item_id)
                        })

                        console.log('selected: ')
                        console.log(selected)
                    })
                })
        })
}

function displayAllProducts() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM products', (err, results) => {
            if (err) throw err 
    
            let table = new Table({
                head: ['id', 'name', 'department', 'price', 'stock quantity']
            })
            results.forEach( item => {
                table.push([item.item_id, item.product_name, item.department_name, item.price, item.stock_quantity])
            })
    
            resolve(console.log('\n' + table.toString()))
        })
    })
}

