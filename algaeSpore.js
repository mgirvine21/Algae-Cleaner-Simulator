//referenced and gained an understanding of how to connect points with curves from Sundftig's sketchs on p5.js
class Metaball {
  constructor(x, y, r, i) {
    this.p = createVector(x, y);
    this.r = 0; //starting radii
    this.targetRadius = r; //target to grow towards
    this.growthSpeed = 0.5;
    this.index = i;
    this.prevDists = new Array(maxAlgae).fill(0);
  }

  display(fillColor) {
    this.r = lerp(this.r, this.targetRadius, this.growthSpeed * 0.05);
    fill(fillColor);
    //sway movement
    this.p.x += sin(frameCount * 0.01 + this.index) * 0.1;
    this.p.y += cos(frameCount * 0.01 + this.index) * 0.1;
    //draw algae
    ellipse(this.p.x, this.p.y, this.r * 2);

    //emit spores around algae
    //spores are 50% circles or stars
    if (frameCount % 5 === 0) {
      let algaeX = this.p.x + random(-50, 50);
      let algaeY = this.p.y + random(-20, 20);
      //add spores to array
      spores.push(new Spore(algaeX, algaeY, random() < 0.5));
    }

    //update and display spores
    for (let i = spores.length - 1; i >= 0; i--) {
      spores[i].update();
      spores[i].display();
      //remove old spores
      if (spores[i].isDead()) {
        spores.splice(i, 1);
      }
    }
  }

  //build bridges between algae
  generateConnections(others) {
    for (let i = 0; i < others.length; i++) {
      //create path referencing this algae, the algae next to it, and the previous distance between them
      let path = metaball(this, others[i], this.prevDists[i]);
      if (this.prevDists[i] === undefined) {
        this.prevDists[i] = 0;
      }

      //if the path is valid between two algae
      if (path) {
        //draw a closed shape with the two curves to bridge the algae
        this.prevDists[i] = path.prevDist;
        fill(92, 133, 62);
        beginShape();
        vertex(path.points[0].x, path.points[0].y);
        bezierVertex(
          path.controlPoints[0].x,
          path.controlPoints[0].y,
          path.controlPoints[1].x,
          path.controlPoints[1].y,
          path.points[1].x,
          path.points[1].y
        );
        vertex(path.points[2].x, path.points[2].y);
        bezierVertex(
          path.controlPoints[2].x,
          path.controlPoints[2].y,
          path.controlPoints[3].x,
          path.controlPoints[3].y,
          path.points[3].x,
          path.points[3].y
        );
        endShape(CLOSE);
      }
    }
  }
}

//calculated the bridge geometry between the algae
//i needed to use ai to help me organize and understand how the original function in Sundftig's sketch worked
//the promt i used what "organize and explain each section of this code:"" and pasted his metaball function.
function metaball(ball1, ball2) {
  let handleLenRate = 2.4;
  let c1 = ball1.p.copy();
  let c2 = ball2.p.copy();
  let r1 = ball1.r;
  let r2 = ball2.r;
  let maxDist = r1 + r2;
  let d = dist(c1.x, c1.y, c2.x, c2.y);

  if (r1 === 0 || r2 === 0 || d > maxDist || d <= abs(r1 - r2)) return null;

  //V represents algae overlap and radius difference
  let v = 0.5;
  if (maxDist - d > 0) {
    let minR = min(r1, r2);
    v = map(maxDist - d, 0, minR, 0.2, 0.8);
  }

  //connection points angels
  let angleBetweenCenters = atan2(c2.y - c1.y, c2.x - c1.x);
  let overlapAngle = acos((r1 - r2) / d);
  let u1 = r1 && r2 ? acos((r1 * r1 + d * d - r2 * r2) / (2 * r1 * d)) : 0;
  let u2 = r2 && r1 ? acos((r2 * r2 + d * d - r1 * r1) / (2 * r2 * d)) : 0;

  //angles of points and bzier curves
  let a1a = angleBetweenCenters + u1 + (overlapAngle - u1) * v;
  let a1b = angleBetweenCenters - u1 - (overlapAngle - u1) * v;
  let a2a = angleBetweenCenters + PI - u2 - (PI - u2 - overlapAngle) * v;
  let a2b = angleBetweenCenters - PI + u2 + (PI - u2 - overlapAngle) * v;

  //connection points
  let p1a = c1.copy().add(polarVector(a1a, r1));
  let p1b = c1.copy().add(polarVector(a1b, r1));
  let p2a = c2.copy().add(polarVector(a2a, r2));
  let p2b = c2.copy().add(polarVector(a2b, r2));

  //handle length
  let totalRadius = r1 + r2;
  let baseHandleLen = min(v * handleLenRate, p1a.dist(p2a) / totalRadius);
  let adjustedHandleLen = baseHandleLen * min(1, (d * 2) / totalRadius);
  let handle1 = r1 * adjustedHandleLen;
  let handle2 = r2 * adjustedHandleLen;

  let piHalf = PI / 2;
  let cp1 = p1a.copy().add(polarVector(a1a - piHalf, handle1));
  let cp2 = p2a.copy().add(polarVector(a2a + piHalf, handle2));
  let cp3 = p2b.copy().add(polarVector(a2b - piHalf, handle2));
  let cp4 = p1b.copy().add(polarVector(a1b + piHalf, handle1));

  return {
    points: [p1a, p2a, p2b, p1b],
    controlPoints: [cp1, cp2, cp3, cp4],
  };
}

//polar vector creation
function polarVector(angle, length) {
  return createVector(cos(angle), sin(angle)).mult(length);
}
