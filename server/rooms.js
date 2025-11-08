// server/rooms.js
const { RoomState } = require('./drawing-state');

const COLORS = [
  '#e11d48','#f97316','#f59e0b','#10b981','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#f43f5e'
];

class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.colorIndex = new Map(); // roomId -> next color idx
  }

  ensureRoom(id) {
    if (!this.rooms.has(id)) this.rooms.set(id, new RoomState());
    if (!this.colorIndex.has(id)) this.colorIndex.set(id, 0);
  }

  assignColor(roomId, socketId) {
    this.ensureRoom(roomId);
    const idx = this.colorIndex.get(roomId) % COLORS.length;
    this.colorIndex.set(roomId, idx + 1);
    return COLORS[idx];
  }

  getState(id) {
    return this.rooms.get(id).serialize();
  }

  addUser(id, user) {
    this.ensureRoom(id);
    this.rooms.get(id).addUser(user);
  }

  removeUser(id, socketId) {
    if (!this.rooms.has(id)) return;
    this.rooms.get(id).removeUser(socketId);
  }

  getUsers(id) {
    return (this.rooms.get(id) || { users: [] }).users;
  }

  startOp(id, op) {
    this.ensureRoom(id);
    this.rooms.get(id).startOp(op);
  }

  appendSegment(id, opId, points, meta) {
    if (!this.rooms.has(id)) return null;
    return this.rooms.get(id).appendSegment(opId, points, meta);
  }

  endOp(id, opId, meta) {
    if (!this.rooms.has(id)) return null;
    return this.rooms.get(id).endOp(opId, meta);
  }

  undo(id) {
    if (!this.rooms.has(id)) return null;
    return this.rooms.get(id).undo();
  }

  redo(id) {
    if (!this.rooms.has(id)) return null;
    return this.rooms.get(id).redo();
  }
}

module.exports = { RoomManager };
