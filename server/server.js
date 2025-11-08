const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { RoomManager } = require('./rooms');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const rooms = new RoomManager();

app.use(express.static(path.join(__dirname, '../client')));

io.on('connection', socket => {
  console.log('Connected:', socket.id);

  socket.on('join', ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.ensureRoom(roomId);

    const user = { id: socket.id, name: userName || 'Guest', color: rooms.assignColor(roomId, socket.id) };
    rooms.addUser(roomId, user);

    socket.emit('full_state', rooms.getState(roomId));
    io.to(roomId).emit('users', rooms.getUsers(roomId));

    socket.on('start_stroke', ({ opId }) => {
      rooms.startOp(roomId, { id: opId, owner: socket.id, type: 'stroke', stroke: { points: [] } });
    });

    socket.on('stroke_segment', ({ opId, points, meta }) => {
      const seg = rooms.appendSegment(roomId, opId, points, meta);
      if (seg) io.to(roomId).emit('stroke_segment', { id: opId, stroke: seg });
    });

    socket.on('end_stroke', ({ opId, meta }) => {
      const op = rooms.endOp(roomId, opId, meta);
      if (op) io.to(roomId).emit('stroke', op);
    });

    // Global Undo
    socket.on('undo', () => {
      const removed = rooms.undo(roomId);
      if (removed) {
        io.to(roomId).emit('tombstone', removed.id);
        io.to(roomId).emit('full_state', rooms.getState(roomId)); // sync all clients
      }
    });

    // Global Redo
    socket.on('redo', () => {
      const op = rooms.redo(roomId);
      if (op) {
        io.to(roomId).emit('stroke', op);
        io.to(roomId).emit('full_state', rooms.getState(roomId)); // sync all clients
      }
    });

    socket.on('cursor', pos => {
      socket.to(roomId).emit('cursor', { id: socket.id, name: user.name, color: user.color, ...pos });
    });

    socket.on('disconnect', () => {
      rooms.removeUser(roomId, socket.id);
      io.to(roomId).emit('users', rooms.getUsers(roomId));
    });
  });
});

server.listen(3000, () => console.log('✅ Server running at http://localhost:3000'));
