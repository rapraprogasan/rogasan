// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const pauseScreen = document.getElementById('pauseScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startButton = document.getElementById('startButton');
const resumeButton = document.getElementById('resumeButton');
const restartButton = document.getElementById('restartButton');
const restartButton2 = document.getElementById('restartButton2');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('finalScore');
const highScoreDisplay = document.getElementById('highScore');
const levelDisplay = document.getElementById('level');
const lifeIcons = document.getElementById('lifeIcons');
const powerUpDisplay = document.getElementById('powerUpDisplay');
const joystickArea = document.getElementById('joystickArea');

// Audio elements
const backgroundMusic = document.getElementById('backgroundMusic');
const starSound = document.getElementById('starSound');
const powerUpSound = document.getElementById('powerUpSound');
const crashSound = document.getElementById('crashSound');
const gameOverSound = document.getElementById('gameOverSound');
const levelUpSound = document.getElementById('levelUpSound');
const startSound = document.getElementById('startSound');

// Game state
let gameRunning = false;
let gamePaused = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let level = 1;
let lives = 3;
let starsCollected = 0;
let starsToNextLevel = 5;
let lastTime = 0;
let animationFrameId;
let joystickActive = false;
let joystickX = 0;
let joystickY = 0;

// Player
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    speed: 5,
    dx: 0,
    dy: 0,
    color: '#0ff',
    activePowerUps: []
};

// Game objects
let stars = [];
let asteroids = [];
let powerUps = [];
let specialEnemies = [];
let particles = [];

// Resize canvas to full window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Reset player position
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
}

// Initialize game
function initGame() {
    resizeCanvas();
    stars = [];
    asteroids = [];
    powerUps = [];
    specialEnemies = [];
    particles = [];
    score = 0;
    level = 1;
    lives = 3;
    starsCollected = 0;
    starsToNextLevel = 5;
    player.activePowerUps = [];
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.dx = 0;
    player.dy = 0;
    
    updateHUD();
    spawnInitialObjects();
}

// Spawn initial game objects
function spawnInitialObjects() {
    // Spawn stars
    for (let i = 0; i < 5; i++) {
        spawnStar();
    }
    
    // Spawn asteroids
    for (let i = 0; i < 3; i++) {
        spawnAsteroid();
    }
}

// Spawn a star
function spawnStar() {
    stars.push({
        x: Math.random() * (canvas.width - 20),
        y: Math.random() * (canvas.height - 20),
        width: 20,
        height: 20,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        color: `hsl(${Math.random() * 60 + 30}, 100%, 50%)`
    });
}

// Spawn an asteroid
function spawnAsteroid() {
    const size = Math.random() * 30 + 20;
    const speed = Math.random() * 2 + 1;
    let x, y, dx, dy;
    
    // Spawn from edges
    if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? -size : canvas.width + size;
        y = Math.random() * canvas.height;
    } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? -size : canvas.height + size;
    }
    
    // Move towards center
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    dx = Math.cos(angle) * speed;
    dy = Math.sin(angle) * speed;
    
    asteroids.push({
        x,
        y,
        width: size,
        height: size,
        dx,
        dy,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: `hsl(${Math.random() * 30 + 20}, 70%, 40%)`,
        points: Math.floor(size / 10)
    });
}

// Spawn a special enemy
function spawnSpecialEnemy() {
    const types = ['hunter', 'shooter', 'splitter'];
    const type = types[Math.floor(Math.random() * types.length)];
    const size = 25;
    let x, y;
    
    // Spawn from edges
    if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? -size : canvas.width + size;
        y = Math.random() * canvas.height;
    } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? -size : canvas.height + size;
    }
    
    specialEnemies.push({
        x,
        y,
        width: size,
        height: size,
        dx: 0,
        dy: 0,
        type,
        health: type === 'hunter' ? 3 : 2,
        color: type === 'hunter' ? '#f00' : type === 'shooter' ? '#0f0' : '#00f',
        lastShot: 0,
        shotInterval: type === 'shooter' ? 2000 : 0
    });
}

// Spawn a power-up
function spawnPowerUp() {
    const types = ['shield', 'speed', 'multiplier'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    powerUps.push({
        x: Math.random() * (canvas.width - 30),
        y: Math.random() * (canvas.height - 30),
        width: 20,
        height: 20,
        type,
        color: type === 'shield' ? '#0ff' : type === 'speed' ? '#ff0' : '#f0f',
        rotation: 0,
        rotationSpeed: 0.05,
        lifeTime: 10000 // 10 seconds
    });
}

// Create particles
function createParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x,
            y,
            size: Math.random() * 5 + 2,
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4,
            color,
            life: 100,
            decay: Math.random() * 3 + 1
        });
    }
}

// Update HUD
function updateHUD() {
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    finalScoreDisplay.textContent = score;
    highScoreDisplay.textContent = highScore;
    
    // Update lives display
    lifeIcons.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const lifeIcon = document.createElement('div');
        lifeIcon.className = 'life-icon';
        lifeIcons.appendChild(lifeIcon);
    }
    
    // Update power-ups display
    powerUpDisplay.innerHTML = '';
    player.activePowerUps.forEach(powerUp => {
        const powerUpIcon = document.createElement('div');
        powerUpIcon.className = `power-up-icon ${powerUp.type}`;
        powerUpDisplay.appendChild(powerUpIcon);
    });
}

// Check collision between two objects
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Player movement
function updatePlayer() {
    // Apply movement
    player.x += player.dx;
    player.y += player.dy;
    
    // Keep player within bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

// Update game objects
function updateGameObjects(deltaTime) {
    // Update stars
    stars.forEach(star => {
        star.rotation += star.rotationSpeed;
    });
    
    // Update asteroids
    asteroids.forEach(asteroid => {
        asteroid.x += asteroid.dx;
        asteroid.y += asteroid.dy;
        asteroid.rotation += asteroid.rotationSpeed;
        
        // Wrap around screen
        if (asteroid.x < -asteroid.width) asteroid.x = canvas.width;
        if (asteroid.x > canvas.width) asteroid.x = -asteroid.width;
        if (asteroid.y < -asteroid.height) asteroid.y = canvas.height;
        if (asteroid.y > canvas.height) asteroid.y = -asteroid.height;
    });
    
    // Update special enemies
    specialEnemies.forEach((enemy, index) => {
        // Behavior based on type
        switch (enemy.type) {
            case 'hunter':
                // Chase player
                const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
                enemy.dx = Math.cos(angle) * 2;
                enemy.dy = Math.sin(angle) * 2;
                break;
            case 'shooter':
                // Move randomly and shoot
                if (Math.random() < 0.02) {
                    enemy.dx = (Math.random() - 0.5) * 3;
                    enemy.dy = (Math.random() - 0.5) * 3;
                }
                
                // Shoot at player
                if (Date.now() - enemy.lastShot > enemy.shotInterval) {
                    enemy.lastShot = Date.now();
                    const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
                    specialEnemies.push({
                        x: enemy.x + enemy.width / 2,
                        y: enemy.y + enemy.height / 2,
                        width: 10,
                        height: 10,
                        dx: Math.cos(angle) * 5,
                        dy: Math.sin(angle) * 5,
                        type: 'bullet',
                        health: 1,
                        color: '#0f0'
                    });
                }
                break;
            case 'splitter':
                // Move in a straight line
                if (Math.abs(enemy.dx) < 0.1 && Math.abs(enemy.dy) < 0.1) {
                    const angle = Math.random() * Math.PI * 2;
                    enemy.dx = Math.cos(angle) * 2;
                    enemy.dy = Math.sin(angle) * 2;
                }
                break;
        }
        
        enemy.x += enemy.dx;
        enemy.y += enemy.dy;
        
        // Remove if out of bounds
        if (enemy.x < -50 || enemy.x > canvas.width + 50 || 
            enemy.y < -50 || enemy.y > canvas.height + 50) {
            specialEnemies.splice(index, 1);
        }
    });
    
    // Update power-ups
    powerUps.forEach((powerUp, index) => {
        powerUp.rotation += powerUp.rotationSpeed;
        powerUp.lifeTime -= deltaTime;
        
        if (powerUp.lifeTime <= 0) {
            powerUps.splice(index, 1);
        }
    });
    
    // Update active power-ups
    player.activePowerUps.forEach((powerUp, index) => {
        powerUp.duration -= deltaTime;
        
        if (powerUp.duration <= 0) {
            player.activePowerUps.splice(index, 1);
            
            // Remove power-up effects
            if (powerUp.type === 'speed') {
                player.speed = 5;
            }
        }
    });
    
    // Update particles
    particles.forEach((particle, index) => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.life -= particle.decay;
        
        if (particle.life <= 0) {
            particles.splice(index, 1);
        }
    });
    
    // Spawn new objects randomly
    if (Math.random() < 0.01) {
        spawnAsteroid();
    }
    
    if (Math.random() < 0.005 && specialEnemies.length < level) {
        spawnSpecialEnemy();
    }
    
    if (Math.random() < 0.003 && powerUps.length < 2) {
        spawnPowerUp();
    }
    
    if (stars.length < 3) {
        spawnStar();
    }
}

// Check collisions
function checkCollisions() {
    // Check star collisions
    stars.forEach((star, index) => {
        if (checkCollision(player, star)) {
            // Check for multiplier
            let multiplier = 1;
            const multiplierPowerUp = player.activePowerUps.find(p => p.type === 'multiplier');
            if (multiplierPowerUp) {
                multiplier = 2;
            }
            
            score += 10 * multiplier;
            starsCollected++;
            starSound.currentTime = 0;
            starSound.play();
            createParticles(star.x + star.width / 2, star.y + star.height / 2, star.color);
            stars.splice(index, 1);
            
            // Check for level up
            if (starsCollected >= starsToNextLevel) {
                levelUp();
            }
            
            return;
        }
    });
    
    // Check asteroid collisions
    asteroids.forEach((asteroid, index) => {
        if (checkCollision(player, asteroid)) {
            // Check for shield
            const hasShield = player.activePowerUps.some(p => p.type === 'shield');
            
            if (!hasShield) {
                lives--;
                crashSound.currentTime = 0;
                crashSound.play();
                createParticles(player.x + player.width / 2, player.y + player.height / 2, '#f00', 20);
                
                if (lives <= 0) {
                    gameOver();
                    return;
                }
            } else {
                // Remove shield on hit
                const shieldIndex = player.activePowerUps.findIndex(p => p.type === 'shield');
                if (shieldIndex !== -1) {
                    player.activePowerUps.splice(shieldIndex, 1);
                }
                createParticles(asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2, '#0ff', 20);
            }
            
            // Split or remove asteroid
            if (asteroid.width > 20) {
                // Split into smaller asteroids
                for (let i = 0; i < 2; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    asteroids.push({
                        x: asteroid.x,
                        y: asteroid.y,
                        width: asteroid.width / 2,
                        height: asteroid.height / 2,
                        dx: Math.cos(angle) * (Math.abs(asteroid.dx) + 1),
                        dy: Math.sin(angle) * (Math.abs(asteroid.dy) + 1),
                        rotation: 0,
                        rotationSpeed: (Math.random() - 0.5) * 0.03,
                        color: asteroid.color,
                        points: Math.floor(asteroid.points / 2)
                    });
                }
            }
            
            score += asteroid.points;
            asteroids.splice(index, 1);
            updateHUD();
            return;
        }
    });
    
    // Check special enemy collisions
    specialEnemies.forEach((enemy, index) => {
        if (checkCollision(player, enemy)) {
            // Check for shield
            const hasShield = player.activePowerUps.some(p => p.type === 'shield');
            
            if (!hasShield) {
                lives--;
                crashSound.currentTime = 0;
                crashSound.play();
                createParticles(player.x + player.width / 2, player.y + player.height / 2, '#f00', 20);
                
                if (lives <= 0) {
                    gameOver();
                    return;
                }
            } else {
                // Remove shield on hit
                const shieldIndex = player.activePowerUps.findIndex(p => p.type === 'shield');
                if (shieldIndex !== -1) {
                    player.activePowerUps.splice(shieldIndex, 1);
                }
            }
            
            // Damage or remove enemy
            enemy.health--;
            if (enemy.health <= 0) {
                createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color, 20);
                
                // Splitter behavior
                if (enemy.type === 'splitter' && enemy.width > 15) {
                    for (let i = 0; i < 2; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        specialEnemies.push({
                            x: enemy.x,
                            y: enemy.y,
                            width: enemy.width * 0.7,
                            height: enemy.height * 0.7,
                            dx: Math.cos(angle) * 3,
                            dy: Math.sin(angle) * 3,
                            type: 'splitter',
                            health: 1,
                            color: enemy.color
                        });
                    }
                }
                
                score += 50;
                specialEnemies.splice(index, 1);
            }
            
            updateHUD();
            return;
        }
    });
    
    // Check power-up collisions
    powerUps.forEach((powerUp, index) => {
        if (checkCollision(player, powerUp)) {
            powerUpSound.currentTime = 0;
            powerUpSound.play();
            
            // Apply power-up
            switch (powerUp.type) {
                case 'shield':
                    player.activePowerUps.push({
                        type: 'shield',
                        duration: 10000 // 10 seconds
                    });
                    break;
                case 'speed':
                    player.speed = 8;
                    player.activePowerUps.push({
                        type: 'speed',
                        duration: 8000 // 8 seconds
                    });
                    break;
                case 'multiplier':
                    player.activePowerUps.push({
                        type: 'multiplier',
                        duration: 12000 // 12 seconds
                    });
                    break;
            }
            
            createParticles(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2, powerUp.color, 15);
            powerUps.splice(index, 1);
            updateHUD();
            return;
        }
    });
}

// Level up
function levelUp() {
    level++;
    starsCollected = 0;
    starsToNextLevel = Math.floor(starsToNextLevel * 1.5);
    levelUpSound.currentTime = 0;
    levelUpSound.play();
    createParticles(player.x + player.width / 2, player.y + player.height / 2, '#fff', 30);
    
    // Increase difficulty
    for (let i = 0; i < level; i++) {
        spawnAsteroid();
    }
    
    updateHUD();
}

// Game over
function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId);
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    
    gameOverSound.currentTime = 0;
    gameOverSound.play();
    backgroundMusic.pause();
    
    // Show game over screen
    gameOverScreen.classList.remove('hidden');
    finalScoreDisplay.textContent = score;
    highScoreDisplay.textContent = highScore;
}

// Draw game
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw starfield background
    drawStarfield();
    
    // Draw particles
    drawParticles();
    
    // Draw stars
    drawStars();
    
    // Draw asteroids
    drawAsteroids();
    
    // Draw special enemies
    drawSpecialEnemies();
    
    // Draw power-ups
    drawPowerUps();
    
    // Draw player
    drawPlayer();
}

// Draw starfield background
function drawStarfield() {
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.5;
        ctx.fillRect(x, y, size, size);
    }
}

// Draw particles
function drawParticles() {
    particles.forEach(particle => {
        ctx.globalAlpha = particle.life / 100;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

// Draw stars
function drawStars() {
    stars.forEach(star => {
        ctx.save();
        ctx.translate(star.x + star.width / 2, star.y + star.height / 2);
        ctx.rotate(star.rotation);
        
        // Draw star shape
        ctx.fillStyle = star.color;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
            const outerX = Math.cos(angle) * star.width / 2;
            const outerY = Math.sin(angle) * star.height / 2;
            
            const innerAngle = angle + Math.PI / 5;
            const innerX = Math.cos(innerAngle) * star.width / 4;
            const innerY = Math.sin(innerAngle) * star.height / 4;
            
            if (i === 0) {
                ctx.moveTo(outerX, outerY);
            } else {
                ctx.lineTo(outerX, outerY);
            }
            
            ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.fill();
        
        // Add glow
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.restore();
    });
}

// Draw asteroids
function drawAsteroids() {
    asteroids.forEach(asteroid => {
        ctx.save();
        ctx.translate(asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2);
        ctx.rotate(asteroid.rotation);
        
        // Draw asteroid shape
        ctx.fillStyle = asteroid.color;
        ctx.beginPath();
        
        // Create irregular shape
        ctx.moveTo(0, -asteroid.height / 2);
        for (let i = 1; i < 8; i++) {
            const angle = (i * Math.PI * 2 / 7) - Math.PI / 2;
            const distance = asteroid.width / 2 * (0.8 + Math.random() * 0.4);
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            ctx.lineTo(x, y);
        }
        
        ctx.closePath();
        ctx.fill();
        
        // Add some crater details
        ctx.fillStyle = '#333';
        for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * asteroid.width / 3;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const size = Math.random() * 5 + 2;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    });
}

// Draw special enemies
function drawSpecialEnemies() {
    specialEnemies.forEach(enemy => {
        ctx.save();
        ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        
        // Draw based on type
        switch (enemy.type) {
            case 'hunter':
                // Draw hunter enemy (triangle)
                ctx.fillStyle = enemy.color;
                ctx.beginPath();
                ctx.moveTo(0, -enemy.height / 2);
                ctx.lineTo(enemy.width / 2, enemy.height / 2);
                ctx.lineTo(-enemy.width / 2, enemy.height / 2);
                ctx.closePath();
                ctx.fill();
                
                // Add eyes
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(-enemy.width / 4, -enemy.height / 4, 3, 0, Math.PI * 2);
                ctx.arc(enemy.width / 4, -enemy.height / 4, 3, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'shooter':
                // Draw shooter enemy (square with turret)
                ctx.fillStyle = enemy.color;
                ctx.fillRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
                
                // Draw turret
                ctx.fillStyle = '#0a0';
                ctx.fillRect(-3, -enemy.height / 2 - 5, 6, 10);
                break;
                
            case 'splitter':
                // Draw splitter enemy (hexagon)
                ctx.fillStyle = enemy.color;
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = i * Math.PI / 3;
                    const x = Math.cos(angle) * enemy.width / 2;
                    const y = Math.sin(angle) * enemy.height / 2;
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'bullet':
                // Draw bullet (small circle)
                ctx.fillStyle = enemy.color;
                ctx.beginPath();
                ctx.arc(0, 0, enemy.width / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
        
        // Add health indicator if not full
        if (enemy.health < (enemy.type === 'hunter' ? 3 : 2)) {
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(enemy.health.toString(), 0, enemy.height / 2 + 15);
        }
        
        ctx.restore();
    });
}

// Draw power-ups
function drawPowerUps() {
    powerUps.forEach(powerUp => {
        ctx.save();
        ctx.translate(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2);
        ctx.rotate(powerUp.rotation);
        
        // Draw based on type
        ctx.fillStyle = powerUp.color;
        
        switch (powerUp.type) {
            case 'shield':
                // Draw shield icon
                ctx.beginPath();
                ctx.arc(0, 0, powerUp.width / 2, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(0, 0, powerUp.width / 3, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'speed':
                // Draw lightning bolt
                ctx.beginPath();
                ctx.moveTo(0, -powerUp.height / 2);
                ctx.lineTo(powerUp.width / 2, 0);
                ctx.lineTo(-powerUp.width / 4, 0);
                ctx.lineTo(powerUp.width / 4, powerUp.height / 2);
                ctx.lineTo(-powerUp.width / 2, 0);
                ctx.lineTo(powerUp.width / 4, 0);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'multiplier':
                // Draw "X2"
                ctx.fillStyle = powerUp.color;
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('X2', 0, 0);
                break;
        }
        
        // Add glow
        ctx.shadowColor = powerUp.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Draw timer circle
        const lifePercent = powerUp.lifeTime / 10000;
        ctx.strokeStyle = powerUp.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, powerUp.width / 2 + 5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * lifePercent);
        ctx.stroke();
        
        ctx.restore();
    });
}

// Draw player
function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    
    // Rotate in direction of movement if moving
    if (player.dx !== 0 || player.dy !== 0) {
        const angle = Math.atan2(player.dy, player.dx);
        ctx.rotate(angle);
    }
    
    // Draw player ship
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.moveTo(player.width / 2, 0);
    ctx.lineTo(-player.width / 2, -player.height / 2);
    ctx.lineTo(-player.width / 3, 0);
    ctx.lineTo(-player.width / 2, player.height / 2);
    ctx.closePath();
    ctx.fill();
    
    // Draw engine glow when moving
    if (player.dx !== 0 || player.dy !== 0) {
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.moveTo(-player.width / 2, -player.height / 4);
        ctx.lineTo(-player.width / 2 - 5, 0);
        ctx.lineTo(-player.width / 2, player.height / 4);
        ctx.closePath();
        ctx.fill();
        
        // Add particles for engine effect
        if (Math.random() < 0.3) {
            createParticles(-player.width / 2 - 5, 0, '#ff0', 1);
        }
    }
    
    // Draw shield if active
    if (player.activePowerUps.some(p => p.type === 'shield')) {
        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, player.width, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    ctx.restore();
}

// Game loop
function gameLoop(timestamp) {
    if (!gamePaused) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        updatePlayer();
        updateGameObjects(deltaTime);
        checkCollisions();
        draw();
    }
    
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    startSound.currentTime = 0;
    startSound.play();
    backgroundMusic.currentTime = 0;
    backgroundMusic.volume = 0.3;
    backgroundMusic.play();
    
    initGame();
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    gameRunning = true;
    gamePaused = false;
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Pause game
function pauseGame() {
    if (!gameRunning) return;
    
    gamePaused = true;
    pauseScreen.classList.remove('hidden');
    backgroundMusic.pause();
}

// Resume game
function resumeGame() {
    gamePaused = false;
    pauseScreen.classList.add('hidden');
    backgroundMusic.play();
}

// Restart game
function restartGame() {
    cancelAnimationFrame(animationFrameId);
    startGame();
}

// Event listeners
startButton.addEventListener('click', startGame);
resumeButton.addEventListener('click', resumeGame);
restartButton.addEventListener('click', restartGame);
restartButton2.addEventListener('click', restartGame);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) return;
    
    switch (e.key) {
        case 'ArrowUp':
            player.dy = -player.speed;
            break;
        case 'ArrowDown':
            player.dy = player.speed;
            break;
        case 'ArrowLeft':
            player.dx = -player.speed;
            break;
        case 'ArrowRight':
            player.dx = player.speed;
            break;
        case ' ':
            // Space bar to shoot (could be implemented)
            break;
        case 'Escape':
            pauseGame();
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            if (e.key === 'ArrowUp' && player.dy < 0 || e.key === 'ArrowDown' && player.dy > 0) {
                player.dy = 0;
            }
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            if (e.key === 'ArrowLeft' && player.dx < 0 || e.key === 'ArrowRight' && player.dx > 0) {
                player.dx = 0;
            }
            break;
    }
});

// Mobile touch controls
let touchStartX = 0;
let touchStartY = 0;
let touchId = null;

joystickArea.addEventListener('touchstart', (e) => {
    if (!gameRunning || gamePaused) return;
    
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchId = touch.identifier;
    joystickActive = true;
    
    // Create visual joystick
    const joystick = document.createElement('div');
    joystick.className = 'joystick';
    joystick.id = 'joystick';
    joystick.style.left = `${touchStartX}px`;
    joystick.style.top = `${touchStartY}px`;
    document.body.appendChild(joystick);
    
    e.preventDefault();
});

document.addEventListener('touchmove', (e) => {
    if (!joystickActive) return;
    
    const touch = Array.from(e.touches).find(t => t.identifier === touchId);
    if (!touch) return;
    
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 50;
    
    if (distance > maxDistance) {
        const angle = Math.atan2(dy, dx);
        joystickX = Math.cos(angle) * maxDistance;
        joystickY = Math.sin(angle) * maxDistance;
    } else {
        joystickX = dx;
        joystickY = dy;
    }
    
    // Update player movement
    player.dx = (joystickX / maxDistance) * player.speed;
    player.dy = (joystickY / maxDistance) * player.speed;
    
    // Update joystick visual
    const joystick = document.getElementById('joystick');
    if (joystick) {
        joystick.style.transform = `translate(${joystickX}px, ${joystickY}px)`;
    }
    
    e.preventDefault();
});

document.addEventListener('touchend', (e) => {
    if (!joystickActive) return;
    
    const touch = Array.from(e.changedTouches).find(t => t.identifier === touchId);
    if (!touch) return;
    
    joystickActive = false;
    player.dx = 0;
    player.dy = 0;
    
    // Remove joystick visual
    const joystick = document.getElementById('joystick');
    if (joystick) {
        joystick.remove();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (gameRunning) {
        resizeCanvas();
    }
});

// Prevent scrolling on mobile
document.addEventListener('touchmove', (e) => {
    if (joystickActive) {
        e.preventDefault();
    }
}, { passive: false });

// Initialize
resizeCanvas();
updateHUD();