import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/api\/v1$/, '');

interface SocketContextType {
  onlineUsers: Set<number>;
  isOnline: (userId: number) => boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!user) return;

    const socket: Socket = io(SOCKET_URL, { withCredentials: true });

    socket.on('friend:online', ({ userId }: { userId: number }) => {
      setOnlineUsers(prev => new Set(prev).add(userId));
    });

    socket.on('friend:offline', ({ userId }: { userId: number }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const isOnline = useCallback((userId: number) => onlineUsers.has(userId), [onlineUsers]);

  return (
    <SocketContext.Provider value={{ onlineUsers, isOnline }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
