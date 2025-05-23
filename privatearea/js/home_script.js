let calendarHome;
//Funzione per caricare dinamicamente il calendario nella home
async function inizializzaCalendarioHome(){
    const isMobile = window.innerWidth < 768;
    if (calendarHome) { /* se esiste già un calendario lo distrugge*/
        calendarHome.destroy();
    }
    var calendarEl = document.getElementById('calendarList');

    //await consente di aspettare che la promise venga risolta
    const list = await caricaCompitiHome(); 

    calendarHome = new FullCalendar.Calendar(calendarEl, {
        initialView: 'listDay',
        locale: 'it',
        validRange: { start: new Date() },
        firstDay: 1,
        nowIndicator: true,
        noEventsContent: 'Nessun evento da visualizzare',
        height: isMobile ? window.innerHeight * 0.4 : 400,

        headerToolbar: {
            start:'title',
            end: ''
        },

        footerToolbar:{
            center: 'today prev,next'
        },

        buttonText: {
            today: 'Oggi'  // Localizza il pulsante "today"
        },

        events: list // contiene gli eventi dalla funzione salva compiti
    });

    calendarHome.render();
}


//Salvo la modalità attuale della finestra
let lastIsMobileHome = window.innerWidth < 768;

//Listener evento resize: succede ogni volta che cambio la dimensione della finestra
window.addEventListener('resize', () => {
    const currentIsMobile = window.innerWidth < 768;
    if (currentIsMobile !== lastIsMobileHome) {
        lastIsMobileHome = currentIsMobile;
        inizializzaCalendarioHome(); /*se ho cambiatà modalità rinizializzo il calendario*/
    }
});

//Funzione per impostare i suggerimenti giornalieri
function impostaSuggerimentoGiornaliero() {
    //crea array con delle frasi motivazionali
    const tips = [
        "Fai oggi ciò che il tuo futuro ti ringrazierà di aver fatto.",
        "La produttività non significa fare di più, ma fare ciò che conta.",
        "Ricorda: anche i piccoli progressi sono progressi.",
        "Dedicare tempo a te stesso non è egoismo, è cura.",
        "Concentrati su un obiettivo alla volta: la chiarezza batte il caos.",
        "Il successo è la somma di piccoli sforzi ripetuti ogni giorno.",
        "Anche le pause fanno parte della produttività.",
        "Non aspettare la motivazione: inizia, e la motivazione ti seguirà.",
        "Impara a dire no a ciò che non ti avvicina ai tuoi obiettivi.",
        "Sii gentile con te stesso: stai facendo del tuo meglio."
    ];
    //prendo la data di oggi
    const today = new Date();
    //calcolo dell'indice per cambiare frase a seconda del giorno
    const index = today.getDate() % tips.length;  
    //salvo la stringa a quell'indice
    const tipOfTheDay = tips[index];
    //imposto il suggerimento nella card
    const tipEl = document.getElementById("dailyTip");
    if (tipEl) {
        tipEl.textContent = tipOfTheDay;
    }
}

//Funzione usata da caricaCompitiHome per mettere i pallini dei compiti del colore giusto a seconda della priorità
function getColor(p){
    if (p === 'Alta') return 'red';
    if (p === 'Media') return 'orange';
    if (p === 'Bassa') return 'green';
    return 'blue'; //blue se sono condivisi
}

//Funzione per caricare i compiti sul calendario della home 
function caricaCompitiHome() {
    // cerca su entrambi i file php
    return Promise.all([
        fetch("php/leggi_compiti.php").then(res => res.json()),
        fetch("php/leggi_compiticondivisi.php").then(res => res.json())
    ])
    .then(([compiti, compitiCondivisi]) => {
        // task normali
        const regularEvents = compiti.map(c => {
            const event = {
                id: c.id,
                title: c.titolo,
                start: c.scadenza,
                allDay: !c.ora, //se non esiste orario tutto il giorno
                borderColor: getColor(c.priorita),
                extendedProps: { condiviso: false }
            };
            if (c.ora) {
                event.start = `${c.scadenza}T${c.ora}`;
                event.allDay = false;
            }
            return event;
        }); 

        //task condivise
        const sharedEvents = compitiCondivisi.map(c => {
            const event = {
                id: c.id,
                title: c.titolo,
                start: c.scadenza,
                allDay: !c.ora, //se non esiste orario tutto il giorno
                borderColor: getColor(c.priorita),
                extendedProps: { condiviso: true },
                className: 'evento-condiviso'
            };
            if (c.ora) {
                event.start = `${c.scadenza}T${c.ora}`;
                event.allDay = false;
            }
            return event;
        });

        //combinali
        return [...regularEvents, ...sharedEvents];
    })
    .catch(error => {
        console.error("Errore nel caricare i compiti:", error);
        throw error; 
    });
}

//Funzione per caricare l'username di benvenuto
function username(){
    fetch('php/get_user_info.php')
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error("Errore:", data.error);
        return;
      }
    document.getElementById('user').textContent = "Bentornato, " + data.username +"!";       })
    .catch(error => {
      console.error("Errore nel caricamento del profilo:", error);
    });
}