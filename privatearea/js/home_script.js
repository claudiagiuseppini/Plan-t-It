let calendarHome;

async function inizializzaCalendarioHome(){
    const isMobile = window.innerWidth < 768;
    if (calendarHome) { /* se esiste già un calendario lo distrugge*/
        calendarHome.destroy();
    }
    var calendarEl = document.getElementById('calendarList');

    const list = await salvaCompiti(); 

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
/*Salvo la modalità attuale della finestra*/
let lastIsMobileHome = window.innerWidth < 768;

/*Ascoltatore evento resize: succede ogni volta che cambio la dimensione della finestra*/
window.addEventListener('resize', () => {
    const currentIsMobile = window.innerWidth < 768;
    if (currentIsMobile !== lastIsMobileHome) {
        lastIsMobileHome = currentIsMobile;
        inizializzaCalendarioHome(); /*se ho cambiatà modalità rinizializzo il calendario*/
    }
});

function impostaSuggerimentoGiornaliero() {
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

    const today = new Date();
    const index = today.getDate() % tips.length; //calcolo dell'indice per cambiare frase a seconda del giorno 
    const tipOfTheDay = tips[index];
    const tipEl = document.getElementById("dailyTip");
    if (tipEl) {
        tipEl.textContent = tipOfTheDay;
    }
}

function getColor(p){
    if (p === 'Alta') return 'red';
    if (p === 'Media') return 'orange';
    if (p === 'Bassa') return 'green';
    return 'black';
}

function salvaCompiti(){
    return fetch("php/leggi_compiti.php")
        .then(res => res.json())
        .then(compiti => {
            return compiti.map(c => ({
                title: c.titolo,
                start: c.scadenza,
                borderColor: getColor(c.priorita)
            }));
        });
}

function username(){
    fetch('php/after_login.php')
    .then(response => response.text())
    .then(name => {
        document.getElementById('user').textContent = "Bentornato, " + name +"!";
    });
}
