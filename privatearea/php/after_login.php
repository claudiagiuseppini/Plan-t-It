<?php

session_start();
echo isset($_SESSION['username']) ? htmlspecialchars($_SESSION['username']) : 'Ospite';




?>