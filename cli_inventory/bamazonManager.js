var mysql = require("mysql");
var inquirer = require("inquirer");

//connection setup
var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "root",
  database: "bamazon"
});

//initial connection code(and starting point)
connection.connect(function(err){
    if (err) throw (err);
    console.log("Connected! Connection ID:" + connection.threadId + "\n");
    mainMenu();
});

//this function handles the prompts given to the user on the main menu, calls their respective functions
function mainMenu(){
    inquirer.prompt({
        name: "menuChoice",
        type: "rawlist",
        message: "Welcome to the Bamazon Management View! Please make a selection below. \n",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Exit Program"
        ]
    //determines if the user moves onto the inventory menu or exiting the app
    }).then(function(answer) {
        if (answer.menuChoice === "View Products for Sale"){
            viewProducts();
        } else if (answer.menuChoice === "View Low Inventory"){
            viewLow();
        } else if (answer.menuChoice === "Add to Inventory"){
            addInventory();
        } else if (answer.menuChoice === "Add New Product"){
            addProduct();
        } else {
            console.log("Logging out");
            connection.end();
        }
    })
}

//this handles the view products selection from the main menu, all products displayed to user
function viewProducts() {
    var query = "SELECT * FROM products"
    connection.query(query, function(err, res){
        if (err) throw (err);
        console.log("PRODUCTS:  \n\n");
        console.log("**********************************")
        for (i = 0; i < res.length; i++){
             console.log("Product: " + res[i].product_name);
             console.log("Department: " + res[i].department_name);
             console.log("Price: $" + res[i].price);
             console.log("Product ID: " + res[i].item_id);
             console.log("Stock: " + res[i].stock_quantity)
             console.log("**********************************");
         };
         continueConfirm();
    })
}

function addProduct() {
    var nameInput;
    var stockInput;
    var departmentInput;
    var priceInput;

    inquirer.prompt({
        name: "nameInput",
        type: "input",
        message: "What is the name of the product you would like to add?"
    }).then(function(answer){
        nameInput = answer.nameInput;

        inquirer.prompt({
            name: "priceInput",
            type: "input",
            message: "What is the price of the product you would like to add?"
        }).then(function(answer){
            priceInput = answer.priceInput;
            inquirer.prompt({
                name: "stockInput",
                type: "input",
                message: "How much stock of the new item do you have?"
            }).then(function(answer){
                stockInput = answer.stockInput;
                inquirer.prompt({
                    name: "departmentInput",
                    type: "input",
                    message: "What is the department of the product you would like to add?"
                }).then(function(answer){
                    departmentInput = answer.departmentInput;
                    console.log("PREPARED FOR ENTRY, CONFIRM INFORMATION");
                    console.log(" Product Name: " + nameInput + "\n Product Price: " + priceInput + "\n Stock: " + stockInput + "\n Department: " + departmentInput)
                    inquirer.prompt({
                        name: "checkWork",
                        type: "confirm",
                        message: "Is the above information correct?"
                    }).then(function(answer){
                        if (answer.checkWork === true){
                            var query = "INSERT INTO products SET ?"
                            connection.query(query, 
                                {
                                    product_name: nameInput,
                                    price: priceInput,
                                    stock_quantity: stockInput,
                                    department_name: departmentInput
                                }, function(err, res){
                                    if (err) throw (err)
                                    console.log("Product successfully added to database")
                                    continueConfirm();
                                })
                        } else if (answer.checkWork === false) {
                            console.log("Aborting, returning to main menu")
                            continueConfirm();
                        }
                    })
                })
            })
        })
    })
}

//this function checks the database for all products with under 5 left
function viewLow(){
    var query = "SELECT * FROM products WHERE stock_quantity BETWEEN 0 AND 4"
    connection.query(query, function(err, res){
        if (err) throw (err);
        console.log("LOW INVENTORY: \n\n");
        console.log("**********************************");

        for (i = 0; i < res.length; i++){
            console.log("Product: " + res[i].product_name);
            console.log("Product ID: " + res[i].item_id);
            console.log("Stock: " + res[i].stock_quantity);
            console.log("**********************************")
        }
        continueConfirm();
    })
}

//this function handles all additions to the inventory
function addInventory() {
    inquirer.prompt({
        name: "item_id",
        type: "input",
        message: "Please enter the item ID you would like to inventory to \n"
    }).then(function(answer){
        var idInput = answer.item_id;
        inquirer.prompt({
            name: "quantity",
            type: "input",
            message: "How many pieces of inventory are being added to the system?"
        }).then(function(ans){
            var quantityInput = ans.quantity;
            var query = "UPDATE products SET stock_quantity = (stock_quantity + " + quantityInput + ") WHERE ?"
            connection.query(query, {item_id: idInput},function(err, res){
                    if (err) throw (err)
                    console.log(quantityInput + " pieces of inventory have been added to item ID " + idInput)
                    continueConfirm();
                })
        })
    })
}

//this is called after a command is issued, prompting the user for when they are ready to return to main menu
function continueConfirm(){
    inquirer.prompt({
        name: "continue",
        type: "input",
        message: "(Press Enter to Return to Main Menu)"
    }).then(function(){
        mainMenu();
    })
}