# Bamazon

## Overview
This is a command line Node.js application that utilizes a MySQL database to create an Amazon-like storefront. The app takes in orders from customers and updates the database accordingly. It can also track product sales across different departments and organize data based on highest grossing departments. 

---

## Features
* ### Customer View
    * Customers can view products in the database and make purchases. The program returns them the total cost of their order and depletes the products in the database.

* ### Manager View
    * View all products in the database
    * View products that have low inventory
    * Add to inventory of a particular product
    * Add a new product to the database

* ### Supervisor View
    * View departments
    * Create a new department in the database
    * View product sales by department

---

## Technologies Used
* JavaScript
* Node.js
* MySQL

---

## Packages Used
* inquirer
* mysql
* cli-table3
* dotenv

---

## Demonstration
* ### Customer View
    <img src="images/bamazonCustomer.gif">

    <br><br><br>

* ### Manager View
    <img src="images/bamazonManager.gif">

    <br><br><br>

* ### Supervisor View
    <img src="images/bamazonSupervisor.gif">