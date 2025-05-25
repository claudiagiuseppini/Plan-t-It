<?php
    require 'db_connect.php';
    header("Content-Type: application/json");

    // recupero lo username
    session_start();
    if (!isset($_SESSION['username'])) {
        echo json_encode(['success' => false, 'message' => 'Utente non autenticato']);
        exit;
    }

    // prendo come input l'id del compito
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;

    // controllo il valore id 
    if (!$id || !is_numeric($id)) {
        echo json_encode(["successo" => false, "errore" => "ID compito non valido"]);
        exit;
    }

    // controlliamo che lo user sia il proprietario
    $query = "SELECT utente FROM compiti WHERE id = $1 ";
    $result = pg_query_params($conn, $query, [$id]); 

    if ($result && pg_num_rows($result) > 0) {
        $row = pg_fetch_assoc($result);
        $utente=$row['utente']; 
        // se utente non è proprietario lo togliamo dai compiti condivisi
        if ($utente != $_SESSION['username']){

            $query = "DELETE FROM compitiCondivisi WHERE id = $1 AND amico = $2 ";
            $result = pg_query_params($conn, $query, [$id, $_SESSION['username']]); 

            if (!$result) {
                echo json_encode(["successo" => false, "errore" => pg_last_error($conn)]);
                exit;
            }

        }else {
            //se sono il proprietario elimino dal db
            $query = "DELETE FROM compiti WHERE id = $1 ";
            $result = pg_query_params($conn, $query, [$id]); 

            if (!$result) {
                echo json_encode(["successo" => false, "errore" => pg_last_error($conn)]);
                exit;
            }
        }
        if ($result == false) {
        echo json_encode(["errore" => "il compito non è stato aggiunto correttamente"]);
        } 
        $rows_affected = pg_affected_rows($result);

        if ($rows_affected === 0) {
            echo json_encode(["successo" => false, "errore" => "Compito non trovato o non hai i permessi"]);
        } else {
            echo json_encode(["successo" => true]);
        }
    
    } else {
        echo json_encode(["errore" => "Compito non trovato"]);
    }


    pg_close($conn);
?>