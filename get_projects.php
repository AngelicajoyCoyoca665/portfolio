<?php
/**
 * get_projects.php
 * ----------------
 * Fetches all projects from the database, ordered for display,
 * and returns them as a JSON array for the front-end to render.
 */

header('Content-Type: application/json');
require_once __DIR__ . '/config.php';

$conn = getConnection();

$sql = "SELECT id, title, description, image_url, tech_stack, live_url, code_url
        FROM projects
        ORDER BY sort_order ASC, id ASC";

$result = $conn->query($sql);

$projects = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $projects[] = $row;
    }
}

echo json_encode($projects);

$conn->close();
