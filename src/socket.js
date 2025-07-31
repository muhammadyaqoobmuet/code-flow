import { io } from 'socket.io-client';

export const initSocket = async (action, data) => {
    const options = {
        reconnectionAttempts: 'Infinity', // Fixed typo: was 'recconnectionAttempt'
        timeout: 10000,
        transports: ['websocket'],
        forceNew: true, // Force a new connection
    }

    const socket = io(import.meta.env.VITE_REACT_APP_BACKEND_URL || window.location.origin, options);

    // Wait for the socket to connect
    return new Promise((resolve, reject) => {
        socket.on('connect', () => {
            console.log('Socket connected successfully:', socket.id);

            // Emit the action after connection is established
            if (action && data) {
                console.log('Emitting action:', action, 'with data:', data);
                socket.emit(action, data);
            }

            resolve(socket);
        });


        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            reject(error);
        });



    });
};