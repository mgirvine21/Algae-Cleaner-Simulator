let algae = [];
let maxAlgae = 20;
let cleanRadius = 50;
let snailImg;
let snailPos;
let snailAngle = 0;
let tankX, tankY, tankW, tankH;
let fishImages = [];
let fishes = [];
let spores = [];
let trails = [];
let bubbles = [];
let floatingCircles = [];
let rocks = [];

function preload() {
  snailImg = loadImage("assets/snail.png");
  fishImages[0] = loadImage("assets/fish.png");
  fishImages[1] = loadImage("assets/fish2.png");
  fishImages[2] = loadImage("assets/fish3.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //tank size
  tankW = width * 0.8;
  tankH = height * 0.6;
  tankX = (width - tankW) / 2;
  tankY = (height - tankH) / 2;
  noiseDetail(2, 0.5);
  snailPos = createVector(width / 2, height / 2);

  //algae
  for (let i = 0; i < maxAlgae; i++) {
    let x = random(tankX + 35, tankX + tankW - 35);
    let y = random(tankY + 35, tankY + tankH - 35);
    let r = random(10, 60);
    let noiseVal = noise(x * 0.005, y * 0.005);
    if (noiseVal > 0.5) {
      algae.push(new Metaball(x, y, r, i));
    }
  }

  //fish
  for (let i = 0; i < 3; i++) {
    let x = random(tankX + 100, tankX + tankW - 100);
    let y = random(tankY + 100, tankY + tankH - 100);
    fishes.push(new Fish(x, y, fishImages[i]));
  }

  //lsystems
  for (let i = 0; i < 10; i++) {
    lSystems.push(
      generateLSystem(
        random(PLANT_TYPES),
        random(tankX + 100, tankX + tankW - 100),
        random(750, 800)
      )
    );
  }
  

  //rocks
  for (let i = 0; i < 20; i++) {
    rocks.push({
      x: random(tankX + 20, tankX + tankW - 20),
      y: random(tankH + 75, tankH + 71 + tankH / 5 - 10),
      size: random(10, 30),
      col: color(random(80, 130), random(80, 130), random(80, 130)),
    });
  }

  //blue circles
  for (let i = 0; i < 20; i++) {
    floatingCircles.push({
      x: random(tankX + 20, tankX + tankW - 20),
      y: random(tankY + 20, tankY + tankH - 60),
      radius: random(10, 40),
      speed: random(0.2, 0.6),
      floatOffset: random(TWO_PI),
      col: color(0, random(100, 200), random(200, 255), 80),
    });
  }
}

function draw() {
  background(20, 30, 30);
  stroke(0);
  //tank blue
  fill(17, 78, 105);
  rect(tankX, tankY, tankW, tankH);

  //draw everything behind algae
  drawTankBackground();

  //draw bubbbles above snail if mouse clicked
  drawBubbles();
  //snail movement
  let mouseVec = createVector(mouseX, mouseY);
  let direction = p5.Vector.sub(mouseVec, snailPos);
  snailAngle = direction.heading();
  //snail slowed
  snailPos.lerp(mouseVec, 0.06);

  //contain in tank
  snailPos.x = constrain(snailPos.x, tankX + 50, tankX + tankW - 50);
  snailPos.y = constrain(snailPos.y, tankY, tankY + tankH - 50);

  push();
  translate(snailPos.x, snailPos.y);
  rotate(snailAngle);
  imageMode(CENTER);
  image(snailImg, 0, 0, 80, 80); // Adjust size as needed
  pop();

  //snail trail
  fill(255, 255, 255, 55);
  noStroke();
  trails.push(createVector(snailPos.x, snailPos.y));
  if (trails.length > 50) {
    trails.shift();
  }
  for (let i = 0; i < trails.length; i++) {
    let pos = trails[i];
    ellipse(pos.x, pos.y, i / 2);
  }

  //remove eaten algae
  for (let i = algae.length - 1; i >= 0; i--) {
    let a = algae[i];
    if (dist(snailPos.x, snailPos.y, a.p.x, a.p.y) < cleanRadius) {
      algae.splice(i, 1);
    }
  }

  //spawn new algae
  if (algae.length < maxAlgae) {
    let x = random(tankX + 35, tankX + tankW - 35);
    let y = random(tankY + 35, tankY + tankH - 35);
    let r = random(10, 30);
    let noiseVal = noise(x * 0.005, y * 0.005);
    if (noiseVal > 0.5) {
      algae.push(new Metaball(x, y, r, algae.length));
    }
  }

  //display algae and connect algae
  for (let i = 0; i < algae.length; i++) {
    let a = algae[i];
    a.display(color(92, 133, 62));

    let others = algae.slice();
    others.splice(i, 1);
    a.generateConnections(others);
  }

  //draw top of tank
  fill(0);
  rect(tankX - 2, tankY / 1.6, tankW + 4, tankH / 8);
}
