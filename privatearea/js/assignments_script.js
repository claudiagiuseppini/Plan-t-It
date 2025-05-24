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
                  <span class="close-modal btn btn-primary">&times;</span>
                  ${html}
              </div>
          `;
      //svuoto e l'aggiungo al container dei compiti
      document.getElementById("container").innerHTML = '';
      document.getElementById("container").appendChild(modal);

      //permetto che si possa chiudere
      modal.querySelector('.close-modal').addEventListener('click', function () {
        modal.remove();
        caricaCompitiDalServer();
      });

      // si chiude anche premendo al di fuori della finestra
      modal.addEventListener('click', function (e) {
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
  const container = document.getElementById("container");
  // chiamo il server per i compiti

  console.log("Avvio caricamento compiti dal server...");
  Promise.all([
    fetch("php/leggi_compiti.php").then(res => res.json()),
    fetch("php/leggi_compiticondivisi.php").then(res => res.json())
  ])
    .then(([compiti, compitiCondivisi]) => {
      // svuoto il container
      container.innerHTML = "";
      // per ogni compito aggiungo un box
      compiti.forEach((c, index) => {
        container.innerHTML += generaCompitoDaOggetto(c, index, false);
        inizializzaListenerProgresso();

      });

      const startIndex = compiti.length;
      // per ogni compito condiviso aggiungo una box
      compitiCondivisi.forEach((c, index) => {
        container.innerHTML += generaCompitoDaOggetto(c, index + startIndex, true);
        inizializzaListenerProgresso();
      });


      // dopo che sono stati caricati tutti i compiti 
      VisualizzaPiantina();

    });




}


//prende in input un compito e crea una box
function generaCompitoDaOggetto(compito, index, cond) {
  const id = `collapseTask${index}`;
  // se ho il link del file aggiungo questo
  const fileLink = compito.file_path
    ? `<a href="uploads/${compito.file_path}" target="_blank" class="btn btn-outline-primary btn-sm mt-2">📎 Apri allegato</a>`
    : '';

  //se cond è true il background è verde
  const backgroundStyle = cond ? 'style="background-color: #e8f5e9;"' : '';

  //il bottone condividi solo se cond è not true
  const condividiButton = !cond ? `
        <div class="position-absolute share-button-container" style="top: 8px; right: 50px;">
            <button class="btn btn-outline-primary btn-sm d-flex align-items-center share-button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                    onmouseover="caricaAmiciPerCondivisione(${compito.id})">
                <span class="share-text"><i class="fa-solid fa-share-from-square me-1"></i>Condividi</span>
                <span class="menu-icon">
                 <i class="fa-solid fa-share"></i>
                </span>

            </button>
            <ul class="dropdown-menu p-2" id="dropdown-amici-${compito.id}">
                <li class="dropdown-item-text text-muted">Caricamento amici...</li>
            </ul>
        </div>
    ` : '';

  return `
    <div class="position-relative panel task-box border rounded mb-3 shadow-sm" id="task-${compito.id}" ${backgroundStyle}>
        <button class="btn btn-sm btn-outline-danger position-absolute action-button" 
                onclick="confermaEliminaCompito(${compito.id})"
                title="Elimina">
            <i class="fas fa-times"></i>
        </button>
        ${condividiButton}  
        <div class="panel-heading" role="tab" id="heading${index}">
            <h4 class="panel-title mb-0">
                <button class="btn text-body w-100 text-start d-flex justify-content-between align-items-center"
                        data-bs-toggle="collapse" 
                        data-bs-target="#${id}" 
                        aria-expanded="false" 
                        aria-controls="${id}">
                    
                    <div class="d-flex flex-wrap align-items-center gap-3"> 
                    <div class = "plant-container plant-container-${compito.id}" priority="${compito.priorita}" progress= "${compito.progresso}" id= "svg-container-${compito.id}" > </div> 
                    <div>
                        <strong class="text-success">${compito.titolo}</strong><br>
                        <small class="text-muted">Scadenza: ${compito.scadenza || 'Nessuna scadenza'}</small>
                        <br>
                        <small class="text-muted">Orario: ${compito.ora || 'Nessun orario'}</small>
                    </div>

                    </div> 

                </button>
            </h4>
        </div>
        <div id="${id}" class="collapse panel-collapse">
            <div class="panel-body task-body p-3">
                <div class="d-flex align-items-center mb-3 gap-2">
                  <!-- Etichetta + Select -->
                    <div class="d-flex align-items-center">
                      <label for="progressSelect-${compito.id}" class="me-2 mb-0">Progresso:</label>
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

      const containerPlant = document.getElementById(`svg-container-${compitoId}`);
      let p = parseInt(progresso);

      const priorità = containerPlant.getAttribute("priority");
      if (containerPlant) {
        console.log("Container trovato:", containerPlant);
        containerPlant.setAttribute("progress", p);
        AggiornaPiantina(containerPlant, priorità, p);
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
            // aggiungo il compito alla tabella dei compiti completati
            aggiungiCompitoCompletato(compitoId).then(success => {

              if (success) {
                setTimeout(() => {
                  let file_svg = "";
                  switch (priorità) {
                    case "Bassa":
                      file_svg = "../../assets/svg/plant_easy.svg";
                      break;
                    case "Media":
                      file_svg = "../../assets/svg/plant_medium.svg";
                      break;

                    case "Alta":
                      file_svg = "../../assets/svg/plant_difficult.svg";
                      break;
                    default:
                      file_svg = "../../assets/svg/plant_easy.svg";
                  }

                  fetch(file_svg)
                    .then(res => res.text())
                    .then(svgText => {

                      return Swal.fire({
                        title: "Hai ottenuto una nuova piantina!",
                        html: `
                        <div style="margin-top: 1em;">${svgText}</div>
                        <p>Hai completato il compito.Vuoi eliminarlo?</p>
                        `,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Elimina",
                        cancelButtonText: "Annulla",
                        reverseButtons: true,
                        focusCancel: true
                      });
                    }).then((result) => {
                      if (result.isConfirmed) {
                        eliminaCompito(compitoId);
                      }
                    });


                }, 500);

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




//permette di cancellare il compito dalla pagina
function confermaEliminaCompito(id) {
  Swal.fire({
    title: "Sei sicuro?",
    text: "Questa azione non può essere annullata!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Elimina",
    cancelButtonText: "Annulla",
    reverseButtons: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6"
  }).then((result) => {
    if (result.isConfirmed) {
      eliminaCompito(id);  // chiama la funzione che fa la fetch
    }
  });
}

// elimima i compiti
function eliminaCompito(id) {
  // chiama il server passandogli l'id del compito che si vuole eliminare
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

        Swal.fire({
        title: "Eliminato!",
        text: "Il compito è stato eliminato con successo.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        });
        
      } else {
        Swal.fire({
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

// aggiungi alla tabella compiti Completati
function aggiungiCompitoCompletato(id) {
  return fetch("php/compito_completato.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id })
  })
    .then(res => res.json())

    .catch(err => {
      console.error("Errore:", err);
      alert("Errore di connessione durante l'eliminazione");
      return false;
    });
}

// carica gli amici disponibili e li mostra quando si preme condividi
function caricaAmiciPerCondivisione(taskId) {
  // chiama il server
  fetch('php/get_amici.php')
    .then(response => response.json())
    .then(amici => {
      const dropdown = document.getElementById(`dropdown-amici-${taskId}`);
      dropdown.innerHTML = '';

      if (amici.length > 0) {
        amici.forEach(amico => {
          const li = document.createElement('li');
          li.className = 'd-flex justify-content-between align-items-center p-2';
          li.innerHTML = `
                      <span>${amico.username}</span>
                      <button class="btn btn-sm btn-success" 
                              onclick="condividiCompitoConAmico(${taskId}, '${amico.username}')">
                          <i class="fas fa-share"></i>
                      </button>
                  `;
          dropdown.appendChild(li);
        });
      } else {
        dropdown.innerHTML = '<li class="dropdown-item-text text-muted">Nessun amico disponibile</li>';
      }
    })
    .catch(error => {
      console.error('Errore nel caricamento degli amici:', error);
      document.getElementById(`dropdown-amici-${taskId}`).innerHTML =
        '<li class="dropdown-item-text text-danger">Errore nel caricamento</li>';
    });
}

// permette di aggiunger un compito a compiticondivisi
function condividiCompitoConAmico(taskId, amicoUsername) {
  fetch('php/condividi_compito.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      taskId: taskId,
      amicoUsername: amicoUsername
    })
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.message || 'Errore del server');
          } catch (e) {
            throw new Error(text || 'Errore del server');
          }
        });
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        swal({
          title: "Successo!",
          text: data.message || `Compito condiviso con ${amicoUsername}`,
          icon: "success",
          timer: 1500,
          buttons: false
        });
      } else {
        throw new Error(data.message || "Errore durante la condivisione");
      }
    })
    .catch(error => {
      console.error('Errore:', error);
      swal({
        title: "Errore!",
        text: error.message,
        icon: "error"
      });
    });
}

function VisualizzaPiantina() {
  document.querySelectorAll(".plant-container").forEach(container => {
    console.log("Caricamento piantina");
    const priorità = container.getAttribute("priority");
    let file_svg = "";

    switch (priorità) {
      case "Bassa":
        file_svg = "../../assets/svg/plant_easy.svg";
        break;
      case "Media":
        file_svg = "../../assets/svg/plant_medium.svg";
        break;

      case "Alta":
        file_svg = "../../assets/svg/plant_difficult.svg";
        break;
      default:
        file_svg = "../../assets/svg/plant_easy.svg";
    }


    fetch(file_svg)
      .then(res => res.text())
      .then(svgText => {
        container.innerHTML = svgText;

        let progresso = parseInt(container.getAttribute("progress"));
        console.log(`Piantina con progresso ${progresso}`);
        return AggiornaSVG(container, priorità, progresso);

      })
      .catch(err => console.error("Errore nel caricamento della piantina:", err));
  });
}


function AggiornaSVG(container, priorità, progresso) {

  if (priorità == "Bassa" || priorità == "Alta") {
    const gambo = container.querySelector("#gambo");
    const foglie = container.querySelector("#foglie");
    const centro = container.querySelector("#centro");
    const petali = container.querySelector("#petali");

    switch (progresso) {
      case 0:
        gambo.style.opacity = 0;
        foglie.style.opacity = 0;
        centro.style.opacity = 0;
        petali.style.opacity = 0;
        break;

      case 25:
        gambo.style.opacity = 1;
        foglie.style.opacity = 0;
        centro.style.opacity = 0;
        petali.style.opacity = 0;
        break;

      case 50:
        gambo.style.opacity = 1;
        foglie.style.opacity = 1;
        centro.style.opacity = 0;
        petali.style.opacity = 0;
        break;

      case 75:
        gambo.style.opacity = 1;
        foglie.style.opacity = 1;
        centro.style.opacity = 1;
        petali.style.opacity = 0;
        break;

      case 100:
        gambo.style.opacity = 1;
        foglie.style.opacity = 1;
        centro.style.opacity = 1;
        petali.style.opacity = 1;
        break;

    }

  }

  else if (priorità == "Media") {
    const gambo = container.querySelector("#gambo");
    const foglie = container.querySelector("#foglie");
    const petali = container.querySelector("#petali");
    const stami = container.querySelector("#stami");


    switch (progresso) {
      case 0:
        gambo.style.opacity = 0;
        foglie.style.opacity = 0;
        petali.style.opacity = 0;
        stami.style.opacity = 0;
        break;

      case 25:
        gambo.style.opacity = 1;
        foglie.style.opacity = 0;
        petali.style.opacity = 0;
        stami.style.opacity = 0;
        break;

      case 50:
        gambo.style.opacity = 1;
        foglie.style.opacity = 1;
        petali.style.opacity = 0;
        stami.style.opacity = 0;
        break;

      case 75:
        gambo.style.opacity = 1;
        foglie.style.opacity = 1;
        petali.style.opacity = 1;
        stami.style.opacity = 0;
        break;

      case 100:
        gambo.style.opacity = 1;
        foglie.style.opacity = 1;
        petali.style.opacity = 1;
        stami.style.opacity = 1;
        break;

    }

  }

}


function AggiornaPiantina(container, priorità, progresso) {
  let file_svg = "";
  switch (priorità) {
    case "Bassa":
      file_svg = "../../assets/svg/plant_easy.svg";
      break;
    case "Media":
      file_svg = "../../assets/svg/plant_medium.svg";
      break;

    case "Alta":
      file_svg = "../../assets/svg/plant_difficult.svg";
      break;
    default:
      file_svg = "../../assets/svg/plant_easy.svg";
  }

  console.log("sto aggiornando la piantina");
  console.log(`Piantina con progresso ${progresso}`);

  fetch(file_svg)
    .then(res => res.text())
    .then(svgText => {
      container.innerHTML = svgText;
      return AggiornaSVG(container, priorità, progresso);

    })
    .catch(err => console.error("Errore nel caricamento della piantina:", err));
}

