let calendarHome;

function inizializzaCalendarioHome(){
    const isMobile = window.innerWidth < 768;
    if (calendarHome) { /* se esiste già un calendario lo distrugge*/
        calendarHome.destroy();
    }
    var calendarEl = document.getElementById('calendarList');
    calendarHome = new FullCalendar.Calendar(calendarEl, {
        initialView: 'listDay', 
        locale: 'it',
        validRange: { start: new Date() }, 
        firstDay: 1, 
        nowIndicator: true,
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

        // Imposta gli eventi per oggi (dobbiamo sostituirli con quelli reali)
        // i colori devranno essere settati a seconda della priorità dell'attività
        events: [
            { title: 'Compito 1', start: new Date(), borderColor: 'green' },
            { title: 'Compito 2', start: new Date(), borderColor: 'red' },
            { title: 'Compito 3', start: new Date(), borderColor: 'orange' },
            { title: 'Compito 4', start: new Date(), borderColor: 'green' }
        ]
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
