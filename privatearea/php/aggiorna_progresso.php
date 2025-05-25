<?php
session_start();

// connessione al DB
require 'db_connect.php';

// recupero id e progresso del compito
$compito_id = $_POST['id'] ?? null;
$progresso = $_POST['progresso'] ?? null;


//compongo la query
$query = "UPDATE compiti SET progresso = $1 WHERE id = $2";

$result = pg_query_params($conn, $query, [
    $progresso,
    $compito_id
]);

if ($result) {
    echo json_encode(["success" => true, "progresso" => $progresso]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Errore nell'aggiornamento del progresso"]);
}
?>
