
// window.opener si riferisce alla pagina madre (quella che ha aperto questa)
// condizione 1. deve esistere e 2. non deve essere chiusa
if (window.opener && !window.opener.closed) {
    window.opener.aggiungiCompitoDopoSalvataggio({
        titolo,
        descrizione,
        priorita,
        scadenza,
        file_path: fileName // questo è il nome del file caricato, se lo hai
    });
}

