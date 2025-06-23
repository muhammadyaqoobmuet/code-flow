import { ACTIONS } from './actions.js';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

const userSocketMap = new Map();
const roomCodeMap = new Map(); // Store code for each room
const roomMessagesMap = new Map(); // Store messages for each room

function getAllConnectedUsers(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || [])
        .map((socketId) => {
            return {
                socketId,
                username: userSocketMap.get(socketId) || 'Loading...'
            };
        });
}

io.on('connection', (socket) => {
    console.log('🟢 User connected:', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        console.log('👤 JOIN EVENT:', { roomId, username, socketId: socket.id });

        userSocketMap.set(socket.id, username);
        socket.join(roomId);

        const clients = getAllConnectedUsers(roomId);
        console.log('👥 Room', roomId, 'now has', clients.length, 'users');

        // Send existing code to the new user
        const existingCode = roomCodeMap.get(roomId);
        if (existingCode) {
            console.log('📤 SENDING EXISTING CODE to', socket.id, '- Length:', existingCode.length);
            socket.emit(ACTIONS.SYNC_CODE, { code: existingCode });
        }

        // Send existing messages to the new user
        const existingMessages = roomMessagesMap.get(roomId) || [];
        if (existingMessages.length > 0) {
            console.log('📤 SENDING EXISTING MESSAGES to', socket.id, '- Count:', existingMessages.length);
            socket.emit('MESSAGES_HISTORY', existingMessages);
        }

        // Notify all users about the new join
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id
            });
        });
    });

    // Handle chat messages
    socket.on('MESSAGE_SEND', ({ roomId, message, username }) => {
        console.log('💬 MESSAGE_SEND:', { roomId, message, username, from: socket.id });

        if (!roomId || !message || !username) {
            console.log('❌ Invalid message data');
            return;
        }

        const messageData = {
            id: Date.now() + Math.random(), // Unique ID
            username,
            message: message.trim(),
            timestamp: new Date().toISOString(),
            socketId: socket.id
        };

        // Store message in room history
        if (!roomMessagesMap.has(roomId)) {
            roomMessagesMap.set(roomId, []);
        }
        const roomMessages = roomMessagesMap.get(roomId);
        roomMessages.push(messageData);

        // Keep only last 100 messages to prevent memory issues
        if (roomMessages.length > 100) {
            roomMessages.shift();
        }

        console.log('📝 Stored message in room', roomId, '- Total messages:', roomMessages.length);

        // Broadcast message to all users in the room
        io.to(roomId).emit('MESSAGE_RECEIVE', messageData);
    });

    // Handle sync requests
    socket.on('REQUEST_SYNC', ({ roomId }) => {
        console.log('🔄 SYNC REQUEST from', socket.id, 'for room', roomId);
        const existingCode = roomCodeMap.get(roomId);

        socket.emit(ACTIONS.SYNC_CODE, {
            code: existingCode || '',
            isInitialSync: true
        });
    });

    // Handle code changes
    socket.on(ACTIONS.SYNC_CODE, ({ roomId, code }) => {
        if (!roomId || typeof code !== 'string') {
            console.log('❌ Invalid sync data');
            return;
        }

        console.log('📝 CODE CHANGE in room', roomId, 'from', socket.id, '- Length:', code.length);

        // Store the code
        roomCodeMap.set(roomId, code);

        // Broadcast to all OTHER users in the room
        socket.in(roomId).emit(ACTIONS.SYNC_CODE, { code });

        const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
        console.log('📡 Broadcasted to', roomSize - 1, 'other users');
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];

        rooms.forEach((roomId) => {
            if (roomId !== socket.id) {
                socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                    socketId: socket.id,
                    username: userSocketMap.get(socket.id)
                });

                // Clean up empty rooms
                const remainingUsers = getAllConnectedUsers(roomId);
                if (remainingUsers.length <= 1) {
                    roomCodeMap.delete(roomId);
                    roomMessagesMap.delete(roomId);
                    console.log('🧹 Cleaned up empty room', roomId);
                }
            }
        });

        userSocketMap.delete(socket.id);
        console.log('🔴 User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
});