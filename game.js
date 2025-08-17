const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_SIZE = 14;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 6;
const AI_SPEED = 4;

// Initial positions
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballVY = 4 * (Math.random() > 0.5 ? 1 : -1);

// Score (optional)
let playerScore = 0;
let aiScore = 0;

// Mouse control
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Draw everything
function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Net
  ctx.fillStyle = "#aaa";
  for (let y = 0; y < canvas.height; y += 24) {
    ctx.fillRect(canvas.width / 2 - 2, y, 4, 12);
  }

  // Paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Ball
  ctx.beginPath();
  ctx.arc(ballX + BALL_SIZE/2, ballY + BALL_SIZE/2, BALL_SIZE/2, 0, 2 * Math.PI);
  ctx.fill();

  // Scores
  ctx.font = "32px Arial";
  ctx.textAlign = "center";
  ctx.fillText(playerScore, canvas.width / 4, 40);
  ctx.fillText(aiScore, (canvas.width * 3) / 4, 40);
}

// Ball and game logic
function update() {
  // Move ball
  ballX += ballVX;
  ballY += ballVY;

  // Wall collision
  if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
    ballVY = -ballVY;
    ballY = Math.max(0, Math.min(canvas.height - BALL_SIZE, ballY));
  }

  // Player paddle collision
  if (
    ballX <= PLAYER_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE >= playerY &&
    ballY <= playerY + PADDLE_HEIGHT
  ) {
    ballVX = Math.abs(ballVX);
    // Add some "spin" based on where the ball hits the paddle
    let impact = (ballY + BALL_SIZE / 2 - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ballVY += impact * 2;
  }

  // AI paddle collision
  if (
    ballX + BALL_SIZE >= AI_X &&
    ballY + BALL_SIZE >= aiY &&
    ballY <= aiY + PADDLE_HEIGHT
  ) {
    ballVX = -Math.abs(ballVX);
    let impact = (ballY + BALL_SIZE / 2 - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ballVY += impact * 2;
  }

  // Score
  if (ballX < 0) {
    aiScore++;
    resetBall(-1);
  } else if (ballX + BALL_SIZE > canvas.width) {
    playerScore++;
    resetBall(1);
  }

  // AI movement (simple AI: follow ball)
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY + BALL_SIZE / 2 - 8) {
    aiY += AI_SPEED;
  } else if (aiCenter > ballY + BALL_SIZE / 2 + 8) {
    aiY -= AI_SPEED;
  }
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function resetBall(direction) {
  ballX = canvas.width / 2 - BALL_SIZE / 2;
  ballY = canvas.height / 2 - BALL_SIZE / 2;
  ballVX = 5 * direction;
  ballVY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Main game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();