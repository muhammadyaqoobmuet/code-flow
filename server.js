import { ACTIONS } from './actions.js';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
    maxHttpBufferSize: 1e8 // 100MB for audio files
});

const userSocketMap = new Map();
const roomCodeMap = new Map(); // Store code for each room
const roomMessagesMap = new Map(); // Store messages for each room
const roomVoiceCallsMap = new Map(); // Store active voice calls

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

    // Handle chat messages (text and audio)
    socket.on('MESSAGE_SEND', ({ roomId, message, username, messageType, audioData, duration }) => {
        console.log('💬 MESSAGE_SEND:', {
            roomId,
            messageType: messageType || 'text',
            username,
            from: socket.id,
            hasAudio: !!audioData,
            duration
        });

        if (!roomId || !username) {
            console.log('❌ Invalid message data');
            return;
        }

        // Validate message content based on type
        if (messageType === 'audio' && !audioData) {
            console.log('❌ Audio message missing audio data');
            return;
        }

        if (messageType !== 'audio' && !message) {
            console.log('❌ Text message missing message content');
            return;
        }

        const messageData = {
            id: Date.now() + Math.random(), // Unique ID
            username,
            message: messageType === 'audio' ? '' : message.trim(),
            messageType: messageType || 'text',
            audioData: audioData || null,
            duration: duration || 0,
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

    // Voice call handling
    socket.on('VOICE_CALL_OFFER', ({ roomId, offer, username }) => {
        console.log('📞 VOICE_CALL_OFFER from', username, 'in room', roomId);

        // Store the active call
        if (!roomVoiceCallsMap.has(roomId)) {
            roomVoiceCallsMap.set(roomId, new Set());
        }
        roomVoiceCallsMap.get(roomId).add(socket.id);

        // Broadcast offer to all other users in the room
        socket.in(roomId).emit('VOICE_CALL_OFFER', {
            from: socket.id,
            offer,
            username,
            roomId
        });
    });

    socket.on('VOICE_CALL_ANSWER', ({ roomId, answer, to }) => {
        console.log('📞 VOICE_CALL_ANSWER in room', roomId);

        // Add this socket to the active call
        if (!roomVoiceCallsMap.has(roomId)) {
            roomVoiceCallsMap.set(roomId, new Set());
        }
        roomVoiceCallsMap.get(roomId).add(socket.id);

        // Send answer to the specific user who made the offer
        if (to) {
            io.to(to).emit('VOICE_CALL_ANSWER', { answer, from: socket.id });
        }
    });

    socket.on('VOICE_CALL_ICE_CANDIDATE', ({ roomId, candidate }) => {
        console.log('📞 ICE_CANDIDATE in room', roomId);

        // Broadcast ICE candidate to all other users in the room
        socket.in(roomId).emit('VOICE_CALL_ICE_CANDIDATE', {
            candidate,
            from: socket.id
        });
    });

    socket.on('VOICE_CALL_END', ({ roomId, username }) => {
        console.log('📞 VOICE_CALL_END from', username, 'in room', roomId);

        // Remove from active calls
        if (roomVoiceCallsMap.has(roomId)) {
            roomVoiceCallsMap.get(roomId).delete(socket.id);

            // If no more active calls, clean up
            if (roomVoiceCallsMap.get(roomId).size === 0) {
                roomVoiceCallsMap.delete(roomId);
            }
        }

        // Notify all other users in the room
        socket.in(roomId).emit('VOICE_CALL_END', {
            username,
            from: socket.id
        });
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
                // End any active voice calls
                if (roomVoiceCallsMap.has(roomId)) {
                    roomVoiceCallsMap.get(roomId).delete(socket.id);

                    // Notify others about voice call end
                    socket.in(roomId).emit('VOICE_CALL_END', {
                        username: userSocketMap.get(socket.id),
                        from: socket.id
                    });

                    if (roomVoiceCallsMap.get(roomId).size === 0) {
                        roomVoiceCallsMap.delete(roomId);
                    }
                }

                socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                    socketId: socket.id,
                    username: userSocketMap.get(socket.id)
                });

                // Clean up empty rooms
                const remainingUsers = getAllConnectedUsers(roomId);
                if (remainingUsers.length <= 1) {
                    roomCodeMap.delete(roomId);
                    roomMessagesMap.delete(roomId);
                    roomVoiceCallsMap.delete(roomId);
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