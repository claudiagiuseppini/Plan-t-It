//Salvo l'istanza del calendario in modo da poterla distruggere e ricreare quando cambia la dim dello schermo
let calendar;
function inizializzaCalendario() {
  try {
    const isMobile = window.innerWidth < 768;
    const calendarEl = document.getElementById('calendar');
    
    if (!calendarEl) throw new Error("Elemento #calendar non trovato");

    if (calendar) {
      calendar.destroy();
    }

    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: isMobile ? 'timeGridDay' : 'dayGridMonth',
      locale: 'it',
      firstDay: 1,
      nowIndicator: true,
      aspectRatio: 1.35,
      height: isMobile ? window.innerHeight * 0.6 : 600,

      headerToolbar: isMobile ? {
        start: 'prev,next',
        center: 'title',
        end: ''
      } : {
        start: 'prev,next',
        center: 'title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay'
      },

      footerToolbar: isMobile ? {
        center: 'dayGridMonth,timeGridWeek,timeGridDay'
      } : false,

      views: isMobile ? {
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
      } : {
        dayGridMonth: { buttonText: 'Mese' },
        timeGridWeek: { buttonText: 'Settimana' },
        timeGridDay: { buttonText: 'Giorno' }
      },

      events: []
    });

    calendar.render();

  } catch (e) {
  }
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

//Funzione per aggiungiere i Compiti al calendario
function aggiungiCompiti() {

    // tolgo tutti gli eventi vecchi
    calendar.getEvents().forEach(event => event.remove());

    // chiedo al DB i compiti presenti
    fetch("php/leggi_compiti.php")
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(compiti => {
            // per ogni compito aggiungo un evento al calendario
            compiti.forEach(compito => {
                try {
                    const event = {
                        id: compito.id,
                        title: compito.titolo,
                        start: compito.scadenza,
                        allDay: !compito.ora, //se non esiste orario tutto il giorno
                        extendedProps: {
                            descrizione: compito.descrizione,
                            priorita: compito.priorita,
                            condiviso: false
                        },
                        classNames: []
                    };

                    //se esiste orario
                    if (compito.ora) {
                        event.start = `${compito.scadenza}T${compito.ora}`;
                        event.allDay = false;
                    }
                     // Aggiungo la classe CSS in base alla priorità
                    if (compito.priorita === 'Alta') {
                        event.classNames.push('alta-priorita');
                    } else if (compito.priorita === 'Media') {
                        event.classNames.push('media-priorita');
                    } else if (compito.priorita === 'Bassa') {
                        event.classNames.push('bassa-priorita');
                    }

                    calendar.addEvent(event);
                } catch (e) {
                    console.error("Errore nell'aggiungere eventi:", e);
                }
            });
        })
        .catch(error => console.error("Errore nel caricare i compiti:", error));

    // chiedo al DB i compiti condivisi
    fetch("php/leggi_compiticondivisi.php")
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(compiti => {
            compiti.forEach(compito => {
                try {
                    const event = {
                        id: compito.id,
                        title: compito.titolo,
                        start: compito.scadenza,
                        allDay: !compito.ora, //se non esiste orario tutto il giorno
                        extendedProps: {
                            descrizione: compito.descrizione,
                            priorita: compito.priorita,
                            condiviso: true
                        },
                        classNames: ['condiviso']
                    };

                    //se esiste orario
                    if (compito.ora) {
                        event.start = `${compito.scadenza}T${compito.ora}`;
                        event.allDay = false;
                    }

                    calendar.addEvent(event);
                } catch (e) {
                    console.error("Errore nell'aggiungere eventi condivisi:", e);
                }
            });
        })
        .catch(error => console.error("Errore nel caricare i compiti condivisi:", error));
}