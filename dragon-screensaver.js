let idleTime = 0;
let screensaverActive = false;
const screensaver = document.getElementById('screensaver');

const resetIdleTimer = () => {
  idleTime = 0;
  if (screensaverActive) {
    screensaver.innerHTML = '';
    screensaver.style.display = 'none';
    screensaverActive = false;
    noLoop();
  }
};

const startIdleTimer = () => {
  idleTime++;
  if (idleTime > 5 && !screensaverActive) {
    screensaver.style.display = 'block';
    screensaverActive = true;
    new p5(dragonSketch, screensaver);
  }
};

window.onload = () => {
  setInterval(startIdleTimer, 1000);
  document.onmousemove = resetIdleTimer;
  document.onkeypress = resetIdleTimer;
  document.onclick = resetIdleTimer;
};

const dragonSketch = (p) => {
  let len = 200;
  let depth = 10;
  let pieces = [];
  let r, g, b;
  let rInc, gInc, bInc;
  let startTime;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noStroke();
    p.background(0);
    r = p.random(255);
    g = p.random(255);
    b = p.random(255);
    rInc = p.random(0.1, 0.5);
    gInc = p.random(0.1, 0.5);
    bInc = p.random(0.1, 0.5);
    startTime = p.millis();
    generateDragon(len, depth, true, 0, p.width / 2 - len / 2, p.height / 2);
  };

  p.draw = () => {
    p.background(0, 10);
    r = (r + rInc) % 255;
    g = (g + gInc) % 255;
    b = (b + bInc) % 255;

    pieces.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      p.fill(r, g, b, particle.alpha);
      p.ellipse(particle.x, particle.y, particle.w, particle.h);
      particle.vx += p.random(-0.1, 0.1);
      particle.vy += p.random(-0.1, 0.1);
    });

    if (p.millis() - startTime > 60000) {
      pieces = [];
      p.background(0);
      r = p.random(255);
      g = p.random(255);
      b = p.random(255);
      startTime = p.millis();
      generateDragon(len, depth, true, 0, p.width / 2 - len / 2, p.height / 2);
    }

    if (pieces.length > 1000) {
      pieces.shift();
    }
  };

  function generateDragon(len, depth, flip, angle, x, y) {
    if (depth === 0) {
      pieces.push({
        x: x + p.random(-5, 5),
        y: y + p.random(-5, 5),
        w: len / 2,
        h: len / 2,
        vx: p.random(-1, 1),
        vy: p.random(-1, 1),
        alpha: 255,
      });
    } else {
      let newLen = len / p.sqrt(2);
      let angle1 = angle + (flip ? -p.PI / 4 : p.PI / 4);
      generateDragon(newLen, depth - 1, true, angle1, x, y);
      let x1 = x + newLen * p.cos(angle1);
      let y1 = y + newLen * p.sin(angle1);
      let angle2 = angle + (flip ? p.PI / 4 : -p.PI / 4);
      generateDragon(newLen, depth - 1, false, angle2, x1, y
