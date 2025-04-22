function sessioneStudio() {
    const form = document.getElementById('studyForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
}

// Funzione per gestire il submit del modulo
function handleSubmit(event) {
    //evita il refresh della pagina
    event.preventDefault(); 
    const form = document.getElementById('studyForm');
    const timerContainer = document.getElementById('timerContainer');
    
    form.style.display = 'none';
    timerContainer.classList.add('visible');

    // Preleva ore e minuti e converte in secondi
    const studyHours = parseInt(document.getElementById('studyHours').value) || 0;
    const studyMinutes = parseInt(document.getElementById('studyMinutes').value) || 0;
    const studyTimeInSeconds = (studyHours * 60 + studyMinutes) * 60;

    // Avvia il timer
    startTimer(studyTimeInSeconds);
}

// Funzione per gestire il timer circolare
function startTimer(duration) {
    const circleTimer = document.getElementById('circle-timer');
    const timeDisplay = document.getElementById('timeDisplay');

    const totalTime = duration;
    let startTime = null;

    const circumference = 2 * Math.PI * 90;
    circleTimer.style.strokeDasharray = circumference;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime) / 1000; // in secondi
        const remainingTime = Math.max(totalTime - elapsed, 0);

        // Update circle
        const offset = circumference * (remainingTime / totalTime);
        circleTimer.style.strokeDashoffset = offset;

        // Update time display
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = Math.floor(remainingTime % 60);
        timeDisplay.innerHTML = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (remainingTime > 0) {
            requestAnimationFrame(animate);
        } else {
            timeDisplay.innerHTML = "Tempo Scaduto!";
        }
    }

    requestAnimationFrame(animate);
}