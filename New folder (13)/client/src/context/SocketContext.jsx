import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
});

export const SocketProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [onlineUserIds, setOnlineUserIds] = useState([]);

  useEffect(() => {
    if (currentUser?.id) {
      socket.emit('user_online', currentUser.id);
    }

    socket.on('update_online_users', (userIds) => {
      setOnlineUserIds(userIds);
    });

    return () => {
      socket.off('update_online_users');
    };
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ onlineUserIds, socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);