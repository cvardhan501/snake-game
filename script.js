// const canvas = document.getElementById('gameCanvas');
// const ctx = canvas.getContext('2d');
// const scoreEl = document.getElementById('score');
// const messageEl = document.getElementById('message');
// const startButton = document.getElementById('startButton');
// const restartButton = document.getElementById('restartButton');

// const gridSize = 20;
// const tileCount = canvas.width / gridSize;
// const maxSpeed = 14;
// let snake = [{ x: 10, y: 10 }];
// let velocity = { x: 0, y: 0 };
// let food = { x: 5, y: 5 };
// let score = 0;
// let gameOver = false;
// let paused = false;
// let speed = 8;
// let lastUpdateTime = 0;

// function resetGame() {
//   snake = [{ x: 10, y: 10 }];
//   velocity = { x: 0, y: 0 };
//   food = randomFoodPosition();
//   score = 0;
//   gameOver = false;
//   paused = false;
//   speed = 8;
//   scoreEl.textContent = score;
//   messageEl.textContent = 'Press Start to begin.';
//   messageEl.className = 'message';
// }

// function randomFoodPosition() {
//   let position;
//   while (true) {
//     position = {
//       x: Math.floor(Math.random() * tileCount),
//       y: Math.floor(Math.random() * tileCount),
//     };
//     const collision = snake.some(segment => segment.x === position.x && segment.y === position.y);
//     if (!collision) return position;
//   }
// }

// function drawBoard() {
//   ctx.fillStyle = '#07090f';
//   ctx.fillRect(0, 0, canvas.width, canvas.height);

//   ctx.fillStyle = '#2fd4a7';
//   snake.forEach((segment, index) => {
//     ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4);
//     if (index === 0) {
//       ctx.fillStyle = '#ffffff';
//       ctx.fillRect(segment.x * gridSize + 6, segment.y * gridSize + 6, gridSize - 12, gridSize - 12);
//       ctx.fillStyle = '#2fd4a7';
//     }
//   });

//   ctx.fillStyle = '#ff4f6d';
//   ctx.fillRect(food.x * gridSize + 3, food.y * gridSize + 3, gridSize - 6, gridSize - 6);
// }

// function updateGame() {
//   if (gameOver || paused) return;
//   if (velocity.x === 0 && velocity.y === 0) return;

//   const head = {
//     x: snake[0].x + velocity.x,
//     y: snake[0].y + velocity.y,
//   };

//   const hitWall = head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
//   const hitSelf = snake.some(segment => segment.x === head.x && segment.y === head.y);
//   if (hitWall || hitSelf) {
//     gameOver = true;
//     messageEl.textContent = 'Game over! Press Restart to try again.';
//     messageEl.className = 'message error';
//     return;
//   }

//   snake.unshift(head);

//   if (head.x === food.x && head.y === food.y) {
//     score += 1;
//     speed = Math.min(maxSpeed, speed + 0.5);
//     scoreEl.textContent = score;
//     food = randomFoodPosition();
//     messageEl.textContent = 'Great! Keep going.';
//     messageEl.className = 'message success';
//   } else {
//     snake.pop();
//   }
// }

// function gameLoop(timestamp) {
//   const timeBetweenFrames = 1000 / speed;
//   if (timestamp - lastUpdateTime > timeBetweenFrames) {
//     lastUpdateTime = timestamp;
//     updateGame();
//     drawBoard();
//   }
//   requestAnimationFrame(gameLoop);
// }

// function setDirection(x, y) {
//   if (gameOver) return;
//   if (velocity.x === -x && velocity.y === -y) return;
//   velocity = { x, y };
// }

// window.addEventListener('keydown', event => {
//   if (event.key === 'ArrowUp') setDirection(0, -1);
//   if (event.key === 'ArrowDown') setDirection(0, 1);
//   if (event.key === 'ArrowLeft') setDirection(-1, 0);
//   if (event.key === 'ArrowRight') setDirection(1, 0);
//   if (event.key === ' ' || event.key === 'Spacebar') {
//     if (gameOver) return;
//     paused = !paused;
//     messageEl.textContent = paused ? 'Paused. Press Space to resume.' : 'Resumed.';
//     messageEl.className = paused ? 'message' : 'message success';
//   }
// });

// startButton.addEventListener('click', () => {
//   if (gameOver) {
//     resetGame();
//   }
//   if (velocity.x === 0 && velocity.y === 0) {
//     setDirection(0, -1);
//   }
//   paused = false;
//   messageEl.textContent = 'Game started. Use arrow keys to move.';
//   messageEl.className = 'message success';
// });

// restartButton.addEventListener('click', () => {
//   resetGame();
//   drawBoard();
// });

// resetGame();
// requestAnimationFrame(gameLoop);

const canvas     = document.getElementById("gameCanvas");  // never changes
const ctx        = canvas.getContext("2d");
const scoreEl    = document.getElementById("score");
const messageEl  = document.getElementById("message");
const muteButton = document.getElementById("muteButton");

const BOX = 20;                    // Size of each block (fixed)
let snake = [{ x: 10, y: 10 }];   // Snake starting position (changes)
let food  = { x: 5, y: 5 };       // Food starting position (changes)
let dx = 0, dy = 0;               // Direction (changes when key pressed)
let score = 0;
let gameOver = false;
let gameStarted = false;


let audioCtx = null;              // Audio Variables
let isMuted  = false;

// Creates the audio engine (must be done after a user click)
function initAudio() {
    if (!audioCtx) audioCtx = new AudioContext();
}

// Plays a beep sound using Web Audio API (no sound files needed)
function playSound(type) {
    if (isMuted || !audioCtx) return; // Skip if muted or audio not ready

    const o = audioCtx.createOscillator(); // Makes the sound
    const g = audioCtx.createGain();       // Controls the volume
    o.connect(g);
    g.connect(audioCtx.destination);       // Output to speakers
    const t = audioCtx.currentTime;

    if (type === "eat") {                                        // Pop sound when eating food
        o.type = "sine";
        o.frequency.setValueAtTime(800, t);
        o.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
        g.gain.setValueAtTime(0.5, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        o.start(t); o.stop(t + 0.1);
    } else if (type === "start") {                               // Rising chime when game starts
        o.type = "square";
        o.frequency.setValueAtTime(400, t);
        o.frequency.setValueAtTime(800, t + 0.2);
        g.gain.setValueAtTime(0.3, t);
        g.gain.linearRampToValueAtTime(0, t + 0.3);
        o.start(t); o.stop(t + 0.3);
    } else if (type === "gameover") {                            // Falling tone on game over
        o.type = "sawtooth";
        o.frequency.setValueAtTime(300, t);
        o.frequency.exponentialRampToValueAtTime(50, t + 0.5);
        g.gain.setValueAtTime(0.5, t);
        g.gain.linearRampToValueAtTime(0.01, t + 0.5);
        o.start(t); o.stop(t + 0.5);
    } else if (type === "click") {                               // Tick sound on restart
        o.type = "triangle";
        o.frequency.setValueAtTime(600, t);
        g.gain.setValueAtTime(0.4, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        o.start(t); o.stop(t + 0.05);
    }
}

// -- Draw the game board, snake, and food --
function drawGame() {
    ctx.fillStyle = "#07090f";                                          // Background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#2fd4a7";                                          // Snake color
    for (var i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * BOX, snake[i].y * BOX, BOX-2, BOX-2);
    }

    ctx.fillStyle = "#ff4f6d";                                          // Food color
    ctx.fillRect(food.x * BOX, food.y * BOX, BOX-2, BOX-2);
}

// -- Place food at a random position --
function createFood() {
    food.x = Math.floor(Math.random() * (canvas.width  / BOX));
    food.y = Math.floor(Math.random() * (canvas.height / BOX));
}

// -- Called when snake hits wall or itself --
function endGame() {
    if (gameOver) return;          // Prevents sound from playing twice
    gameOver = true;
    playSound("gameover");         // Game over sound
    messageEl.textContent = "Game Over! Press Restart.";
    messageEl.className = "message error";
}

// -- Move the snake one step (runs every 120ms) --
function moveSnake() {
    if (!gameStarted || gameOver) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy }; // New head position

    // Wall collision check
    if (head.x < 0 || head.x >= canvas.width/BOX || head.y < 0 || head.y >= canvas.height/BOX) {
        endGame(); return;
    }

    // Self collision check
    for (var i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) { endGame(); return; }
    }

    snake.unshift(head); // Add new head

    if (head.x === food.x && head.y === food.y) {  // Snake ate food
        score++;
        scoreEl.textContent = score;
        playSound("eat");   // Eating/pop sound
        createFood();
    } else {
        snake.pop();        // Remove tail (snake moves forward)
    }

    drawGame();
}

// -- Arrow key controls --
document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowUp"    && dy !== 1)  { dx = 0;  dy = -1; } // Up
    if (e.key === "ArrowDown"  && dy !== -1) { dx = 0;  dy = 1;  } // Down
    if (e.key === "ArrowLeft"  && dx !== 1)  { dx = -1; dy = 0;  } // Left
    if (e.key === "ArrowRight" && dx !== -1) { dx = 1;  dy = 0;  } // Right
});

// -- Start button --
document.getElementById("startButton").addEventListener("click", function() {
    initAudio();
    if (!gameStarted) playSound("start"); // Start chime
    gameStarted = true; dx = 1; dy = 0;
    messageEl.textContent = "Game Started!";
    messageEl.className = "message success";
});

// -- Restart button --
document.getElementById("restartButton").addEventListener("click", function() {
    initAudio();
    playSound("click");                   // Click sound on restart
    snake = [{ x: 10, y: 10 }];
    food = { x: 5, y: 5 };
    dx = 0; dy = 0; score = 0;
    gameOver = false; gameStarted = false;
    scoreEl.textContent = 0;
    messageEl.textContent = "Press Start to begin.";
    messageEl.className = "message";
    drawGame();
});

// -- Mute button --
muteButton.addEventListener("click", function() {
    initAudio();
    isMuted = !isMuted;                                  // Toggle mute on/off
    muteButton.textContent = isMuted ? "Unmute" : "Mute";
    muteButton.classList.toggle("muted", isMuted);       // Grey out when muted
});

// -- Start the game --
drawGame();
setInterval(moveSnake, 120); // Run moveSnake every 120 milliseconds

