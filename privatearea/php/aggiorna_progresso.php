<?php
session_start();

// connessione al DB
$conn = pg_connect("host=localhost dbname=plant user=postgres password=biar");

if (!$conn) {
    http_response_code(500);
    echo json_encode(["error" => "Errore di connessione al database"]);
    exit;
}

// recupero lo username dalla sessione
$username = isset($_SESSION['username']) ? $_SESSION['username'] : null;

if ($username === null) {
    http_response_code(401);
    echo json_encode(["error" => "Utente non autenticato"]);
    exit;
}

// recupero id e progresso del compito
$compito_id = $_POST['id'] ?? null;
$progresso = $_POST['progresso'] ?? null;


//compongo la query
$query = "UPDATE compiti SET progresso = $1 WHERE id = $2 AND utente = $3";

$result = pg_query_params($conn, $query, [
    $progresso,
    $compito_id,
    $username
]);

if ($result) {
    echo json_encode(["success" => true, "progresso" => $progresso]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Errore nell'aggiornamento del progresso"]);
}
?>
