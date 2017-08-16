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

// validateInput makes sure that the user is supplying only positive integers for their inputs
function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole, non-zero number.';
	}
}
console.log(colors.yellow("WELCOME TO BAMazon!"))
displayInventory();
function promptPurchase() {

	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Item ID of which you would like to purchase: ',
			validate: validateInput,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many units would you like?',
			validate: validateInput,
			filter: Number
		}
	]).then(function(input) {

		var item = input.item_id;
		var quantity = input.quantity;

		// Query db to confirm that the given item ID exists in the desired quantity
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {item_id: item}, function(err, res) {
			if (err) throw err;

			// If the user has selected an invalid item ID, res array will be empty

			if (res.length === 0) {
				console.log(colors.red('ERROR: Invalid Item ID. Please enter a valid Item ID.'));
				setTimeout(promptPurchase, 2000);

			} else {
				var productData = res[0];

				// console.log('productData = ' + JSON.stringify(productData));
				// console.log('productData.stock_quantity = ' + productData.stock_quantity);

				// If the quantity requested by the user is in stock
				if (quantity <= productData.stock_quantity) {
					console.log(colors.green('\nCongratulations, the product you requested is in stock!'));

					// Construct the updating query string
					var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
					// console.log('updateQueryStr = ' + updateQueryStr);

					// Update the inventory
					connection.query(updateQueryStr, function(err, data) {
						if (err) throw err;

						console.log(colors.yellow('\nYour order has been placed! Your total is $' + productData.price * quantity));
						console.log(colors.yellow('Thank you for shopping with us!'));
						console.log("\n---------------------------------------------------------------------\n");

						inquirer.prompt([
							{
								type: 'list',
								name: 'continue',
								message: 'Would you like to make another purchase?',
								choices: ['Yes', 'No, exit app'],
							}
						]).then(function(answer) {
							if (answer.continue ==='Yes') {
								setTimeout(promptPurchase, 500);	
							} else {
								console.log(colors.yellow("\nThank you for using BAMazon. We're going to put Walmart out of business! \nCome again!\n"));												
								connection.end();
							}
						});
					})
				} else {
					console.log(colors.red('\nSorry, there is not enough product in stock, your order cannot be placed as is.\nPlease modify your order.'));
					console.log("\n---------------------------------------------------------------------\n");

					setTimeout(promptPurchase, 4000);
				}
			}
		})
	})
}

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

	  	console.log("---------------------------------------------------------------------\n");
		  inquirer.prompt([
			{
				type: 'list',
				name: 'continue',
				message: 'Would you like to purchase an item?',
				choices: ['Yes', 'No, exit app'],
			}
		]).then(function(answer) {
			if (answer.continue ==='Yes') {
				setTimeout(promptPurchase, 500);	
			} else {
				console.log(colors.yellow("\nThank you for using BAMazon. We're going to put Walmart out of business! \nCome again!\n"));												
				connection.end();
			}
		});
	})
}


