/* Gra działa bez bibliotek i bez serwera — wystarczy otworzyć index.html. */
'use strict';
const COLS = 10, ROWS = 20, CELL = 30;
const SHAPES = [
  { color: '#63dce9', cells: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]] },
  { color: '#829aff', cells: [[1,0,0],[1,1,1],[0,0,0]] },
  { color: '#ffb36b', cells: [[0,0,1],[1,1,1],[0,0,0]] },
  { color: '#f6d86b', cells: [[1,1],[1,1]] },
  { color: '#8ed8ff', cells: [[0,1,1],[1,1,0],[0,0,0]] },
  { color: '#c295fa', cells: [[0,1,0],[1,1,1],[0,0,0]] },
  { color: '#ff8299', cells: [[1,1,0],[0,1,1],[0,0,0]] }
];
const $ = id => document.getElementById(id);
const ctx = $('board').getContext('2d');
const preview = $('next').getContext('2d');
let board, active, upcoming, bag = [], score = 0, lines = 0, level = 1;
let playing = false, paused = false, lastTime = 0, elapsed = 0, best = 0;
try { best = Number(localStorage.getItem('vit-klocki-best')) || 0; } catch { /* Gra działa też bez pamięci lokalnej. */ }
$('best').textContent = best;

function makeBoard() { return Array.from({length: ROWS}, () => Array(COLS).fill(null)); }
function nextPiece() {
  if (!bag.length) {
    bag = SHAPES.map((_, i) => i);
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
  }
  const shape = SHAPES[bag.pop()];
  return { cells: shape.cells.map(row => [...row]), color: shape.color, x: Math.floor((COLS - shape.cells.length) / 2), y: 0 };
}
function collides(piece, dx = 0, dy = 0, cells = piece.cells) {
  return cells.some((row, y) => row.some((v, x) => {
    if (!v) return false;
    const bx = piece.x + x + dx, by = piece.y + y + dy;
    return bx < 0 || bx >= COLS || by >= ROWS || (by >= 0 && board[by][bx] !== null);
  }));
}
function updateStats() {
  $('score').textContent = score;
  $('lines').textContent = lines;
  $('level').textContent = level;
  if (score > best) {
    best = score;
    $('best').textContent = best;
    try { localStorage.setItem('vit-klocki-best', String(best)); } catch { /* Opcjonalny zapis. */ }
  }
}
function cell(context, x, y, color, size = CELL, ghost = false) {
  context.fillStyle = ghost ? color + '16' : color;
  context.fillRect(x * size + 2, y * size + 2, size - 4, size - 4);
  context.strokeStyle = ghost ? color + '77' : '#ffffff35';
  context.lineWidth = 1;
  context.strokeRect(x * size + 2.5, y * size + 2.5, size - 5, size - 5);
  if (!ghost) { context.fillStyle = '#ffffff25'; context.fillRect(x * size + 4, y * size + 4, size - 8, 3); }
}
function drawPiece(context, piece, ghost = false) {
  piece.cells.forEach((row, y) => row.forEach((v, x) => {
    if (v && piece.y + y >= 0) cell(context, piece.x + x, piece.y + y, piece.color, CELL, ghost);
  }));
}
function render() {
  ctx.fillStyle = '#0b0e18'; ctx.fillRect(0, 0, 300, 600);
  ctx.strokeStyle = '#ffffff07'; ctx.lineWidth = 1;
  for (let x = 1; x < COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL + .5, 0); ctx.lineTo(x * CELL + .5, 600); ctx.stroke(); }
  for (let y = 1; y < ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL + .5); ctx.lineTo(300, y * CELL + .5); ctx.stroke(); }
  board.forEach((row, y) => row.forEach((color, x) => { if (color) cell(ctx, x, y, color); }));
  if (active) {
    const ghost = {...active};
    while (!collides(ghost, 0, 1)) ghost.y++;
    drawPiece(ctx, ghost, true); drawPiece(ctx, active);
  }
}
function drawNext() {
  preview.clearRect(0, 0, 150, 120);
  const cells = upcoming.cells;
  const filled = [];
  cells.forEach((row,y) => row.forEach((v,x) => { if(v) filled.push([x,y]); }));
  const minX = Math.min(...filled.map(c => c[0])), maxX = Math.max(...filled.map(c => c[0]));
  const minY = Math.min(...filled.map(c => c[1])), maxY = Math.max(...filled.map(c => c[1]));
  const ox = (150 / 26 - (maxX - minX + 1)) / 2 - minX;
  const oy = (120 / 26 - (maxY - minY + 1)) / 2 - minY;
  filled.forEach(([x,y]) => cell(preview, x + ox, y + oy, upcoming.color, 26));
}
function showOverlay(title, text, button) {
  $('overlay-title').textContent = title; $('overlay-text').textContent = text;
  $('start').textContent = button; $('overlay').hidden = false;
  $('announcement').textContent = title + '. ' + text;
}
function lock(placementSound = 'lock') {
  let overflow = false;
  active.cells.forEach((row,y) => row.forEach((v,x) => {
    if (!v) return;
    if (active.y + y < 0) overflow = true;
    else board[active.y + y][active.x + x] = active.color;
  }));
  if (overflow) { endGame(); return; }
  const remaining = board.filter(row => row.some(v => !v));
  const cleared = ROWS - remaining.length;
  if (cleared) {
    score += [0, 100, 300, 500, 800][cleared] * level;
    lines += cleared; level = 1 + Math.floor(lines / 10);
    board = [...Array.from({length:cleared}, () => Array(COLS).fill(null)), ...remaining];
    $('announcement').textContent = `Usunięte linie: ${cleared}. Wynik: ${score}.`;
  }
  gameAudio.play(cleared ? 'clear' : placementSound);
  active = upcoming; upcoming = nextPiece(); elapsed = 0;
  updateStats(); drawNext();
  if (collides(active)) endGame();
}
function endGame() {
  playing = false; paused = false; active = null; $('pause').disabled = true;
  gameAudio.stop(); gameAudio.play('over');
  showOverlay('Jeszcze jedna runda?', `Twój wynik: ${score}. Usunięte linie: ${lines}.`, 'Zagraj ponownie ↗');
}
function step(manual = false) {
  if (!collides(active, 0, 1)) { active.y++; if (manual) { score++; updateStats(); } }
  else lock();
  elapsed = 0;
}
function rotate() {
  const rotated = active.cells[0].map((_, i) => active.cells.map(row => row[i]).reverse());
  for (const dx of [0,-1,1,-2,2]) {
    if (!collides(active, dx, 0, rotated)) { active.cells = rotated; active.x += dx; gameAudio.play('rotate'); return; }
  }
}
function action(name) {
  if (!playing || paused) return;
  if (name === 'left' && !collides(active, -1)) active.x--;
  if (name === 'right' && !collides(active, 1)) active.x++;
  if (name === 'rotate') rotate();
  if (name === 'down') step(true);
  if (name === 'drop') {
    let distance = 0;
    while (!collides(active, 0, 1)) { active.y++; distance++; }
    score += distance * 2; lock('drop');
  }
  render();
}
function togglePause() {
  if (!playing) return;
  paused = !paused; elapsed = 0;
  $('pause').innerHTML = paused ? 'Wznów <kbd>P</kbd>' : 'Pauza <kbd>P</kbd>';
  if (paused) { gameAudio.stop(); showOverlay('Chwila oddechu.', 'Twoje klocki nigdzie się nie wybierają.', 'Wróć do gry ↗'); }
  else { gameAudio.unlock(); $('overlay').hidden = true; $('board').focus({preventScroll:true}); }
}
function startGame() {
  if (playing && paused) { togglePause(); return; }
  board = makeBoard(); bag = []; score = 0; lines = 0; level = 1;
  active = nextPiece(); upcoming = nextPiece(); playing = true; paused = false; elapsed = 0;
  $('overlay').hidden = true; $('pause').disabled = false; $('pause').innerHTML = 'Pauza <kbd>P</kbd>';
  updateStats(); drawNext(); render(); $('board').focus({preventScroll:true});
  gameAudio.stop();
  gameAudio.unlock().then(ready => { if (ready && playing && !paused) gameAudio.play('start'); });
}
const keys = {ArrowLeft:'left', ArrowRight:'right', ArrowUp:'rotate', ArrowDown:'down', Space:'drop'};
document.addEventListener('keydown', event => {
  if (event.code === 'KeyM') { event.preventDefault(); if (!event.repeat) gameAudio.toggle(); return; }
  if (!playing) return;
  if (event.code === 'KeyP' || event.code === 'Escape') { event.preventDefault(); if (!event.repeat) togglePause(); return; }
  if (keys[event.code]) { event.preventDefault(); if (event.repeat && (event.code === 'Space' || event.code === 'ArrowUp')) return; action(keys[event.code]); }
});
$('start').addEventListener('click', startGame);
$('pause').addEventListener('click', togglePause);
document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => action(button.dataset.action)));
document.addEventListener('visibilitychange', () => { if (document.hidden && playing && !paused) togglePause(); });
window.addEventListener('blur', () => { if (playing && !paused) togglePause(); });
function frame(time) {
  const delta = Math.min(time - lastTime, 100); lastTime = time;
  if (playing && !paused) {
    elapsed += delta;
    if (elapsed >= Math.max(90, 850 * Math.pow(.82, level - 1))) { step(); render(); }
  }
  requestAnimationFrame(frame);
}
board = makeBoard(); render(); requestAnimationFrame(frame);
