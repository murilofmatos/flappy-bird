class Pipe {
  constructor() {
    this.width = 60;
    this.gap = 150;
    this.x = width;
    this.speed = 3;
    this.scored = false;

    // Altura aleatória para o cano superior
    this.topHeight = random(50, height - this.gap - 50);
    this.bottomHeight = height - this.topHeight - this.gap;
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    // Cano superior
    fill(34, 139, 34); // Verde escuro
    stroke(0, 100, 0); // Contorno verde mais escuro
    strokeWeight(2);
    rect(this.x, 0, this.width, this.topHeight);

    // Tampa do cano superior
    fill(46, 125, 50);
    rect(this.x - 5, this.topHeight - 20, this.width + 10, 20);

    // Cano inferior
    fill(34, 139, 34);
    stroke(0, 100, 0);
    strokeWeight(2);
    rect(this.x, height - this.bottomHeight, this.width, this.bottomHeight);

    // Tampa do cano inferior
    fill(46, 125, 50);
    rect(this.x - 5, height - this.bottomHeight, this.width + 10, 20);

    // Adicionar alguns detalhes visuais nos canos
    this.addPipeDetails();
  }

  addPipeDetails() {
    // Detalhes no cano superior
    fill(60, 179, 113);
    for (let i = 0; i < this.topHeight; i += 30) {
      rect(this.x + 5, i + 5, this.width - 10, 3);
    }

    // Detalhes no cano inferior
    for (let i = height - this.bottomHeight + 10; i < height; i += 30) {
      rect(this.x + 5, i, this.width - 10, 3);
    }
  }

  // Verificar se o cano saiu da tela
  isOffScreen() {
    return this.x + this.width < 0;
  }

  // Marcar que o pássaro passou por este cano
  markScored() {
    this.scored = true;
  }

  // Verificar se o cano está na posição de pontuação
  canScore(bird) {
    return !this.scored && bird.x > this.x + this.width;
  }
}
