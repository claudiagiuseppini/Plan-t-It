/*
("host=localhost 
dbname=users 
user=postgres 
password=biar")

Ho creato un database users su PGADMIN (user e password li ho impostati quando ho collegato postgres a XAMPP)
E poi ho creato la tabella users
*/

CREATE TABLE users(
    nome varchar(50) NOT NULL, 
    cognome varchar(50) NOT NULL, 
    email varchar(50) UNIQUE, 
    username varchar(50) PRIMARY KEY,
    password varchar(50) NOT NULL,
)

/* 
per far par funzionare tutto su windows dal terminale di vscode: 
- entrare nella cartella home 
- fare php -S localhost: 8000 
- e poi nel browser: http://localhost:8000/homepage.html
- e poi registrati 

- su PGADMIN (select * from users)

- mancano SFONDO E LOGO 

