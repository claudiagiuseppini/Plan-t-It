CREATE DATABASE IF NOT EXISTS plant;
USE plant;



CREATE TABLE compiti (
    id SERIAL PRIMARY KEY,
    utente TEXT NOT NULL DEFAULT 'Mario',
    titolo TEXT NOT NULL,
    descrizione TEXT,
    priorita TEXT,
    scadenza DATE,
    ora TIME,
    file_path TEXT  
);



