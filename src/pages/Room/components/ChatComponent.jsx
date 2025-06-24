import { ChartArea, MessageCircle, MessageCircleDashed, MessageCircleHeart, Send, SendIcon } from 'lucide-react';
import { useEffect, useState, useRef } from 'react'
import FloatingWidget from './FloatingWidget';

export default function ChatComponent({ socket, roomId, currentUsername }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!socket || !roomId || !currentUsername) {
            console.log('Missing required props:', { socket: !!socket, roomId, currentUsername });
            return;
        }

        console.log('Setting up chat listeners for room:', roomId);
        setIsConnected(true);

        // Listen for new messages
        const handleMessageReceive = (messageData) => {
            console.log('Received message:', messageData);
            setMessages(prevMessages => {
                // Check if message already exists to prevent duplicates
                const exists = prevMessages.some(msg => msg.id === messageData.id);
                if (exists) return prevMessages;

                return [...prevMessages, {
                    id: messageData.id,
                    user: messageData.username,
                    message: messageData.message,
                    time: new Date(messageData.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    isOwn: messageData.socketId === socket.id,
                    timestamp: messageData.timestamp
                }];
            });
        };

        // Listen for message history when joining
        const handleMessagesHistory = (messagesHistory) => {
            console.log('Received messages history:', messagesHistory.length, 'messages');
            const formattedMessages = messagesHistory.map(msg => ({
                id: msg.id,
                user: msg.username,
                message: msg.message,
                time: new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                isOwn: msg.socketId === socket.id,
                timestamp: msg.timestamp
            }));
            setMessages(formattedMessages);
        };

        socket.on('MESSAGE_RECEIVE', handleMessageReceive);
        socket.on('MESSAGES_HISTORY', handleMessagesHistory);

        // Cleanup
        return () => {
            socket.off('MESSAGE_RECEIVE', handleMessageReceive);
            socket.off('MESSAGES_HISTORY', handleMessagesHistory);
        };
    }, [socket, roomId, currentUsername]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!message.trim() || !socket || !roomId || !currentUsername) {
            console.log('Cannot send message:', {
                message: message.trim(),
                socket: !!socket,
                roomId,
                currentUsername
            });
            return;
        }

        console.log('Sending message:', { roomId, message: message.trim(), username: currentUsername });

        // Send message to server
        socket.emit('MESSAGE_SEND', {
            roomId,
            message: message.trim(),
            username: currentUsername
        });

        // Clear input
        setMessage("");
    };

    if (!socket || !roomId || !currentUsername) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                    <div className="text-2xl mb-2">💬</div>
                    <div>Chat not available</div>
                    <div className="text-sm">Missing connection details</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[500px]">
            {/* Connection Status */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                <div className={` text-white`}>
                    <MessageCircleHeart />
                </div>
                <span className="text-xs text-green-800 font-bold bg-white px-2 rounded-xl">
                    {isConnected ? 'Connected' : 'Disconnected'}
                </span>
                <span className="text-xs text-gray-50">-</span>
                <span className="text-xs text-gray-50">{messages.length} messages</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 min-h-0">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                            <div className="text-3xl mb-2">💬</div>
                            <div>No messages yet</div>
                            <div className="text-sm">Start the conversation!</div>
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-lg p-3 ${msg.isOwn
                                ? 'bg-blue-500 text-white rounded-br-none shadow-md'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none shadow-sm'
                                }`}>
                                {!msg.isOwn && (
                                    <div className="text-xs font-medium mb-1 opacity-70">
                                        {msg.user}
                                    </div>
                                )}
                                <div className="text-sm leading-relaxed break-words">{msg.message}</div>
                                <div className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                    {msg.time}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage(e);
                        }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 px-2 py-2 border text-white border-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                    disabled={!isConnected}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || !isConnected}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                >
                    <SendIcon className="w-4 h-4 inline-block mr-1" />
                </button>
            </div>
            
        </div>
    );
}