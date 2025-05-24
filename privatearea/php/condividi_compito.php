<?php
    require 'db_connect.php';
    header('Content-Type: application/json');

    session_start();
    // recuperiamo lo username della sessione
    if (!isset($_SESSION['username'])) {
        echo json_encode(['success' => false, 'message' => 'Non autenticato']);
        exit;
    }
    // prendiamo e scomponiamo i file dal formato JSON
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['taskId']) || !isset($data['amicoUsername'])) {
        echo json_encode(['success' => false, 'message' => 'Dati mancanti']);
        exit;
    }

    try {
        $currentUser = $_SESSION['username'];
        $taskId = $data['taskId'];
        $amicoUsername = $data['amicoUsername'];

        //verifichiamo che sia il proprietario della task
        $verifyQuery = "SELECT 1 FROM compiti WHERE id = $1 AND utente = $2";
        $verifyResult = pg_query_params($conn, $verifyQuery, [$taskId, $currentUser]);

        if ($checkSharedResult && pg_num_rows($checkSharedResult) > 0) {
            echo json_encode(['success' => false, 'message' => 'Non sei proprietario di questo compito']);
            exit;
        }
        


        //verifichiamo che non sia stata già condivisa
        $checkSharedQuery = "SELECT 1 FROM compitiCondivisi WHERE id = $1 AND amico = $2";
        $checkSharedResult = pg_query_params($conn, $checkSharedQuery, [$taskId, $amicoUsername]);
        
        if ($checkSharedResult && pg_num_rows($checkSharedResult) > 0) {
            echo json_encode(['success' => false, 'message' => 'Compito già condiviso con questo amico']);
            exit;
        }
        

        //inseriamo
        $insertQuery = "INSERT INTO compitiCondivisi (id, amico) VALUES ($1, $2)";
        $insertResult = pg_query_params($conn, $insertQuery, [$taskId, $amicoUsername]);

        if (!$insertResult) {
            throw new Exception('Errore database: ' . pg_last_error($conn));
        }

        echo json_encode(['success' => true, 'message' => 'Compito condiviso con successo']);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    pg_close($conn);
?>