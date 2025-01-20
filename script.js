const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20; // Size of each grid square
const gridCount = canvas.width / gridSize;

let worm;
let direction;
let food;
let bombs;
let gameOver;
let gameSpeed;

const wormColors = ["#ff7f50", "#ff6347", "#ff4500", "#ff6347"]; // Worm colors

let speedIncreaseRate = 5; // Rate at which the game speed increases

const refreshButton = document.getElementById("refresh-btn");  // Reference to the refresh button

// Function to initialize the game state
function resetGame() {
  worm = [{ x: 10, y: 10 }]; // Worm starts as a single block
  direction = { x: 0, y: 0 }; // Current movement direction
  food = { x: 5, y: 5 }; // Food position
  bombs = []; // Array to hold bomb positions
  gameOver = false;

  gameSpeed = 200;  // Initial game speed (milliseconds)
  
  // Reset game over message visibility
  document.getElementById("game-over-message").style.display = "none";

  // Reset the refresh button text to "Start Game"
  refreshButton.textContent = "Start Game";

  // Reset the message box visibility
  document.getElementById("game-message").style.display = "none";

  // Generate new food and bomb
  generateFood();
  generateBomb();

  // Start the game loop
  gameLoop();
}

// Game loop to update the game state
function gameLoop() {
  if (gameOver) {
    // Show the game over message
    document.getElementById("game-over-message").style.display = "block";
    refreshButton.textContent = "Restart Game";  // Change the button text to "Restart Game"
    return;
  }

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the border
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 10;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Move the worm
  moveWorm();

  // Check if the worm eats the food
  checkFoodCollision();

  // Check if the worm hits a bomb
  checkBombCollision();

  // Draw the food
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2,
    gridSize / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Draw the bombs
  bombs.forEach((bomb) => {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(
      bomb.x * gridSize + gridSize / 2,
      bomb.y * gridSize + gridSize / 2,
      gridSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  // Draw the worm
  worm.forEach((segment, index) => {
    ctx.fillStyle = wormColors[index % wormColors.length];
    ctx.beginPath();
    ctx.arc(
      segment.x * gridSize + gridSize / 2,
      segment.y * gridSize + gridSize / 2,
      gridSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  // Call the loop again with the dynamic game speed
  setTimeout(gameLoop, gameSpeed);  // Use dynamic game speed
}

// Move the worm
function moveWorm() {
  const head = { ...worm[0] };
  head.x += direction.x;
  head.y += direction.y;

  // Wrap the worm around the borders
  if (head.x < 0) head.x = gridCount - 1; // Wrap from left to right
  if (head.x >= gridCount) head.x = 0; // Wrap from right to left
  if (head.y < 0) head.y = gridCount - 1; // Wrap from top to bottom
  if (head.y >= gridCount) head.y = 0; // Wrap from bottom to top

  worm.unshift(head); // Add the new head
  worm.pop(); // Remove the tail
}

// Check if the worm eats the food
function checkFoodCollision() {
  const head = worm[0];
  if (head.x === food.x && head.y === food.y) {
    worm.push({}); // Add a new segment
    generateFood();
    generateBomb(); // Add a new bomb whenever food is eaten

    // Increase the game speed when the worm eats food
    if (gameSpeed > 50) {
      gameSpeed -= speedIncreaseRate; // Increase speed by decreasing the delay
    }

    // Check if worm exceeds the maximum size threshold (e.g., 50 segments)
    if (worm.length >10 ) {
      showLifeMessage();  // Show the "Get a Life!" message
    }
  }
}

// Show the message when the worm is too long
function showLifeMessage() {
  document.getElementById("game-message").textContent = "Ok this can go on forever. GET A LIFE!";
  document.getElementById("game-message").style.display = "block";  // Make the message visible
}

// Check if the worm hits a bomb
function checkBombCollision() {
  const head = worm[0];
  bombs.forEach((bomb) => {
    if (head.x === bomb.x && head.y === bomb.y) {
      gameOver = true; // Game over if the worm hits a bomb
    }
  });
}

// Generate new food position
function generateFood() {
  food = {
    x: Math.floor(Math.random() * gridCount),
    y: Math.floor(Math.random() * gridCount),
  };
}

// Generate a new bomb position
function generateBomb() {
  const bomb = {
    x: Math.floor(Math.random() * gridCount),
    y: Math.floor(Math.random() * gridCount),
  };
  // Ensure the bomb does not spawn on the worm or the food
  if (
    worm.some((segment) => segment.x === bomb.x && segment.y === bomb.y) ||
    (bomb.x === food.x && bomb.y === food.y)
  ) {
    generateBomb(); // Retry if bomb spawns on the worm or food
  } else {
    bombs.push(bomb);
  }
}

// Listen for keyboard input
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

// Add event listener for refresh button
refreshButton.addEventListener("click", () => {
  resetGame(); // Reset the game when the button is clicked
});

// Initialize the game when the page is loaded
resetGame();  // Start the game when the page loads
