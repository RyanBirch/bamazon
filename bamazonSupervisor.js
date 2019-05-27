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
            viewDepartments()
        } else {
            connection.end()
            process.exit()
        }
    })
}

function viewProductSales() {

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
                viewDepartments()
                askSupervisor()
            }
        )
    })
}

function viewDepartments() {
    connection.query('SELECT * FROM departments', (err, results) => {
        if (err) throw err 

        let table = new Table({
            head: ['id', 'department name', 'overhead costs']
        })

        results.forEach( item => {
            table.push([item.department_id, item.department_name, item.over_head_costs])
        })

        console.log('\n' + table.toString())
    })
}