var mysql = require("mysql");
var inquirer = require("inquirer");

var idChoice;
var quantityChoice;
var dataQuantity;

//connection setup
var connection = mysql.createConnection({
  host: "localhost",

  port: 8080,

  user: "root",

  
  password: "",
  database: "bamazon"
});

//initial connection code
connection.connect(function(err){
    if (err) throw (err);
    console.log("Connected! Connection ID:" + connection.threadId + "\n");
    mainMenu();
});

//first menu starting the app
function mainMenu(){
    inquirer.prompt({
        name: "menuChoice",
        type: "confirm",
        message: "Welcome to Bamazon shopping! Would you like to see the products?"
    }).then(function(answer) {
        //determines moves onto the inventory menu or exiting the app
        if (answer.menuChoice === true){
            displayInventory();
        } else {
            console.log("Come visit us again soon!");
            connection.end();
        }
    });
}

//this handles the prompt and stores the user's purchase options in global variables
function buyProduct(){
    inquirer.prompt({
        name: "buyChoice",
        type: "input",
        message: "Which product would you like to buy? (Please use product ID)"
    }).then(function(answer) {
        idChoice = answer.buyChoice;
        inquirer.prompt({
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?"
        }).then(function(quantityAns){
            quantityChoice = parseInt(quantityAns.quantity);
            checkProduct();
        })
    });
}

//this checks the product inventory choice against what the user input
function checkProduct(){
    var query = "SELECT * FROM products WHERE ?"
    connection.query(query, {item_id: idChoice}, function (err, res){
        if (err) throw (err)
        dataQuantity = parseInt(res[0].stock_quantity)
         if (dataQuantity >= quantityChoice){
             // determines the total price of the purchase
            var price = quantityChoice * res[0].price;
             console.log("You have successfully purchased " + quantityChoice + " of the product " + res[0].product_name);
             console.log("Your purchase total is $" + price)
             stockUpdate();
         } else {
             console.log("I'm sorry, we don't have enough stock of the specified product to complete this transaction. \n Returning to main menu!")
             mainMenu();
         }
    })
}

//updates the quantity of each stock item
function stockUpdate(){
    var newQuantity = dataQuantity - quantityChoice;
    var query = "UPDATE products SET ? WHERE ?"
    connection.query(query,[
        {
            stock_quantity: newQuantity
        },
        {
            item_id: idChoice
        }
        ],
        function(err, res){
            console.log("Returning to Main Menu!");
            mainMenu();
        }
    )
}

//displays the entire inventory for the customer
function displayInventory(){
    var query = "SELECT * FROM products"
    connection.query(query, function(err, res){
        if (err) throw (err);
        for (i = 0; i < res.length; i++){
             console.log("Product: " + res[i].product_name);
             console.log("Price: $" + res[i].price)
             console.log("Product ID: " + res[i].item_id);
             console.log("*===============================================*")
         };
         buyProduct();
     })
    
}

 