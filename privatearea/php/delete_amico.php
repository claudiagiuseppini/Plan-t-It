<?php
require 'db_connect.php';
header('Content-Type: application/json');

session_start();
//$currentUser = $_SESSION['username'];
$currentUser = "Mario";
$data = json_decode(file_get_contents('php://input'), true);
$friendUsername = trim($data['username'] ?? '');

if ($friendUsername === '') {
    echo json_encode(['success' => false, 'message' => 'Username amico mancante']);
    exit;
}

// Elimina l'amicizia (mittente = utente corrente, destinatario = amico)
$query = "DELETE FROM amicizia WHERE mittente = $1 AND destinatario = $2";
$result = pg_query_params($conn, $query, [$currentUser, $friendUsername]);

// Elimina la richiesta di amicizia
$query1 = "DELETE FROM richiestaAmicizia WHERE mittente = $1 AND destinatario = $2";
$result1 = pg_query_params($conn, $query1, [$currentUser, $friendUsername]);

// Controllo esito
$successAmicizia = ($result && pg_affected_rows($result) > 0);
$successRichiesta = ($result1 && pg_affected_rows($result1) > 0);

if ($successAmicizia || $successRichiesta) {
    echo json_encode(['success' => true, 'message' => 'Amico eliminato con successo']);
} else {
    echo json_encode(['success' => false, 'message' => 'Errore durante l\'eliminazione o amico non trovato']);
}
?>