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

        socket.join(roomId); // become part of the room join 


        const clients = getAllConnectedUsers(roomId);
        console.log('👥 Room', roomId, 'now has', clients.length, 'users');

        // Send existing code to the new user
        const existingCode = roomCodeMap.get(roomId);
        if (existingCode) {
            console.log('📤 SENDING EXISTING CODE to', socket.id, '- Length:', existingCode.length);
            socket.emit(ACTIONS.SYNC_CODE, { code: existingCode });
        } else {
            console.log('📝 No existing code in room', roomId);
        }

        // Notify all users about the new join
        clients.forEach(({ socketId }) => { // socketId is userId Connected In the room
            io.to(socketId).emit(ACTIONS.JOINED, { // io.to(socketId) emits to a specific user 
                clients,
                username,
                socketId: socket.id
            });
        });
    });

    // Handle sync requests
    socket.on('REQUEST_SYNC', ({ roomId }) => {
        console.log('🔄 SYNC REQUEST from', socket.id, 'for room', roomId);
        const existingCode = roomCodeMap.get(roomId);

        console.log('📤 SENDING SYNC CODE - Length:', existingCode?.length || 0);

        // Always send a response, even if empty
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