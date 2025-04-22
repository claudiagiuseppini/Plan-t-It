<?php
// Connetti al DB
$conn = pg_connect("host=localhost dbname=plant user=postgres password=biar");

if (!$conn) {
    die("Errore connessione al DB");
}

// Leggi i dati dal form
$titolo = $_POST['titolo'];
$descrizione = $_POST['descrizione'];
$priorita = $_POST['priorità'];
$scadenza = $_POST['scadenza'] ?: null; // opzionale

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
$query = "INSERT INTO compiti (titolo, descrizione, priorita, scadenza, file_path) VALUES ($1, $2, $3, $4, $5)";
// verifichiamo che non ci siano problemi
$result = pg_query_params($conn, $query, [$titolo, $descrizione, $priorita, $scadenza, $file_path]);

//se non ci sono problemi
if ($result) {
    echo "<script>
  window.opener.aggiungiCompitoDopoSalvataggio(" . json_encode([
    "titolo" => $titolo,
    "descrizione" => $descrizione,
    "priorita" => $priorita,
    "scadenza" => $scadenza,
    "file_path" => $file_path
  ]) . ");
  window.close();
</script>";
} 
// se ci sono problemi
else {
    echo "Errore nel salvataggio: " . pg_last_error();
}
?>