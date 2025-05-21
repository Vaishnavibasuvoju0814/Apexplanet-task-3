// Quiz Questions
const quizQuestions = [
    {
        question: "What is the term for the scientific study of weather?",
        options: ["Climatology", "Meteorology", "Geology", "Hydrology"],
        answer: 1
    },
    {
        question: "Which instrument measures atmospheric pressure?",
        options: ["Thermometer", "Barometer", "Hygrometer", "Anemometer"],
        answer: 1
    },
    {
        question: "What scale is used to measure tornado intensity?",
        options: ["Richter scale", "Fujita scale", "Saffir-Simpson scale", "Beaufort scale"],
        answer: 1
    },
    {
        question: "Which gas makes up the majority of Earth's atmosphere?",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Argon"],
        answer: 2
    },
    {
        question: "What type of cloud is tall and associated with thunderstorms?",
        options: ["Cumulus", "Stratus", "Cirrus", "Cumulonimbus"],
        answer: 3
    },
    {
        question: "What is the name for a tropical cyclone in the Atlantic Ocean?",
        options: ["Typhoon", "Hurricane", "Cyclone", "Monsoon"],
        answer: 1
    },
    {
        question: "Which layer of the atmosphere contains the ozone layer?",
        options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
        answer: 1
    },
    {
        question: "What causes wind?",
        options: [
            "Rotation of the Earth",
            "Differences in air pressure",
            "Ocean currents",
            "Gravitational pull of the Moon"
        ],
        answer: 1
    },
    {
        question: "What is the term for rain that freezes before hitting the ground?",
        options: ["Sleet", "Hail", "Snow", "Freezing rain"],
        answer: 0
    },
    {
        question: "Which weather phenomenon is measured on the Beaufort scale?",
        options: ["Temperature", "Wind speed", "Precipitation", "Atmospheric pressure"],
        answer: 1
    }
];

// DOM Elements
const quizIntro = document.getElementById('quizIntro');
const quizQuestionsSection = document.getElementById('quizQuestions');
const quizResults = document.getElementById('quizResults');
const startQuizBtn = document.getElementById('startQuiz');
const nextQuestionBtn = document.getElementById('nextQuestion');
const restartQuizBtn = document.getElementById('restartQuiz');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const progressBar = document.getElementById('progress');
const scoreElement = document.getElementById('score');
const totalQuestionsElement = document.getElementById('totalQuestions');
const scorePercentElement = document.getElementById('scorePercent');
const feedbackElement = document.getElementById('feedback');
const weatherDisplay = document.getElementById('weatherDisplay');
const refreshWeatherBtn = document.getElementById('refreshWeather');

// Quiz Variables
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let quizCompleted = false;

// Weather API Variables
const API_KEY = '9ac8f66cec5c57e1af2a7c4a75f3af3d'; 
const DEFAULT_CITY = 'London';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    totalQuestionsElement.textContent = quizQuestions.length;
    fetchWeatherData(DEFAULT_CITY);
});

// Event Listeners
startQuizBtn.addEventListener('click', startQuiz);
nextQuestionBtn.addEventListener('click', showNextQuestion);
restartQuizBtn.addEventListener('click', restartQuiz);
refreshWeatherBtn.addEventListener('click', () => fetchWeatherData(DEFAULT_CITY));

// Quiz Functions
function startQuiz() {
    quizIntro.style.display = 'none';
    quizQuestionsSection.style.display = 'block';
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        showResults();
        return;
    }

    const question = quizQuestions[currentQuestionIndex];
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';

    // Update progress bar
    const progress = ((currentQuestionIndex) / quizQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;

    // Disable next button until an option is selected
    nextQuestionBtn.disabled = true;

    // Create options
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        
        // Check if user has already answered this question
        if (userAnswers[currentQuestionIndex] !== undefined) {
            if (index === question.answer) {
                optionElement.classList.add('correct');
            } else if (index === userAnswers[currentQuestionIndex] && userAnswers[currentQuestionIndex] !== question.answer) {
                optionElement.classList.add('incorrect');
            }
        }
        
        optionElement.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionElement);
    });
}

function selectOption(optionIndex) {
    const question = quizQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    // Remove selected class from all options
    options.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    options[optionIndex].classList.add('selected');
    
    // Store user answer
    userAnswers[currentQuestionIndex] = optionIndex;
    
    // Enable next button
    nextQuestionBtn.disabled = false;
}

function showNextQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const selectedOptionIndex = userAnswers[currentQuestionIndex];
    
    // Check if answer is correct and update score
    if (selectedOptionIndex === question.answer) {
        score++;
    }
    
    currentQuestionIndex++;
    showQuestion();
}

function showResults() {
    quizQuestionsSection.style.display = 'none';
    quizResults.style.display = 'block';
    
    // Calculate score percentage
    const percentage = Math.round((score / quizQuestions.length) * 100);
    
    // Update results display
    scoreElement.textContent = score;
    scorePercentElement.textContent = `${percentage}%`;
    
    // Animate the progress circle
    const circle = document.querySelector('.circle-progress');
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    
    // Provide feedback based on score
    let feedback = '';
    if (percentage >= 80) {
        feedback = 'Excellent! You have great knowledge of weather phenomena.';
    } else if (percentage >= 60) {
        feedback = 'Good job! You know quite a bit about weather.';
    } else if (percentage >= 40) {
        feedback = 'Not bad! You have some weather knowledge.';
    } else {
        feedback = 'Keep learning! Check out some weather resources to improve your knowledge.';
    }
    
    feedbackElement.textContent = feedback;
    quizCompleted = true;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    quizCompleted = false;
    
    quizResults.style.display = 'none';
    quizQuestionsSection.style.display = 'block';
    
    showQuestion();
}

// Weather API Functions
async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
        if (!response.ok) {
            throw new Error('Weather data not available');
        }
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherDisplay.querySelector('.weather-details p').textContent = 'Failed to load weather data. Please try again later.';
    }
}

function displayWeatherData(data) {
    const weatherDetails = weatherDisplay.querySelector('.weather-details p');
    const weatherIcon = weatherDisplay.querySelector('.weather-icon i');
    
    const city = data.name;
    const country = data.sys.country;
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    
    // Update weather icon based on conditions
    const weatherId = data.weather[0].id;
    let iconClass = 'fa-cloud';
    
    if (weatherId >= 200 && weatherId < 300) {
        iconClass = 'fa-bolt'; // Thunderstorm
    } else if (weatherId >= 300 && weatherId < 400) {
        iconClass = 'fa-cloud-rain'; // Drizzle
    } else if (weatherId >= 500 && weatherId < 600) {
        iconClass = 'fa-umbrella'; // Rain
    } else if (weatherId >= 600 && weatherId < 700) {
        iconClass = 'fa-snowflake'; // Snow
    } else if (weatherId >= 700 && weatherId < 800) {
        iconClass = 'fa-smog'; // Atmosphere
    } else if (weatherId === 800) {
        iconClass = 'fa-sun'; // Clear
    } else if (weatherId > 800) {
        iconClass = 'fa-cloud'; // Clouds
    }
    
    weatherIcon.className = `fas ${iconClass}`;
    
    weatherDetails.innerHTML = `
        <strong>${city}, ${country}</strong><br>
        ${temp}°C, ${description.charAt(0).toUpperCase() + description.slice(1)}<br>
        Humidity: ${humidity}%<br>
        Wind: ${windSpeed} m/s
    `;
}