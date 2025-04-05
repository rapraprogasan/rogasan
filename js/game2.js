document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const gameBoard = document.getElementById('game-board');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const moveCounter = document.getElementById('move-counter');
    const timerDisplay = document.getElementById('timer');
    const winModal = document.getElementById('win-modal');
    const finalMoves = document.getElementById('final-moves');
    const finalTime = document.getElementById('final-time');

    // Game State
    let cards = [];
    let flippedCards = [];
    let moves = 0;
    let matchedPairs = 0;
    let gameStarted = false;
    let timerInterval;
    let seconds = 0;
    const totalPairs = 8;
    
    // Animal Emojis (8 pairs)
    const emojis = [
        '🐶', '🐱', '🐭', '🐹', 
        '🐰', '🦊', '🐻', '🐼'
    ];

    // Initialize Game
    function initGame() {
        // Clear previous game
        clearInterval(timerInterval);
        gameBoard.innerHTML = '';
        cards = [];
        flippedCards = [];
        moves = 0;
        matchedPairs = 0;
        seconds = 0;
        gameStarted = false;
        
        // Update UI
        moveCounter.textContent = `Moves: ${moves}`;
        timerDisplay.textContent = `Time: ${seconds}s`;
        winModal.classList.add('hidden');
        resetBtn.disabled = true;
        startBtn.disabled = false;
        
        // Create shuffled deck
        const deck = [...emojis, ...emojis];
        shuffleArray(deck);
        
        // Create cards
        deck.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.dataset.emoji = emoji;
            
            // Create card faces
            const cardBack = document.createElement('div');
            cardBack.className = 'card-face card-back';
            
            const cardFront = document.createElement('div');
            cardFront.className = 'card-face card-front';
            cardFront.textContent = emoji;
            
            card.appendChild(cardBack);
            card.appendChild(cardFront);
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            cards.push(card);
        });
    }

    // Shuffle array using Fisher-Yates algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Start the game
    function startGame() {
        if (gameStarted) return;
        
        gameStarted = true;
        startBtn.disabled = true;
        resetBtn.disabled = false;
        
        // Start timer
        seconds = 0;
        timerInterval = setInterval(() => {
            seconds++;
            timerDisplay.textContent = `Time: ${seconds}s`;
        }, 1000);
    }

    // Flip card
    function flipCard() {
        if (!gameStarted) {
            alert('Please click "Start Game" to begin!');
            return;
        }
        
        const selectedCard = this;
        
        // Don't allow flipping if:
        // - Card is already flipped
        // - Two cards are already flipped
        // - Card is already matched
        if (selectedCard.classList.contains('flipped') || 
            flippedCards.length === 2 || 
            selectedCard.classList.contains('matched')) {
            return;
        }
        
        // Flip the card
        selectedCard.classList.add('flipped');
        flippedCards.push(selectedCard);
        
        // Check for match when two cards are flipped
        if (flippedCards.length === 2) {
            moves++;
            moveCounter.textContent = `Moves: ${moves}`;
            
            const [card1, card2] = flippedCards;
            
            if (card1.dataset.emoji === card2.dataset.emoji) {
                // Match found
                setTimeout(() => {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    flippedCards = [];
                    matchedPairs++;
                    
                    // Check for win
                    if (matchedPairs === totalPairs) {
                        clearInterval(timerInterval);
                        setTimeout(showWinMessage, 500);
                    }
                }, 300);
            } else {
                // No match
                setTimeout(() => {
                    card1.classList.add('unmatched');
                    card2.classList.add('unmatched');
                    
                    setTimeout(() => {
                        card1.classList.remove('flipped', 'unmatched');
                        card2.classList.remove('flipped', 'unmatched');
                        flippedCards = [];
                    }, 1000);
                }, 300);
            }
        }
    }

    // Show win message
    function showWinMessage() {
        finalMoves.textContent = moves;
        finalTime.textContent = seconds;
        winModal.classList.remove('hidden');
    }

    // Event Listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', () => {
        winModal.classList.add('hidden');
        initGame();
        startGame();
    });

    // Initialize the game
    initGame();
});