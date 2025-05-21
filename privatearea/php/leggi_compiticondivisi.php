<?php
    require 'db_connect.php';
    header('Content-Type: application/json');

    // recuperiamo lo username
    session_start();
    if (!isset($_SESSION['username'])) {
        echo json_encode(['error' => 'Utente non autenticato']);
        exit;
    }

    $currentUser = $_SESSION['username'];
    // prendiamo i compiti condivisi con user
    try {
        $query = "SELECT c.id, c.titolo, c.descrizione, c.scadenza, c.utente, cc.data
                FROM compiti c
                JOIN compitiCondivisi cc ON c.id = cc.id
                WHERE cc.amico = $1
                ORDER BY c.scadenza ASC";
        
        $result = pg_query_params($conn, $query, [$currentUser]);
        
        $tasks = [];
        while ($row = pg_fetch_assoc($result)) {
            $tasks[] = $row;
        }
        // ritorniamo i compiti in formato JSON
        echo json_encode($tasks);
        
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    pg_close($conn);
?>