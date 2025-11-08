export function setupCanvas(socket, userName) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const cursors = document.getElementById('cursor-container');

  const colorInput = document.getElementById('color');
  const widthInput = document.getElementById('width');
  const eraserBtn = document.getElementById('eraser');
  const undoBtn = document.getElementById('undo');
  const redoBtn = document.getElementById('redo');

  let drawing = false;
  let points = [];
  let currentOpId = null;
  let isEraser = false;

  const getColor = () => colorInput.value;
  const getWidth = () => +widthInput.value;

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  };
  window.addEventListener('resize', resize);
  resize();

  eraserBtn.onclick = () => {
    isEraser = !isEraser;
    eraserBtn.classList.toggle('active', isEraser);
  };
  undoBtn.onclick = () => socket.emit('undo');
  redoBtn.onclick = () => socket.emit('redo');

  function drawSegment(meta, points) {
    if (!points || points.length < 2) return;
    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = meta.width;
    ctx.globalCompositeOperation = meta.isEraser ? 'destination-out' : 'source-over';
    ctx.strokeStyle = meta.color;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.stroke();
    ctx.restore();
  }

  canvas.addEventListener('pointerdown', e => {
    drawing = true;
    points = [{ x: e.clientX, y: e.clientY }];
    currentOpId = 'op_' + Math.random().toString(36).substring(2, 9);
    socket.emit('start_stroke', { opId: currentOpId });
  });

  canvas.addEventListener('pointermove', e => {
    if (!drawing) return;
    const pt = { x: e.clientX, y: e.clientY };
    points.push(pt);
    drawSegment({ color: getColor(), width: getWidth(), isEraser }, [points[points.length - 2] || pt, pt]);
    socket.emit('stroke_segment', {
      opId: currentOpId,
      points: [points[points.length - 2] || pt, pt],
      meta: { color: getColor(), width: getWidth(), isEraser }
    });
    socket.emit('cursor', { x: e.clientX, y: e.clientY });
  });

  const endStroke = () => {
    if (!drawing) return;
    drawing = false;
    socket.emit('end_stroke', {
      opId: currentOpId,
      meta: { color: getColor(), width: getWidth(), isEraser }
    });
    points = [];
  };

  canvas.addEventListener('pointerup', endStroke);
  canvas.addEventListener('pointerleave', endStroke);
  canvas.addEventListener('pointercancel', endStroke);

  // Remote draw updates
  socket.on('stroke_segment', ({ stroke }) => drawSegment(stroke, stroke.points));
  socket.on('stroke', op => drawSegment(op.stroke, op.stroke.points));
  socket.on('tombstone', () => ctx.clearRect(0, 0, canvas.width, canvas.height));
  socket.on('full_state', state => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    state.forEach(op => drawSegment(op.stroke, op.stroke.points));
  });

  socket.on('cursor', data => {
    let el = document.getElementById(`cursor-${data.id}`);
    if (!el) {
      el = document.createElement('div');
      el.id = `cursor-${data.id}`;
      cursors.appendChild(el);
    }
    el.style.left = data.x + 'px';
    el.style.top = data.y + 'px';
    el.textContent = data.name;
    el.style.border = `1px solid ${data.color}`;
  });
}
export function drawFullState(state) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!state || !state.ops) return;

  state.ops.forEach(op => {
    if (op.type === 'stroke' && op.stroke?.points) {
      ctx.strokeStyle = op.stroke.color || 'black';
      ctx.lineWidth = op.stroke.width || 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();

      op.stroke.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }
  });
}
