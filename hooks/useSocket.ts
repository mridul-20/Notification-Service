import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket-client';

export function useSocket() {
  const [connected, setConnected] = useState(false);
  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Set initial connection state
    setConnected(socket.connected);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket]);

  const emit = (event: string, data: any) => {
    socket?.emit(event, data);
  };

  const on = (event: string, callback: (data: any) => void) => {
    if (!socket) return;
    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  };

  return { emit, on, connected };
} 