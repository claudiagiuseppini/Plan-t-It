//Funzione di inizializzazione chiamata da mainpage_script.js
function initAmici() {
    const friendsList = document.getElementById('friends-list');
    const pendingFriendsList = document.getElementById('pending-requests-list');

    // Carica amici all'avvio
    loadFriends();

    //Carica richieste in attesa all'avvio
    loadPendingRequest();


    // Carica gli amici dal database
    function loadFriends() {
        fetch('php/get_amici.php')
            .then(response => response.json())
            .then(data => {
                friendsList.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(friend => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.innerHTML = `
                            <div class="d-flex justify-content-between align-items-center">
                                <strong>${friend.username}</strong>
                                <button class="btn btn-sm btn-danger" style="padding: 0 6px; font-weight: bold; line-height: 1;" title="Elimina amico">&times;</button>
                            </div>
                            <div>
                                <span>Nome: ${friend.nome}</span><br>
                                <span>Cognome: ${friend.cognome}</span><br>
                                <span>Email: ${friend.email}</span>
                            </div>
                        `;
                        const btn = li.querySelector('button');
                        btn.addEventListener('click', () => {
                            swal({
                                title: "Sei sicuro?",
                                text:  `Vuoi eliminare ${friend.username} dagli amici?`,
                                icon: "warning",
                                buttons: ["Annulla", "Elimina"],
                                dangerMode: true,
                            }).then((willDelete) => {
                                if (willDelete) {
                                    eliminaAmico(friend.username);
                                }
                            });
                        });

                        friendsList.appendChild(li);
                    });
                } else {
                    friendsList.innerHTML = '<li class="list-group-item">Nessun amico trovato.</li>';
                }
            })
            .catch(error => {
                console.error('Errore durante il caricamento degli amici:', error);
            }); 
    } 
    // Funzione per eliminare un amico 
    function eliminaAmico(username) {
        fetch('php/delete_amico.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        })
        .then(response => response.json())
        .then(data => {
             swal("Completato", data.message, data.success ? "success" : "error");
            if (data.success) {
                loadFriends(); 
            }
        }) 
        .catch(error => {
            console.error('Errore durante l\'eliminazione dell\'amico:', error);
            swal("Errore", "Non è stato possibile eliminare l'amico.", "error");
        });
    }
 
    //Funzione per caricare le richieste in attesa
    function loadPendingRequest(){
        fetch('php/get_pendingRequest.php')
            .then (response => response.json())
            .then (data => {
                pendingFriendsList.innerHTML= '';
                if (data.length >0) {
                    data.forEach(richiestaAttesa => {
                        const li= document.createElement('li');
                        li.className= 'list-group-item';
                        li.innerHTML = ` <div class="d-flex justify-content-between align-items-center"> ${richiestaAttesa.destinatario} </div>`;
                         pendingFriendsList.appendChild(li);
                    });

                } else {
                    pendingFriendsList.innerHTML=  `<li class="list-group-item text-muted">Nessuna richiesta in attesa.</li>`;
                }

            })
            .catch(error => {
                console.error('Errore durante il caricamento delle richieste in attesa:', error);
            }); 
    }

    //Funzione per inviare richieste di amicizia
    document.getElementById('addFriendForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const friendUsernameInput = document.getElementById('friendUsername');
        const friendUsername = friendUsernameInput.value.trim();
        const friendRequestStatus = document.getElementById('friendRequestStatus');

        if (friendUsername === '') {
            friendRequestStatus.innerHTML = '<div class="alert alert-danger">Inserisci un username valido</div>';
            return;
        }

        fetch('php/send_request.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ friendUsername })
        })
        .then(response => response.json())
        .then(data => {
            friendRequestStatus.innerHTML = `<div class="alert alert-${data.success ? 'success' : 'danger'}">${data.message}</div>`;
            if (data.success) {
                friendUsernameInput.value = ''; // Svuota il campo di input
                loadPendingRequest(); // Aggiorna la lista delle richieste in attesa
            }
        })
        .catch(error => {
            console.error('Errore durante l\'invio della richiesta:', error);
            friendRequestStatus.innerHTML = '<div class="alert alert-danger">Errore durante l\'invio della richiesta</div>';
        });
    });
}


