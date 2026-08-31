require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
});

// Track online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('User connected via socket:', socket.id);

    socket.on('user_online', (userId) => {
        if (userId) {
            onlineUsers.set(socket.id, userId);

            io.emit(
                'update_online_users',
                Array.from(new Set(onlineUsers.values()))
            );
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        onlineUsers.delete(socket.id);

        io.emit(
            'update_online_users',
            Array.from(new Set(onlineUsers.values()))
        );
    });
});

server.listen(PORT, () => {
    console.log(`CollabBoard API running at http://localhost:${PORT}`);
    console.log('Socket.IO enabled');
});