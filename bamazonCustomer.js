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

// ask user what they want to buy
function askUser() {
    console.log('\n')
    inquirer.prompt([
        {
            type: 'list',
            message: 'Select an option',
            choices: ['Make a purchase', 'Exit'],
            name: 'homeChoice'
        }
    ])
    .then(answer => {
        if (answer.homeChoice === 'Make a purchase') {
            console.log('\n')
            inquirer.prompt([
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
            .then(answers => {
                processTransaction(answers)
            })
        } else {
            connection.end()
            process.exit()
        }
    })
}

function processTransaction(answers) {
    let resArr = []
    let selected

    connection.query('SELECT * FROM products', (err, results) => {
        if (err) throw err

        // find the item the user selected in the database
        results.forEach(item => {
            resArr.push(item)
            if (item.item_id === parseInt(answers.id)) selected = item
        })

        // check if store has sufficient quantity
        if (selected.stock_quantity < answers.amount) {
            console.log('\nInsufficient quantity')
            homePage()
        } else {
            console.log('\nOrder successfully placed \nTotal cost: $' + selected.price * answers.amount)
            updateProducts(selected, answers.amount)
            askUser()
        }
    })
}

// update the database after a purchase
function updateProducts(item, amount) {
    connection.query(
        'UPDATE  products SET ?, ? WHERE ?',
        [
            {
                stock_quantity: item.stock_quantity - amount
            },
            {
                product_sales: item.product_sales + (item.price * amount)
            },
            {
                item_id: item.item_id
            }
        ],
        (err, res) => {
            if (err) throw err
        }
    )
}

