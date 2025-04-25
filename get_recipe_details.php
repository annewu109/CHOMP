<?php
header('Content-Type: application/json');

if (!isset($_GET['meal_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'meal_id parameter is required']);
    exit;
}

$mealId = $_GET['meal_id'];

$servername = "localhost";
$username = 'uuvxmvote8rbz';
$password = 'greatGrandma123';
$dbname = 'dbi1snsabxqwti';

$conn = new mysqli($servername, $username, $password);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$conn->select_db($dbname);

$stmt = $conn->prepare("SELECT * FROM Meals WHERE meal_id = ?");
$stmt->bind_param("i", $mealId);
$stmt->execute();
$result = $stmt->get_result();
$meal = $result->fetch_assoc();

if (!$meal) {
    http_response_code(404);
    echo json_encode(['error' => 'Meal not found']);
    exit;
}

$stmt = $conn->prepare("
    SELECT i.name, i.unit, i.calories_per_unit, mi.quantity_required 
    FROM MealIngredients mi
    JOIN Ingredients i ON mi.ingredient_id = i.ingredient_id
    WHERE mi.meal_id = ?
");
$stmt->bind_param("i", $mealId);
$stmt->execute();
$result = $stmt->get_result();

$ingredients = [];
while ($row = $result->fetch_assoc()) {
    $ingredients[] = $row;
}

echo json_encode([
    'meal' => $meal,
    'ingredients' => $ingredients
]);

$conn->close();
?>
