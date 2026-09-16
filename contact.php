<?php
/**
 * contact.php
 * -----------
 * Receives the contact form data (sent as JSON via fetch()),
 * validates it on the server, and stores it in the
 * `contact_messages` table.
 */

header('Content-Type: application/json');
require_once __DIR__ . '/config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Read the JSON body sent by script.js
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

// Honeypot check: real visitors never fill this hidden field in.
// If it has a value, silently pretend success so bots move on.
if (!empty($input['website'])) {
    echo json_encode(['success' => true, 'message' => 'Message sent — thank you!']);
    exit;
}

// Collect and sanitize input
$name    = trim($input['name'] ?? '');
$email   = trim($input['email'] ?? '');
$subject = trim($input['subject'] ?? '');
$message = trim($input['message'] ?? '');

// Server-side validation (never trust the client alone)
$errors = [];

if (mb_strlen($name) < 2) {
    $errors[] = 'Please enter your name.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}
if (mb_strlen($message) < 10) {
    $errors[] = 'Your message should be at least 10 characters.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// Save to the database using a prepared statement (prevents SQL injection)
$conn = getConnection();

$stmt = $conn->prepare(
    "INSERT INTO contact_messages (name, email, subject, message, created_at)
     VALUES (?, ?, ?, ?, NOW())"
);
$stmt->bind_param('ssss', $name, $email, $subject, $message);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => "Thanks, $name! Your message has been sent."]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not save your message. Please try again later.']);
}

$stmt->close();
$conn->close();
