//what gets drawn behind the snail and algae and tank front
function drawTankBackground() {
  noStroke();
  //sand
  fill(186, 155, 141);
  rect(tankX + 2, tankH + 85, tankW - 4, tankH / 5);

  //rocks
  for (let r of rocks) {
    fill(r.col);
    ellipse(r.x, r.y, r.size, r.size * 0.7);
  }

  //blue circles
  for (let c of floatingCircles) {
    let floatY = c.y + sin(frameCount * 0.02 + c.floatOffset) * 5;
    fill(c.col);
    noStroke();
    ellipse(c.x, floatY, c.radius);
  }

  //fish
  for (let fish of fishes) {
    fish.update();
    fish.display();
  }

  //plants
  lSystems.forEach(drawLSystem);

  //tank green vingette
  drawAlgaeVignette();
}

//creates star based on pos, center to point and center to inner 'curve' of star / radii, the number of points and if the star is curved or not
//referenced the custom shapes and smooth curves tutorial in p5.js
function star(x, y, radius, innerRadius, numPoints, curved) {
  //angle between points
  let angle = TWO_PI / numPoints;
  let halfAngle = angle / 2.0;

  beginShape();
  //for number of points
  for (let i = 0; i < numPoints; i++) {
    let angleOffset = i * angle;

    //outer point
    let xOuter = x + cos(angleOffset) * radius;
    let yOuter = y + sin(angleOffset) * radius;
    vertex(xOuter, yOuter);

    //inner point
    let xInner = x + cos(angleOffset + halfAngle) * innerRadius;
    let yInner = y + sin(angleOffset + halfAngle) * innerRadius;

    if (curved) {
      //creates a curve to the next outer point
      bezierVertex(
        xOuter,
        yOuter,
        xInner,
        yInner,
        x + cos(angleOffset + angle) * radius,
        y + sin(angleOffset + angle) * radius
      );
    } else {
      //draws straight to next outer point
      vertex(xInner, yInner);
    }
  }
  endShape(CLOSE);
}

//pushes a bubble to the bubble array based on current mouse pos
function mousePressed() {
  bubbles.push({
    x: snailPos.x,
    y: snailPos.y - 20,
    size: random(5, 15),
    alpha: 255,
  });
}

function drawBubbles() {
  //for each bubble based on mouse click
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let bubble = bubbles[i];
    fill(173, 216, 230, bubble.alpha);
    noStroke();
    ellipse(bubble.x, bubble.y, bubble.size);

    // Move the bubble up and fade it out
    bubble.y -= 2;
    bubble.alpha -= 3;

    // Remove the bubble if it's fully faded
    if (bubble.alpha <= 0) {
      bubbles.splice(i, 1);
    }
  }
}

//draws green arond the edges of the tank based on how much algae is growing
function drawAlgaeVignette() {
  let algaeRatio = algae.length / maxAlgae;
  let greenAlpha = map(algaeRatio, 0, 1, 0, 100);

  if (greenAlpha > 0) {
    push();
    drawingContext.save();

    //radial gradient around center of tank
    let ctx = drawingContext;
    let gradient = ctx.createRadialGradient(
      tankX + tankW / 2,
      tankY + tankH / 2,
      tankW * 0.1,
      tankX + tankW / 2,
      tankY + tankH / 2,
      tankW * 0.6
    );

    //smooth gradient
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, `rgba(50, 230, 60, ${greenAlpha / 255})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(tankX, tankY, tankW, tankH);

    drawingContext.restore();
    pop();
  }
}
