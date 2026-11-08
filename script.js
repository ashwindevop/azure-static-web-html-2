// 1. Live Real-Time Clock Function
function updateLiveClock() {
    const now = new Date();
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');

    const timeString = now.toLocaleTimeString('en-US', { hour12: true });
    const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    if (clockEl) clockEl.textContent = timeString;
    if (dateEl) dateEl.textContent = dateString;
}
setInterval(updateLiveClock, 1000);
updateLiveClock();

// 2. Timer Logic
let totalSeconds = 1500;
let initialSeconds = 1500;
let timerInterval = null;
let isRunning = false;

const display = document.getElementById('display');
const progress = document.getElementById('progress');
const minsInput = document.getElementById('mins');
const secsInput = document.getElementById('secs');
const startBtn = document.getElementById('startBtn');
const toast = document.getElementById('toast');

const circleRadius = 110;
const circumference = 2 * Math.PI * circleRadius;

function updateDisplay() {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    
    const offset = circumference - (totalSeconds / initialSeconds) * circumference;
    progress.style.strokeDashoffset = isNaN(offset) ? 0 : offset;
}

function setPreset(mins) {
    resetTimer();
    minsInput.value = mins;
    secsInput.value = 0;
    applyInputs();
}

function applyInputs() {
    const m = parseInt(minsInput.value) || 0;
    const s = parseInt(secsInput.value) || 0;
    totalSeconds = m * 60 + s;
    initialSeconds = totalSeconds;
    updateDisplay();
}

function toggleTimer() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    if (totalSeconds <= 0) applyInputs();
    if (totalSeconds <= 0) return;

    isRunning = true;
    startBtn.textContent = 'PAUSE';
    startBtn.style.background = 'linear-gradient(45deg, #f7b731, #eb3b5a)';

    timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateDisplay();
        } else {
            finishTimer();
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    startBtn.textContent = 'RESUME';
    startBtn.style.background = 'var(--btn-bg)';
    clearInterval(timerInterval);
}

function resetTimer() {
    pauseTimer();
    startBtn.textContent = 'START';
    applyInputs();
}

function finishTimer() {
    pauseTimer();
    startBtn.textContent = 'START';
    playAlarm();
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 5000);
}

function playAlarm() {
    try {
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease("C5", "8n");
    } catch(e) {}
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
}

minsInput.addEventListener('change', applyInputs);
secsInput.addEventListener('change', applyInputs);

updateDisplay();
