const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");

// Game settings
const boardSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let score = 0;
let lastTime = 0;
const snakeSpeed = 10; // Moves per second

// Initialize the board
function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
  }
}

// Draw the snake
function drawSnake() {
  snake.forEach((segment) => {
    const index = segment.y * boardSize + segment.x;
    const cell = board.children[index];
    if (cell) cell.classList.add("snake");
  });
}

// Draw the food
function drawFood() {
  const index = food.y * boardSize + food.x;
  const cell = board.children[index];
  if (cell) cell.classList.add("food");
}

// Move the snake
function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  // Check collision with food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreDisplay.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }

  // Check collision with walls or itself
  if (
    head.x < 0 ||
    head.x >= boardSize ||
    head.y < 0 ||
    head.y >= boardSize ||
    snake
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    alert("Game Over! Your score: " + score);
    resetGame();
  }
}

// Place food at a random position
function placeFood() {
  food.x = Math.floor(Math.random() * boardSize);
  food.y = Math.floor(Math.random() * boardSize);
  if (snake.some((segment) => segment.x === food.x && segment.y === food.y)) {
    placeFood();
  }
}

// Reset the game
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  nextDirection = { x: 0, y: 0 };
  score = 0;
  scoreDisplay.textContent = score;
  placeFood();
}

// Game loop
function gameLoop(currentTime) {
  window.requestAnimationFrame(gameLoop);

  const secondsSinceLastRender = (currentTime - lastTime) / 1000;
  if (secondsSinceLastRender < 1 / snakeSpeed) return;

  lastTime = currentTime;

  // Update direction
  direction = nextDirection;

  createBoard();
  moveSnake();
  drawSnake();
  drawFood();
}

// Handle controls
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
      if (direction.y === 0) nextDirection = { x: 0, y: -1 };
      break;
    case "a":
      if (direction.x === 0) nextDirection = { x: -1, y: 0 };
      break;
    case "s":
      if (direction.y === 0) nextDirection = { x: 0, y: 1 };
      break;
    case "d":
      if (direction.x === 0) nextDirection = { x: 1, y: 0 };
      break;
  }
});

// Start the game
placeFood();
window.requestAnimationFrame(gameLoop);
