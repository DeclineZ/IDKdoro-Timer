
let isRunning = false;
let isFocusMode = true;
let startTime;
let elapsedTime = 0;
let timerInterval;
let restTime = 0;

const timerElement = document.getElementById('timer');
const toggleBtn = document.getElementById('toggle-btn');
const modeTitle = document.getElementById('mode-title');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const textColorInput = document.getElementById('text-color-input');
const bgColorInput = document.getElementById('bg-color-input');
const backgroundInput = document.getElementById('background-input');
const notificationSound = document.getElementById('notification-sound');
const resetBtn = document.getElementById('reset-btn')

function formatTime(ms) {
    const date = new Date(ms);
    return date.toISOString().substr(11, 8);
}

function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    timerElement.textContent = formatTime(elapsedTime);
}

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTimer, 1000);
    toggleBtn.textContent = 'Stop';
    isRunning = true;
}

function stopTimer() {
    clearInterval(timerInterval);
    toggleBtn.textContent = 'Start';
    isRunning = false;
}

function resetTimer() {
    stopTimer();
    switchToFocusMode();    
    isRunning = false;
    isFocusMode = true;
    elapsedTime = 0;
    restTime = 0;
    timerElement.textContent = formatTime(0);
}

function switchToRestMode() {
    isFocusMode = false;
    modeTitle.textContent = 'Rest Mode';
    restTime = Math.floor(elapsedTime / (5 * 1000)); // Convert to seconds and divide by 5
    elapsedTime = restTime * 1000; // Convert back to milliseconds
    timerElement.textContent = formatTime(elapsedTime);
    toggleBtn.textContent = 'Start Rest';
}

function startRestTimer() {
    startTime = Date.now() + restTime * 1000;
    timerInterval = setInterval(() => {
        const remaining = startTime - Date.now();
        if (remaining <= 0) {
            stopTimer();
            switchToFocusMode();
            sendNotification();
            playNotificationSound();
        } else {
            timerElement.textContent = formatTime(remaining);
        }
    }, 1000);
    toggleBtn.textContent = 'Stop Rest';
    isRunning = true;
}

function switchToFocusMode() {
    isFocusMode = true;
    modeTitle.textContent = 'Focus Mode';
    elapsedTime = 0;
    updateTimer();
    toggleBtn.textContent = 'Start';
}

function sendNotification() {
    if (Notification.permission === "granted") {
        new Notification("Rest Time Over!", {
            body: "Time to get back to work!",
            icon: "icon-512x512.png" // Replace with your icon URL
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                sendNotification();
            }
        });
    }
}

function playNotificationSound() {
    notificationSound.play();
}

toggleBtn.addEventListener('click', () => {
    if (isFocusMode) {
        if (isRunning) {
            stopTimer();
            switchToRestMode();
        } else {
            startTimer();
        }
    } else {
        if (isRunning) {
            stopTimer();
        } else {
            startRestTimer();
        }
    }
});

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const li = document.createElement('li');
        li.className = 'task-item flex items-center mb-2';
        li.innerHTML = `
            <input type="checkbox" class="mr-2">
            <span class="flex-grow">${taskText}</span>
            <button class="delete-btn ml-2 text-red-500">&times;</button>
        `;
        taskList.appendChild(li);
        taskInput.value = '';

        li.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
            if (e.target.checked) {
                li.classList.add('completed');
            } else {
                li.classList.remove('completed');
            }
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
        });
    }
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'block';
});

resetBtn.addEventListener('click', () => {
    resetTimer();
})

saveSettingsBtn.addEventListener('click', () => {
    const textColor = textColorInput.value;
    const bgColor = bgColorInput.value;
    const backgroundUrl = backgroundInput.value;

    // Apply text color
    document.body.style.color = textColor;

    // Apply background color
    document.body.style.backgroundColor = bgColor;

    // Apply background image/gif
    if (backgroundUrl) {
        document.body.style.backgroundImage = `url(${backgroundUrl})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
    } else {
        document.body.style.backgroundImage = 'none';
    }

    settingsModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
});

// Request notification permission
if ("Notification" in window) {
    Notification.requestPermission();
}


// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}