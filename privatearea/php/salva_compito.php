<?php
    require 'db_connect.php';
    header('Content-Type: application/json');

    // recuperiamo lo username
    session_start();
    if (!isset($_SESSION['username'])) {
        echo json_encode(['error' => 'Utente non autenticato']);
        exit;
    }
    $username = $_SESSION['username'];


    // Leggi i dati dal form
    $titolo = $_POST['titolo'];
    $descrizione = $_POST['descrizione'];
    $priorita = $_POST['priorità'];
    $scadenza = $_POST['scadenza'] ?: null;//opzionale
    $orario = $_POST['orario'] ?: null;  // opzionale

    // Gestione file
    $upload_dir = "../uploads/";

    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    // inizializzo la variabile file_path
    $file_path = null;

    //verifichiamo che il file sia stato caricato e che non ci siano errori
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        //gli diamo un nome univoco 
        $nome_originale = basename($_FILES['file']['name']);
        $nome_sicuro = uniqid() . "_" . preg_replace("/[^a-zA-Z0-9\._-]/", "_", $nome_originale);
        $destinazione = $upload_dir . $nome_sicuro;   

        //muovo il file dal posto temporaneo alla cartella uploads dove lo conservo
        if (move_uploaded_file($_FILES['file']['tmp_name'], $destinazione)) {
            $file_path = $nome_sicuro; // Salvo solo il nome, non il path completo
        }
    }

    // Inserisci nel DB
    $query = "INSERT INTO compiti (titolo, descrizione, priorita, scadenza, ora, file_path, utente) 
            VALUES ($1, $2, $3, $4, $5::time, $6, $7) RETURNING id";

    $result = pg_query_params($conn, $query, [
        $titolo,
        $descrizione,
        $priorita,
        $scadenza,
        $orario, 
        $file_path,
        $username
    ]);

    if ($result) {
        $new_id = pg_fetch_result($result, 0, 0);
        $task_data = [
            'id' => $new_id,
            'titolo' => $titolo,
            'descrizione' => $descrizione,
            'priorita' => $priorita,
            'scadenza' => $scadenza,
            'ora' => $orario,  
            'file_path' => $file_path,
            'utente' => $username
        ];
        header("Location: ../mainpage.html"); // DA CAMBIARE redireziono per ora a mainpage !!!
        exit();

    } 
    else {
        echo "Errore nel salvataggio: " . pg_last_error();
    }
    pg_close($conn);
?>