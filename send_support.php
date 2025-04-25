<?php
$host = 'localhost';
$user = 'uymwldwk4tn5s';
$password = 'magic8ball';
$database = 'dbvjrlf3z5gc3a';

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$message = $_POST['message'] ?? '';

$stmt = $conn->prepare("INSERT INTO support_messages (name, email, message) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $message);
$stmt->execute();
$stmt->close();
$conn->close();

echo "<p style='text-align:center;'>Thank you! Your message has been received.</p>";
?>
