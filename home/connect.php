<?php 

$conn = pg_connect("host=localhost dbname=plant user=postgres password=biar"); 
if (!$conn){
    echo "errore di connessione";
}

?> 