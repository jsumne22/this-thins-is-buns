// Minimal graph with one point and blocker, user guesses coordinates
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

// One random point
const point = {
  x: Math.floor(Math.random() * 200) + 100,
  y: Math.floor(Math.random() * 200) + 100
};

function drawGraph() {
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
}

drawGraph();

document.getElementById('guess-btn').onclick = function() {
  const xGuess = parseInt(document.getElementById('x-guess').value, 10);
  const yGuess = parseInt(document.getElementById('y-guess').value, 10);
  if (isNaN(xGuess) || isNaN(yGuess)) {
    document.getElementById('result').textContent = 'Enter valid numbers for both coordinates.';
    return;
  }
  // Show how close the guess is
  const dx = Math.abs(xGuess - point.x);
  const dy = Math.abs(yGuess - point.y);
  if (dx < 5 && dy < 5) {
    document.getElementById('result').textContent = `Correct! The point was at (${point.x}, ${point.y})`;
  } else {
    document.getElementById('result').textContent = `Off by (${dx}, ${dy}). Try again!`;
  }
};
