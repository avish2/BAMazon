# BAMazon

BAMazon is a MySQL based Node.js app that accesses data on a MySQL server and displays the information using JavaScript and Node. The app is used as a contrived example of a store website that contains multiple departments, items and corresponding prices and quantities. There are two ways to run the BAMazon app, either from the Customer Side or the Manager Side. 

### Customer Interaction

The Customer Side of BAMazon displays a list of items in stock and allows the customer to choose one or more for purchase. If the user is finished making purchases, the app closes.

To run the Customer Side of the app please follow the steps below:

	git clone git@github.com:amvish2/BAMazon.git
	cd BAMazon
	npm install
	node bamazonCustomer.js



### Manager Interaction

The Manager Side of BAMazon gives the user the option to view invetory, view low invetory, add to invetory and add new products all while staying within the app. The user exits when he/she is finished editing and viewing the inventory.

To run the Manager Side of this application before running the customer side, please follow the steps below:
	
    git clone git@github.com:amvish2/BAMazon.git
	cd BAMazon
	npm install
	node bamazonManager.js

If you have already run the customer side, you can run the manager side by simply typing the below line into bash:

	node bamazonManager.js

### BAMazon Demo

You can view a narrated video recording of the app in use at the below link. 

[YouTube Demo](https://youtu.be/jhSJz-AC0GU)