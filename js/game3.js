document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    const musicToggle = document.getElementById('musicToggle');
    const character = document.getElementById('character');
    const obstacle = document.getElementById('obstacle');
    const coin = document.getElementById('coin');
    const scoreDisplay = document.getElementById('score');
    const coinsDisplay = document.getElementById('coins');
    const finalScoreDisplay = document.getElementById('finalScore');
    const finalCoinsDisplay = document.getElementById('finalCoins');
    
    // Audio elements - now referencing local files
    const jumpSound = document.getElementById('jumpSound');
    const coinSound = document.getElementById('coinSound');
    const gameOverSound = document.getElementById('gameOverSound');
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    // Set audio properties
    [jumpSound, coinSound, gameOverSound, backgroundMusic].forEach(sound => {
        sound.volume = 0.5;
    });

    // Game variables
    let score = 0;
    let coins = 0;
    let isJumping = false;
    let isGameOver = false;
    let gameSpeed = 5;
    let obstacleInterval = null;
    let coinInterval = null;
    let musicOn = true;
    let audioEnabled = false;
    
    // Enable audio on first user interaction
    function enableAudio() {
        if (!audioEnabled) {
            audioEnabled = true;
            // Try to play a silent sound to unlock audio
            const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
            silentAudio.play().then(() => {
                silentAudio.pause();
                silentAudio.remove();
            }).catch(e => console.log("Audio enable failed:", e));
            
            // Preload sounds
            [jumpSound, coinSound, gameOverSound, backgroundMusic].forEach(sound => {
                sound.load().catch(e => console.log("Preload error:", e));
            });
        }
    }
    
    // Initialize game elements
    function initGame() {
        // Reset positions
        obstacle.style.left = '100%';
        coin.style.left = '100%';
        coin.style.bottom = '180px';
        character.style.bottom = '100px';
        character.style.transform = 'translateY(0)';
        
        // Reset game state
        score = 0;
        coins = 0;
        isGameOver = false;
        gameSpeed = 5;
        scoreDisplay.textContent = score;
        coinsDisplay.textContent = coins;
    }
    
    // Event listeners
    startBtn.addEventListener('click', () => {
        enableAudio();
        startGame();
    });
    restartBtn.addEventListener('click', restartGame);
    musicToggle.addEventListener('click', toggleMusic);
    
    // Jump controls (both keyboard and touch)
    document.addEventListener('keydown', (e) => {
        if ((e.code === 'Space' || e.key === 'ArrowUp') && !isJumping && !isGameOver) {
            jump();
        }
    });
    
    gameScreen.addEventListener('click', () => {
        if (!isJumping && !isGameOver) {
            jump();
        }
    });

    // Sound helper function
    function playSound(sound) {
        if (!audioEnabled) return;
        
        try {
            sound.currentTime = 0;
            sound.play().catch(e => {
                console.log("Sound playback prevented:", e);
                // Try to enable audio again
                enableAudio();
            });
        } catch (e) {
            console.error("Sound error:", e);
        }
    }
    
    // Functions
    function startGame() {
        initGame();
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        gameOverScreen.style.display = 'none';
        
        if (musicOn) {
            playSound(backgroundMusic);
        }
        
        // Clear any existing intervals
        if (obstacleInterval) clearInterval(obstacleInterval);
        if (coinInterval) clearInterval(coinInterval);
        
        obstacleInterval = setInterval(moveObstacle, 20);
        coinInterval = setInterval(moveCoin, 20);
        
        createClouds();
    }
    
    
    function jump() {
        if (isJumping || isGameOver) return;
        
        isJumping = true;
        playSound(jumpSound);
        
        // Improved jump animation with easing
        let jumpHeight = 180;
        let jumpDuration = 800;
        let startTime = null;
        
        function jumpAnimation(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const halfTime = jumpDuration / 2;
            
            if (progress < halfTime) {
                // Going up (ease-out)
                const jumpProgress = progress / halfTime;
                const easedProgress = 1 - Math.pow(1 - jumpProgress, 2);
                character.style.transform = `translateY(${-easedProgress * jumpHeight}px)`;
            } else {
                // Coming down (ease-in)
                const fallProgress = (progress - halfTime) / halfTime;
                const easedProgress = Math.pow(fallProgress, 2);
                character.style.transform = `translateY(${-(1 - easedProgress) * jumpHeight}px)`;
            }
            
            if (progress < jumpDuration) {
                requestAnimationFrame(jumpAnimation);
            } else {
                // Jump complete
                character.style.transform = 'translateY(0)';
                isJumping = false;
            }
        }
        
        requestAnimationFrame(jumpAnimation);
    }
    
    function moveObstacle() {
        try {
            const obstacleRect = obstacle.getBoundingClientRect();
            const characterRect = character.getBoundingClientRect();
            
            // Move obstacle
            const obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left')) || 0;
            if (obstacleLeft > -40) {
                obstacle.style.left = (obstacleLeft - gameSpeed) + 'px';
            } else {
                // Reset obstacle position
                obstacle.style.left = '100%';
                score++;
                scoreDisplay.textContent = score;
                
                if (score % 5 === 0) {
                    gameSpeed += 0.5;
                }
            }
            
            // Improved collision detection
            if (
                obstacleRect.right > characterRect.left + 20 &&
                obstacleRect.left < characterRect.right - 20 &&
                obstacleRect.top < characterRect.bottom &&
                obstacleRect.bottom > characterRect.top + 30
            ) {
                gameOver();
            }
        } catch (e) {
            console.error("Obstacle movement error:", e);
        }
    }
    
    function moveCoin() {
        try {
            const coinRect = coin.getBoundingClientRect();
            const characterRect = character.getBoundingClientRect();
            
            // Move coin
            const coinLeft = parseInt(window.getComputedStyle(coin).getPropertyValue('left')) || 0;
            if (coinLeft > -30) {
                coin.style.left = (coinLeft - gameSpeed) + 'px';
            } else {
                // Reset coin position
                const randomHeight = Math.random() * 100 + 150;
                coin.style.left = '100%';
                coin.style.bottom = randomHeight + 'px';
            }
            
            // Improved coin collection detection
            if (
                coinRect.right > characterRect.left + 15 &&
                coinRect.left < characterRect.right - 15 &&
                coinRect.bottom > characterRect.top + 30 &&
                coinRect.top < characterRect.bottom - 20
            ) {
                // Collect coin
                coin.style.left = '-30px';
                coins++;
                coinsDisplay.textContent = coins;
                playSound(coinSound);
                score += 2;
                scoreDisplay.textContent = score;
            }
        } catch (e) {
            console.error("Coin movement error:", e);
        }
    }
    
    function gameOver() {
        isGameOver = true;
        
        // Clear intervals
        if (obstacleInterval) clearInterval(obstacleInterval);
        if (coinInterval) clearInterval(coinInterval);
        
        playSound(gameOverSound);
        backgroundMusic.pause();
        
        finalScoreDisplay.textContent = score;
        finalCoinsDisplay.textContent = coins;
        
        gameScreen.style.display = 'none';
        gameOverScreen.style.display = 'flex';
    }
    
    function restartGame() {
        gameOverScreen.style.display = 'none';
        startGame();
    }
    
    function toggleMusic() {
        musicOn = !musicOn;
        musicToggle.textContent = musicOn ? 'ON' : 'OFF';
        
        if (musicOn) {
            playSound(backgroundMusic);
        } else {
            backgroundMusic.pause();
        }
    }
    
    function createClouds() {
        try {
            const gameArea = document.querySelector('.game-area');
            
            // Remove existing clouds
            document.querySelectorAll('.cloud').forEach(cloud => cloud.remove());
            
            // Create 5 clouds at random positions
            for (let i = 0; i < 5; i++) {
                const cloud = document.createElement('div');
                cloud.classList.add('cloud');
                
                const size = Math.random() * 50 + 50;
                const left = Math.random() * 80;
                const top = Math.random() * 50 + 10;
                const opacity = Math.random() * 0.5 + 0.3;
                
                cloud.style.width = `${size}px`;
                cloud.style.height = `${size/2}px`;
                cloud.style.left = `${left}%`;
                cloud.style.top = `${top}%`;
                cloud.style.opacity = opacity;
                cloud.style.borderRadius = '50%';
                cloud.style.boxShadow = `
                    ${size/3}px ${size/6}px 0 0 white,
                    ${size/6}px ${size/4}px 0 0 white
                `;
                
                gameArea.appendChild(cloud);
                animateCloud(cloud);
            }
        } catch (e) {
            console.error("Cloud creation error:", e);
        }
    }
    
    function animateCloud(cloud) {
        let position = parseInt(cloud.style.left) || 0;
        
        function move() {
            if (isGameOver) return;
            
            position -= 0.05;
            if (position < -20) {
                position = 100;
            }
            cloud.style.left = `${position}%`;
            
            requestAnimationFrame(move);
        }
        
        move();
    }
});