//fish that bounces around the contraints of the tank
class Fish {
  constructor(x, y, img) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 2));
    this.img = img;
    this.flip = false;
    this.size = random(60, 100);
  }

  update() {
    this.pos.add(this.vel);

    //contained in tank :>
    if (this.pos.x < tankX || this.pos.x > tankX + tankW - this.size) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, tankX, tankX + tankW);
    }
    if (this.pos.y < tankY || this.pos.y > tankY + tankH - this.size) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, tankY, tankY + tankH);
    }
    //flip sprite
    this.flip = this.vel.x > 0;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    if (this.flip) {
      scale(-1, 1);
      image(this.img, -this.size, -this.size / 2, this.size, this.size);
    } else {
      image(this.img, 0, -this.size / 2, this.size, this.size);
    }
    pop();
  }
}
