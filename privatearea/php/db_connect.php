<?php
// Connessione al DB
$conn = pg_connect("host=localhost dbname=plant user=postgres password=biar");

if (!$conn) {
    die("Errore connessione al DB");
}
?>