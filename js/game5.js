// Game variables
let canvas, ctx;
let player = {
    x: 0,
    y: 0,
    size: 30,
    speed: 5,
    color: '#3498db',
    invulnerable: false
};
let treasures = [];
let bombs = [];
let explosions = [];
let level = 1;
let lives = 3;
let score = 0;
let treasuresToFind = 3;
let treasuresFound = 0;
let gameRunning = false;
let keys = {};
let isMobile = false;
let spawnArea = {
    x: 0,
    y: 0,
    width: 100,
    height: 100
};
let soundEnabled = true;
let bgMusicPlaying = false;

// Sound effects
const sounds = {
    background: new Audio("sounds/treasurebg.mp3"),
    treasure: new Audio('sounds/coin.mp3'),
    explosion: new Audio('sounds/explosiontt.mp3'),
    gameOver: new Audio('sounds/gameover.mp3'),
    levelComplete: new Audio("sounds/levelup.mp3"),
    click: new Audio("sounds/click.mp3")
};

// Initialize sounds
function initSounds() {
    // Set volume levels
    sounds.background.volume = 0.3;
    sounds.treasure.volume = 0.5;
    sounds.explosion.volume = 0.5;
    sounds.gameOver.volume = 0.5;
    sounds.levelComplete.volume = 0.5;
    sounds.click.volume = 0.5;
    
    // Loop background music
    sounds.background.loop = true;
}

// Play sound helper function
function playSound(sound) {
    if (!soundEnabled) return;
    sound.currentTime = 0;
    sound.play().catch(error => {
        console.log("Sound play prevented:", error);
    });
}

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const settingsScreen = document.getElementById('settings-screen');
const creditsScreen = document.getElementById('credits-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const levelCompleteScreen = document.getElementById('level-complete-screen');
const levelDisplay = document.getElementById('level');
const livesDisplay = document.getElementById('lives');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');
const finalLevelDisplay = document.getElementById('final-level');
const levelScoreDisplay = document.getElementById('level-score');
const treasuresFoundDisplay = document.getElementById('treasures-found');
const mobileControls = document.getElementById('mobile-controls');

// Event listeners for buttons
document.getElementById('start-btn').addEventListener('click', () => {
    playSound(sounds.click);
    startGame();
});
document.getElementById('settings-btn').addEventListener('click', () => {
    playSound(sounds.click);
    showSettings();
});
document.getElementById('credits-btn').addEventListener('click', () => {
    playSound(sounds.click);
    showCredits();
});
document.getElementById('back-btn').addEventListener('click', () => {
    playSound(sounds.click);
    showMenu();
});
document.getElementById('credits-back-btn').addEventListener('click', () => {
    playSound(sounds.click);
    showMenu();
});
document.getElementById('restart-btn').addEventListener('click', () => {
    playSound(sounds.click);
    restartGame();
});
document.getElementById('menu-btn').addEventListener('click', () => {
    playSound(sounds.click);
    showMenu();
});
document.getElementById('next-level-btn').addEventListener('click', () => {
    playSound(sounds.click);
    nextLevel();
});

// Mobile controls
const controlButtons = document.querySelectorAll('.control-btn');
controlButtons.forEach(button => {
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const direction = button.classList[1];
        keys[direction] = true;
    });
    
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        const direction = button.classList[1];
        keys[direction] = false;
    });
});

// Keyboard controls
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // Prevent arrow keys from scrolling the page
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Check if mobile device
function checkMobile() {
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        mobileControls.classList.remove('hidden');
    }
}

// Initialize game
function initGame() {
    checkMobile();
    initSounds();
    
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Center player in spawn area
    player.x = canvas.width / 2 - player.size / 2;
    player.y = canvas.height / 2 - player.size / 2;
    
    // Define spawn area (center of canvas)
    spawnArea = {
        x: canvas.width / 2 - 50,
        y: canvas.height / 2 - 50,
        width: 100,
        height: 100
    };
}

function resizeCanvas() {
    const maxWidth = Math.min(800, window.innerWidth - 40);
    const maxHeight = Math.min(600, window.innerHeight - 200);
    
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    
    // Keep player within bounds if canvas resizes
    player.x = Math.min(player.x, canvas.width - player.size);
    player.y = Math.min(player.y, canvas.height - player.size);
}

// Start game
function startGame() {
    level = 1;
    lives = 3;
    score = 0;
    treasuresFound = 0;
    player.invulnerable = false;
    
    updateUI();
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    setupLevel();
    gameRunning = true;
    
    // Start background music
    if (soundEnabled) {
        sounds.background.play()
            .then(() => {
                bgMusicPlaying = true;
            })
            .catch(error => {
                console.log("Autoplay prevented:", error);
            });
    }
    
    requestAnimationFrame(gameLoop);
}

// Restart game
function restartGame() {
    level = 1;
    lives = 3;
    score = 0;
    treasuresFound = 0;
    player.invulnerable = false;
    
    updateUI();
    gameOverScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    setupLevel();
    gameRunning = true;
    
    // Restart background music
    if (soundEnabled && !bgMusicPlaying) {
        sounds.background.play();
        bgMusicPlaying = true;
    }
    
    requestAnimationFrame(gameLoop);
}

// Show settings
function showSettings() {
    startScreen.classList.add('hidden');
    settingsScreen.classList.remove('hidden');
    
    // Add sound toggle button if it doesn't exist
    if (!document.getElementById('sound-toggle')) {
        const soundToggle = document.createElement('button');
        soundToggle.id = 'sound-toggle';
        soundToggle.className = 'btn';
        soundToggle.textContent = soundEnabled ? 'Sound: ON' : 'Sound: OFF';
        soundToggle.onclick = () => {
            soundEnabled = !soundEnabled;
            soundToggle.textContent = soundEnabled ? 'Sound: ON' : 'Sound: OFF';
            playSound(sounds.click);
            
            if (!soundEnabled) {
                sounds.background.pause();
                bgMusicPlaying = false;
            } else if (gameRunning) {
                sounds.background.play();
                bgMusicPlaying = true;
            }
        };
        
        settingsScreen.appendChild(soundToggle);
    }
}

// Show credits
function showCredits() {
    startScreen.classList.add('hidden');
    creditsScreen.classList.remove('hidden');
}

// Show menu
function showMenu() {
    sounds.background.pause();
    bgMusicPlaying = false;
    
    settingsScreen.classList.add('hidden');
    creditsScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    levelCompleteScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    
    gameRunning = false;
}

// Setup level
function setupLevel() {
    treasures = [];
    bombs = [];
    explosions = [];
    
    treasuresToFind = 3 + level;
    
    // Create treasures
    for (let i = 0; i < treasuresToFind; i++) {
        createTreasure();
    }
    
    // Create bombs (more bombs as level increases)
    for (let i = 0; i < Math.min(level, 10); i++) {
        createBomb();
    }
    
    // Reset player position to spawn area
    player.x = canvas.width / 2 - player.size / 2;
    player.y = canvas.height / 2 - player.size / 2;
    
    // Make player temporarily invulnerable when starting level
    player.invulnerable = true;
    setTimeout(() => {
        player.invulnerable = false;
    }, 1000);
}

// Create treasure at random position (not in spawn area)
function createTreasure() {
    let x, y;
    let validPosition = false;
    
    while (!validPosition) {
        x = Math.random() * (canvas.width - 30);
        y = Math.random() * (canvas.height - 30);
        
        // Check if position is outside spawn area
        if (!(x > spawnArea.x && x < spawnArea.x + spawnArea.width &&
              y > spawnArea.y && y < spawnArea.y + spawnArea.height)) {
            validPosition = true;
        }
    }
    
    treasures.push({
        x: x,
        y: y,
        size: 20,
        color: '#f1c40f',
        collected: false
    });
}

// Create bomb at random position (not in spawn area)
function createBomb() {
    let x, y;
    let validPosition = false;
    
    while (!validPosition) {
        x = Math.random() * (canvas.width - 30);
        y = Math.random() * (canvas.height - 30);
        
        // Check if position is outside spawn area and not too close to player
        if (!(x > spawnArea.x && x < spawnArea.x + spawnArea.width &&
              y > spawnArea.y && y < spawnArea.y + spawnArea.height) &&
            Math.abs(x - player.x) > 50 && Math.abs(y - player.y) > 50) {
            validPosition = true;
        }
    }
    
    bombs.push({
        x: x,
        y: y,
        size: 25,
        color: '#e74c3c',
        speedX: (Math.random() - 0.5) * 3,
        speedY: (Math.random() - 0.5) * 3
    });
}

// Create explosion
function createExplosion(x, y) {
    explosions.push({
        x: x,
        y: y,
        radius: 5,
        maxRadius: 50,
        color: '#f39c12',
        alpha: 1,
        growing: true
    });
    playSound(sounds.explosion);
}

// Update UI
function updateUI() {
    levelDisplay.textContent = level;
    livesDisplay.textContent = lives;
    scoreDisplay.textContent = score;
    finalScoreDisplay.textContent = score;
    finalLevelDisplay.textContent = level;
    levelScoreDisplay.textContent = score;
    treasuresFoundDisplay.textContent = treasuresFound;
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    update();
    render();
    
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    movePlayer();
    moveBombs();
    updateExplosions();
    checkCollisions();
}

// Move player based on input
function movePlayer() {
    // Arrow keys or WASD
    if (keys['ArrowUp'] || keys['w'] || keys['up']) {
        player.y = Math.max(0, player.y - player.speed);
    }
    if (keys['ArrowDown'] || keys['s'] || keys['down']) {
        player.y = Math.min(canvas.height - player.size, player.y + player.speed);
    }
    if (keys['ArrowLeft'] || keys['a'] || keys['left']) {
        player.x = Math.max(0, player.x - player.speed);
    }
    if (keys['ArrowRight'] || keys['d'] || keys['right']) {
        player.x = Math.min(canvas.width - player.size, player.x + player.speed);
    }
}

// Move bombs
function moveBombs() {
    bombs.forEach(bomb => {
        bomb.x += bomb.speedX;
        bomb.y += bomb.speedY;
        
        // Bounce off walls
        if (bomb.x <= 0 || bomb.x >= canvas.width - bomb.size) {
            bomb.speedX *= -1;
        }
        if (bomb.y <= 0 || bomb.y >= canvas.height - bomb.size) {
            bomb.speedY *= -1;
        }
    });
}

// Update explosions
function updateExplosions() {
    for (let i = explosions.length - 1; i >= 0; i--) {
        const explosion = explosions[i];
        
        if (explosion.growing) {
            explosion.radius += 2;
            if (explosion.radius >= explosion.maxRadius) {
                explosion.growing = false;
            }
        } else {
            explosion.alpha -= 0.02;
            if (explosion.alpha <= 0) {
                explosions.splice(i, 1);
            }
        }
    }
}

// Check collisions
function checkCollisions() {
    // Check treasure collisions
    for (let i = treasures.length - 1; i >= 0; i--) {
        const treasure = treasures[i];
        
        if (!treasure.collected &&
            player.x < treasure.x + treasure.size &&
            player.x + player.size > treasure.x &&
            player.y < treasure.y + treasure.size &&
            player.y + player.size > treasure.y) {
            
            treasure.collected = true;
            score += 100 * level;
            treasuresFound++;
            updateUI();
            
            // Play treasure sound
            playSound(sounds.treasure);
            
            // Remove treasure
            treasures.splice(i, 1);
            
            // Check if all treasures collected
            if (treasures.length === 0) {
                levelComplete();
            }
        }
    }
    
    // Check bomb collisions
    for (let i = bombs.length - 1; i >= 0; i--) {
        const bomb = bombs[i];
        
        // More precise collision detection
        const playerCenterX = player.x + player.size / 2;
        const playerCenterY = player.y + player.size / 2;
        const bombCenterX = bomb.x + bomb.size / 2;
        const bombCenterY = bomb.y + bomb.size / 2;
        
        const dx = playerCenterX - bombCenterX;
        const dy = playerCenterY - bombCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Collision occurs if distance is less than the sum of radii
        if (distance < (player.size / 2 + bomb.size / 2) && !player.invulnerable) {
            // Create explosion
            createExplosion(bomb.x + bomb.size / 2, bomb.y + bomb.size / 2);
            
            // Remove bomb
            bombs.splice(i, 1);
            
            // Add new bomb to replace the one that exploded
            createBomb();
            
            // Make player invulnerable temporarily
            player.invulnerable = true;
            setTimeout(() => {
                player.invulnerable = false;
            }, 1000);
            
            // Only deduct life if not in spawn area
            if (!isInSpawnArea(player.x, player.y)) {
                lives--;
                updateUI();
                flashPlayer();
                
                // Check if game over
                if (lives <= 0) {
                    gameOver();
                    return;
                }
            }
        }
    }
    
    // Check explosion collisions
    explosions.forEach(explosion => {
        if (explosion.growing && !player.invulnerable) {
            const dx = player.x + player.size / 2 - explosion.x;
            const dy = player.y + player.size / 2 - explosion.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < explosion.radius + player.size / 2) {
                // Make player invulnerable temporarily
                player.invulnerable = true;
                setTimeout(() => {
                    player.invulnerable = false;
                }, 1000);
                
                // Only deduct life if not in spawn area
                if (!isInSpawnArea(player.x, player.y)) {
                    lives--;
                    updateUI();
                    flashPlayer();
                    
                    // Check if game over
                    if (lives <= 0) {
                        gameOver();
                        return;
                    }
                }
            }
        }
    });
}

// Helper function to check if player is in spawn area
function isInSpawnArea(x, y) {
    return x > spawnArea.x && 
           x < spawnArea.x + spawnArea.width - player.size &&
           y > spawnArea.y && 
           y < spawnArea.y + spawnArea.height - player.size;
}

// Flash player when hit
function flashPlayer() {
    const originalColor = player.color;
    let flashCount = 0;
    const maxFlashes = 5;
    
    const flashInterval = setInterval(() => {
        player.color = player.color === originalColor ? '#ff0000' : originalColor;
        flashCount++;
        
        if (flashCount >= maxFlashes * 2) {
            clearInterval(flashInterval);
            player.color = originalColor;
        }
    }, 100);
}

// Level complete
function levelComplete() {
    playSound(sounds.levelComplete);
    gameRunning = false;
    sounds.background.pause();
    bgMusicPlaying = false;
    gameScreen.classList.add('hidden');
    levelCompleteScreen.classList.remove('hidden');
}

// Next level
function nextLevel() {
    level++;
    treasuresFound = 0;
    updateUI();
    
    levelCompleteScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    setupLevel();
    gameRunning = true;
    
    // Restart background music
    if (soundEnabled) {
        sounds.background.play();
        bgMusicPlaying = true;
    }
    
    requestAnimationFrame(gameLoop);
}

// Game over
function gameOver() {
    playSound(sounds.gameOver);
    sounds.background.pause();
    bgMusicPlaying = false;
    gameRunning = false;
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
}

// Render game
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw spawn area (safe zone)
    ctx.fillStyle = 'rgba(46, 204, 113, 0.2)';
    ctx.fillRect(spawnArea.x, spawnArea.y, spawnArea.width, spawnArea.height);
    ctx.strokeStyle = '#2ecc71';
    ctx.lineWidth = 2;
    ctx.strokeRect(spawnArea.x, spawnArea.y, spawnArea.width, spawnArea.height);
    
    // Draw treasures
    treasures.forEach(treasure => {
        if (!treasure.collected) {
            ctx.fillStyle = treasure.color;
            ctx.fillRect(treasure.x, treasure.y, treasure.size, treasure.size);
            
            // Draw treasure icon (simplified)
            ctx.fillStyle = '#f39c12';
            ctx.beginPath();
            ctx.arc(treasure.x + treasure.size / 2, treasure.y + treasure.size / 2, treasure.size / 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    // Draw bombs
    bombs.forEach(bomb => {
        ctx.fillStyle = bomb.color;
        ctx.beginPath();
        ctx.arc(bomb.x + bomb.size / 2, bomb.y + bomb.size / 2, bomb.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw bomb fuse
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bomb.x + bomb.size * 0.7, bomb.y + bomb.size * 0.3);
        ctx.lineTo(bomb.x + bomb.size, bomb.y);
        ctx.stroke();
    });
    
    // Draw explosions
    explosions.forEach(explosion => {
        ctx.save();
        ctx.globalAlpha = explosion.alpha;
        
        const gradient = ctx.createRadialGradient(
            explosion.x, explosion.y, 0,
            explosion.x, explosion.y, explosion.radius
        );
        gradient.addColorStop(0, explosion.color);
        gradient.addColorStop(1, 'rgba(231, 76, 60, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    });
    
    // Draw player (with invulnerability effect)
    if (!player.invulnerable || Math.floor(Date.now() / 100) % 2 === 0) {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.size, player.size);
        
        // Draw player eyes (to show direction)
        ctx.fillStyle = '#fff';
        if (keys['ArrowUp'] || keys['w'] || keys['up']) {
            // Looking up
            ctx.fillRect(player.x + player.size * 0.25, player.y + player.size * 0.2, 5, 5);
            ctx.fillRect(player.x + player.size * 0.65, player.y + player.size * 0.2, 5, 5);
        } else if (keys['ArrowDown'] || keys['s'] || keys['down']) {
            // Looking down
            ctx.fillRect(player.x + player.size * 0.25, player.y + player.size * 0.7, 5, 5);
            ctx.fillRect(player.x + player.size * 0.65, player.y + player.size * 0.7, 5, 5);
        } else if (keys['ArrowLeft'] || keys['a'] || keys['left']) {
            // Looking left
            ctx.fillRect(player.x + player.size * 0.2, player.y + player.size * 0.3, 5, 5);
            ctx.fillRect(player.x + player.size * 0.2, player.y + player.size * 0.6, 5, 5);
        } else if (keys['ArrowRight'] || keys['d'] || keys['right']) {
            // Looking right
            ctx.fillRect(player.x + player.size * 0.7, player.y + player.size * 0.3, 5, 5);
            ctx.fillRect(player.x + player.size * 0.7, player.y + player.size * 0.6, 5, 5);
        } else {
            // Default (looking forward)
            ctx.fillRect(player.x + player.size * 0.25, player.y + player.size * 0.4, 5, 5);
            ctx.fillRect(player.x + player.size * 0.65, player.y + player.size * 0.4, 5, 5);
        }
    }
}

// Initialize game when page loads
window.addEventListener('load', initGame);