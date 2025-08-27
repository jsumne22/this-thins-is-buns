const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const pointLabel = document.getElementById('point-label');
const dragResult = document.getElementById('drag-result');
const formulaSection = document.getElementById('formula-section');
const formulaResult = document.getElementById('formula-result');
const explanation = document.getElementById('explanation');
const newProblemBtn = document.getElementById('new-problem');

// 10x10 grid, draggable point starting at origin
let point = { x: 0, y: 0 };
let dragging = false;

function toCanvasCoords(x, y) {
  // x, y in grid [-5,5], [5,-5] to [0,400]
  return {
    cx: Math.round((x + 5) * 40),
    cy: Math.round((5 - y) * 40)
  };
}
function toGridCoords(cx, cy) {
  // canvas to grid
  return {
    x: ((cx / 40) - 5),
    y: (5 - (cy / 40))
  };
}

function drawGraph() {
  ctx.clearRect(0, 0, width, height);
  // Draw grid
  ctx.strokeStyle = '#eee';
  for (let i = 0; i <= 10; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 40, 0);
    ctx.lineTo(i * 40, 400);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * 40);
    ctx.lineTo(400, i * 40);
    ctx.stroke();
  }
  // Axes
  ctx.strokeStyle = '#aaa';
  ctx.beginPath();
  ctx.moveTo(0, 200);
  ctx.lineTo(400, 200);
  ctx.moveTo(200, 0);
  ctx.lineTo(200, 400);
  ctx.stroke();
  // Draw draggable point
  const { cx, cy } = toCanvasCoords(point.x, point.y);
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  ctx.arc(cx, cy, 10, 0, 2 * Math.PI);
  ctx.fill();
}

function updatePointLabel() {
  pointLabel.textContent = `(${point.x.toFixed(2)}, ${point.y.toFixed(2)})`;
}

function reset() {
  point = { x: 0, y: 0 };
  dragging = false;
  updatePointLabel();
  dragResult.textContent = '';
  formulaSection.style.display = 'none';
  formulaResult.textContent = '';
  explanation.textContent = '';
  newProblemBtn.style.display = 'none';
  drawGraph();
}

canvas.onmousedown = function(e) {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const { cx, cy } = toCanvasCoords(point.x, point.y);
  if (Math.hypot(mx - cx, my - cy) < 15) {
    dragging = true;
  }
};
canvas.onmousemove = function(e) {
  if (!dragging) return;
  const rect = canvas.getBoundingClientRect();
  let mx = e.clientX - rect.left;
  let my = e.clientY - rect.top;
  // Clamp to canvas
  mx = Math.max(0, Math.min(400, mx));
  my = Math.max(0, Math.min(400, my));
  const { x, y } = toGridCoords(mx, my);
  // Clamp to -5..5
  point.x = Math.max(-5, Math.min(5, x));
  point.y = Math.max(-5, Math.min(5, y));
  updatePointLabel();
  drawGraph();
};
canvas.onmouseup = function(e) {
  if (!dragging) return;
  dragging = false;
  dragResult.textContent = 'Now enter a slope-intercept formula for a line through this point.';
  formulaSection.style.display = '';
};
canvas.onmouseleave = function() { dragging = false; };

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
    explanation.innerHTML = `Any line through (${point.x.toFixed(2)}, ${point.y.toFixed(2)}) can be written as y = m x + b.<br>\n      For this point, plug in x = ${point.x.toFixed(2)}, y = ${point.y.toFixed(2)}:<br>\n      ${point.y.toFixed(2)} = m * ${point.x.toFixed(2)} + b<br>\n      So b = ${point.y.toFixed(2)} - m * ${point.x.toFixed(2)}.<br>\n      Any slope m works, as long as b = ${point.y.toFixed(2)} - m * ${point.x.toFixed(2)}.`;
    newProblemBtn.style.display = '';
  } else {
    formulaResult.textContent = 'That formula does not pass through the point. Try again!';
    explanation.textContent = '';
  }
};

newProblemBtn.onclick = reset;


reset();
