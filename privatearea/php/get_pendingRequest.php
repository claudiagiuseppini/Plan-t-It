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

$query="SELECT r.destinatario
        FROM richiestaAmicizia r
        WHERE r.mittente = $1 AND r.status= 'attesa' ";

$result= pg_query_params($conn, $query, [$currentUser]);
$pendingRequest= [];
while ($row= pg_fetch_assoc($result)){
    $pendingRequest[] = ['destinatario' => $row['destinatario']];
}
echo json_encode($pendingRequest);
?>