// Funzione per caricare le richieste in attesa
function loadIncomingRequest() {
    const pendingFriendsList = document.getElementById('pending-requests-list');
    fetch('php/get_receivedRequests.php')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            pendingFriendsList.innerHTML = '';
            if (data.length > 0) {
                data.forEach(richiestaAttesa => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.innerHTML = `
                        <div class="d-flex justify-content-between align-items-center">
                            <span>${richiestaAttesa.mittente}</span>
                            <div>
                                <input class="btn btn-outline-success" type="submit" value="Accetta" onclick="updateRequestStatus('${richiestaAttesa.mittente}', 'accettata');">
                                <input class="btn btn-outline-danger" type="submit" value="Rifiuta" onclick="updateRequestStatus('${richiestaAttesa.mittente}', 'rifiutata');">
                            </div>
                        </div>
                    `;
                    pendingFriendsList.appendChild(li);
                });
            } else {
                pendingFriendsList.innerHTML = `<li class="list-group-item text-muted">Nessuna richiesta in attesa.</li>`;
            }
        })
        .catch(error => {
            console.error('Errore durante il caricamento delle richieste in attesa:', error);
            pendingFriendsList.innerHTML = `<li class="list-group-item text-danger">Errore nel caricamento delle richieste.</li>`;
        });
}

//aggiorna lo status della richiesta 
function updateRequestStatus(sender, status) {
    fetch('php/aggiorna_request_status.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sender: sender,
            status: status
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadIncomingRequest();
            badgeNotifiche();
            if (status === 'rifiutata') {
                eliminaAmico(sender); 
            }
        } 
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Errore durante la richiesta');
    });
}

// carica tutti i compiti condivisi per le news
function loadSharedTasks() {
    fetch('php/leggi_compiticondivisi.php')
        .then(response => response.json())
        .then(tasks => {
            const sharedTasksList = document.getElementById('lista-compiti-condivisi');
            sharedTasksList.innerHTML = '';

            if (tasks.length > 0) {
                tasks.forEach(task => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center';
                    li.innerHTML = `
                        <div>
                            <div class="text-muted small">
                                 Il ${task.data} ${task.utente} ha condiviso con te:
                            </div>
                            <strong>${task.titolo}</strong> !!
                        </div>
                        
                    `;
                    sharedTasksList.appendChild(li);
                });
            } else {
                sharedTasksList.innerHTML = `
                    <li class="list-group-item text-muted">
                        Nessun compito condiviso con te
                    </li>
                `;
            }
        })
        .catch(error => {
            console.error('Errore nel caricamento dei compiti condivisi:', error);
            document.getElementById('lista-compiti-condivisi').innerHTML = `
                <li class="list-group-item text-danger">
                    Errore nel caricamento dei compiti condivisi
                </li>
            `;
        });
}

function eliminaAmico(username) {
        fetch('php/delete_amico.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("ok");
            }
        }) 
        .catch(error => {
            console.error('Errore durante l\'eliminazione dell\'amico:', error);
        });
    }