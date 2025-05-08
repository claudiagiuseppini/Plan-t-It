
function inviaCompito(titolo, descrizione, priorita, scadenza,ora, fileName) {
    if (window.opener && !window.opener.closed) {
        window.opener.aggiungiCompitoDopoSalvataggio({
            titolo,
            descrizione,
            priorita,
            scadenza,
            ora,
            file_path: fileName || null
        });
        window.close(); 
    }
}

