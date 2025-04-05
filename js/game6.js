// Game Variables
let currentLevel = 1;
let score = 0;
let timeLeft = 60;
let timer;
let isGameRunning = false;
let currentWord = '';
let correctAnswer = '';
let usedWords = [];
let difficulty = 'medium';

// DOM Elements
const startScreen = document.querySelector('.start-screen');
const settingsScreen = document.querySelector('.settings-screen');
const creditsScreen = document.querySelector('.credits-screen');
const gameScreen = document.querySelector('.game-screen');
const gameoverScreen = document.querySelector('.gameover-screen');
const congratsScreen = document.querySelector('.congrats-screen');

const startBtn = document.querySelector('.start-btn');
const settingsBtn = document.querySelector('.settings-btn');
const creditsBtn = document.querySelector('.credits-btn');
const backBtns = document.querySelectorAll('.back-btn');
const submitBtn = document.querySelector('.submit-btn');
const hintBtn = document.querySelector('.hint-btn');
const restartBtns = document.querySelectorAll('.restart-btn');
const menuBtns = document.querySelectorAll('.menu-btn');

const scrambleWordEl = document.getElementById('scramble-word');
const userInput = document.getElementById('user-input');
const levelEl = document.getElementById('level');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('final-score');
const finalLevelEl = document.getElementById('final-level');
const congratsScoreEl = document.getElementById('congrats-score');
const volumeControl = document.getElementById('volume');
const difficultySelect = document.getElementById('difficulty');

// Audio Elements
const backgroundMusic = document.getElementById('background-music');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const gameoverSound = document.getElementById('gameover-sound');

// Word Lists
const easyWords = [
    'apple', 'banana', 'orange', 'grape', 'pear', 'lemon', 'mango', 'peach',
    'house', 'mouse', 'chair', 'table', 'couch', 'shelf', 'clock', 'light',
    'happy', 'sadly', 'angry', 'funny', 'crazy', 'lucky', 'sunny', 'windy'
];

const mediumWords = [
    'elephant', 'giraffe', 'kangaroo', 'dolphin', 'octopus', 'rhinoceros',
    'computer', 'keyboard', 'monitor', 'printer', 'scanner', 'software',
    'beautiful', 'wonderful', 'fantastic', 'excellent', 'brilliant', 'amazing'
];

const hardWords = [
    'extravaganza', 'quintessential', 'magnificent', 'phenomenon', 'extraordinary',
    'architecture', 'photosynthesis', 'encyclopedia', 'mathematics', 'astronomy',
    'psychology', 'philosophy', 'revolution', 'democracy', 'technology'
];

// Event Listeners
startBtn.addEventListener('click', startGame);
settingsBtn.addEventListener('click', showSettings);
creditsBtn.addEventListener('click', showCredits);
backBtns.forEach(btn => btn.addEventListener('click', showMenu));
submitBtn.addEventListener('click', checkAnswer);
hintBtn.addEventListener('click', giveHint);
restartBtns.forEach(btn => btn.addEventListener('click', restartGame));
menuBtns.forEach(btn => btn.addEventListener('click', showMenu));

userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

volumeControl.addEventListener('input', function() {
    backgroundMusic.volume = this.value;
    correctSound.volume = this.value;
    wrongSound.volume = this.value;
    gameoverSound.volume = this.value;
});

difficultySelect.addEventListener('change', function() {
    difficulty = this.value;
});

// Initialize game
function init() {
    backgroundMusic.volume = volumeControl.value;
    correctSound.volume = volumeControl.value;
    wrongSound.volume = volumeControl.value;
    gameoverSound.volume = volumeControl.value;
    backgroundMusic.play();
}

// Show Menu Screen
function showMenu() {
    hideAllScreens();
    startScreen.classList.add('active');
}

// Show Settings Screen
function showSettings() {
    hideAllScreens();
    settingsScreen.classList.add('active');
}

// Show Credits Screen
function showCredits() {
    hideAllScreens();
    creditsScreen.classList.add('active');
}

// Hide all screens
function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

// Start Game
function startGame() {
    currentLevel = 1;
    score = 0;
    timeLeft = 60;
    usedWords = [];
    
    updateGameInfo();
    hideAllScreens();
    gameScreen.classList.add('active');
    isGameRunning = true;
    
    startTimer();
    loadNewWord();
    userInput.focus();
}

// Restart Game
function restartGame() {
    startGame();
}

// Start Timer
function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Update Game Info
function updateGameInfo() {
    levelEl.textContent = currentLevel;
    timeEl.textContent = timeLeft;
    scoreEl.textContent = score;
}

// Load New Word
function loadNewWord() {
    let wordList;
    
    if (difficulty === 'easy') {
        wordList = easyWords;
    } else if (difficulty === 'hard') {
        wordList = hardWords;
    } else {
        // Medium difficulty - mix of easy and medium words
        wordList = [...easyWords, ...mediumWords];
    }
    
    // Filter out used words
    const availableWords = wordList.filter(word => !usedWords.includes(word));
    
    if (availableWords.length === 0) {
        // If all words have been used, reset the used words list
        usedWords = [];
    }
    
    // Select a random word
    correctAnswer = wordList[Math.floor(Math.random() * wordList.length)];
    usedWords.push(correctAnswer);
    
    // Scramble the word
    currentWord = scrambleWord(correctAnswer);
    scrambleWordEl.textContent = currentWord;
    
    // Clear input
    userInput.value = '';
}

// Scramble Word
function scrambleWord(word) {
    const letters = word.split('');
    
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    return letters.join('');
}

// Check Answer
function checkAnswer() {
    if (!isGameRunning) return;
    
    const userAnswer = userInput.value.trim().toLowerCase();
    
    if (userAnswer === correctAnswer) {
        // Correct answer
        correctSound.currentTime = 0;
        correctSound.play();
        
        score += 10 * currentLevel;
        timeLeft += 5; // Bonus time
        
        if (currentLevel < 10) {
            currentLevel++;
            updateGameInfo();
            loadNewWord();
        } else {
            // Player completed all levels
            congratsScoreEl.textContent = score;
            hideAllScreens();
            congratsScreen.classList.add('active');
            isGameRunning = false;
            clearInterval(timer);
        }
    } else {
        // Wrong answer
        wrongSound.currentTime = 0;
        wrongSound.play();
        
        timeLeft -= 5; // Penalty
        if (timeLeft < 0) timeLeft = 0;
        
        userInput.value = '';
        userInput.placeholder = 'Try again...';
        userInput.classList.add('shake');
        setTimeout(() => {
            userInput.classList.remove('shake');
        }, 500);
    }
    
    updateGameInfo();
}

// Give Hint
function giveHint() {
    if (!isGameRunning || !correctAnswer) return;
    
    // Reveal one letter at a time
    const scrambledLetters = currentWord.split('');
    const correctLetters = correctAnswer.split('');
    
    for (let i = 0; i < scrambledLetters.length; i++) {
        if (scrambledLetters[i] !== correctLetters[i]) {
            scrambledLetters[i] = correctLetters[i];
            currentWord = scrambledLetters.join('');
            scrambleWordEl.textContent = currentWord;
            
            // Penalty for using hint
            timeLeft -= 3;
            if (timeLeft < 0) timeLeft = 0;
            updateGameInfo();
            
            break;
        }
    }
}

// End Game
function endGame() {
    isGameRunning = false;
    clearInterval(timer);
    
    finalScoreEl.textContent = score;
    finalLevelEl.textContent = currentLevel - 1;
    
    gameoverSound.currentTime = 0;
    gameoverSound.play();
    
    hideAllScreens();
    gameoverScreen.classList.add('active');
}

// Initialize the game when the page loads
window.addEventListener('load', init);