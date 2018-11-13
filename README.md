# bamazon

# cli_inventory

1. Introduction
Welcome to the CLI inventory app! This app is merely a lightweight, proof of concept Node app that works with a MySQL database. Not only does it simulate an app that allows users to "buy" from the inventory, but it has another Manager interface that allows users to manage the inventory in their system.

2. Features

bamazonCustomer.js is just a simple "buy" interface.

    1) When the user starts the application, they will be first displayed all products that are currently for sale (via the database)

    2) They have the option to "buy" an item by entering its product ID

    3) Then, they will be asked the quantity of the item in question.

    4) The total will be calculated and displayed to the user

bamazonManager.js is a bit more robust, allowing the user to complete several tasks.

    1) "View Products for Sale" - Allows the user to see all of the products in the system that are available for sale.

    2) "View Low Inventory" - Allows the user to see all products that have a stock level BELOW 5.

    3) "Add to Inventory" - Allows the user to add an amount to the stock of an EXISTING product.

    4) "Add New Product" - Allows the user to create an entirely new product with stock levels


    
