
let idleTime = 0;
let screensaverActive = false;
const screensaver = document.getElementById('screensaver');

const resetIdleTimer = () => {
  idleTime = 0;
  if (screensaverActive) {
    // Clear the canvas and hide screensaver
    screensaver.innerHTML = '';
    screensaver.style.display = 'none';
    screensaverActive = false;
    noLoop(); // Stop p5 sketch loop if running
  }
};

const startIdleTimer = () => {
  idleTime++;
  if (idleTime > 300 && !screensaverActive) { // 300 seconds = 5 minutes
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


// Dragon Curve sketch code as a p5 instance mode
const dragonSketch = (p) => {
  let len = 200;
  let depth = 10; // Reduced depth for better performance
  let pieces = [];
  let r, g, b;
  let rIncrement, gIncrement, bIncrement;
  let startTime;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(0);
    p.noStroke();
    r = p.random(255);
    g = p.random(255);
    b = p.random(255);

    rIncrement = p.random(0.1, 0.5);
    gIncrement = p.random(0.1, 0.5);
    bIncrement = p.random(0.1, 0.5);

    startTime = p.millis();
    p.translate(p.width / 2 - len / 2, p.height / 2);
    generateDragon(len, depth, true, 0, p.width / 2 - len / 2, p.height / 2);
  };

  p.draw = () => {
    p.background(0, 10); // Reduced fade effect

    r = (r + rIncrement) % 255;
    g = (g + gIncrement) % 255;
    b = (b + bIncrement) % 255;

    pieces.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      p.fill(r, g, b, particle.alpha);
      p.ellipse(particle.x, particle.y, particle.w, particle.h);

      particle.vx += p.random(-0.1, 0.1);
      particle.vy += p.random(-0.1, 0.1);
    });

    if (p.millis() - startTime > 60000) { // Reset every 1 minute
      resetSketch();
    }

    if (pieces.length > 1000) {
      pieces.shift();
    }
  };

  function generateDragon(len, depth, flip, angle, x, y) {
    if (depth === 0) {
      let offsetX = p.random(-5, 5);
      let offsetY = p.random(-5, 5);

      pieces.push({
        x: x + offsetX,
        y: y + offsetY,
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

      generateDragon(newLen, depth - 1, false, angle2, x1, y1);
    }
  }

  function resetSketch() {
    pieces = [];
    p.background(0);

    r = p.random(255);
    g = p.random(255);
    b = p.random(255);
    rIncrement = p.random(0.1, 0.5);
    gIncrement = p.random(0.1, 0.5);
    bIncrement = p.random(0.1, 0.5);

    startTime = p.millis();
    p.translate(p.width / 2 - len / 2, p.height / 2);
    generateDragon(len, depth, true, 0, p.width / 2 - len / 2, p.height / 2);
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.background(0);
  };
};
