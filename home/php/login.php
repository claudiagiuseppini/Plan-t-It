<?php

include "connect.php";


// controlla se il form è stato eseguito
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    //chiede al db - sicuramente un problema di sicurezza ma ok
    $query = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
    $result = pg_query($conn, $query);

    if (!$result) {
        die("Errore nella query: " . pg_last_error($conn));
    }

    // controlla se esiste l'user
    if (pg_num_rows($result) > 0) {
        session_start();
        $_SESSION['username'] = $username;
        header("Location: ../../privatearea/mainpage.html"); // Reindirizza qua
        exit();
    } else {
        echo "Username o password errati.";
    }
} else {
    echo "Metodo non valido.";
}
?>
