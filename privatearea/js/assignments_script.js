//funzione che apre il form per creazione compito
function openMyWin() {
    var x = window.open("./formA.html", "formA", "width=1000,height=1000");
    x.moveTo(0,0);

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
                onclick="eliminaCompito(${compito.id})">
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

                <div class="progress mb-3" style="height: 8px;">
                    <div class="progress-bar bg-success" 
                         role="progressbar" 
                         style="width: 50%;" 
                         aria-valuenow="50" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                    </div>
                </div>
                
                <p>${compito.descrizione}</p>
                ${fileLink}
            </div>
        </div>
    </div>`;

  }



  
//prende in input un compito, chiama la funzione precedente e aggiunge al container un box con il compito
  function aggiungiCompitoDopoSalvataggio(compito) {
    const container = document.getElementById("container");
    if (!container) return;
    
    const index = container.children.length;
    container.insertAdjacentHTML('beforeend', generaCompitoDaOggetto(compito, index));
  }
  
//permette di cancellare il compito dalla pagina
  function eliminaCompito(id) {
    if (!confirm("Sei sicuro di voler eliminare questo compito?")) return;
  
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
        } else {
            alert("Errore nell'eliminazione: " + data.errore);
        }
    })
    .catch(err => {
        console.error("Errore:", err);
        alert("Errore di connessione durante l'eliminazione");
    });
}

  