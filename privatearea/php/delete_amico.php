<?php
//File php per l'eliminazione di un amico
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
$friendUsername = trim($data['username'] ?? '');

if ($friendUsername === '') {
    echo json_encode(['success' => false, 'message' => 'Username amico mancante']);
    exit;
}

// Elimina l'amicizia (mittente = utente corrente, destinatario = amico)
$query = "DELETE FROM amicizia WHERE (mittente = $1 AND destinatario = $2) OR (mittente = $2 AND destinatario = $1) ";
$result = pg_query_params($conn, $query, [$currentUser, $friendUsername]);

// Elimina la richiesta di amicizia
$query1 = "DELETE FROM richiestaAmicizia WHERE (mittente = $1 AND destinatario = $2) OR (mittente = $2 AND destinatario = $1)";
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