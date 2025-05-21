<?php
require 'db_connect.php';
header('Content-Type: application/json');
// recupero lo username
session_start();
if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'message' => 'Utente non autenticato']);
    exit;
}
// prendo i dati in formato JSON
$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['sender']) || !isset($data['status'])) {
    echo json_encode(['success' => false, 'message' => 'Dati mancanti']);
    exit;
}
// salvo in mittente, status e utente corrente(destinatario)
$sender = pg_escape_string($conn, $data['sender']);
$status = pg_escape_string($conn, $data['status']);
$currentUser = $_SESSION['username'];

//verifichiamo prima che la richiesta esista e sta in attesa
$checkQuery = "SELECT 1 FROM richiestaAmicizia 
               WHERE mittente = $1 AND destinatario = $2 AND status = 'attesa'";
$checkResult = pg_query_params($conn, $checkQuery, [$sender, $currentUser]);

// se non ci sono risultati
if (!$checkResult || pg_num_rows($checkResult) === 0) {
    echo json_encode(['success' => false, 'message' => 'Richiesta non trovata o già elaborata']);
    exit;
}

// ho bisogno di fare una serie di istruzioni senza interruzione
// transazione
pg_query($conn, "BEGIN");

try {
//    cambio lo status della richiesta amicizia
    $updateQuery = "UPDATE richiestaAmicizia 
                   SET status = $1 
                   WHERE mittente = $2 AND destinatario = $3 AND status = 'attesa'";
    $updateResult = pg_query_params($conn, $updateQuery, [$status, $sender, $currentUser]);
// controllo che sia andata a buon fine
    if (!$updateResult || pg_affected_rows($updateResult) === 0) {
        throw new Exception('Aggiornamento fallito');
    }

    // se accettata aggiungiamo l'amicizia
    if ($status === 'accettata') {
        
        $addFriendQuery = "INSERT INTO amicizia (mittente, destinatario) VALUES ($1, $2)";
        $friendResult = pg_query_params($conn, $addFriendQuery, [$sender, $currentUser]);
        // controllo che sia stata agiunta al DB
        if (!$friendResult) {
            throw new Exception('Creazione amicizia fallita');
        }
    }
// chiudo la transazione
    pg_query($conn, "COMMIT");
    echo json_encode(['success' => true]);
    
} catch (Exception $e) {
    // in caso di errori annulla tutto
    pg_query($conn, "ROLLBACK");
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>