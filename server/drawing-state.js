class DrawingState {
  constructor() {
    this.ops = [];
    this.redoStack = [];
    this.activeOps = new Map();
  }

  startOp(op) {
    this.activeOps.set(op.id, op);
  }

  appendSegment(opId, points, meta) {
    const op = this.activeOps.get(opId);
    if (!op) return null;
    op.stroke.points.push(...points);
    return { color: meta.color, width: meta.width, isEraser: !!meta.isEraser, points };
  }

  endOp(opId, meta) {
    const op = this.activeOps.get(opId);
    if (!op) return null;
    op.stroke.color = meta.color;
    op.stroke.width = meta.width;
    op.stroke.isEraser = meta.isEraser;
    this.ops.push(op);
    this.activeOps.delete(opId);
    return op;
  }

  undo() {
    if (this.ops.length === 0) return null;
    const removed = this.ops.pop();
    this.redoStack.push(removed);
    return removed;
  }

  redo() {
    if (this.redoStack.length === 0) return null;
    const op = this.redoStack.pop();
    this.ops.push(op);
    return op;
  }

  getState() {
    return this.ops;
  }
}

module.exports = { DrawingState };
