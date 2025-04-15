function inizializzaCalendarioHome(){
    const isMobile = window.innerWidth < 768;

    var calendarEl = document.getElementById('calendarList');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'listMonth', 
        locale: 'it',
        validRange: { start: new Date() }, 
        firstDay: 1, 
        nowIndicator: true,

        headerToolbar:false,
        views: {
            listDay: {
                buttonText: 'Oggi'
            }
        },

        // Imposta gli eventi per oggi (dobbiamo sostituirli con quelli reali)
        events: [
            { title: 'Compito 1', start: '2025-04-13T10:00:00' },
            { title: 'Compito 2', start: '2025-04-13T14:00:00' }
        ]
    });

    calendar.render();

}
