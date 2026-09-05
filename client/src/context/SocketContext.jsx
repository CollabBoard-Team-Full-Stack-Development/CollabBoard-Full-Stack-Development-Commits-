import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

// Connect to backend server socket
const socket = io('http://localhost:5000');

export const SocketProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [onlineUserIds, setOnlineUserIds] = useState([]);

  useEffect(() => {
    if (currentUser?.id) {
      // Emit event that this user is online
      socket.emit('user_online', currentUser.id);
    }

    // Listen for broadcasts from backend regarding online users
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