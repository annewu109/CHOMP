<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = 'uuvxmvote8rbz';
$password = 'greatGrandma123';
$dbname = 'dbi1snsabxqwti';

$conn = new mysqli($servername, $username, $password);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$conn->select_db($dbname);

$sql = "SELECT * FROM Meals";
$result = $conn->query($sql);

if ($result === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Database query error: ' . $conn->error]);
    exit;
}

$meals = [];
while ($row = $result->fetch_assoc()) {
    $meals[] = $row;
}

echo json_encode($meals);

$conn->close();
?>
