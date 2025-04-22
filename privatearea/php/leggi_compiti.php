<?php
header("Content-Type: application/json");

// Connessione al DB PostgreSQL
$conn = pg_connect("host=localhost dbname=plant user=postgres password=biar");

if (!$conn) {
    echo json_encode(["errore" => "Connessione fallita"]);
    exit;
}

// Prendi tutti i compiti ordinati per scadenza
$result = pg_query($conn, "SELECT * FROM compiti ORDER BY scadenza ASC ");

$compiti = [];
while ($row = pg_fetch_assoc($result)) {
    $compiti[] = $row;
}


// Ritorna i compiti in formato JSON
echo json_encode($compiti);
?>
