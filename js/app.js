let allQuotes = [];
let currentQuoteIndex = -1;
const quoteButton = document.getElementById('new-quote-btn');

quoteButton.addEventListener('click', displayRandomQuote);

function displayRandomQuote() {
    const display = document.getElementById('quotes-display');
    if (allQuotes.length === 0) {
        display.innerHTML = `<p class="widget-error">No quotes to show.</p>`;
        return;
    }
    let randomIndex;
do {
    randomIndex = Math.floor(Math.random() * allQuotes.length);
} while (randomIndex === currentQuoteIndex && allQuotes.length > 1);
currentQuoteIndex = randomIndex;
    const quote = allQuotes[randomIndex];
    display.innerHTML = `
        <div class="quote-card">
            <div class="quote-text">"${quote.text}"</div>
            <div class="quote-author">— ${quote.author}</div>
        </div>`;
}

function loadWeather() {
    fetch('./data/weather.json')
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => {
            console.error('Error loading weather:', error);
            displayWeatherError();
        });
}


function displayTasks() {
    const tasks = loadTasks();
    const list = document.getElementById('task-list');
    list.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener('click', () => deleteTask(index));
        li.appendChild(deleteBtn);
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('click', () => toggleTask(index));
        li.appendChild(checkbox);
        list.appendChild(li);
    });
}

function displayWeather(weather) {
    document.getElementById('weather-display').innerHTML = `
        <div class="weather-current">
            <div class="weather-icon">${weather.icon}</div>
            <div class="weather-temp">${weather.temperature}°F</div>
            <div class="weather-location">${weather.location}</div>
            <div class="weather-condition">${weather.condition}</div>
        </div>`;
}

function displayWeatherError() {
    document.getElementById('weather-display').innerHTML =
        `<p class="widget-error">Weather data is unavailable right now.</p>`;
}

function displayQuotesError() {
    document.getElementById('quotes-display').innerHTML =
        `<p class="widget-error">Quotes are unavailable right now.</p>`;
}


function loadQuotes() {
    fetch('./data/quotes.json')
        .then(response => response.json())
        .then(quotes => {
            allQuotes = quotes;
            displayRandomQuote();

            if (allQuotes.length > 0) {
                quoteButton.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error loading quotes:', error);
            displayQuotesError();
        });
}


function loadTasks() {
    const tasksJSON = localStorage.getItem('dashboardTasks');
    return tasksJSON ? JSON.parse(tasksJSON) : [];
}
function saveTasks(tasks) {
    localStorage.setItem('dashboardTasks', JSON.stringify(tasks));
}
function addTask(taskText) {
    const tasks = loadTasks();
    tasks.push({ text: taskText, completed: false, id: Date.now() });
    saveTasks(tasks);
    displayTasks();
}
function toggleTask(index) {
    const tasks = loadTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    displayTasks();
}
function deleteTask(index) {
    const tasks = loadTasks();
    if (confirm(`Delete task: "${tasks[index].text}"?`)) {
        tasks.splice(index, 1);
        saveTasks(tasks);
        displayTasks();
    }
}

function initializeTheme() {
    if (localStorage.getItem('dashboardTheme') === 'dark') {
        document.body.classList.add('theme-dark');
    }
}
function toggleTheme() {
    const isDark = document.body.classList.toggle('theme-dark');
    if (isDark) {
        localStorage.setItem('dashboardTheme', 'dark');
    } else {
        localStorage.setItem('dashboardTheme', 'light');
    }
}

loadWeather();
loadQuotes();
displayTasks();

document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
initializeTheme();

