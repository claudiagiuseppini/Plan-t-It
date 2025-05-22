<?php
require 'db_connect.php';
header('Content-Type: application/json');

session_start();
$currentUser = strval(isset($_SESSION['username']) ? $_SESSION['username'] : null);
if ($currentUser === null) {
    http_response_code(401);
    echo json_encode(["error" => "Utente non autenticato"]);
    exit;
}

$query= "SELECT username, nome, cognome, email FROM users WHERE username=$1";
$result= pg_query_params ($conn, $query,[$currentUser]);

if (!$result) {
    http_response_code(500);
    echo json_encode(["error" => "Errore nella query al database"]);
    exit;
}

// Controlla se l'utente è stato trovato
if (pg_num_rows($result) === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Utente non trovato"]);
    exit;
}

// Estrai i dati dell'utente
$user = pg_fetch_assoc($result);

// Invia i dati in formato JSON
echo json_encode($user);

?>