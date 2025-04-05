document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const settingsScreen = document.getElementById('settings-screen');
    const creditsScreen = document.getElementById('credits-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultsScreen = document.getElementById('results-screen');
    
    const startBtn = document.getElementById('start-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const creditsBtn = document.getElementById('credits-btn');
    const saveSettingsBtn = document.getElementById('save-settings');
    const backFromSettingsBtn = document.getElementById('back-from-settings');
    const backFromCreditsBtn = document.getElementById('back-from-credits');
    const playAgainBtn = document.getElementById('play-again');
    const backToMenuBtn = document.getElementById('back-to-menu');
    
    const difficultySelect = document.getElementById('difficulty');
    const timeLimitInput = document.getElementById('time-limit');
    const questionsInput = document.getElementById('questions');
    
    const questionElement = document.getElementById('question');
    const optionButtons = document.querySelectorAll('.option-btn');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const questionCountElement = document.getElementById('question-count');
    const feedbackElement = document.querySelector('.feedback');
    
    const finalScoreElement = document.getElementById('final-score');
    const totalQuestionsElement = document.getElementById('total-questions');
    const correctAnswersElement = document.getElementById('correct-answers');
    const wrongAnswersElement = document.getElementById('wrong-answers');
    const averageTimeElement = document.getElementById('average-time');
    
    // Game Variables
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeLeft;
    let questions = [];
    let gameSettings = {
        difficulty: 'medium',
        timeLimit: 15,
        totalQuestions: 10
    };
    
    // Initialize the game
    init();
    
    function init() {
        // Load saved settings from localStorage if available
        const savedSettings = localStorage.getItem('mathQuizSettings');
        if (savedSettings) {
            gameSettings = JSON.parse(savedSettings);
            difficultySelect.value = gameSettings.difficulty;
            timeLimitInput.value = gameSettings.timeLimit;
            questionsInput.value = gameSettings.totalQuestions;
        }
        
        // Event Listeners
        startBtn.addEventListener('click', startGame);
        settingsBtn.addEventListener('click', () => showScreen('settings-screen'));
        creditsBtn.addEventListener('click', () => showScreen('credits-screen'));
        saveSettingsBtn.addEventListener('click', saveSettings);
        backFromSettingsBtn.addEventListener('click', () => showScreen('start-screen'));
        backFromCreditsBtn.addEventListener('click', () => showScreen('start-screen'));
        playAgainBtn.addEventListener('click', startGame);
        backToMenuBtn.addEventListener('click', () => showScreen('start-screen'));
        
        optionButtons.forEach(button => {
            button.addEventListener('click', () => selectAnswer(button));
        });
    }
    
    function showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show the requested screen
        document.getElementById(screenId).classList.add('active');
    }
    
    function saveSettings() {
        gameSettings = {
            difficulty: difficultySelect.value,
            timeLimit: parseInt(timeLimitInput.value),
            totalQuestions: parseInt(questionsInput.value)
        };
        
        // Save to localStorage
        localStorage.setItem('mathQuizSettings', JSON.stringify(gameSettings));
        
        // Show confirmation and return to start screen
        alert('Settings saved successfully!');
        showScreen('start-screen');
    }
    
    function startGame() {
        // Reset game variables
        currentQuestionIndex = 0;
        score = 0;
        questions = [];
        
        // Generate questions based on difficulty
        generateQuestions();
        
        // Update UI
        scoreElement.textContent = `Score: ${score}`;
        totalQuestionsElement.textContent = gameSettings.totalQuestions;
        
        // Show game screen and start first question
        showScreen('game-screen');
        showQuestion();
    }
    
    function generateQuestions() {
        const operationTypes = ['addition', 'subtraction', 'multiplication', 'division'];
        
        for (let i = 0; i < gameSettings.totalQuestions; i++) {
            const operation = operationTypes[Math.floor(Math.random() * operationTypes.length)];
            let a, b, answer;
            
            switch (gameSettings.difficulty) {
                case 'easy':
                    a = Math.floor(Math.random() * 10) + 1;
                    b = Math.floor(Math.random() * 10) + 1;
                    break;
                case 'medium':
                    a = Math.floor(Math.random() * 20) + 1;
                    b = Math.floor(Math.random() * 20) + 1;
                    break;
                case 'hard':
                    a = Math.floor(Math.random() * 50) + 1;
                    b = Math.floor(Math.random() * 50) + 1;
                    break;
            }
            
            switch (operation) {
                case 'addition':
                    answer = a + b;
                    questions.push({
                        text: `${a} + ${b} = ?`,
                        answer: answer,
                        options: generateOptions(answer)
                    });
                    break;
                case 'subtraction':
                    // Ensure result is positive
                    if (a < b) [a, b] = [b, a];
                    answer = a - b;
                    questions.push({
                        text: `${a} - ${b} = ?`,
                        answer: answer,
                        options: generateOptions(answer)
                    });
                    break;
                case 'multiplication':
                    answer = a * b;
                    questions.push({
                        text: `${a} × ${b} = ?`,
                        answer: answer,
                        options: generateOptions(answer)
                    });
                    break;
                case 'division':
                    // Ensure division is clean
                    answer = a;
                    a = a * b;
                    questions.push({
                        text: `${a} ÷ ${b} = ?`,
                        answer: answer,
                        options: generateOptions(answer)
                    });
                    break;
            }
        }
    }
    
    function generateOptions(correctAnswer) {
        const options = [correctAnswer];
        let range;
        
        switch (gameSettings.difficulty) {
            case 'easy':
                range = 5;
                break;
            case 'medium':
                range = 10;
                break;
            case 'hard':
                range = 20;
                break;
        }
        
        // Generate 3 unique wrong answers
        while (options.length < 4) {
            let option;
            if (Math.random() > 0.5) {
                option = correctAnswer + Math.floor(Math.random() * range) + 1;
            } else {
                option = correctAnswer - Math.floor(Math.random() * range) - 1;
            }
            
            // Ensure option is positive and not duplicate
            if (option > 0 && !options.includes(option)) {
                options.push(option);
            }
        }
        
        // Shuffle options
        return options.sort(() => Math.random() - 0.5);
    }
    
    function showQuestion() {
        // Reset feedback
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';
        
        // Update question count
        questionCountElement.textContent = `Question: ${currentQuestionIndex + 1}/${gameSettings.totalQuestions}`;
        
        // Get current question
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.text;
        
        // Set options
        optionButtons.forEach((button, index) => {
            button.textContent = currentQuestion.options[index];
            button.disabled = false;
            button.style.backgroundColor = '';
            button.style.borderColor = '';
        });
        
        // Start timer
        timeLeft = gameSettings.timeLimit;
        timerElement.textContent = `Time: ${timeLeft}`;
        
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Time: ${timeLeft}`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                timeUp();
            }
        }, 1000);
    }
    
    function selectAnswer(selectedButton) {
        clearInterval(timer);
        
        // Disable all buttons
        optionButtons.forEach(button => {
            button.disabled = true;
        });
        
        // Get current question
        const currentQuestion = questions[currentQuestionIndex];
        const selectedAnswer = parseInt(selectedButton.textContent);
        
        // Check answer
        if (selectedAnswer === currentQuestion.answer) {
            // Correct answer
            score++;
            scoreElement.textContent = `Score: ${score}`;
            selectedButton.style.backgroundColor = 'rgba(76, 201, 240, 0.2)';
            selectedButton.style.borderColor = 'var(--success-color)';
            feedbackElement.textContent = 'Correct! ✔';
            feedbackElement.style.color = 'var(--success-color)';
        } else {
            // Wrong answer
            selectedButton.style.backgroundColor = 'rgba(247, 37, 133, 0.2)';
            selectedButton.style.borderColor = 'var(--error-color)';
            feedbackElement.textContent = `Wrong! The correct answer was ${currentQuestion.answer}`;
            feedbackElement.style.color = 'var(--error-color)';
            
            // Highlight correct answer
            optionButtons.forEach(button => {
                if (parseInt(button.textContent) === currentQuestion.answer) {
                    button.style.backgroundColor = 'rgba(76, 201, 240, 0.2)';
                    button.style.borderColor = 'var(--success-color)';
                }
            });
        }
        
        // Move to next question or end game
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            setTimeout(showQuestion, 1500);
        } else {
            setTimeout(showResults, 1500);
        }
    }
    
    function timeUp() {
        // Disable all buttons
        optionButtons.forEach(button => {
            button.disabled = true;
        });
        
        // Show correct answer
        const currentQuestion = questions[currentQuestionIndex];
        feedbackElement.textContent = `Time's up! The answer was ${currentQuestion.answer}`;
        feedbackElement.style.color = 'var(--error-color)';
        
        optionButtons.forEach(button => {
            if (parseInt(button.textContent) === currentQuestion.answer) {
                button.style.backgroundColor = 'rgba(76, 201, 240, 0.2)';
                button.style.borderColor = 'var(--success-color)';
            }
        });
        
        // Move to next question or end game
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            setTimeout(showQuestion, 1500);
        } else {
            setTimeout(showResults, 1500);
        }
    }
    
    function showResults() {
        // Calculate average time per question
        const averageTime = (gameSettings.timeLimit * gameSettings.totalQuestions) / gameSettings.totalQuestions;
        
        // Update results screen
        finalScoreElement.textContent = score;
        totalQuestionsElement.textContent = gameSettings.totalQuestions;
        correctAnswersElement.textContent = score;
        wrongAnswersElement.textContent = gameSettings.totalQuestions - score;
        averageTimeElement.textContent = averageTime.toFixed(1);
        
        // Show results screen
        showScreen('results-screen');
    }
});