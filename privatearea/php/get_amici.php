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

$query ="SELECT u.username, u.nome, u.cognome, u.email
          FROM amicizia a 
          INNER JOIN users u ON a.destinatario = u.username 
          WHERE a.mittente = $1";

$result = pg_query_params($conn, $query, [$currentUser]);

$amici = [];
while ($row = pg_fetch_assoc($result)) {
    $amici[] = [
        'username' => $row['username'],
        'nome' => $row['nome'],
        'cognome' => $row['cognome'],
        'email' => $row['email']
    ];
    
}

echo json_encode($amici);
?>
