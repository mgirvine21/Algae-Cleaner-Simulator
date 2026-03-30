//lsystems code from lsystems project
//adjusted to work in radians instead of degree
//adjusted to make sure the ends do not sway outside of the tank
let lSystems = [];
const PLANT_TYPES = [
  {
    name: "darkGreen",
    axiom: "F",
    rules: { F: "FF+[+F-F]-[-F+F]" },
    angle: (22.5 * Math.PI) / 180,
    color: [114, 96, 18],
  },
  {
    name: "lightGreen",
    axiom: "Y",
    rules: {
      X: "X[-FFF][+FFF]FX",
      Y: "YFX[+Y][-Y]",
    },
    angle: (25.7 * Math.PI) / 180,
    color: [170, 217, 54],
  },
  {
    name: "green",
    axiom: "VWYVWYVW",
    rules: {
      V: "[+++W][---W]YV",
      W: "+X[-W]Z",
      X: "-W[+X]Z",
      Y: "YZ",
      Z: "[-FFF][+FFF]F",
    },
    angle: (20 * Math.PI) / 180,
    color: [202, 179, 43],
  },
  {
    name: "reddishBrown",
    axiom: "F",
    rules: {
      F: "FF-[XY]+[XY]",
      X: "+FY",
      Y: "-FX",
    },
    angle: (22.5 * Math.PI) / 180,
    color: [165, 42, 42],
  },
];

function generateLSystem(plantType, x, y) {
  let axiom = plantType.axiom;

  for (let i = 0; i < 4; i++) {
    let newAxiom = "";
    for (let char of axiom) {
      newAxiom += plantType.rules[char] || char;
    }
    axiom = newAxiom;
  }

  return {
    axiom,
    xPos: x,
    yPos: y,
    angle: random(radians(70), radians(120)),
    lineLength: random(5, 15),
    angleIncrement: plantType.angle,
    color: plantType.color,
  };
}

function drawLSystem(plant) {
  push();
  stroke(plant.color);
  strokeWeight(1);
  translate(plant.xPos, plant.yPos);

  let stack = [];
  let baseSway = sin(millis() / 800) * radians(4); // sway is now in radians

  let currentX = 0;
  let currentY = 0;
  let currentAngle = plant.angle;

  for (let char of plant.axiom) {
    switch (char) {
      case "F": {
        let distanceToFish = dist(
          plant.xPos + currentX,
          plant.yPos + currentY,
          mouseX,
          mouseY
        );
        let swayStrength = map(
          distanceToFish,
          0,
          width / 3,
          radians(20),
          0,
          true
        );
        let localSway = lerp(
          plant.currentSway || 0,
          baseSway + swayStrength,
          0.5
        );

        let endX = currentX + cos(currentAngle + localSway) * plant.lineLength;
        let endY = currentY - sin(currentAngle + localSway) * plant.lineLength;

        //check if end position is inside the tank
        let worldEndX = plant.xPos + endX;
        let worldEndY = plant.yPos + endY;
        if (
          worldEndX < tankX ||
          worldEndX > tankX + tankW ||
          worldEndY < tankY ||
          worldEndY > tankY + tankH
        ) {
          //stop this branch if it's outside the tank bounds
          break;
        }

        line(currentX, currentY, endX, endY);
        currentX = endX;
        currentY = endY;
        break;
      }

      case "+":
        currentAngle += plant.angleIncrement + baseSway;
        break;

      case "-":
        currentAngle -= plant.angleIncrement + baseSway;
        break;

      case "[":
        stack.push([currentX, currentY, currentAngle]);
        push();
        break;

      case "]":
        [currentX, currentY, currentAngle] = stack.pop();
        pop();
        break;
    }
  }

  pop();
}
