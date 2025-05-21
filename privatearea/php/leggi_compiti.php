<?php
    require 'db_connect.php';
    header("Content-Type: application/json");
    header("Cache-Control: no-cache, must-revalidate");

    session_start();
    if (!isset($_SESSION['username'])) {
                echo json_encode(['success' => false, 'message' => 'Utente non autenticato']);
        exit;
    }

    $username = $_SESSION['username'];
    

// Prendi tutti i compiti ordinati per scadenza
try {
    $query = "SELECT * FROM compiti WHERE utente = $1 ORDER BY scadenza ASC";

    $result = pg_query_params($conn, $query, array($username));
    
    if (!$result) {
        http_response_code(500);
        echo json_encode(["error" => pg_last_error($conn)]);
        pg_close($conn);
        exit;
    }
    
    $compiti = [];
    while ($row = pg_fetch_assoc($result)) {
        $compiti[] = $row;
    }
    
    echo json_encode($compiti);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
} 
pg_close($conn);

?>