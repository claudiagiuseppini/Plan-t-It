-- Tabella users
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(50) NOT NULL, 
    cognome VARCHAR(50) NOT NULL, 
    email VARCHAR(50) UNIQUE NOT NULL, 
    password VARCHAR(50) NOT NULL
);

-- Tabella compiti
CREATE TABLE compiti (
    id SERIAL PRIMARY KEY,
    utente VARCHAR(50) NOT NULL,
    titolo TEXT NOT NULL,
    descrizione TEXT,
    priorita TEXT NOT NULL,
    scadenza DATE NOT NULL,
    progresso INTEGER DEFAULT 0,
    ora TIME,
    file_path TEXT,
    FOREIGN KEY (utente) REFERENCES users(username) ON DELETE CASCADE
);


-- Tabella compitiCompletati
CREATE TABLE compitiCompletati(
    id SERIAL,
    utente VARCHAR(50) NOT NULL,
    titolo TEXT NOT NULL,
    priorita TEXT NOT NULL,
    scadenza DATE NOT NULL,
    PRIMARY KEY (id, utente),
    FOREIGN KEY (utente) REFERENCES users(username) ON DELETE CASCADE
);


-- Tabella compitiCondivisi
CREATE TABLE compitiCondivisi (
    id INTEGER,
    amico VARCHAR(50) NOT NULL,
    data DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (id, amico),
    FOREIGN KEY (id) REFERENCES compiti(id) ON DELETE CASCADE,
    FOREIGN KEY (amico) REFERENCES users(username) ON DELETE CASCADE
);

-- Tabella richiestaAmicizia
CREATE TABLE richiestaAmicizia (
    mittente VARCHAR(50) NOT NULL,
    destinatario VARCHAR(50) NOT NULL,
    dataRichiesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    status VARCHAR(20) NOT NULL CHECK (status IN ('attesa', 'accettata', 'rifiutata')),
    PRIMARY KEY (mittente, destinatario),
    FOREIGN KEY (mittente) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (destinatario) REFERENCES users(username) ON DELETE CASCADE
);

-- Tabella amicizia
CREATE TABLE amicizia (
    mittente VARCHAR(50) NOT NULL,
    destinatario VARCHAR(50) NOT NULL,
    dataAccettazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (mittente, destinatario),
    FOREIGN KEY (mittente, destinatario) REFERENCES richiestaAmicizia(mittente, destinatario) ON DELETE CASCADE
);
