//funzione che apre il form per creazione compito
function showForm() {
  fetch("formA.html")
      .then(response => response.text())
      .then(html => {
          // creo una finestra all'interno della pagina
          const modal = document.createElement('div');
          modal.className = 'assignment-modal';
          modal.innerHTML = `
              <div class="assignment-modal-content">
                  <span class="close-modal">&times;</span>
                  ${html}
              </div>
          `;
          //svuoto e l'aggiungo al container dei compiti
          document.getElementById("container").innerHTML = '';
          document.getElementById("container").appendChild(modal);
          
          //permetto che si possa chiudere
          modal.querySelector('.close-modal').addEventListener('click', function() {
              modal.remove();
              caricaCompitiDalServer();
          });
          
          // si chiude anche premendo al di fuori della finestra
          modal.addEventListener('click', function(e) {
              if (e.target === modal) {
                  modal.remove();
                  caricaCompitiDalServer();
              }
          });

          //mando la query
          const form = modal.querySelector('form');
          

      }
    )
    .catch(error => console.error('Errore caricamento form:', error));

  }


//chiede al database quali sono i compiti ordinati per scadenza
function caricaCompitiDalServer() {
    fetch("php/leggi_compiti.php")
      .then(res => res.json())
      .then(compiti => {
        const container = document.getElementById("container");
        container.innerHTML = "";
    
  
        compiti.forEach((c, index) => {
          container.innerHTML += generaCompitoDaOggetto(c, index);
        });
        inizializzaListenerProgresso();
      });
  }      
  
  //funzione che genera id univoci
  function generateUniqueId(index) {
    return `collapseTask${index}`;
  }


  
  //prende in input un compito e crea una box
  function generaCompitoDaOggetto(compito, index) {
    const id = generateUniqueId(index);
    const fileLink = compito.file_path
        ? `<a href="uploads/${compito.file_path}" target="_blank" class="btn btn-outline-primary btn-sm mt-2">📎 Apri allegato</a>`
        : '';
        console.log("Compito ricevuto:", compito);

  
    return `
    <div class="position-relative panel task-box border rounded mb-3 shadow-sm" id="task-${compito.id}">
        <button class="btn btn-sm btn-outline-danger position-absolute" 
                style="top: 6px; right: 6px; padding: 0.1rem 0.4rem; font-size: 0.75rem;"
                onclick="confermaEliminaCompito(${compito.id})">
            &times;
        </button>
        <div class="panel-heading" role="tab" id="heading${index}">
            <h4 class="panel-title mb-0">
                <button class="btn text-body w-100 text-start d-flex justify-content-between align-items-center"
                        data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false" aria-controls="${id}">
                    <div>
                        <strong class="text-success">${compito.titolo}</strong><br>
                        <small class="text-muted">Scadenza: ${compito.scadenza || 'Nessuna scadenza'}</small>
                        <br>
                        <small class="text-muted">Orario: ${compito.ora || 'Nessun orario'}</small>
                    </div>
                </button>
            </h4>
        </div>
        <div id="${id}" class="collapse panel-collapse">
            <div class="panel-body task-body p-3">
                <div class="d-flex align-items-center mb-3 gap-2">
                  <!-- Etichetta + Select -->
                  <div class="d-flex align-items-center">
                      <label for="progressSelect-${compito.id}" class="me-2 mb-0">Progress:</label>
                      <select id="progressSelect-${compito.id}" class="form-select form-select-sm w-auto">
                          <option value="0" ${compito.progresso == 0 ? 'selected' : ''}>0%</option>
                          <option value="25" ${compito.progresso == 25 ? 'selected' : ''}>25%</option>
                          <option value="50" ${compito.progresso == 50 ? 'selected' : ''}>50%</option>
                          <option value="75" ${compito.progresso == 75 ? 'selected' : ''}>75%</option>
                          <option value="100" ${compito.progresso == 100 ? 'selected' : ''}>100%</option>
                      </select>
                  </div>

                  <!-- Progress Bar -->
                  <div class="flex-grow-1">
                      <div class="progress" style="height: 10px;">
                          <div class="progress-bar bg-success" 
                              role="progressbar" 
                              style="width: ${compito.progresso}%;" 
                              aria-valuenow="${compito.progresso}" 
                              aria-valuemin="0" 
                              aria-valuemax="100">
                              ${compito.progresso}%
                          </div>
                      </div>
                  </div>
              </div>

                <p>${compito.descrizione}</p>
                ${fileLink}
            </div>
        </div>
    </div>`;

  }

  function inizializzaListenerProgresso() {
    document.querySelectorAll('select[id^="progressSelect-"]').forEach(select => {
      select.addEventListener("change", function () {
        const progresso = this.value;
        const compitoId = this.id.split("-")[1];
  
        // Aggiorna la barra visivamente
        const progressBar = document.querySelector(`#task-${compitoId} .progress-bar`);
        if (progressBar) {
          progressBar.style.width = progresso + "%";
          progressBar.setAttribute("aria-valuenow", progresso);
          progressBar.textContent = progresso + "%";
        }
  
        // Salva nel DB
        fetch("php/aggiorna_progresso.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: `id=${compitoId}&progresso=${progresso}`
        })
        .then(response => response.json())
        .then(data => {
          if (!data.success) {
            alert("Errore nel salvataggio del progresso.");
            return;
          }
  
          // Se progresso = 100, chiedi conferma per eliminazione
         if (parseInt(progresso) === 100) {
        swal({
          title: "Hai completato il compito.",
          text: "Vuoi eliminarlo?",
          icon: "warning",
          buttons: ["Annulla", "Elimina"],
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            eliminaCompito(compitoId); 
          }
        });
}
        })
        .catch(() => {
          alert("Errore di rete durante l'aggiornamento del progresso.");
        });
      });
    });
  }
  
  



  
// //prende in input un compito, chiama la funzione precedente e aggiunge al container un box con il compito
//   function aggiungiCompitoDopoSalvataggio(compito) {
//     const container = document.getElementById("container");
//     if (!container) return;
    
//     const index = container.children.length;
//     container.insertAdjacentHTML('beforeend', generaCompitoDaOggetto(compito, index));
//   }
  
//permette di cancellare il compito dalla pagina

function confermaEliminaCompito(id) {
  swal({
      title: "Sei sicuro?",
      text: "Questa azione non può essere annullata!",
      icon: "warning",
      buttons: ["Annulla", "Elimina"],
      dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      eliminaCompito(id);  // chiama la funzione che fa la fetch
    }
  });
}
  function eliminaCompito(id) {
        fetch("php/elimina_compito.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id })
        })
        .then(res => res.json())
        .then(data => {
            if (data.successo) {
                const taskBox = document.getElementById(`task-${id}`);
                if (taskBox) {
                    taskBox.style.transition = "opacity 0.3s";
                    taskBox.style.opacity = "0";
                    setTimeout(() => taskBox.remove(), 300);
                }
                swal({
                        title: "Eliminato!",
                        text: "Il compito è stato eliminato con successo.",
                        icon: "success",
                        timer: 1500,
                        buttons: false,
                });
            } else {
                    swal({
                        title: "Errore!",
                        text: data.errore,
                        icon: "error",
                    });
                  }
        })
        .catch(err => {
            console.error("Errore:", err);
            swal({
                    title: "Errore di connessione!",
                    text: "Errore durante l'eliminazione del compito.",
                    icon: "error",
              });
        });
}
  