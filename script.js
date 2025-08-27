// Minimal slope guessing game
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

// One random point
const point = {
  x: Math.floor(Math.random() * 200) + 100,
  y: Math.floor(Math.random() * 200) + 100
};

// Random slope for the answer
const trueSlope = (Math.random() * 4 - 2).toFixed(2); // between -2 and 2

function drawGraph(userSlope = null) {
  ctx.clearRect(0, 0, width, height);
  // Axes
  ctx.strokeStyle = '#aaa';
  ctx.beginPath();
  ctx.moveTo(0, height/2);
  ctx.lineTo(width, height/2);
  ctx.moveTo(width/2, 0);
  ctx.lineTo(width/2, height);
  ctx.stroke();

  // The point
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
  ctx.fill();

  // User's guessed line
  if (userSlope !== null) {
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    // y = m(x - x0) + y0
    let x1 = 0;
    let y1 = userSlope * (x1 - point.x) + point.y;
    let x2 = width;
    let y2 = userSlope * (x2 - point.x) + point.y;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

drawGraph();

document.getElementById('guess-btn').onclick = function() {
  const guess = parseFloat(document.getElementById('slope').value);
  if (isNaN(guess)) {
    document.getElementById('result').textContent = 'Enter a valid number.';
    return;
  }
  drawGraph(guess);
  // Show how close the guess is
  const diff = Math.abs(guess - trueSlope);
  if (diff < 0.05) {
    document.getElementById('result').textContent = `Correct! The slope was ${trueSlope}`;
  } else {
    document.getElementById('result').textContent = `Off by ${diff.toFixed(2)}. Try again!`;
  }
};
