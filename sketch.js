let bodyW, bodyH, pleatCount, eyeGap, knotSize;
let doughR, doughG, doughB;
let blushR, blushG, blushB;
let cx = 400;
let baseY = 374;
let energy = 0.8;
let hot = false;
let heat = 0;
let squish = 0;
let squishVel = 0;
let lean = 0;
let blushAmt = 0;
let burst = 0;
let clicks = 0;
let steamT = 0;

function setup() {
  createCanvas(800, 500);
  bodyW = random(90, 125);
  bodyH = random(58, 72);
  pleatCount = floor(random(9, 18));
  eyeGap = random(22, 36);
  knotSize = random(10, 18);
  doughR = random(238, 252);
  doughG = random(224, 240);
  doughB = random(198, 225);

  let pick = floor(random(4));
  if (pick == 0) {
    blushR = 255;
    blushG = 150;
    blushB = 160;
  } else if (pick == 1) {
    blushR = 255;
    blushG = 170;
    blushB = 120;
  } else if (pick == 2) {
    blushR = 240;
    blushG = 120;
    blushB = 150;
  } else {
    blushR = 255;
    blushG = 125;
    blushB = 125;
  }
}

function draw() {
  drawBackground();
  updateCreature();
  drawSteamerBack();
  drawSpirit();
  drawSteamerFront();
  drawSteam();
  drawBurst();
  drawZzz();
}

function mousePressed() {
  if (dist(mouseX, mouseY, cx, baseY - bodyH * 0.8) < bodyW) {
    hot = true;
    clicks = clicks + 1;
    squishVel = -0.3;
    blushAmt = 1;
    burst = 60;
  }
}

function updateCreature() {
  if (hot) {
    heat = lerp(heat, constrain(clicks / 6, 0, 1), 0.03);
    energy = 1;
  } else {
    energy = constrain(energy - 0.0005, 0, 1);
  }

  squishVel = squishVel - squish * 0.2;
  squishVel = squishVel * 0.85;
  squish = constrain(squish + squishVel, -0.3, 0.3);

  let target = map(mouseX, 0, width, -0.12, 0.12) * energy;
  lean = lerp(lean, target, 0.05);

  let d = dist(mouseX, mouseY, cx, baseY - bodyH);
  let near = constrain(map(d, 250, 60, 0, 1), 0, 1);
  blushAmt = lerp(blushAmt, near, 0.06);

  if (burst > 0) {
    burst = burst - 1;
  }

  steamT = steamT + 0.8 + heat * 1.5;
}

function drawBackground() {
  for (let y = 0; y < height; y++) {
    let r = map(y, 0, height, 70, 122);
    let g = map(y, 0, height, 50, 80);
    let b = map(y, 0, height, 52, 50);
    stroke(r, g, b);
    line(0, y, width, y);
  }
}

function drawSteamerBack() {
  noStroke();
  fill(70, 45, 30);
  ellipse(cx, 452, 360, 40);
  fill(170, 122, 66);
  stroke(140, 98, 50);
  strokeWeight(2);
  ellipse(cx, 345, 340, 70);
  noStroke();
  fill(96, 64, 34);
  ellipse(cx, 347, 314, 56);
}

function drawSteamerFront() {
  fill(198, 152, 90);
  stroke(150, 105, 55);
  strokeWeight(2);
  beginShape();
  for (let a = 0; a <= PI; a += 0.05) {
    vertex(cx + cos(a) * 170, 345 + sin(a) * 35);
  }
  for (let a = PI; a >= 0; a -= 0.05) {
    vertex(cx + cos(a) * 170, 415 + sin(a) * 35);
  }
  endShape(CLOSE);

  noFill();
  stroke(165, 118, 65);
  for (let k = 1; k < 4; k++) {
    beginShape();
    for (let a = 0; a <= PI; a += 0.05) {
      vertex(cx + cos(a) * 170, 345 + k * 17 + sin(a) * 35);
    }
    endShape();
  }
  for (let a = 0.35; a < PI; a += 0.5) {
    line(cx + cos(a) * 170, 345 + sin(a) * 35, cx + cos(a) * 170, 415 + sin(a) * 35);
  }

  stroke(228, 188, 124);
  strokeWeight(4);
  beginShape();
  for (let a = 0; a <= PI; a += 0.05) {
    vertex(cx + cos(a) * 170, 345 + sin(a) * 35);
  }
  endShape();
}

function drawSpirit() {
  let sleepy = constrain(map(energy, 0.1, 0.45, 1, 0), 0, 1);
  let breathSpeed = lerp(0.02, 0.06, energy) + heat * 0.03;
  let breathe = sin(frameCount * breathSpeed) * 0.04;
  let shake = 0;
  if (heat > 0.7) {
    shake = map(heat, 0.7, 1, 0, 2.5);
  }

  let r, g, b;
  if (heat < 0.5) {
    r = lerp(doughR, 255, heat * 2);
    g = lerp(doughG, 212, heat * 2);
    b = lerp(doughB, 195, heat * 2);
  } else {
    r = lerp(255, 235, (heat - 0.5) * 2);
    g = lerp(212, 85, (heat - 0.5) * 2);
    b = lerp(195, 70, (heat - 0.5) * 2);
  }

  push();
  translate(cx + random(-shake, shake), baseY + random(-shake, shake));
  rotate(lean);
  scale(1 + squish + breathe * 0.5, 1 - squish + breathe);
  translate(0, -bodyH * 0.35);

  drawBody(r, g, b);
  drawPleats(r, g, b);
  drawFace(sleepy);

  pop();
}

function drawBody(r, g, b) {
  fill(r, g, b);
  stroke(r - 45, g - 50, b - 55);
  strokeWeight(2);
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.05) {
    let wob = 1 + (noise(cos(a) + 1, sin(a) + 1, frameCount * 0.01) - 0.5) * 0.08;
    let s = sin(a);
    let x = cos(a) * bodyW * wob;
    let y = s * bodyH * 0.35;
    if (s < 0) {
      let s8 = s * s * s * s * s * s * s * s;
      y = s * bodyH * wob * (1 + 0.3 * s8);
    }
    vertex(x, y);
  }
  endShape(CLOSE);
}

function drawPleats(r, g, b) {
  let peakY = -bodyH * 1.3;
  noFill();
  stroke(r - 40, g - 45, b - 50);
  strokeWeight(1.5);
  for (let i = 0; i < pleatCount; i++) {
    let a = map(i, 0, pleatCount - 1, PI + 0.4, TWO_PI - 0.4);
    let sx = cos(a) * bodyW * 0.8;
    let sy = sin(a) * bodyH * 0.6;
    let sway = sin(frameCount * 0.04 + i) * 3;
    bezier(sx, sy, sx * 0.5 + sway, sy - 20, sway, peakY + 25, 0, peakY + 6);
  }
  fill(r - 12, g - 15, b - 18);
  ellipse(0, peakY + 6, knotSize, knotSize * 0.7);
}

function drawFace(sleepy) {
  let eyeY = -bodyH * 0.1;
  let rosy = max(blushAmt, heat);
  noStroke();
  fill(blushR, blushG, blushB, 50 + rosy * 170);
  ellipse(-eyeGap - 15, eyeY + 13, 20, 10);
  ellipse(eyeGap + 15, eyeY + 13, 20, 10);

  let lookX = constrain(map(mouseX - cx, -300, 300, -3, 3), -3, 3) * (1 - sleepy);
  let lookY = constrain(map(mouseY - (baseY - bodyH * 0.45), -200, 200, -3, 3), -3, 3) * (1 - sleepy);
  let eyeH = lerp(13, 2, sleepy);
  drawEye(-eyeGap + lookX, eyeY + lookY, eyeH, sleepy);
  drawEye(eyeGap + lookX, eyeY + lookY, eyeH, sleepy);

  if (sleepy > 0.8) {
    fill(150, 70, 70);
    let o = 4 + sin(frameCount * 0.04) * 1.5;
    ellipse(0, eyeY + 14, o, o);
  } else if (hot || blushAmt > 0.6) {
    fill(190, 80, 90);
    arc(0, eyeY + 11, 14, 12, 0, PI);
  } else {
    noFill();
    stroke(110, 60, 60);
    strokeWeight(2);
    arc(0, eyeY + 11, 10, 6, 0, PI);
  }
}

function drawEye(x, y, h, sleepy) {
  noStroke();
  fill(45, 30, 30);
  ellipse(x, y, 11, h);
  if (sleepy < 0.5) {
    fill(255);
    ellipse(x + 2, y - 3, 3.5, 3.5);
  }
}

function drawSteam() {
  let count = floor(3 + energy * 5 + heat * 30);
  noStroke();
  for (let i = 0; i < count; i++) {
    let t = (steamT + i * (220 / count)) % 220;
    let px = cx + (noise(i * 0.7, frameCount * 0.005) - 0.5) * t * (0.8 + heat);
    let py = baseY - bodyH * 1.65 - t;
    fill(255, 250, 245, map(t, 0, 220, 150, 0));
    circle(px, py, 8 + t * 0.18 + heat * 14);
  }

  let sideCount = floor(heat * 16);
  for (let i = 0; i < sideCount; i++) {
    let t = (steamT * 0.8 + i * (180 / sideCount)) % 180;
    let side = map(i % 6, 0, 5, -150, 150);
    let px = cx + side + (noise(i, frameCount * 0.01) - 0.5) * 40;
    let py = 340 - t;
    fill(255, 250, 245, map(t, 0, 180, 120, 0));
    circle(px, py, 12 + t * 0.2);
  }
}

function drawBurst() {
  if (burst > 0) {
    let age = 60 - burst;
    push();
    translate(cx, baseY - bodyH * 0.6 - age * 0.8);
    noStroke();
    fill(255, 250, 245, map(age, 0, 60, 160, 0));
    for (let i = 0; i < 18; i++) {
      push();
      rotate((TWO_PI / 18) * i);
      circle(90 + age * 3, 0, 20 + age * 0.4);
      pop();
    }
    pop();
  }
}

function drawZzz() {
  let sleepy = constrain(map(energy, 0.1, 0.45, 1, 0), 0, 1);
  if (sleepy > 0.8) {
    for (let i = 0; i < 3; i++) {
      let t = (frameCount * 0.5 + i * 40) % 120;
      let x = cx + 35 + t * 0.2 + sin(frameCount * 0.05 + i) * 5;
      let y = baseY - bodyH * 1.5 - t;
      drawZ(x, y, 12, map(t, 0, 120, 255, 0));
    }
  }
}

function drawZ(x, y, size, fade) {
  stroke(255, 240, 220, fade);
  strokeWeight(2.5);
  line(x, y, x + size, y);
  line(x + size, y, x, y + size);
  line(x, y + size, x + size, y + size);
}
