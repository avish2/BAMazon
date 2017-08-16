// Pull in required dependencies
var inquirer = require('inquirer');
var mysql = require('mysql');
const colors = require('colors');
require('console.table');


// Define the MySQL connection parameters
var connection = mysql.createConnection({
	host: 'localhost',
	port: 8889,

	// Your username
	user: 'root',

	// Your password
	password: 'root',
	database: 'bamazon'
});


function openMenu() {

	// Prompt the manager to select an option
	inquirer.prompt([
		{
			type: 'list',
			name: 'menuOptions',
			message: 'What would you like to do?',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add A New Product','Exit'],
		}
	]).then(function(answer) {
		var waitMsg;
		
		switch (answer.menuOptions) {
	
			case 'View Products for Sale':
				setTimeout(displayInventory, 2000);
				break;
	
			case 'View Low Inventory':
				console.log("Fetching Low Invetory Items...");
				waitMsg = setTimeout(displayLowInventory, 2000);
				break;
	
			case 'Add to Inventory':
				addInventory();
				break;
	
			case 'Add A New Product':
				createNewProduct();
				break;

			case 'Exit':
				console.log(colors.yellow("\nThank you for using BAMazon. We're going to put Walmart out of business! \nIt's employees like you that make us great!\n"));
				connection.end();
				break;
	
			default:
				console.log(colors.red("Sorry, I don't understand"));
		}
	
		});
	
	}
	
	openMenu();
// displayInventory will retrieve the current inventory from the database and output it to the console
function displayInventory() {
	// console.log('___ENTER displayInventory___');

	// Construct the db query string
	queryStr = 'SELECT * FROM products';

	// Make the db query
	connection.query(queryStr, function(err, res) {
		if (err) throw err;

		console.log(colors.yellow('Current Inventory: '));
		console.log('...................\n');

		console.table(res);

		  console.log("----------------------------------------------------------------------------\n");

		  inquirer.prompt([
			{
				type: 'list',
				name: 'continue',
				message: 'Would you like to do anything else?',
				choices: ['Yes', 'No, exit app'],
			}
		]).then(function(answer) {
			if (answer.continue ==='Yes') {
				setTimeout(openMenu, 500);	
			} else {
				console.log(colors.yellow("\nThank you for using BAMazon. We're going to put Walmart out of business! \nIt's employees like you that make us great!\n"));				
				connection.end();
			}
		});
	});
}

function displayLowInventory() {

	queryStr = 'SELECT * FROM products WHERE stock_quantity < 50';

	connection.query(queryStr, function(err, res) {
		if (err) throw err;

		console.log(colors.yellow('These products have less than 50 units in stock: '));
		console.log('................................\n');

		console.table(res);

		  console.log("----------------------------------------------------------------------------------------\n");
		  inquirer.prompt([
			{
				type: 'list',
				name: 'continue',
				message: 'Would you like to do anything else?',
				choices: ['Yes', 'No, exit app'],
			}
		]).then(function(answer) {
			if (answer.continue ==='Yes') {
				setTimeout(openMenu, 500);	
			} else {
				console.log(colors.yellow("\nThank you for using BAMazon. We're going to put Walmart out of business! \nIt's employees like you that make us great!\n"));				
				connection.end();
			}
		});
	});
}

// validateInteger makes sure that the user is supplying only positive integers for their inputs
function validateInteger(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole, non-zero number.';
	}
}

// Makes sure that the user is supplying only positive numbers for their inputs
function validatePrice(value) {
	// Value must be a positive number
	var number = (typeof parseFloat(value)) === 'number';
	var positive = parseFloat(value) > 0;

	if (number && positive) {
		return true;
	} else {
		return 'Please enter a positive number.'
	}
}

// addInventory will guilde a user in adding additional quantify to an existing item
function addInventory() {
	// console.log('___ENTER addInventory___');

	// Prompt the user to select an item
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the Item ID you want to update: ',
			validate: validateInteger,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many would you like to add? ',
			validate: validateInteger,
			filter: Number
		}
	]).then(function(input) {
		// console.log('Manager has selected: \n    item_id = '  + input.item_id + '\n    additional quantity = ' + input.quantity);

		var item = input.item_id;
		var addQuantity = input.quantity;

		// Query db to confirm that the given item ID exists and to determine the current stock_count
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {item_id: item}, function(err, res) {
			if (err) throw err;

			if (res.length === 0) {
				console.log(colors.red('ERROR: Invalid Item ID. Please select a valid Item ID.'));
				addInventory();

			} else {
				var productData = res[0];

				console.log('Updating Inventory...\n');
				

				// Construct the updating query string
				var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;
				// console.log('updateQueryStr = ' + updateQueryStr);

				// Update the inventory
				connection.query(updateQueryStr, function(err, res) {
					if (err) throw err;

					console.log(colors.yellow('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.'));
					console.log("\n---------------------------------------------------------------------\n");
					inquirer.prompt([
						{
							type: 'list',
							name: 'continue',
							message: 'Would you like to do anything else?',
							choices: ['Yes', 'No, exit app'],
						}
					]).then(function(answer) {
						if (answer.continue ==='Yes') {
							setTimeout(openMenu, 500);	
						} else {
							console.log(colors.yellow("\nThank you for using BAMazon. We're going to put Walmart out of business! \nIt's employees like you that make us great!\n"));				
							connection.end();
						}
					})
				})
			}
	});
});
};

function createNewProduct() {

	inquirer.prompt([
		{
			type: 'input',
			name: 'product_name',
			message: 'Name of the item: ',
		},
		{
			type: 'input',
			name: 'department_name',
			message: 'Item Department: ',
		},
		{
			type: 'input',
			name: 'price',
			message: 'Price per unit: ',
			validate: validatePrice
		},
		{
			type: 'input',
			name: 'stock_quantity',
			message: 'Number of items in stock: ',
			validate: validateInteger
		}
	]).then(function(input) {
		// console.log('input: ' + JSON.stringify(input));

		console.log('Adding New Item: \n    product_name = ' + input.product_name + '\n' +  
									   '    department_name = ' + input.department_name + '\n' +  
									   '    price = ' + input.price + '\n' +  
									   '    stock_quantity = ' + input.stock_quantity);

		// Create the insertion query string
		var queryStr = 'INSERT INTO products SET ?';

		// Add new product to the db
		connection.query(queryStr, input, function (error, results, fields) {
			if (error) throw error;

			console.log(colors.yellow('New product has been added to the inventory under Item ID ' + results.insertId + '.'));
			console.log("\n---------------------------------------------------------------------\n");
			inquirer.prompt([
				{
					type: 'list',
					name: 'continue',
					message: 'Would you like to do anything else?',
					choices: ['Yes', 'No, exit app'],
				}
			]).then(function(answer) {
				if (answer.continue ==='Yes') {
					setTimeout(openMenu, 500);	
				} else {
					console.log(colors.yellow("\nThank you for using BAMazon. We're going to put Walmart out of business! \nIt's employees like you that make us great!\n"));				
					connection.end();
				}
			});
		})
	});
};

