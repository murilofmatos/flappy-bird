class Bird {
  constructor() {
    this.x = 80;
    this.y = height / 2;
    this.size = 25;
    this.velocity = 0;
    this.gravity = 0.6;
    this.jumpForce = -12;
    this.maxVelocity = 10;
    this.angle = 0;
  }

  update() {
    // Aplicar gravidade
    this.velocity += this.gravity;

    // Limitar velocidade máxima
    this.velocity = constrain(
      this.velocity,
      -this.maxVelocity,
      this.maxVelocity
    );

    // Atualizar posição
    this.y += this.velocity;

    // Calcular ângulo baseado na velocidade
    this.angle = map(
      this.velocity,
      -this.maxVelocity,
      this.maxVelocity,
      -PI / 4,
      PI / 2
    );

    // Limitar o pássaro dentro da tela
    this.y = constrain(this.y, this.size / 2, height - this.size / 2);
  }

  jump() {
    this.velocity = this.jumpForce;
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Corpo do pássaro
    fill(255, 215, 0); // Amarelo dourado
    stroke(255, 140, 0); // Contorno laranja
    strokeWeight(2);
    ellipse(0, 0, this.size, this.size);

    // Asa
    fill(255, 165, 0); // Laranja
    ellipse(-5, -3, 12, 8);

    // Olho
    fill(255);
    ellipse(5, -5, 8, 8);
    fill(0);
    ellipse(6, -4, 4, 4);

    // Bico
    fill(255, 140, 0);
    triangle(12, -2, 18, 0, 12, 2);

    pop();
  }

  // Verificar colisão com os limites da tela
  checkBounds() {
    return this.y - this.size / 2 <= 0 || this.y + this.size / 2 >= height;
  }

  // Verificar colisão com um cano
  checkCollision(pipe) {
    // Verificar se o pássaro está na mesma posição horizontal do cano
    if (
      this.x + this.size / 2 > pipe.x &&
      this.x - this.size / 2 < pipe.x + pipe.width
    ) {
      // Verificar colisão com cano superior ou inferior
      if (
        this.y - this.size / 2 < pipe.topHeight ||
        this.y + this.size / 2 > height - pipe.bottomHeight
      ) {
        return true;
      }
    }
    return false;
  }

  // Verificar se passou por um cano (para pontuação)
  checkScore(pipe) {
    return this.x > pipe.x + pipe.width && !pipe.scored;
  }

  // Resetar posição do pássaro
  reset() {
    this.y = height / 2;
    this.velocity = 0;
    this.angle = 0;
  }
}
