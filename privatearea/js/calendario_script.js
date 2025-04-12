function inizializzaCalendario(){
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: window.innerWidth < 768 ? 'timeGridDay' : 'dayGridMonth',
        locale: 'it',
        selectable: true,
        nowIndicator: true,
        aspectRatio: 1.35, // più basso = calendario più alto, più compatto



        headerToolbar: {
            start:'prev,next',
            center:'title',
            end:'dayGridMonth,timeGridWeek,timeGridDay'
        },

        views: {
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