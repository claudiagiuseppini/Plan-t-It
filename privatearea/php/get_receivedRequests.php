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
// prendiamo le richieste in arrivo
$query="SELECT r.mittente
        FROM richiestaAmicizia r
        WHERE r.destinatario = $1 AND r.status= 'attesa' ";

$result= pg_query_params($conn, $query, [$currentUser]);
$pendingRequest= [];
while ($row= pg_fetch_assoc($result)){
    $pendingRequest[] = ['mittente' => $row['mittente']];
}
echo json_encode($pendingRequest);
?>