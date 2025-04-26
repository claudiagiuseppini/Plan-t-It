<?php 

$conn = pg_connect("host=localhost dbname=users user=postgres password=biar"); 
if (!$conn){
    echo "errore di connessione";
}

?> 