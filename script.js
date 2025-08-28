const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const width = canvas.width;
  if (isNaN(m) || isNaN(b)) {
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

// Graph settings
const minVal = -10;
const maxVal = 10;
const gridStep = 1;

// Convert graph coordinates to canvas pixels
function toCanvasX(x) {
  return ((x - minVal) / (maxVal - minVal)) * width;
}
function toCanvasY(y) {
  return height - ((y - minVal) / (maxVal - minVal)) * height;
}
function toGraphX(px) {
  return minVal + (px / width) * (maxVal - minVal);
}
function toGraphY(py) {
  return minVal + ((height - py) / height) * (maxVal - minVal);
}

let point = { x: 0, y: 0 };
let dragging = false;
let dragOffset = { x: 0, y: 0 };
let userPlotted = false;

function drawGraph() {
  ctx.clearRect(0, 0, width, height);
  // Draw grid
  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 1;
  for (let i = minVal; i <= maxVal; i += gridStep) {
    // Vertical
    ctx.beginPath();
    ctx.moveTo(toCanvasX(i), 0);
    ctx.lineTo(toCanvasX(i), height);
    ctx.stroke();
    // Horizontal
    ctx.beginPath();
    ctx.moveTo(0, toCanvasY(i));
    ctx.lineTo(width, toCanvasY(i));
    ctx.stroke();
  }
  // Axes
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(toCanvasX(0), 0);
  ctx.lineTo(toCanvasX(0), height);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, toCanvasY(0));
  ctx.lineTo(width, toCanvasY(0));
  ctx.stroke();
  // The draggable point
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(toCanvasX(point.x), toCanvasY(point.y), 8, 0, 2 * Math.PI);
  ctx.fill();
}

function reset() {
  point = { x: 0, y: 0 };
  userPlotted = false;
  plotResult.textContent = 'Drag the red point to any location.';
  formulaSection.style.display = 'none';
  formulaResult.textContent = '';
  explanation.textContent = '';
  newProblemBtn.style.display = 'none';
  updatePointLabel();
  drawGraph();
}

function updatePointLabel() {
  pointLabel.textContent = `(${point.x.toFixed(2)}, ${point.y.toFixed(2)})`;
}

canvas.onmousedown = function(e) {
  if (userPlotted) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const px = toCanvasX(point.x);
  const py = toCanvasY(point.y);
  if (Math.abs(mx - px) < 12 && Math.abs(my - py) < 12) {
    dragging = true;
    dragOffset.x = mx - px;
    dragOffset.y = my - py;
  }
};

canvas.onmousemove = function(e) {
  if (!dragging || userPlotted) return;
  const rect = canvas.getBoundingClientRect();
  let mx = e.clientX - rect.left - dragOffset.x;
  let my = e.clientY - rect.top - dragOffset.y;
  // Clamp to graph area
  mx = Math.max(0, Math.min(width, mx));
  my = Math.max(0, Math.min(height, my));
  point.x = Math.round(toGraphX(mx) * 100) / 100;
  point.y = Math.round(toGraphY(my) * 100) / 100;
  updatePointLabel();
  drawGraph();
};

canvas.onmouseup = function(e) {
  if (!dragging || userPlotted) return;
  dragging = false;
  plotResult.textContent = 'Now enter a slope-intercept formula for a line through this point.';
  formulaSection.style.display = '';
  userPlotted = true;
};

reset();
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
    explanation.innerHTML = `Any line through (${point.x.toFixed(2)}, ${point.y.toFixed(2)}) can be written as y = m x + b.<br>
      For this point, plug in x = ${point.x.toFixed(2)}, y = ${point.y.toFixed(2)}:<br>
      ${point.y.toFixed(2)} = m * ${point.x.toFixed(2)} + b<br>
      So b = ${point.y.toFixed(2)} - m * ${point.x.toFixed(2)}.<br>
      Any slope m works, as long as b = ${point.y.toFixed(2)} - m * ${point.x.toFixed(2)}.`;
    newProblemBtn.style.display = '';
  } else {
    formulaResult.textContent = 'That formula does not pass through the point. Try again!';
    explanation.textContent = '';
  }
};

newProblemBtn.onclick = reset;

reset();
