
<?php 

$conn = pg_connect("host=localhost dbname=plant user=postgres password=biar"); 
if (!$conn){
    echo "errore di connessione";
}

// seleziona tutti i compiti completati (progsso = 100)
$prog = 100; 
try {
    $query = "SELECT * FROM compiti WHERE progresso=$1 ORDER BY scadenza DESC";
    $result = pg_query_params($conn, $query, array($prog));
    
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