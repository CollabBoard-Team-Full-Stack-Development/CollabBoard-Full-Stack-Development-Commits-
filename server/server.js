require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Increase header size limit to prevent 431 errors from large user payloads/tokens
server.maxHeaderSize = 65536; // 64KB

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
});

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

const startServer = async () => {
    try {
        await connectDB();

        server.listen(PORT, () => {
            console.log(`CollabBoard API running at http://localhost:${PORT}`);
            console.log('MongoDB connected');
            console.log('Socket.IO enabled');
        });
    } catch (error) {
        console.error('Server startup aborted because MongoDB could not connect.');
        process.exit(1);
    }
};

startServer();