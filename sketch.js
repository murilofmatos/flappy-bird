// Variáveis do jogo
let bird;
let pipes = [];
let gameState = "menu"; // 'menu', 'playing', 'gameOver', 'paused'
let score = 0;
let highScore = 0;
let frameCounter = 0;
let pipeSpawnRate = 90; // frames entre novos canos

// Cores e configurações
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

function setup() {
  let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent("game-canvas");

  // Inicializar o pássaro
  bird = new Bird();

  // Carregar high score do localStorage
  highScore = getItem("flappyBirdHighScore") || 0;
}

function draw() {
  // Fundo gradiente
  drawBackground();

  // Lógica baseada no estado do jogo
  switch (gameState) {
    case "menu":
      drawMenu();
      break;
    case "playing":
      updateGame();
      drawGame();
      break;
    case "gameOver":
      drawGame();
      drawGameOver();
      break;
    case "paused":
      drawGame();
      drawPaused();
      break;
  }
}

function drawBackground() {
  // Céu gradiente
  for (let i = 0; i <= height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(135, 206, 235), color(255, 218, 185), inter);
    stroke(c);
    line(0, i, width, i);
  }

  // Nuvens simples
  drawClouds();

  // Chão
  fill(34, 139, 34);
  noStroke();
  rect(0, height - 50, width, 50);

  // Detalhes do chão
  fill(46, 125, 50);
  for (let x = 0; x < width; x += 20) {
    rect(x, height - 45, 15, 5);
  }
}

function drawClouds() {
  fill(255, 255, 255, 150);
  noStroke();

  // Nuvens estáticas para simplicidade
  ellipse(150, 100, 60, 40);
  ellipse(170, 90, 80, 50);
  ellipse(190, 100, 60, 40);

  ellipse(500, 150, 70, 45);
  ellipse(520, 140, 90, 55);
  ellipse(540, 150, 70, 45);

  ellipse(650, 80, 50, 30);
  ellipse(665, 75, 70, 40);
  ellipse(680, 80, 50, 30);
}

function updateGame() {
  frameCounter++;

  // Atualizar pássaro
  bird.update();

  // Verificar colisão com limites
  if (bird.checkBounds()) {
    gameOver();
    return;
  }

  // Gerar novos canos
  if (frameCounter % pipeSpawnRate === 0) {
    pipes.push(new Pipe());
  }

  // Atualizar canos
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();

    // Verificar colisão
    if (bird.checkCollision(pipes[i])) {
      gameOver();
      return;
    }

    // Verificar pontuação
    if (pipes[i].canScore(bird)) {
      score++;
      pipes[i].markScored();
    }

    // Remover canos fora da tela
    if (pipes[i].isOffScreen()) {
      pipes.splice(i, 1);
    }
  }
}

function drawGame() {
  // Desenhar canos
  for (let pipe of pipes) {
    pipe.show();
  }

  // Desenhar pássaro
  bird.show();

  // Desenhar UI
  drawScore();
}

function drawMenu() {
  // Título
  fill(255, 255, 255);
  stroke(0);
  strokeWeight(3);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("FLAPPY BIRD", width / 2, height / 2 - 100);

  // Instruções
  fill(255, 255, 255);
  stroke(0);
  strokeWeight(2);
  textSize(24);
  text("Pressione ESPAÇO ou CLIQUE para começar", width / 2, height / 2);

  // High Score
  textSize(20);
  text(`Melhor Pontuação: ${highScore}`, width / 2, height / 2 + 50);

  // Pássaro animado no menu
  push();
  translate(width / 2, height / 2 + 100);
  rotate(sin(frameCount * 0.1) * 0.2);

  // Corpo do pássaro
  fill(255, 215, 0);
  stroke(255, 140, 0);
  strokeWeight(2);
  ellipse(0, 0, 30, 30);

  // Asa
  fill(255, 165, 0);
  ellipse(-6, -4, 15, 10);

  // Olho
  fill(255);
  ellipse(6, -6, 10, 10);
  fill(0);
  ellipse(7, -5, 5, 5);

  // Bico
  fill(255, 140, 0);
  triangle(15, -2, 22, 0, 15, 2);

  pop();
}

function drawGameOver() {
  // Overlay semi-transparente
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  // Caixa de game over
  fill(255);
  stroke(0);
  strokeWeight(3);
  rectMode(CENTER);
  rect(width / 2, height / 2, 400, 250, 20);

  // Texto Game Over
  fill(220, 20, 60);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("GAME OVER", width / 2, height / 2 - 60);

  // Pontuação final
  fill(0);
  textSize(24);
  text(`Pontuação: ${score}`, width / 2, height / 2 - 20);
  text(`Melhor: ${highScore}`, width / 2, height / 2 + 10);

  // Novo recorde
  if (score === highScore && score > 0) {
    fill(255, 215, 0);
    textSize(20);
    text("🏆 NOVO RECORDE! 🏆", width / 2, height / 2 + 40);
  }

  // Instruções
  fill(100);
  textSize(18);
  text("Pressione R para jogar novamente", width / 2, height / 2 + 80);

  rectMode(CORNER);
}

function drawPaused() {
  // Overlay semi-transparente
  fill(0, 0, 0, 100);
  rect(0, 0, width, height);

  // Texto pausado
  fill(255);
  stroke(0);
  strokeWeight(2);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("PAUSADO", width / 2, height / 2);

  textSize(20);
  text("Pressione P para continuar", width / 2, height / 2 + 50);
}

function drawScore() {
  // Pontuação atual
  fill(255);
  stroke(0);
  strokeWeight(2);
  textAlign(LEFT, TOP);
  textSize(32);
  text(`Score: ${score}`, 20, 30);

  // High score
  textSize(20);
  text(`Best: ${highScore}`, 20, 70);
}

function gameOver() {
  gameState = "gameOver";

  // Atualizar high score
  if (score > highScore) {
    highScore = score;
    storeItem("flappyBirdHighScore", highScore);
  }
}

function resetGame() {
  bird.reset();
  pipes = [];
  score = 0;
  frameCounter = 0;
  gameState = "playing";
}

// Controles do teclado
function keyPressed() {
  if (key === " ") {
    // Espaço
    if (gameState === "menu") {
      resetGame();
    } else if (gameState === "playing") {
      bird.jump();
    }
  }

  if (key === "r" || key === "R") {
    if (gameState === "gameOver") {
      resetGame();
    }
  }

  if (key === "p" || key === "P") {
    if (gameState === "playing") {
      gameState = "paused";
    } else if (gameState === "paused") {
      gameState = "playing";
    }
  }
}

// Controles do mouse
function mousePressed() {
  if (gameState === "menu") {
    resetGame();
  } else if (gameState === "playing") {
    bird.jump();
  }
}

// Prevenir comportamento padrão da barra de espaço
function keyTyped() {
  if (key === " ") {
    return false;
  }
}
