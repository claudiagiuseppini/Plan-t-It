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

$data = json_decode(file_get_contents('php://input'), true);
$destinatario = $data['friendUsername'];

if (empty($destinatario)) {
    echo json_encode(['success' => false, 'message' => 'Username non valido']);
    exit;
}

// Controlla se l'utente esiste
$queryUtenteEsistente= "SELECT username FROM users WHERE username= $1";
$resultUtenteEsistente= pg_query_params($conn, $queryUtenteEsistente, [$destinatario]);

if (!$resultUtenteEsistente) {
    echo json_encode(['success' => false, 'message' => 'Errore nella query di verifica utente']);
    exit;
}

if (pg_num_rows($resultUtenteEsistente) === 0) {
    echo json_encode(['success' => false, 'message' => 'Utente non trovato']);
    exit;
}

// Verifica che la richiesta non esista già
$queryRichiestaEsistente = "SELECT * FROM richiestaAmicizia WHERE mittente = $1 AND destinatario = $2";
$resultRichiestaEsistente = pg_query_params($conn, $queryRichiestaEsistente, [$currentUser, $destinatario]);

if (!$resultRichiestaEsistente) {
    echo json_encode(['success' => false, 'message' => 'Errore nella query di verifica richiesta']);
    exit;
}

if (pg_num_rows($resultRichiestaEsistente) > 0) {
    echo json_encode(['success' => false, 'message' => 'Richiesta già inviata']);
    exit;
}


// Inserisci la nuova richiesta
$queryInserisciRichiesta = "INSERT INTO richiestaAmicizia (mittente, destinatario, status) VALUES ($1, $2, 'attesa')";
$resultInserisciRichiesta = pg_query_params($conn, $queryInserisciRichiesta, [$currentUser, $destinatario]);

if ($resultInserisciRichiesta) {
    echo json_encode(['success' => true, 'message' => 'Richiesta di amicizia inviata']);
} else {
    echo json_encode(['success' => false, 'message' => 'Errore durante l\'invio della richiesta']);
}

?>