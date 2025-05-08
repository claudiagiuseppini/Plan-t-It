<?php
header("Content-Type: application/json");

//connessione al DB
$conn = pg_connect("host=localhost dbname=plant user=postgres password=biar");
if (!$conn) {
    echo json_encode(["successo" => false, "errore" => "Connessione al database fallita"]);
    exit;
}

// prendo come input l'id del compito
$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? null;

// // controllo il valore id 
// if (!$id || !is_numeric($id)) {
//     echo json_encode(["successo" => false, "errore" => "ID compito non valido"]);
//     exit;
// }

// elimino dal db
$query = "DELETE FROM compiti WHERE id = $1 ";
$result = pg_query_params($conn, $query, [$id]); 

if (!$result) {
    echo json_encode(["successo" => false, "errore" => pg_last_error($conn)]);
    exit;
}

$rows_affected = pg_affected_rows($result);

if ($rows_affected === 0) {
    echo json_encode(["successo" => false, "errore" => "Compito non trovato o non hai i permessi"]);
} else {
    echo json_encode(["successo" => true]);
}

pg_close($conn);
?>