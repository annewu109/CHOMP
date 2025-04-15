<!-- Kaelen’s database  (meals and ingredients)
[    Database name: dbi1snsabxqwti (chomp_db)   ]
[    User: uuvxmvote8rbz (store_user)  |  Password: greatGrandma123  ]
-- Ingredients --
KEY: ingredient_id
name
unit
price_per_unit
calories_per_unit
in_stock

-- Meals --
meal_id
name
description
image_url
recipe
total_calories

-- Meal Ingredients: junction table that connects meals to ingredients --
meal_id
ingredient_id
quantity_required -->

<?php
$servername = "localhost";
$username = "uuvxmvote8rbz";
$password = "greatGrandma123";
$dbname = "dbi1snsabxqwti";

// Connect to database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check for errors
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->close();
?>