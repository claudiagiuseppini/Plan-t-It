document.addEventListener('DOMContentLoaded', () => {
  username_exit();
    // Funzione per caricare il contenuto dinamicamente
    const loadPageContent = (page) => {
      fetch(`${page}.html`)  // Carica il file HTML specifico
        .then(response => response.text())
        .then(data => {
          document.querySelector('main').innerHTML = data;  // Inserisci il contenuto nel main 

          if (page==='calendario'){
            inizializzaCalendario();
            aggiungiCompiti();
          }
          if (page==='home'){
            username();
            inizializzaCalendarioHome();
            impostaSuggerimentoGiornaliero();
          }
          if (page=='sessione-studio'){
            sessioneStudio();
          }
          if (page =='assignments'){
            caricaCompitiDalServer();
          }
          if(page== 'amici'){
            initAmici();
          }
          if(page== 'notifiche'){
            loadIncomingRequest();
            loadSharedTasks();
          }
          if(page== 'giardino'){
            MesediDefault();
            CaricaPiantina();

            const inputMese = document.getElementById('mese');
            if(inputMese){
              inputMese.addEventListener('change', () => CaricaPiantina());
            }
            
          }
          badgeNotifiche();

        })
        .catch(error => console.error('Errore nel caricamento del contenuto:', error));
    };
  
    // Aggiungi gli event listener per ogni link
    document.getElementById('home-link').addEventListener('click', () => loadPageContent('home'));
    document.getElementById('calendario-link').addEventListener('click', () => loadPageContent('calendario'));
    document.getElementById('notifiche-link').addEventListener('click', () => loadPageContent('notifiche'));
    document.getElementById('giardino-link').addEventListener('click', () => loadPageContent('giardino'));
    document.getElementById('amici-link').addEventListener('click', () => loadPageContent('amici'));
    document.getElementById('compiti-link').addEventListener('click', () => loadPageContent('assignments'));
    document.getElementById('sessione-studio').addEventListener('click', () => loadPageContent('sessione-studio'));


    // Carica la pagina di default (ad esempio Home)
    loadPageContent('home');
});
 

//Const che prende gli elementi della pagina tramite l'id assegnato nell'html con il tag "id"
const hamburgerBtn = document.getElementById('hamburger-menu');
const sidebar = document.getElementById('sidebar');


//serve ad aprire la sideBar
hamburgerBtn.addEventListener('click', () => {
    sidebar.classList.toggle('show');
    document.body.classList.toggle('sidebar-open');
});

  // Serve a chiudere la sidebar se clicchi fuori da essa nella versione mobile
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target) && sidebar.classList.contains('show')) {
    sidebar.classList.remove('show');
    document.body.classList.remove('sidebar-open');
    }
});

//aggiunge classe active per ogni nav-link cliccato e la rimuove dagli altri non cliccati
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
})

function username_exit(){
  fetch('php/after_login.php')
  .then(response => response.text())
  .then(name => {
      document.getElementById('goodbye').textContent = "Ciao " + name +"!";
  });
}

function caricaProfilo() {
  fetch('php/get_user_info.php')
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error("Errore:", data.error);
        return;
      }
      document.getElementById("modal-username").textContent = data.username;
      document.getElementById("modal-nome").textContent = data.nome;
      document.getElementById("modal-cognome").textContent = data.cognome;
      document.getElementById("modal-email").textContent = data.email;
    })
    .catch(error => {
      console.error("Errore nel caricamento del profilo:", error);
    });
}

const profileModal = document.getElementById('profileModal');
const userDropdownButton = document.getElementById('userDropdown'); // o un altro elemento esterno focusabile

// Quando la modale sta per chiudersi, tolgo il focus da qualunque elemento dentro la modale
profileModal.addEventListener('hide.bs.modal', () => {
  document.activeElement.blur();
});

// Quando la modale è completamente nascosta, sposta il focus sul bottone esterno
profileModal.addEventListener('hidden.bs.modal', () => {
  if(userDropdownButton) {
    userDropdownButton.focus();
  }
});
