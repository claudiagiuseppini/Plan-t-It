document.addEventListener('DOMContentLoaded', () => {
    // Funzione per caricare il contenuto dinamicamente
    const loadPageContent = (page) => {
      fetch(`${page}.html`)  // Carica il file HTML specifico
        .then(response => response.text())
        .then(data => {
          document.querySelector('main').innerHTML = data;  // Inserisci il contenuto nel main 

          if (page==='calendario'){
            inizializzaCalendario();
          }
        })
        .catch(error => console.error('Errore nel caricamento del contenuto:', error));
    };
  
    // Aggiungi gli event listener per ogni link
    document.getElementById('home-link').addEventListener('click', () => loadPageContent('home'));
    document.getElementById('calendario-link').addEventListener('click', () => loadPageContent('calendario'));
    document.getElementById('notifiche-link').addEventListener('click', () => loadPageContent('notifiche'));
    document.getElementById('giardino-link').addEventListener('click', () => loadPageContent('giardino'));
    document.getElementById('amici-link').addEventListener('click', () => loadPageContent('amici'));
  
    // Carica la pagina di default (ad esempio Home)
    loadPageContent('calendario');
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

