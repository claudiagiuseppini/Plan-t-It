let timerRequestId = null; //ID dell'animazione
let timerRunning = false; // Se il timer è in esecuzione o no 
let elapsedTime = 0; // Per tenere traccia del tempo trascorso
let totalTime = 0; // Tempo totale globale
let currentCycle = 0; // Numero del ciclo attuale
let totalCycles = 0; // Numero totale di cicli da eseguire
let isStudyPhase = true; // true = fase di studio, false = fase di pausa
let studyTime = 0; // Durata in secondi della fase di studio
let breakTime = 0; // Durata in secondi della fase di pausa
let circumference = 2 * Math.PI * 90; // Circonferenza globale
let offset;
let startTime = null;
// Funzione principale chiamata al caricamento della pagina
function sessioneStudio() {
    const form = document.getElementById('studyForm');
    const timerContainer = document.getElementById('timerContainer');
    if (form) {
        form.addEventListener('submit', handleSubmit);
        form.addEventListener('input', handleInput);
    }
    if (timerContainer){
        document.getElementById('reset').addEventListener('click', resetSession); 
        document.getElementById('interrompi').addEventListener('click', interruptSession); 
    }
}
//Funzione per gestire l'input
function handleInput(event){
    const targetId = event.target.id; // ID dell'elemento che ha generato l'evento
    // Rimuovi il messaggio di errore relativo
    if (targetId === 'studyHours' || targetId === 'studyMinutes') {
        document.getElementById('breakError1').classList.add('hidden');
        document.getElementById('studyHours').classList.remove('error');
        document.getElementById('studyMinutes').classList.remove('error');
    }
    if (targetId === 'breakHours' || targetId === 'breakMinutes') {
        document.getElementById('breakError2').classList.add('hidden');
        document.getElementById('breakHours').classList.remove('error');
        document.getElementById('breakMinutes').classList.remove('error')
    }
    if (targetId=== 'numCicli'){
        document.getElementById('numCicli').classList.remove('error');
        document.getElementById('breakError3').classList.add('hidden');
    }
    
    
}

// Funzione per gestire il submit del modulo
function handleSubmit(event) {
    event.preventDefault(); //evita il refresh della pagina
    const form = document.getElementById('studyForm');
    const timerContainer = document.getElementById('timerContainer');
    

    // Preleva ore e minuti e converte in secondi (Tempo Studio)
    const studyHours = parseInt(document.getElementById('studyHours').value) || 0;
    const studyMinutes = parseInt(document.getElementById('studyMinutes').value) || 0;
    studyTime = (studyHours * 60 + studyMinutes) * 60;

    // Preleva ore e minuti e converte in secondi (Tempo Pausa)
    const breakHours = parseInt(document.getElementById('breakHours').value) || 0;
    const breakMinutes = parseInt(document.getElementById('breakMinutes').value) || 0;
    breakTime = (breakHours * 60 + breakMinutes) * 60;

    totalCycles = parseInt(document.getElementById('numCicli').value) || 1; // Cicli totali
    
    //controlli campi
    if (studyHours==0 && studyMinutes==0 || studyHours<0 || studyMinutes<0){
        document.getElementById('studyHours').classList.add('error');
        document.getElementById('studyMinutes').classList.add('error');
        document.getElementById('breakError1').classList.remove('hidden');
        return;
    }
    if (breakHours==0 && breakMinutes==0 || breakHours<0 || breakMinutes<0){
        document.getElementById('breakHours').classList.add('error');
        document.getElementById('breakMinutes').classList.add('error');
        document.getElementById('breakError2').classList.remove('hidden');
        return;
    }
    if (totalCycles<0){
        document.getElementById('numCicli').classList.add('error');
        document.getElementById('breakError3').classList.remove('hidden');
        return;
    }
    
        form.style.display = 'none';
        timerContainer.classList.add('visible');
        currentCycle = 1;
        isStudyPhase = true; // Inizia sempre con lo studio
        startPhase(); // Avvia la prima fase
    
}
// Avvia una nuova fase (studio o pausa)
function startPhase() {
    const label = document.querySelector('.timer-label');
    const circleTimer = document.getElementById('circle-timer');
    elapsedTime = 0; // Azzera il tempo trascorso

    if (isStudyPhase) {
        totalTime = studyTime;
        circleTimer.style.stroke = "#4caf50"; // verde
        label.innerHTML = `Studio <br> Ciclo ${currentCycle} di ${totalCycles}`;
    } else {
        totalTime = breakTime;
        circleTimer.style.stroke = "#FAE7A5"; // giallo 
        label.innerHTML = `Pausa <br>  Ciclo ${currentCycle} di ${totalCycles}`;
    }

    startTimer(elapsedTime); // Avvia il timer da zero
}

// Funzione che gestisce l'animazione del timer
function startTimer(startFrom) {
    const circleTimer = document.getElementById('circle-timer');
    const timeDisplay = document.getElementById('timeDisplay');

   let startTime = null;

   circleTimer.style.strokeDashoffset=circumference;
    circleTimer.style.strokeDasharray = circumference;
    /*Nota: circleTimer.style.strokeDasharray -> imposta il massimo che voglio colorare, poi decido quanta parte mostrare con il prossimo valore
            circleTimer.style.strokeDashoffset -> imposta quanto contorno grigio si vede*/

    function animate(timestamp) {
        if (!startTime) startTime = timestamp - startFrom * 1000; // Calcola il tempo di partenza corretto
        
        /*Per vedere più velocemente il funzionamento del timer si può mettere un valore alla
        seguente variabile che indica a quanto corrisponde 1 min in secondi, per farlo funzionare in tempo
        reale rimettere 1 a speedMultipowe (attenzione: se settiamo questa variabile il pulsante riprendi non 
        funziona bene)*/
        const speedMultiplier = 1; // 1 secondo reale = 60 secondi simulati
        const elapsed = (timestamp - startTime) / 1000 *speedMultiplier ;


        elapsedTime = elapsed; // Salva il tempo effettivamente trascorso
        const remainingTime = Math.max(totalTime - elapsedTime, 0);
        
        // Aggiornamento cerchio
        offset = circumference * (remainingTime / totalTime); 
        circleTimer.style.strokeDashoffset = offset; //più basso è più è bassa la parte grigia del cerchio, arriverà a 0 e quindi si vedrà tutto il bordo verde

        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = Math.floor(remainingTime % 60);
        timeDisplay.innerHTML = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; //mostra il tempo rimanente in formato hh:mm:ss
    
        if (remainingTime > 0) {
            timerRequestId = requestAnimationFrame(animate);
        } else {
            // Fase finita
            timerRunning = false;
            if (!isStudyPhase) currentCycle++; // Se era una pausa, incrementa il ciclo
 
            if (currentCycle < totalCycles || (!isStudyPhase))  {
                 isStudyPhase = !isStudyPhase; // Passa alla fase opposta
                 circleTimer.style.strokeDasharray = circumference;
                    circleTimer.style.strokeDashoffset = circumference;
                 setTimeout(startPhase, 1000); // Dopo 1 sec inizia la prossima fase
            } 
            else if ( isStudyPhase) {
                 // Sessione completata (rimuove l'ultima pausa che sarebbe inutile)
                 timeDisplay.innerHTML = "Sessione Completa!";
                 timeDisplay.style.fontSize = "1.2rem";
                 document.querySelector('.timer-label').textContent = "✔ Tutti i cicli completati!";
                 document.getElementById('interrompi').disabled = true;
            }
        }
    }
    timerRunning = true;
    timerRequestId = requestAnimationFrame(animate);
}

//Pulsante Reset
function resetSession(){
    const form = document.getElementById('studyForm');
    const timerContainer = document.getElementById('timerContainer');
    
    form.style.display = 'block';
    timerContainer.classList.remove('visible');
    form.reset();
    
    // Ferma il timer se è in esecuzione
    if (timerRequestId !== null) {
        cancelAnimationFrame(timerRequestId);
    }

    document.getElementById('timeDisplay').innerHTML = '00:00';
    timeDisplay.style.fontSize = "2rem";
    document.getElementById('circle-timer').style.strokeDashoffset = circumference; //Reset grafico
    document.getElementById('interrompi').textContent = "Interrompi";
    document.getElementById('interrompi').disabled = false;
    //Reset variabili globali
    timerRunning = false;
    elapsedTime = 0;
    totalTime = 0;
    currentCycle = 0;
    totalCycles = 0;
    isStudyPhase = true;
}

//Pulsante Interrompi
function interruptSession(){
    //se ho cliccato su Interrompi
    if (timerRunning){
        timerRunning = false;
        cancelAnimationFrame(timerRequestId);
        document.getElementById('interrompi').textContent = "Riprendi";
    } 
    //se ho cliccato su Riprendi
    else {
        timerRunning = true;
        document.getElementById('interrompi').textContent = "Interrompi";
        startTimer(elapsedTime); 
    }
}

