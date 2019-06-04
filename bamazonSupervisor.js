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
            choices: ['View Product Sales by Department', 'View Departments', 'Create New Department', 'Exit'],
            name: 'choice'
        }
    ])
    .then( answer => {
        if (answer.choice === 'View Product Sales by Department') {
            viewProductSales()

        } else if (answer.choice === 'Create New Department') {
            createNewDepartment()

        } else if (answer.choice === 'View Departments') {
            viewDepartments().then(askSupervisor)
            
        } else {
            connection.end()
            process.exit()
        }
    })
}

function viewProductSales() {

    // ************* need to fix this *************

    let query = 
    `
        SELECT departments.department_id, departments.department_name, departments.over_head_costs, 
            SUM(products.product_sales) FROM departments
        JOIN products ON products.department_name = departments.department_name
        GROUP BY departments.department_id
    `

    // ************* need to fix this *************

    connection.query(query, (err, results) => {
        if (err) throw err
        
        let table = new Table({
            head: ['department_id', 'department_name', 'over_head_costs', 'product_sales']
        })

        results.forEach( item => {
            table.push([item.department_id, item.department_name, item.over_head_costs, item.product_sales])
        })

        console.log('\n' + table.toString())

        askSupervisor()
    })
}

function createNewDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the department you would like to add?',
            name: 'name'
        },
        {
            type: 'input',
            message: 'What is the overhead cost of the department?',
            name: 'cost'
        }
    ])
    .then(answers => {
        let name = answers.name 
        let cost = parseFloat(answers.cost)

        connection.query(
            'INSERT INTO departments SET ?',
            {
                department_name: name,
                over_head_costs: cost
            },
            (err, res) => {
                if (err) throw err
                viewDepartments().then(askSupervisor)
            }
        )
    })
}

function viewDepartments() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM departments', (err, results) => {
            if (err) throw err 
    
            let table = new Table({
                head: ['id', 'department name', 'overhead costs']
            })
    
            results.forEach( item => {
                table.push([item.department_id, item.department_name, item.over_head_costs])
            })
    
            resolve(console.log('\n' + table.toString()))
        })
    })
}