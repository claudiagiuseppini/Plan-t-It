<?php
    require 'db_connect.php';
    header('Content-Type: application/json');

    // recupero lo username
    session_start();
    if (!isset($_SESSION['username'])) {
        echo json_encode(['success' => false, 'message' => 'Utente non autenticato']);
        exit;
    }
    $currentUser = $_SESSION['username'];


    // prendiamo le richieste in arrivo
    $query="SELECT r.mittente
            FROM richiestaAmicizia r
            WHERE r.destinatario = $1 AND r.status= 'attesa' ";

    $result= pg_query_params($conn, $query, [$currentUser]);
    $pendingRequest= [];
    while ($row= pg_fetch_assoc($result)){
        $pendingRequest[] = ['mittente' => $row['mittente']];
    }
    // riformattiamo la risposta in formato JSON
    echo json_encode($pendingRequest);
    pg_close($conn);
?>