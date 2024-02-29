let snake = [];
let food = {};
let score = 0;
let direction = "";
let gameLoopInterval = 0;
let isRunningGame = false;

const setupGame = () => {
  if (!isRunningGame) {
    score = 0;
    direction = "right";
  }
  startGame();
};

const startGame = () => {
  const { playButton, pauseButton, resetButton } = getGameElements();

  document.addEventListener("keydown", changeDirection);
  gameLoopInterval = setInterval(gameLoop, 1000 / 10);
  inactivate(resetButton);
  inactivate(playButton);
  activate(pauseButton);
  gameLoop();
};

const gameLoop = () => {
  clearCanvas();
  drawSnake();
  drawFood();
  moveSnake();
  checkCollision();
};

const clearCanvas = () => {
  const { gameBoard, gameBoardContext } = getGameElements();
  gameBoardContext.clearRect(0, 0, gameBoard.width, gameBoard.height);
};

const createSnake = () => {
  const { gameBoard, gridSize, snakeSize } = getGameElements();

  // starts snake from the center
  const centerX = Math.floor(gameBoard.width / gridSize / 2);
  const centerY = Math.floor(gameBoard.height / gridSize / 2);

  for (let i = 0; i < snakeSize; i++) {
    snake.push({ x: centerX - i, y: centerY });
  }
};

const drawSnake = () => {
  const { gameBoardContext, gridSize } = getGameElements();

  snake.forEach((segment) => {
    gameBoardContext.fillStyle = "#d0e392";
    gameBoardContext.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
};

// Move the snake's head according to the direction and add it to the front of the snake array.
const moveSnake = () => {
  const { scoreElement } = getGameElements();
  const head = {
    x: snake[0].x + (direction === "right" ? 1 : direction === "left" ? -1 : 0),
    y: snake[0].y + (direction === "down" ? 1 : direction === "up" ? -1 : 0),
  };

  snake.unshift(head);
  // Check if snake has eaten food or pop last segment
  if (head.x === food.x && head.y === food.y) {
    score += 5;
    createFood();
  } else {
    snake.pop();
  }
  scoreElement.innerHTML = score;
};

const createFood = () => {
  const { gameBoard, gridSize } = getGameElements();

  food = {
    x: Math.floor(Math.random() * (gameBoard.width / gridSize)),
    y: Math.floor(Math.random() * (gameBoard.height / gridSize)),
  };
};

const drawFood = () => {
  const { gameBoardContext, gridSize } = getGameElements();

  gameBoardContext.fillStyle = "#f6c8c4";
  gameBoardContext.fillRect(
    food.x * gridSize,
    food.y * gridSize,
    gridSize,
    gridSize
  );
};

const changeDirection = (e) => {
  const leftKeyCode = 37;
  const upKeyCode = 38;
  const rightKeyCode = 39;
  const downKeyCode = 40;

  switch (e.keyCode) {
    case leftKeyCode:
      if (direction !== "right") {
        direction = "left";
      }
      break;
    case upKeyCode:
      if (direction !== "down") {
        direction = "up";
      }
      break;
    case rightKeyCode:
      if (direction !== "left") {
        direction = "right";
      }
      break;
    case downKeyCode:
      if (direction !== "up") {
        direction = "down";
      }
      break;
    default:
      break;
  }
};

const checkCollision = () => {
  const { gameBoard, gridSize } = getGameElements();
  if (
    snake[0].x < 0 ||
    snake[0].x >= gameBoard.width / gridSize ||
    snake[0].y < 0 ||
    snake[0].y >= gameBoard.height / gridSize
  ) {
    gameOver();
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      gameOver();
    }
  }
};

const gameOver = () => {
  const { messageElement, playButton, pauseButton, resetButton } =
    getGameElements();

  messageElement.style.opacity = "1";
  inactivate(playButton);
  inactivate(pauseButton);
  activate(resetButton);
  clearInterval(gameLoopInterval);
};

const pauseGame = () => {
  const { playButton, pauseButton, resetButton } = getGameElements();

  isRunningGame = true;
  inactivate(pauseButton);
  activate(resetButton);
  activate(playButton);
  clearInterval(gameLoopInterval);
};

const resetGame = () => {
  const { scoreElement, messageElement, playButton, resetButton } =
    getGameElements();

  snake = [];
  food = {};
  direction = "";
  gameLoopInterval = 0;
  isRunningGame = false;
  scoreElement.innerHTML = 0;
  messageElement.style.opacity = "0";

  activate(playButton);
  inactivate(resetButton);
  clearCanvas();
  createSnake();
  createFood();
  drawSnake();
  drawFood();
};

const inactivate = (element) => {
  element.classList.add("inactive");
};

const activate = (element) => {
  element.classList.remove("inactive");
};

const getGameElements = () => {
  const canvas = document.querySelector(".game__board");
  const elements = {
    gameBoard: canvas,
    gameBoardContext: canvas.getContext("2d"),
    scoreElement: document.querySelector("#score"),
    messageElement: document.querySelector(".message"),
    playButton: document.querySelector("#play"),
    pauseButton: document.querySelector("#pause"),
    resetButton: document.querySelector("#reset"),
    snakeSize: 5,
    gridSize: 5,
  };
  return elements;
};

const setButtons = () => {
  const { playButton, pauseButton, resetButton } = getGameElements();

  playButton.addEventListener("click", setupGame);
  pauseButton.addEventListener("click", pauseGame);
  resetButton.addEventListener("click", resetGame);
};

const initializeApp = () => {
  const { scoreElement, resetButton, pauseButton } = getGameElements();

  scoreElement.innerHTML = score;
  inactivate(resetButton);
  inactivate(pauseButton);
  setButtons();
  createSnake();
  drawSnake();
  createFood();
  drawFood();
};

window.addEventListener("DOMContentLoaded", initializeApp);
