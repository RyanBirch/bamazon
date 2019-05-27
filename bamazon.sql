DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price DECIMAL(10, 2),
    stock_quantity INT,
    product_sales DECIMAL(10, 2),
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Fight Club', 'Movies', 8.99, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('The Departed', 'Movies', 9.99, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('The Eminem Show', 'Music', 11.99, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Kamikaze', 'Music', 11.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Red Dead Redemption', 'Video Games', 59.99, 250);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Call of Duty', 'Video Games', 49.99, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Lamp', 'Furniture', 14.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Rocking Chair', 'Furniture', 19.99, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('War and Peace', 'Books', 9.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Moby Dick', 'Books', 9.99, 15);



CREATE TABLE departments(
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50),
    over_head_costs DECIMAL(10, 2)
);