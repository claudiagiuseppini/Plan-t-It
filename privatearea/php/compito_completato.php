<?php
require 'db_connect.php';
header('Content-Type: application/json');

//recuperiamo l'id del compito e troviamo la riga corrispondente nella tabella compiti
$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? null;

// prendiamo il compito e i suoi parametri
$query = "SELECT id, utente, titolo, priorita, scadenza FROM compiti WHERE id = $1 ";
$result = pg_query_params($conn, $query, [$id]);

if ($result && pg_num_rows($result) > 0) {
    $row = pg_fetch_assoc($result);
    $id=$row['id']; 
    $utente=$row['utente']; 
    $titolo=$row['titolo'];
    $priorita=$row['priorita'];
    $scadenza=$row['scadenza'];
// inseriamo il compito in compiti completati
    $query = "INSERT into compitiCompletati (id, utente, titolo, priorita, scadenza) values ($1, $2, $3, $4, $5)";
    $result = pg_query_params($conn, $query, [$id, $utente, $titolo, $priorita, $scadenza]);

    if ($result == false) {
    echo json_encode(["errore" => "il compito non è stato aggiunto correttamente"]);
    } else {
    echo json_encode(["successo" => "il compito è stato inserito correttamente"]);
    }
   
} else {
    echo json_encode(["errore" => "Compito non trovato"]);
}



pg_close($conn);

?>