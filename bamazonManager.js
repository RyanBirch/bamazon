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
    askManager()
})


// home page
function askManager() {
    console.log('\n')
    inquirer.prompt([
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

// view all products
function viewProducts() {
    return new Promise((resolve, reject) => {
        // retrieve all items from the database to display to the user
        connection.query('SELECT * FROM products', (err, results) => {
            if (err) throw err 
    
            // display the items in a table
            let table = new Table({
                head: ['id', 'name', 'department', 'price', 'stock quantity', 'product sales']
            })
            results.forEach( item => {
                table.push([item.item_id, item.product_name, item.department_name, item.price, item.stock_quantity, item.product_sales])
            })
    
            // print the table to the console
            resolve(console.log('\n' + table.toString()))
        })
    })
}

// view products with less than 5 units in stock
function viewLowInventory() {
    return new Promise((resolve, reject) => {
        // retrieve items from the database to display to the user
        connection.query('SELECT * FROM products WHERE stock_quantity < ?', [5],
            (err, results) => {
                if (err) throw err

                // display the items in a table
                let table = new Table({
                    head: ['id', 'name', 'department', 'price', 'stock quantity', 'product sales']
                })
                results.forEach(item => {
                    table.push([item.item_id, item.product_name, item.department_name, item.price, item.stock_quantity, item.product_sales])
                })

                // print the table to the console
                resolve(console.log('\n' + table.toString()))
            })
    })
}

// add more units of a specific item
function addToInventory() {
    // show user all products, then ask which one they want to update
    viewProducts().then(() => {
        inquirer.prompt([
            {
                type: 'input',
                message: 'Type the id of the item you would like to update',
                name: 'choice'
            },
            {
                type: 'input',
                message: 'How many units would you like to add?',
                name: 'units'
            }
        ])
        .then(answers => {
            let choiceID = answers.choice
            let numUnits = answers.units
            let resArr = []
            let selected

            // find the item in the database
            connection.query('SELECT * FROM products', (err, results) => {
                if (err) throw err

                results.forEach(item => {
                    resArr.push(item)
                    if (item.item_id === parseInt(choiceID)) selected = item
                })

                // update quantity in the database
                connection.query('UPDATE products SET ? WHERE ?',
                    [
                        {
                            stock_quantity: parseInt(selected.stock_quantity) + parseInt(numUnits)
                        },
                        {
                            item_id: choiceID
                        }
                    ],
                    (err, res) => {
                        if (err) throw err
                        // return to home screen
                        askManager()
                    }
                )
            })
        })
    })
}

// add a new product to the database
function addNewProduct() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the product?',
            name: 'name'
        },
        {
            type: 'input',
            message: 'Which department does the item go in?',
            name: 'department'
        },
        {
            type: 'input',
            message: 'what is the price of the item?',
            name: 'price'
        },
        {
            type: 'input',
            message: 'What is the stock quantity?',
            name: 'stock'
        }
    ])
    .then(answers => {
        connection.query(
            'INSERT INTO products SET ?',
            {
                product_name: answers.name,
                department_name: answers.department,
                price: answers.price,
                stock_quantity: answers.stock
            },
            (err, res) => {
                if (err) throw err
                askManager()
            }
        )
    })
}