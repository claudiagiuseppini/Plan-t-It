CREATE DATABASE IF NOT EXISTS plant;
USE plant;


CREATE TABLE compiti (
    id SERIAL PRIMARY KEY,
    titolo TEXT NOT NULL,
    descrizione TEXT,
    priorita TEXT,
    scadenza DATE
);


-- CREATE TABLE utente (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     nome VARCHAR(50),
--     cognome VARCHAR(50),
--     password VARCHAR(50),
   
-- );

