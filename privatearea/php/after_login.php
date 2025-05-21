<?php

// salva nella sessione lo username - se ci sono special char li converte e se non è valido usa ospite
session_start();
echo isset($_SESSION['username']) ? htmlspecialchars($_SESSION['username']) : 'Ospite';




?>