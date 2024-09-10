import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000', {
  transports: ['websocket', 'polling'],
  reconnect: true,
});

socket.on('connect', () => {
  console.log('Connected to backend');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

export default socket;
