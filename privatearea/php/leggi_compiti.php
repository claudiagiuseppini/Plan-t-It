<?php
session_start();
header("Content-Type: application/json");
header("Cache-Control: no-cache, must-revalidate");

$username = strval(isset($_SESSION['username']) ? $_SESSION['username'] : null);
if ($username === null) {
    http_response_code(401);
    echo json_encode(["error" => "Utente non autenticato"]);
    exit;
}


// Connessione al DB PostgreSQL
$conn = pg_connect("host=localhost dbname=plant user=postgres password=biar");

if (!$conn) {
    http_response_code(500);
    echo json_encode(["errore" => "Connessione fallita"]);
    exit;
}

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
} finally {
    pg_close($conn);
}
?>