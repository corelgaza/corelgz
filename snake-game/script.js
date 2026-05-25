const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayMsg = document.getElementById("overlay-msg");
const startBtn = document.getElementById("start-btn");
const skinSelect = document.getElementById("skin-select");
const lobbyView = document.getElementById("lobby-view");
const gameView = document.getElementById("game-view");
const backBtn = document.getElementById("back-btn");

function goToLobby() {
    lobbyView.classList.remove("hidden");
    gameView.classList.add("hidden");
    overlay.classList.add("hidden");
    gameActive = false;
    if (gameLoop) clearInterval(gameLoop);
}

backBtn.addEventListener("click", goToLobby);

skinSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    let color = "#00ff88"; // neon
    if (val === 'blue') color = "#00d4ff";
    if (val === 'pink') color = "#ff3366";
    if (val === 'rainbow') color = "#ffffff";
    e.target.style.borderColor = color;
    e.target.style.color = color;
});
// Web Audio API for Retro Sound Effects
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playEatSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const t = audioCtx.currentTime;
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
    
    // Tambahan attack & decay agar suaranya konsisten dan tidak "meletup" (popping)
    gainNode.gain.setValueAtTime(0, t);
    gainNode.gain.linearRampToValueAtTime(0.1, t + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(t);
    osc.stop(t + 0.15);
}

function playSpecialEatSound() {
    if (audioCtx.state === 'suspended') return;
    const t = audioCtx.currentTime;
    // Mainkan 3 nada cepat (arpeggio) untuk efek "bonus/koin"
    [600, 800, 1200].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gainNode.gain.setValueAtTime(0, t + i * 0.05);
        gainNode.gain.linearRampToValueAtTime(0.15, t + i * 0.05 + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, t + i * 0.05 + 0.05);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start(t + i * 0.05);
        osc.stop(t + i * 0.05 + 0.05);
    });
}

function playGameOverSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const t = audioCtx.currentTime;
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.5);
    
    gainNode.gain.setValueAtTime(0, t);
    gainNode.gain.linearRampToValueAtTime(0.2, t + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(t);
    osc.stop(t + 0.5);
}

let bassIndex = 0;
// Sequence bass yang lebih panjang, bervariasi, dan asik (16 nada)
const bassNotes = [
    130.81, 130.81, 155.56, 130.81, // C - C - Eb - C
    174.61, 130.81, 196.00, 155.56, // F - C - G - Eb
    130.81, 103.83, 116.54, 103.83, // C - Ab - Bb - Ab
    98.00,  98.00,  116.54, 130.81  // G - G - Bb - C
];

function playBassNote() {
    // We don't resume here automatically to avoid spamming browser console if un-interacted
    if (audioCtx.state === 'suspended') return; 
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const t = audioCtx.currentTime;
    
    // Pakai sawtooth biar suaranya lebih tebal dan "buzzy" khas synthwave
    osc.type = 'sawtooth';
    
    // Sedikit efek pitch drop di awal biar suaranya lebih "nendang"
    osc.frequency.setValueAtTime(bassNotes[bassIndex] + 30, t);
    osc.frequency.exponentialRampToValueAtTime(bassNotes[bassIndex], t + 0.05);
    
    // Volume sedikit diturunkan agar tidak terlalu berisik (ke 0.25)
    gainNode.gain.setValueAtTime(0, t);
    gainNode.gain.linearRampToValueAtTime(0.25, t + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(t);
    osc.stop(t + 0.15);
    
    bassIndex = (bassIndex + 1) % bassNotes.length;
}

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let dx = 0;
let dy = 0;
let foodX = 0;
let foodY = 0;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let gameLoop;
let gameActive = false;
let changingDirection = false;
let currentSpeed = 140;
let specialFood = null;

highScoreEl.textContent = highScore;

function initGame() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    lobbyView.classList.add("hidden");
    gameView.classList.remove("hidden");
    
    snake = [
        { x: 10, y: 10 }
    ];
    dx = 0;
    dy = 0;
    score = 0;
    scoreEl.textContent = score;
    placeFood();
    gameActive = true;
    changingDirection = false;
    overlay.classList.add("hidden");
    document.querySelector('.game-container').classList.remove('shake');
    
    currentSpeed = 140;
    specialFood = null;
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, currentSpeed);
}

function update() {
    if (!gameActive) return;
    changingDirection = false;
    
    // Play dynamic background bass note
    playBassNote();

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Self collision
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y && snake.length > 1) {
            gameOver();
            return;
        }
    }

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    snake.unshift(head); // Add new head

    let ateSomething = false;

    // Normal Food collision
    if (head.x === foodX && head.y === foodY) {
        playEatSound();
        score += 10;
        placeFood(); // this might also spawn special food
        ateSomething = true;
    }
    
    // Special Food collision
    if (specialFood && head.x === specialFood.x && head.y === specialFood.y) {
        playSpecialEatSound();
        score += 50; // Bonus besar!
        specialFood = null;
        ateSomething = true;
    }

    if (ateSomething) {
        scoreEl.textContent = score;
        if (score > highScore) {
            highScore = score;
            highScoreEl.textContent = highScore;
            localStorage.setItem("snakeHighScore", highScore);
        }

        // Increase speed slightly for every 50 points
        const newSpeed = Math.max(60, 140 - Math.floor(score / 50) * 10);
        if (newSpeed !== currentSpeed) {
            currentSpeed = newSpeed;
            clearInterval(gameLoop);
            gameLoop = setInterval(update, currentSpeed);
        }
    } else {
        snake.pop(); // Remove tail if no food eaten
    }

    // Handle special food timeout
    if (specialFood) {
        specialFood.timeLeft--;
        if (specialFood.timeLeft <= 0) {
            specialFood = null; // Menghilang jika tidak cepat dimakan
        }
    }

    draw();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    // Draw Food
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff3366";
    ctx.fillStyle = "#ff3366";
    ctx.beginPath();
    ctx.arc(foodX * gridSize + gridSize/2, foodY * gridSize + gridSize/2, gridSize/2 - 2, 0, 2 * Math.PI);
    ctx.fill();

    // Draw Special Food
    if (specialFood) {
        // Berkedip jika waktunya hampir habis (kurang dari 10 tick)
        if (specialFood.timeLeft > 10 || specialFood.timeLeft % 2 === 0) {
            ctx.shadowColor = "#ffcc00"; // Warna emas
            ctx.fillStyle = "#ffcc00";
            ctx.beginPath();
            // Ukurannya sedikit lebih besar (tanpa dikurangi 2 pixel)
            ctx.arc(specialFood.x * gridSize + gridSize/2, specialFood.y * gridSize + gridSize/2, gridSize/2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    // Draw Snake
    const skin = skinSelect.value;
    
    if (skin === 'neon') ctx.shadowColor = "#00ff88";
    else if (skin === 'blue') ctx.shadowColor = "#00d4ff";
    else if (skin === 'pink') ctx.shadowColor = "#ff3366";
    else if (skin === 'rainbow') ctx.shadowColor = "#ffffff";
    
    ctx.shadowBlur = 10;
    
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            ctx.fillStyle = "#ffffff"; // Head is always white
        } else {
            if (skin === 'neon') ctx.fillStyle = "#00ff88";
            else if (skin === 'blue') ctx.fillStyle = "#00d4ff";
            else if (skin === 'pink') ctx.fillStyle = "#ff3366";
            else if (skin === 'rainbow') {
                ctx.fillStyle = `hsl(${(i * 15 - score) % 360}, 100%, 50%)`; // Dynamic shifting rainbow
                ctx.shadowColor = ctx.fillStyle; 
            }
        }
        
        // Give snake blocks rounded corners
        const x = snake[i].x * gridSize;
        const y = snake[i].y * gridSize;
        const s = gridSize - 1;
        const r = 4; // radius
        
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + s - r, y);
        ctx.quadraticCurveTo(x + s, y, x + s, y + r);
        ctx.lineTo(x + s, y + s - r);
        ctx.quadraticCurveTo(x + s, y + s, x + s - r, y + s);
        ctx.lineTo(x + r, y + s);
        ctx.quadraticCurveTo(x, y + s, x, y + s - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.fill();
    }
    
    // Reset shadow for next draw
    ctx.shadowBlur = 0;
}

function placeFood() {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        // Ensure food doesn't spawn on the snake
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            break;
        }
    }
    foodX = newFood.x;
    foodY = newFood.y;

    // 20% chance untuk memunculkan Makanan Spesial (jika belum ada)
    if (!specialFood && Math.random() < 0.20) {
        let newSpecial;
        while (true) {
            newSpecial = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
            // Jangan taruh di atas ular ATAU di atas makanan merah
            if (!snake.some(s => s.x === newSpecial.x && s.y === newSpecial.y) &&
                !(newSpecial.x === foodX && newSpecial.y === foodY)) {
                break;
            }
        }
        // Waktu hidup spesial food = 40 tick (sekitar 4-5 detik tergantung kecepatan)
        specialFood = { x: newSpecial.x, y: newSpecial.y, timeLeft: 40 };
    }
}

function gameOver() {
    gameActive = false;
    clearInterval(gameLoop);
    
    // Play game over sound
    playGameOverSound();
    
    document.querySelector('.game-container').classList.add('shake');
    
    overlayTitle.textContent = "Game Over!";
    overlayTitle.style.color = "#ff3366";
    overlayMsg.textContent = `You scored ${score} points!`;
    overlay.classList.remove("hidden");
}

function handleDirection(dir) {
    if (!gameActive) return;
    if (changingDirection) return;

    switch (dir) {
        case "UP":
            if (dy !== 1) { dx = 0; dy = -1; changingDirection = true; }
            break;
        case "DOWN":
            if (dy !== -1) { dx = 0; dy = 1; changingDirection = true; }
            break;
        case "LEFT":
            if (dx !== 1) { dx = -1; dy = 0; changingDirection = true; }
            break;
        case "RIGHT":
            if (dx !== -1) { dx = 1; dy = 0; changingDirection = true; }
            break;
    }
}

document.addEventListener("keydown", (e) => {
    // Prevent default scrolling for arrows and space
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

    if (e.code === "Space" && !gameActive) {
        initGame();
        return;
    }

    switch (e.key) {
        case "ArrowUp": case "w": case "W":
            handleDirection("UP"); break;
        case "ArrowDown": case "s": case "S":
            handleDirection("DOWN"); break;
        case "ArrowLeft": case "a": case "A":
            handleDirection("LEFT"); break;
        case "ArrowRight": case "d": case "D":
            handleDirection("RIGHT"); break;
    }
});

// D-Pad Event Listeners
const attachDpad = (id, dir) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    // Gunakan touchstart agar di HP lebih responsif dan mousedown untuk di PC
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); handleDirection(dir); }, {passive: false});
    btn.addEventListener("mousedown", (e) => { e.preventDefault(); handleDirection(dir); });
};
attachDpad("dpad-up", "UP");
attachDpad("dpad-down", "DOWN");
attachDpad("dpad-left", "LEFT");
attachDpad("dpad-right", "RIGHT");

startBtn.addEventListener("click", initGame);

// Initial draw
draw();
