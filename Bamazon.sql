-- Create a database called 'Bamazon' and switch into it for this activity --
CREATE DATABASE bamazon;
USE Bamazon;

-- Create a table called 'products' which will contain the store inventory --
CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(20) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INTEGER(11) NOT NULL,
	PRIMARY KEY (item_id)
);

-- Insert data into the 'products' table --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ('Dove Deoderant', 'Bath & Beauty', 3.75, 450),
		('Dove Conditioner', 'Bath & Beauty', 5.50, 345),
		('Colgate Mouthwash', 'Bath & Beauty', 3.99, 398),
		('Nivea Body Wash', 'Bath & Beauty', 2.99, 456),
		('Hills Science Diet Dog Food', 'Pets', 50.35, 830),
		('Wiz Gear Magnetic Mount', 'Automotive', 7.99, 10056),
		('Capezio Short Sleeve Leotard', 'Womens Clothing', 4.45, 26),
		('TEAS Study Manual', 'Books', 24.99, 200),
		('Universal Phone Camera Lense', 'Phone Accessories', 11.75, 476),
		('Cherokee Womens Workwear Scrubs', 'Womens Clothing', 24.99, 575),
		('Ebonite Ultra Slide Powder', 'Sports', 5.50, 423),
		('Yoga Mat', 'Sports', 12.75, 12),
		('Yunmai mini Smart Scale', 'Health & Wellness', 7.99, 89),
		('Fidget Spinner', 'Toys', 5.55, 120),
		('Mens Hindsight is 2020 Bernie Sanders Shirt', 'Mens Clothing', 17.88, 36),
		('Magnolia Derby Time Flag', 'Home Decor', 7.25, 157),
		('Quaker Instant Oatmeal', 'Grocery', 2.50, 163),
		('Ibuprophen', 'Pharmacy', 4.95, 389),
		('Band Aid', 'Pharmacy', 3.25, 550),
		('Ben & Jerry Ice Cream', 'Grocery', 3.25, 26);

SELECT * FROM products;