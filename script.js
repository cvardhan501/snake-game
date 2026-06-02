const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('message');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const maxSpeed = 14;
let snake = [{ x: 10, y: 10 }];
let velocity = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let gameOver = false;
let paused = false;
let speed = 8;
let lastUpdateTime = 0;

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 0, y: 0 };
  food = randomFoodPosition();
  score = 0;
  gameOver = false;
  paused = false;
  speed = 8;
  scoreEl.textContent = score;
  messageEl.textContent = 'Press Start to begin.';
  messageEl.className = 'message';
}

function randomFoodPosition() {
  let position;
  while (true) {
    position = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
    const collision = snake.some(segment => segment.x === position.x && segment.y === position.y);
    if (!collision) return position;
  }
}

function drawBoard() {
  ctx.fillStyle = '#07090f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#2fd4a7';
  snake.forEach((segment, index) => {
    ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4);
    if (index === 0) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(segment.x * gridSize + 6, segment.y * gridSize + 6, gridSize - 12, gridSize - 12);
      ctx.fillStyle = '#2fd4a7';
    }
  });

  ctx.fillStyle = '#ff4f6d';
  ctx.fillRect(food.x * gridSize + 3, food.y * gridSize + 3, gridSize - 6, gridSize - 6);
}

function updateGame() {
  if (gameOver || paused) return;
  if (velocity.x === 0 && velocity.y === 0) return;

  const head = {
    x: snake[0].x + velocity.x,
    y: snake[0].y + velocity.y,
  };

  const hitWall = head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
  const hitSelf = snake.some(segment => segment.x === head.x && segment.y === head.y);
  if (hitWall || hitSelf) {
    gameOver = true;
    messageEl.textContent = 'Game over! Press Restart to try again.';
    messageEl.className = 'message error';
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    speed = Math.min(maxSpeed, speed + 0.5);
    scoreEl.textContent = score;
    food = randomFoodPosition();
    messageEl.textContent = 'Great! Keep going.';
    messageEl.className = 'message success';
  } else {
    snake.pop();
  }
}

function gameLoop(timestamp) {
  const timeBetweenFrames = 1000 / speed;
  if (timestamp - lastUpdateTime > timeBetweenFrames) {
    lastUpdateTime = timestamp;
    updateGame();
    drawBoard();
  }
  requestAnimationFrame(gameLoop);
}

function setDirection(x, y) {
  if (gameOver) return;
  if (velocity.x === -x && velocity.y === -y) return;
  velocity = { x, y };
}

window.addEventListener('keydown', event => {
  if (event.key === 'ArrowUp') setDirection(0, -1);
  if (event.key === 'ArrowDown') setDirection(0, 1);
  if (event.key === 'ArrowLeft') setDirection(-1, 0);
  if (event.key === 'ArrowRight') setDirection(1, 0);
  if (event.key === ' ' || event.key === 'Spacebar') {
    if (gameOver) return;
    paused = !paused;
    messageEl.textContent = paused ? 'Paused. Press Space to resume.' : 'Resumed.';
    messageEl.className = paused ? 'message' : 'message success';
  }
});

startButton.addEventListener('click', () => {
  if (gameOver) {
    resetGame();
  }
  if (velocity.x === 0 && velocity.y === 0) {
    setDirection(0, -1);
  }
  paused = false;
  messageEl.textContent = 'Game started. Use arrow keys to move.';
  messageEl.className = 'message success';
});

restartButton.addEventListener('click', () => {
  resetGame();
  drawBoard();
});

resetGame();
requestAnimationFrame(gameLoop);
