const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const pointLabel = document.getElementById('point-label');
const plotResult = document.getElementById('plot-result');
const formulaSection = document.getElementById('formula-section');
const formulaResult = document.getElementById('formula-result');
const explanation = document.getElementById('explanation');
const newProblemBtn = document.getElementById('new-problem');

let point = null;
let userPlotted = false;

function randomPoint() {
  return {
    x: Math.floor(Math.random() * 200) + 100,
    y: Math.floor(Math.random() * 200) + 100
  };
}

function drawGraph(showPoint = true, userX = null, userY = null) {
  ctx.clearRect(0, 0, width, height);
  // Axes
  ctx.strokeStyle = '#aaa';
  ctx.beginPath();
  ctx.moveTo(0, height/2);
  ctx.lineTo(width, height/2);
  ctx.moveTo(width/2, 0);
  ctx.lineTo(width/2, height);
  ctx.stroke();

  // The point to guess
  if (showPoint && point) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
    ctx.fill();
  }
  // User's plotted point
  if (userX !== null && userY !== null) {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(userX, userY, 6, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function reset() {
  point = randomPoint();
  userPlotted = false;
  pointLabel.textContent = `(${point.x}, ${point.y})`;
  plotResult.textContent = '';
  formulaSection.style.display = 'none';
  formulaResult.textContent = '';
  explanation.textContent = '';
  newProblemBtn.style.display = 'none';
  drawGraph(true);
}

canvas.onclick = function(e) {
  if (userPlotted) return;
  const rect = canvas.getBoundingClientRect();
  const x = Math.round(e.clientX - rect.left);
  const y = Math.round(e.clientY - rect.top);
  drawGraph(true, x, y);
  if (Math.abs(x - point.x) < 8 && Math.abs(y - point.y) < 8) {
    plotResult.textContent = 'Correct! Now enter a slope-intercept formula for a line through this point.';
    formulaSection.style.display = '';
    userPlotted = true;
  } else {
    plotResult.textContent = 'Try again! Plot the point as close as you can.';
  }
};

document.getElementById('check-formula').onclick = function() {
  const m = parseFloat(document.getElementById('m').value);
  const b = parseFloat(document.getElementById('b').value);
  if (isNaN(m) || isNaN(b)) {
    formulaResult.textContent = 'Enter valid numbers for m and b.';
    return;
  }
  // Check if the formula passes through the point
  // y = m x + b
  const expectedY = m * point.x + b;
  if (Math.abs(expectedY - point.y) < 0.1) {
    formulaResult.textContent = `Correct! y = ${m}x + ${b}`;
    explanation.innerHTML = `Any line through (${point.x}, ${point.y}) can be written as y = m x + b.<br>
      For this point, plug in x = ${point.x}, y = ${point.y}:<br>
      ${point.y} = m * ${point.x} + b<br>
      So b = ${point.y} - m * ${point.x}.<br>
      Any slope m works, as long as b = ${point.y} - m * ${point.x}.`;
    newProblemBtn.style.display = '';
  } else {
    formulaResult.textContent = 'That formula does not pass through the point. Try again!';
    explanation.textContent = '';
  }
};

newProblemBtn.onclick = reset;

reset();
