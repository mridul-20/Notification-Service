import { io, Socket } from 'socket.io-client';
import { config } from './config';

let socket: Socket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000; // 3 seconds

export function initializeSocket() {
  if (socket?.connected) return socket;

  try {
    socket = io(config.socket.url, {
      reconnection: true,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: RECONNECT_DELAY,
      timeout: 10000, // 10 seconds timeout
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Socket connected successfully');
      reconnectAttempts = 0;
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      reconnectAttempts++;
      
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('Max reconnection attempts reached');
        socket?.disconnect();
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        socket?.connect();
      }
    });

    return socket;
  } catch (error) {
    console.error('Error initializing socket:', error);
    return null;
  }
}

export function getSocket() {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
} 