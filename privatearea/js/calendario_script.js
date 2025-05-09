let calendar; /*salvo l'istanza del calendario in modo da poterla distruggere e ricreare quando cambia la dim dello schermo*/
function inizializzaCalendario(){
    const isMobile = window.innerWidth < 768; //variabile che se true indica che il dispositivo è mobile
    var calendarEl = document.getElementById('calendar');
    if (calendar) { /* se esiste già un calendario lo distrugge*/
        calendar.destroy();
    }
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: window.innerWidth < 768 ? 'timeGridDay' : 'dayGridMonth',
        locale: 'it',
        selectable: true,
        validRange: { start: new Date() }, //non fa vedere i giorni passati
        firstDay: 1, //lunedì come primo giorno 
        nowIndicator: true,
        aspectRatio: 1.35, // più basso = calendario più alto, più compatto
        height: isMobile ? window.innerHeight * 0.6 : 600, // Su mobile, il calendario occupa il 60% dell'altezza della finestra

        headerToolbar: isMobile? {
            start:'prev,next',
            center:'title',
            end:''
        }:{
            start:'prev,next',
            center:'title',
            end:'dayGridMonth,timeGridWeek,timeGridDay'
        },
        footerToolbar: isMobile?{
            center: 'dayGridMonth,timeGridWeek,timeGridDay'
        }: false,

        views: isMobile? { //cambia solo che se è mobile su settimana e mese vedrò D anzichè dom 04/02
            dayGridMonth: {
                dayHeaderFormat: { weekday: 'narrow' },
                buttonText: 'Mese'
            },
            timeGridWeek: {
                dayHeaderFormat: { weekday: 'narrow' },
                buttonText: 'Settimana'
            },
            timeGridDay: {
                buttonText: 'Giorno'
            }
        }: {
            dayGridMonth: {
                buttonText: 'Mese'
            },
            timeGridWeek: {
                buttonText: 'Settimana'
            },
            timeGridDay: {
                buttonText: 'Giorno'
            }

        },
        
        dateClick: function(info) {
            const title = prompt('Titolo del nuovo evento:');
            if (title) {
              calendar.addEvent({
                title: title,
                start: info.date,
                allDay: info.allDay
              });
            }
          },
    
        select: function(info) {
            const title = prompt('Titolo del nuovo evento:');
            if (title) {
                calendar.addEvent({
                    title: title,
                    start: info.start,
                    end: info.end,
                    allDay: info.allDay
                });
            }
        },
        events: []
      });
      calendar.render();
}
/*Salvo la modalità attuale della finestra*/
let lastIsMobile = window.innerWidth < 768;

/*Ascoltatore evento resize: succede ogni volta che cambio la dimensione della finestra*/
window.addEventListener('resize', () => {
    const currentIsMobile = window.innerWidth < 768;
    if (currentIsMobile !== lastIsMobile) {
        lastIsMobile = currentIsMobile;
        inizializzaCalendario(); /*se ho cambiatà modalità rinizializzo il calendario*/
    }
});
