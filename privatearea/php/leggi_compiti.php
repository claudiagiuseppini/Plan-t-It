<?php
header("Content-Type: application/json");
header("Cache-Control: no-cache, must-revalidate");

// Connessione al DB PostgreSQL
$conn = pg_connect("host=localhost dbname=plant user=postgres password=biar");

if (!$conn) {
    http_response_code(500);
    echo json_encode(["errore" => "Connessione fallita"]);
    exit;
}

// Prendi tutti i compiti ordinati per scadenza
try {
    $result = pg_query($conn, "SELECT * FROM compiti WHERE utente = 'Mario' ORDER BY scadenza ASC");
    if (!$result) {
        throw new Exception(pg_last_error($conn));
    }

    $compiti = [];
    while ($row = pg_fetch_assoc($result)) {
        $compiti[] = $row;
    }


// Ritorna i compiti in formato JSON
    echo json_encode($compiti);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
} finally {
    pg_close($conn);
}
?>