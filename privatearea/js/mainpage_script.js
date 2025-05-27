//Listener che aspetta il caricamento della pagina per effetturare le funzioni javascript
document.addEventListener('DOMContentLoaded', () => {
  caricaNome();
    // Funzione per caricare il contenuto dinamicamente
    const loadPageContent = (page) => {
      fetch(`${page}.html`)  // Carica il file HTML specifico
        .then(response => response.text())
        .then(data => {
          document.querySelector('main').innerHTML = data;  // Inserisci il contenuto nel main 

          if (page === 'calendario') {
  const intervalId = setInterval(() => {
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
      clearInterval(intervalId); // Ferma il controllo appena trovato
      inizializzaCalendario();
      aggiungiCompiti();
    }
  }, 50); // ogni 50ms controlla
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
  
    //Event listener per ogni link
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


//Listener per aprire la sideBar
hamburgerBtn.addEventListener('click', () => {
    sidebar.classList.toggle('show');
    document.body.classList.toggle('sidebar-open');
});

//Listener per chiudere la sidebar se clicchi fuori da essa nella versione mobile
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target) && sidebar.classList.contains('show')) {
    sidebar.classList.remove('show');
    document.body.classList.remove('sidebar-open');
    }
});

//Aggiunge classe active per ogni nav-link cliccato e la rimuove dagli altri non cliccati
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
})

//Funzione per caricare il nome dell'utente nel dropdown menu ("Ciao utente123!")
function caricaNome(){
   fetch('php/get_user_info.php')
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error("Errore:", data.error);
        return;
      }
      document.getElementById('goodbye').textContent = "Ciao " + data.username +"!";
       })
    .catch(error => {
      console.error("Errore nel caricamento del profilo:", error);
    });
}


//Funzione per caricare tutte le info dell'utente nella modal del pulsante Profilo nel dropdown menu
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

//Funzione per visualizzare il badge delle notifiche sul bottone Notifiche
function badgeNotifiche(){
    fetch('php/get_receivedRequests.php')
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nella richiesta");
            }
            return response.json();
        })
        .then(data => {
            const badge = document.getElementById('notificationBadge');
            if (Array.isArray(data) && data.length > 0) {
                badge.classList.remove('visually-hidden');
            } else {
                badge.classList.add('visually-hidden');
            }
        })
        .catch(error => {
            console.error("Errore nel recupero delle notifiche:", error);
        });
}