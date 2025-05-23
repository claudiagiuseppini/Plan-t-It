<?php 

include "connect.php";

if (isset($_POST['registrati'])){
    $nome = $_POST['nome']; 
    $cognome = $_POST['cognome']; 
    $email= trim($_POST['email']); 
    $username = $_POST['username']; 
    $password = $_POST['password']; 


    // per controllare se un utente si è già registrato con quella mail
    $checkMail = "SELECT * FROM users WHERE email=$1";
    $result = pg_query_params($conn, $checkMail, array($email));   

    if(pg_num_rows($result) > 0){
        echo "L' email è già stata utilizzata per un altro account!";
    }
    else {       
        $insertquery = "INSERT INTO users(nome, cognome, email, username, password)
                        VALUES ($1, $2, $3, $4, $5)";

        $result = pg_query_params($conn, $insertquery, [$nome, $cognome, $email, $username, $password]);  

        if ($result == false){
            echo "errore: l'iscrizione non è andata a buon fine";
        }
        else{
            header("Location: ../iscrizione.html");
            exit();
        }

    }
}