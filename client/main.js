import { setupCanvas } from './canvas.js';
import { setupSocket } from './websocket.js';

const socket = setupSocket();
const userName = prompt('Enter your name:') || 'Guest';
const roomId = 'main-room';

socket.emit('join', { roomId, userName });

setupCanvas(socket, userName);
