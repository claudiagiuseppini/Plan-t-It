//funzione che apre il form per creazione compito
function openMyWin() {
  var x = window.open("./formA.html", "formA", "width=1000,height=1000");
  x.moveTo(0,0);

}

//listener che non aspetta che la pagina sia completamente caricata per chiedere i compiti già salvati
window.addEventListener("DOMContentLoaded", () => {
  caricaCompitiDalServer();
});



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
  const id = `collapseTask${index}`;
  const fileLink = compito.file_path
    ? `<a href="uploads/${compito.file_path}" target="_blank" class="btn btn-outline-primary btn-sm mt-2">📎 Apri allegato</a>`
    : '';
    console.log("Compito ricevuto:", compito);


  return `
    <div class="position-relative panel task-box border rounded mb-3 shadow-sm" id="task-${compito.id}">
      
      <!-- Bottone X in alto a destra, più piccolo -->
      <button 
        class="btn btn-sm btn-outline-danger position-absolute" 
        style="top: 6px; right: 6px; padding: 0.1rem 0.4rem; font-size: 0.75rem;"
        onclick="eliminaCompito(${compito.id})">
        &times;
      </button>
      


      <!-- Header cliccabile con freccia -->
      <div class="panel-heading" role="tab" id="heading${index}">
        <h4 class="panel-title mb-0">
          <button class="btn btn-link w-100 text-start d-flex justify-content-between align-items-center"
                  data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false" aria-controls="${id}">
            <div>
              <strong>${compito.titolo}</strong><br>
              <small class="text-muted">Scadenza: ${compito.scadenza}</small>
            </div>
            <i class="fas fa-chevron-down"></i>
          </button>
        </h4>
      </div>

      <!-- Corpo con descrizione e file -->
      <div id="${id}" class="collapse panel-collapse">
        <div class="panel-body task-body p-3">
          <p>${compito.descrizione}</p>
          ${fileLink}
        </div>
      </div>
    </div>
  `;
}



//prende in input un compito, chiama la funzione precedente e aggiunge al container un box con il compito
function aggiungiCompitoDopoSalvataggio(compito) {
  const container = document.getElementById("container");
  const index = container.children.length;

  container.innerHTML += generaCompitoDaOggetto(compito, index);
}

//permette di cancellare il compito dalla pagina e dal database
function eliminaCompito(id) {
  console.log("ID ricevuto per eliminazione:", id); // DEBUG

  if (!confirm("Eliminare questo compito?")) return;

  fetch("php/elimina_compito.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: id })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Risposta dal server:", data); // DEBUG

    if (data.successo) {
      const taskBox = document.getElementById(`task-${id}`);
      if (taskBox) taskBox.remove();
    } else {
      alert("Errore nell'eliminazione: " + data.errore);
    }
  });
}



    
    

    // function addTaskToContainer() {
    //   const taskListContainer = document.getElementById("container");
    //   const taskIndex = taskListContainer.children.length;  // Nuovo compito avrà un indice uguale al numero di compiti già presenti
    //   taskListContainer.innerHTML += generaCompito(taskIndex);
    // }
              


    // window.addEventListener("storage", function(event) {
    //   if (event.key === "titolo") {
    //     addTaskToContainer();
    //   }
    // });

    
