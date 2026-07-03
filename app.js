const RATE = 40;
const INTERVAL = 4;     

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const arrivedBtn = document.getElementById('arrivedBtn');
const fareValueEl = document.getElementById('fareValue');
const elapsedTimeEl = document.getElementById('elapsedTime');
const countdownEl = document.getElementById('countdown');
const statusLabel = document.getElementById('statusLabel');
const liveDot = document.getElementById('liveDot');
const tripSummary = document.getElementById('tripSummary');
const tripSummaryAmount = document.getElementById('tripSummaryAmount');

const START_FARE = 3000; 
let fare = START_FARE;
let elapsedSeconds = 0;
let secondsToNextCharge = INTERVAL;
let tickHandle = null;
let running = false;

function formatSom(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return m + ':' + s;
}

function renderFare(bump) {
    fareValueEl.innerHTML = formatSom(fare) + '<span class="fare-unit">so\'m</span>';
    if (bump) {
        fareValueEl.classList.remove('bump');
        void fareValueEl.offsetWidth; // restart animation
        fareValueEl.classList.add('bump');
    }
}

function tick() {
    elapsedSeconds += 1;
    secondsToNextCharge -= 1;

    elapsedTimeEl.textContent = formatTime(elapsedSeconds);

    if (secondsToNextCharge <= 0) {
        fare += RATE;
        renderFare(true);
        secondsToNextCharge = INTERVAL;
    }

    countdownEl.textContent = secondsToNextCharge + 's';
}

function start() {
    if (running) return;
    running = true;

    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusLabel.textContent = 'Yo\'lda';
    liveDot.classList.add('live');

    tickHandle = setInterval(tick, 1000);
}

function stop() {
    if (!running) return;
    running = false;

    clearInterval(tickHandle);
    tickHandle = null;

    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusLabel.textContent = 'To\'xtatilgan';
    liveDot.classList.remove('live');
}

function arrived() {
    // hisoblagichni to'xtatish (agar ishlab turgan bo'lsa)
    if (running) {
        clearInterval(tickHandle);
        tickHandle = null;
        running = false;
    }

    startBtn.disabled = true;
    stopBtn.disabled = true;
    arrivedBtn.disabled = true;
    statusLabel.textContent = 'Yetib keldik';
    liveDot.classList.remove('live');

    tripSummaryAmount.textContent = formatSom(fare) + ' so\'m • ' + formatTime(elapsedSeconds);
    tripSummary.classList.add('show');
}

function resetTrip() {
    fare = START_FARE;
    elapsedSeconds = 0;
    secondsToNextCharge = INTERVAL;

    renderFare(false);
    elapsedTimeEl.textContent = formatTime(0);
    countdownEl.textContent = secondsToNextCharge + 's';

    tripSummary.classList.remove('show');

    startBtn.disabled = false;
    stopBtn.disabled = true;
    arrivedBtn.disabled = false;
    statusLabel.textContent = 'To\'xtatilgan';
}

startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
arrivedBtn.addEventListener('click', () => {
    if (arrivedBtn.textContent.trim() === 'Yangi safar') {
        resetTrip();
        arrivedBtn.textContent = 'Manzilga yetib keldik';
    } else {
        arrived();
        arrivedBtn.disabled = false;
        arrivedBtn.textContent = 'Yangi safar';
    }
});

renderFare(false);
countdownEl.textContent = secondsToNextCharge + 's';