CREATE DATABASE IF NOT EXISTS compiti;
USE compiti;




CREATE TABLE compito (
    nome VARCHAR(50) PRIMARY KEY,
    età INT not null
);

CREATE TABLE films (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titolo VARCHAR(50),
    regista VARCHAR(50) references registi(nome),
    anno INT not null,
    genere VARCHAR(50),
    p1 VARCHAR(50),
    p2 VARCHAR(50)
);

INSERT INTO registi(nome, età) VALUES ('aaa', 21);

