export function setupSocket() {
  const socket = io();
  socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
  });
  return socket;
}
