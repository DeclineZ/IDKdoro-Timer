let isRunning = false;
let isFocusMode = true;
let startTime;
let elapsedTime = 0;
let timerInterval;
let restTime = 0;

const startStopBtn = document.getElementById('startStopBtn');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const bgColorPicker = document.getElementById('bgColorPicker');
const textColorPicker = document.getElementById('textColorPicker');
const applyThemeBtn = document.getElementById('applyThemeBtn');

startStopBtn.addEventListener('click', toggleTimer);
addTaskBtn.addEventListener('click', addTask);
applyThemeBtn.addEventListener('click', applyTheme);

function toggleTimer() {
    if (isFocusMode) {
        if (isRunning) {
            stopFocusTimer();
        } else {
            startFocusTimer();
        }
    } else {
        if (isRunning) {
            stopRestTimer();
        } else {
            startRestTimer();
        }
}
}

function startFocusTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTimer, 1000);
    startStopBtn.textContent = 'Stop';
    isRunning = true;
}

function stopFocusTimer() {
    clearInterval(timerInterval);
    elapsedTime = Date.now() - startTime;
    restTime = Math.floor(elapsedTime / 5000);
    switchToRestMode();
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

function startRestTimer() {
    timerInterval = setInterval(updateRestTimer, 1000);
    startStopBtn.textContent = 'Stop Rest';
    isRunning = true;
}

function stopRestTimer() {
    clearInterval(timerInterval);
    switchToFocusMode();
}

function updateRestTimer() {
    if (restTime > 0) {
        restTime--;
        const minutes = Math.floor(restTime / 60);
        const seconds = restTime % 60;
        minutesDisplay.textContent = String(minutes).padStart(2, '0');
        secondsDisplay.textContent = String(seconds).padStart(2, '0');
    } else {
        clearInterval(timerInterval);
        switchToFocusMode();
    }
}

function switchToRestMode() {
    isFocusMode = false;
    elapsedTime = 0;
    minutesDisplay.textContent = '00';
    secondsDisplay.textContent = String(restTime).padStart(2, '0');
    startStopBtn.textContent = 'Start Rest';
}

function switchToFocusMode() {
    isFocusMode = true;
    restTime = 0;
    minutesDisplay.textContent = '00';
    secondsDisplay.textContent = '00';
    startStopBtn.textContent = 'Start Focus';
    isRunning = false;
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const taskItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => {
            taskItem.classList.toggle('checked', checkbox.checked);
        });
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskSpan);
        taskList.appendChild(taskItem);
        taskInput.value = '';
    }
}

const bgImageUrl = document.getElementById('bgImageUrl');

function applyTheme() {
    document.body.style.setProperty('--bg-color', bgColorPicker.value);
    document.body.style.setProperty('--text-color', textColorPicker.value);
    const imageUrl = bgImageUrl.value.trim();
    if (imageUrl) {
        document.body.style.setProperty('--bg-image', `url(${imageUrl})`);
    } else {
        document.body.style.setProperty('--bg-image', 'none');
    }
}

const resetBtn = document.getElementById('resetBtn');

resetBtn.addEventListener('click', resetTimer);

function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    restTime = 0;
    isRunning = false;
    isFocusMode = true;
    minutesDisplay.textContent = '00';
    secondsDisplay.textContent = '00';
    startStopBtn.textContent = 'Start Focus';
}

const resetTasksBtn = document.getElementById('resetTasksBtn');

resetTasksBtn.addEventListener('click', resetTasks);

function resetTasks() {
    taskList.innerHTML = '';
}


