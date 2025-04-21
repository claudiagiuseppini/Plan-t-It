CREATE DATABASE IF NOT EXISTS compiti;
USE compiti;




CREATE TABLE compito (
    nome VARCHAR(50) PRIMARY KEY,
    età INT not null
);

CREATE TABLE utente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    cognome VARCHAR(50),
    password VARCHAR(50),
   
);



