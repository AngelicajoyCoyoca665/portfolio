<?php
/**
 * config.php
 * ----------
 * Database connection settings.
 * Update these four values to match your local MySQL setup
 * (for example, when using XAMPP/WAMP/MAMP the defaults below
 * usually work out of the box).
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'portfolio_db');
define('DB_USER', 'root');
define('DB_PASS', '');

/**
 * Returns a mysqli connection, or stops the script with a
 * JSON error response if the connection fails.
 */
function getConnection(): mysqli {
    mysqli_report(MYSQLI_REPORT_OFF); // we handle errors ourselves

    $conn = @new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if ($conn->connect_error) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed. Please check php/config.php and make sure the database has been imported.'
        ]);
        exit;
    }

    $conn->set_charset('utf8mb4');
    return $conn;
}
