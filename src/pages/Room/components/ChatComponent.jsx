import { MessageCircle, MessageCircleDashed, MessageCircleHeart, Mic, Mic2, MicOff, Send, Play, Pause, Square, Phone, PhoneOff } from 'lucide-react';
import { useEffect, useState, useRef } from 'react'


// Mock configuration - replace with your actual servers.js import
const rtcPeerConnectionIceServersConfigration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

export default function ChatComponent({ socket, roomId, currentUsername }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    // Voice message states
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);

    // Real-time voice chat states
    const [isInVoiceCall, setIsInVoiceCall] = useState(false);
    const [isMicActive, setIsMicActive] = useState(false);


    // Refs
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const recordingIntervalRef = useRef(null);
    const audioElementsRef = useRef(new Map());

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

        // Listen for new messages (text and audio)
        const handleMessageReceive = (messageData) => {
            console.log('Received message:', messageData);
            setMessages(prevMessages => {
                const exists = prevMessages.some(msg => msg.id === messageData.id);
                if (exists) return prevMessages;

                return [...prevMessages, {
                    id: messageData.id,
                    user: messageData.username,
                    message: messageData.message,
                    audioData: messageData.audioData,
                    messageType: messageData.messageType || 'text',
                    duration: messageData.duration,
                    time: new Date(messageData.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    isOwn: messageData.socketId === socket.id,
                    timestamp: messageData.timestamp
                }];
            });
        };

        // Listen for message history
        const handleMessagesHistory = (messagesHistory) => {
            console.log('Received messages history:', messagesHistory.length, 'messages');
            const formattedMessages = messagesHistory.map(msg => ({
                id: msg.id,
                user: msg.username,
                message: msg.message,
                audioData: msg.audioData,
                messageType: msg.messageType || 'text',
                duration: msg.duration,
                time: new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                isOwn: msg.socketId === socket.id,
                timestamp: msg.timestamp
            }));
            setMessages(formattedMessages);
        };

        // Voice call listeners
        const handleVoiceCallOffer = async ({ from, offer, username }) => {
            console.log('Received voice call offer from:', username);
            // Auto-accept for simplicity - in production, show accept/decline UI
            await handleAcceptVoiceCall(from, offer, username);
        };

        const handleVoiceCallAnswer = async ({ answer }) => {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(answer);
            }
        };

        const handleVoiceCallIceCandidate = async ({ candidate }) => {
            if (peerConnectionRef.current && candidate) {
                await peerConnectionRef.current.addIceCandidate(candidate);
            }
        };

        const handleVoiceCallEnd = ({ username }) => {
            console.log('Voice call ended by:', username);
            // toast(`${username} ended the voice call`)

            endVoiceCall();
        };

        socket.on('MESSAGE_RECEIVE', handleMessageReceive);
        socket.on('MESSAGES_HISTORY', handleMessagesHistory);
        socket.on('VOICE_CALL_OFFER', handleVoiceCallOffer);
        socket.on('VOICE_CALL_ANSWER', handleVoiceCallAnswer);
        socket.on('VOICE_CALL_ICE_CANDIDATE', handleVoiceCallIceCandidate);
        socket.on('VOICE_CALL_END', handleVoiceCallEnd);

        return () => {
            socket.off('MESSAGE_RECEIVE', handleMessageReceive);
            socket.off('MESSAGES_HISTORY', handleMessagesHistory);
            socket.off('VOICE_CALL_OFFER', handleVoiceCallOffer);
            socket.off('VOICE_CALL_ANSWER', handleVoiceCallAnswer);
            socket.off('VOICE_CALL_ICE_CANDIDATE', handleVoiceCallIceCandidate);
            socket.off('VOICE_CALL_END', handleVoiceCallEnd);
        };
    }, [socket, roomId, currentUsername]);

    // Text message handling
    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!message.trim() || !socket || !roomId || !currentUsername) {
            return;
        }

        socket.emit('MESSAGE_SEND', {
            roomId,
            message: message.trim(),
            username: currentUsername,
            messageType: 'text'
        });

        setMessage("");
    };

    // Voice message recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            const chunks = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            recordingIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Could not access microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(recordingIntervalRef.current);
        }
    };

    const sendAudioMessage = async () => {
        if (!audioBlob || !socket || !roomId || !currentUsername) return;

        try {
            // Convert blob to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const audioData = reader.result;

                socket.emit('MESSAGE_SEND', {
                    roomId,
                    message: '',
                    username: currentUsername,
                    messageType: 'audio',
                    audioData: audioData,
                    duration: recordingTime
                });

                // Clear the recording
                setAudioBlob(null);
                setRecordingTime(0);
            };
            reader.readAsDataURL(audioBlob);
        } catch (error) {
            console.error('Error sending audio message:', error);
        }
    };

    const cancelRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(recordingIntervalRef.current);
            setAudioBlob(null);
            setRecordingTime(0);
        }
    };

    // Audio playback
    const playAudioMessage = (audioData, messageId) => {
        try {
            // Stop any currently playing audio
            audioElementsRef.current.forEach((audio, id) => {
                if (id !== messageId) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });

            let audio = audioElementsRef.current.get(messageId);

            if (!audio) {
                audio = new Audio(audioData);
                audioElementsRef.current.set(messageId, audio);

                audio.onended = () => {
                    // Clean up after playback
                };
            }

            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
                audio.currentTime = 0;
            }
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    // Real-time voice call functions
    const startVoiceCall = async () => {
        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsMicActive(true);
            setIsInVoiceCall(true);

            // Create peer connection
            peerConnectionRef.current = new RTCPeerConnection(rtcPeerConnectionIceServersConfigration);

            // Add local stream
            streamRef.current.getTracks().forEach(track => {
                peerConnectionRef.current.addTrack(track, streamRef.current);
            });

            // Handle remote stream
            peerConnectionRef.current.ontrack = (event) => {
                remoteStreamRef.current = event.streams[0];
                // Play remote audio
                const remoteAudio = new Audio();
                remoteAudio.srcObject = remoteStreamRef.current;
                remoteAudio.play();
            };

            // Handle ICE candidates
            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('VOICE_CALL_ICE_CANDIDATE', {
                        roomId,
                        candidate: event.candidate
                    });
                }
            };

            // Create and send offer
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);

            socket.emit('VOICE_CALL_OFFER', {
                roomId,
                offer,
                username: currentUsername
            });

        } catch (error) {
            console.error('Error starting voice call:', error);
            setIsInVoiceCall(false);
            setIsMicActive(false);
        }
    };

    const handleAcceptVoiceCall = async (from, offer) => {
        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsMicActive(true);
            setIsInVoiceCall(true);

            peerConnectionRef.current = new RTCPeerConnection(rtcPeerConnectionIceServersConfigration);

            streamRef.current.getTracks().forEach(track => {
                peerConnectionRef.current.addTrack(track, streamRef.current);
            });

            peerConnectionRef.current.ontrack = (event) => {
                remoteStreamRef.current = event.streams[0];
                const remoteAudio = new Audio();
                remoteAudio.srcObject = remoteStreamRef.current;
                remoteAudio.play();
            };

            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('VOICE_CALL_ICE_CANDIDATE', {
                        roomId,
                        candidate: event.candidate
                    });
                }
            };

            await peerConnectionRef.current.setRemoteDescription(offer);
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);

            socket.emit('VOICE_CALL_ANSWER', {
                roomId,
                answer,
                to: from
            });

        } catch (error) {
            console.error('Error accepting voice call:', error);
        }
    };

    const endVoiceCall = () => {
        // Clean up streams first
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        // Clean up peer connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        // Clean up remote stream reference
        if (remoteStreamRef.current) {
            remoteStreamRef.current = null;
        }

        // Only emit if we're actually ending a call (not if we're responding to someone else ending)
        if (isInVoiceCall) {
            socket.emit('VOICE_CALL_END', {
                roomId,
                username: currentUsername
            });
        }

        // Reset states
        setIsInVoiceCall(false);
        setIsMicActive(false);
    };

    const toggleMute = () => {
        if (streamRef.current) {
            const audioTrack = streamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMicActive(audioTrack.enabled);
            }
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        <div className="flex flex-col h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex flex-col gap-4 justify-between items-center px-4 py-3 bg-slate-800/50 border-b border-slate-600">
                <div>
                    <span className="text-sm text-slate-300">{messages.length} messages</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Voice Call Controls */}
                    {isInVoiceCall ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleMute}
                                className={`p-2 rounded-full transition-colors ${isMicActive ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={endVoiceCall}
                                className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                            >
                                <PhoneOff className="w-4 h-4" />
                            </button>
                            <span className="text-xs bg-green-600 px-3 py-2 rounded-full">In Call</span>
                        </div>
                    ) : (
                        <button
                            onClick={startVoiceCall}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                        </button>
                    )}

                    <span className={`text-xs px-5 py-2  rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                        {isConnected ? 'active' : 'Disconnected'}
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-400">
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
                                ? 'bg-blue-600 text-white rounded-br-none shadow-lg'
                                : 'bg-slate-700 text-slate-100 rounded-bl-none shadow-lg'
                                }`}>
                                {!msg.isOwn && (
                                    <div className="text-xs font-medium mb-1 opacity-70">
                                        {msg.user}
                                    </div>
                                )}

                                {msg.messageType === 'audio' ? (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => playAudioMessage(msg.audioData, msg.id)}
                                            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                                        >
                                            <Play className="w-4 h-4" />
                                        </button>
                                        <div className="flex-1">
                                            <div className="w-full bg-white/20 rounded-full h-2">
                                                <div className="bg-white rounded-full h-2 w-0"></div>
                                            </div>
                                        </div>
                                        <span className="text-xs opacity-70">
                                            {formatTime(msg.duration || 0)}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="text-sm leading-relaxed break-words">{msg.message}</div>
                                )}

                                <div className={`text-xs mt-1 opacity-70`}>
                                    {msg.time}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Recording Preview */}
            {audioBlob && (
                <div className="px-4 py-2 bg-slate-700/50 border-t border-slate-600">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <div className="text-sm text-slate-300">Voice message recorded</div>
                            <div className="text-xs text-slate-400">{formatTime(recordingTime)}</div>
                        </div>
                        <button
                            onClick={cancelRecording}
                            className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 rounded transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={sendAudioMessage}
                            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-slate-800/50 border-t border-slate-600">
                {isRecording ? (
                    <div className=" flex  items-center gap-3">
                        <div className="flex-1 flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-sm">Recording... {formatTime(recordingTime)}</span>
                        </div>
                        <button
                            onClick={stopRecording}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                        >
                            <Square className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
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
                            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white placeholder-slate-400"
                            disabled={!isConnected}
                        />

                        <button
                            onClick={startRecording}
                            disabled={!isConnected}
                            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition-colors disabled:opacity-50"
                        >
                            <Mic className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handleSendMessage}
                            disabled={!message.trim() || !isConnected}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}