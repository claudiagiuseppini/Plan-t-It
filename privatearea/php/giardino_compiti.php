
<?php 
session_start();

$conn = pg_connect("host=localhost dbname=plant user=postgres password=biar"); 
if (!$conn){
    echo "errore di connessione";
}



$username = isset($_SESSION['username']) ? $_SESSION['username'] : null;

if ($username === null) {
    http_response_code(401);
    echo json_encode(["error" => "Utente non autenticato correttamente"]);
    exit;
}

// seleziona tutti i compiti completati (progsso = 100)
try {
    $query = "SELECT * FROM compitiCompletati WHERE (utente=$1) ORDER BY scadenza DESC";
    $result = pg_query_params($conn, $query, array($username));
    
    if (!$result) {
        http_response_code(500);
        pg_close($conn);
        exit;
    }
    
    $piantine = [];
    while ($row = pg_fetch_assoc($result)) {
        $piantine[] = $row;
    }
    
    echo json_encode($piantine);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);

} finally {
    pg_close($conn);
}

?> 