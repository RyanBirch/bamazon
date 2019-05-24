require('dotenv').config()
const inquirer = require('inquirer')
const mysql = require('mysql')

// connect
const connection = mysql.createConnection({
    host: process.env.HOST,
    port: 3306,
    user: process.env.USER,
    password: process.env.PASS,
    database: 'bamazon'
})