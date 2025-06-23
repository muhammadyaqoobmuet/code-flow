import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import LanguageDropdown from './LanguageDrop';
import TabSwitcher from './TabSwitch';
import { Editor } from '@monaco-editor/react';
import { ACTIONS } from '../../../../actions';

function OutputDisplay({ output, isLoading }) {
    return (
        <div className="mt-4 p-4 bg-black text-green-300 rounded min-h-[100px] font-mono whitespace-pre-wrap">
            {isLoading ? 'Running your code...' : output}
        </div>
    );
}

function SharedCodeEditor({ socketRef, roomId }) {
    const [language, setLanguage] = useState('javascript');
    const [activeTab, setActiveTab] = useState('Editor');
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [synced, setSynced] = useState(false);

    // Refs for tracking state
    const isReceivingUpdate = useRef(false);
    
    const editorRef = useRef(null);
    const syncTimeoutRef = useRef(null);
    const hasRequestedSync = useRef(false);

    const languageMap = {
        javascript: 63,
        typescript: 74,
        python: 71,
        cpp: 54,
    };

    // Monitor socket connection
    useEffect(() => {
        if (!socketRef?.current) return;

        const socket = socketRef.current;

        const checkConnection = () => {
            const connected = socket.connected;
            setSocketConnected(connected);
            console.log('🔗 Socket connection:', connected, 'Socket ID:', socket.id);
        };

        checkConnection();

        const interval = setInterval(checkConnection, 1000);

        return () => clearInterval(interval);
    }, [socketRef]);

    // Socket event listeners
    useEffect(() => {
        if (!socketRef?.current || !roomId) {
            console.log('❌ Missing socket or roomId');
            return;
        }

        const socket = socketRef.current;
        console.log('🔧 Setting up socket listeners for room:', roomId);

        // Handler for receiving code
        const handleReceiveCode = (data) => {
            console.log('📥 RECEIVED SYNC_CODE EVENT:', data);
            if (data && typeof data.code === 'string') {
                isReceivingUpdate.current = true;
                setCode(data.code);
                setSynced(true);
                hasRequestedSync.current = false; // Reset the flag
                console.log('✅ Code updated! Length:', data.code.length);

                setTimeout(() => {
                    isReceivingUpdate.current = false;
                }, 100);
            } else {
                console.log('❌ Invalid sync data received:', data);
            }
        };

        // Test listener to see if events are being received
        const handleTestEvent = (data) => {
            console.log('🧪 TEST EVENT RECEIVED:', data);
        };

        // Remove existing listeners
        socket.off(ACTIONS.SYNC_CODE);
        socket.off('test-event');

        // Add listeners
        socket.on(ACTIONS.SYNC_CODE, handleReceiveCode);
        socket.on('test-event', handleTestEvent);

        console.log('📡 Added listeners for:', ACTIONS.SYNC_CODE, 'and test-event');

        // Request initial sync only once
        const requestSync = () => {
            if (socket.connected && !hasRequestedSync.current && !synced) {
                console.log('🔄 Requesting sync for room:', roomId);
                socket.emit('REQUEST_SYNC', { roomId });
                hasRequestedSync.current = true;

                // Fallback if no response
                setTimeout(() => {
                    if (!synced) {
                        console.log('⚠️ No sync response, marking as synced anyway');
                        setSynced(true);
                        hasRequestedSync.current = false;
                    }
                }, 5000);
            }
        };

        // Initial sync request
        requestSync();

        return () => {
            socket.off(ACTIONS.SYNC_CODE, handleReceiveCode);
            socket.off('test-event', handleTestEvent);
            console.log('🧹 Cleaned up socket listeners');
        };
    }, [socketRef, roomId, synced]); // Include synced to prevent multiple requests

    // Reset when room changes
    useEffect(() => {
        hasRequestedSync.current = false;
        setSynced(false);
        console.log('🔄 Room changed, resetting sync state');
    }, [roomId]);

    // Debounced emit function
    const emitCodeChange = useCallback((newCode) => {
        if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
        }

        syncTimeoutRef.current = setTimeout(() => {
            if (socketRef?.current?.connected && !isReceivingUpdate.current && synced) {
                console.log('📤 Emitting code change to room:', roomId, 'Length:', newCode.length);
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    roomId,
                    code: newCode
                });
            } else {
                console.log('⚠️ Cannot emit:', {
                    connected: socketRef?.current?.connected,
                    receiving: isReceivingUpdate.current,
                    synced: synced
                });
            }
        }, 150);
    }, [socketRef, roomId, synced]);

    // Handle editor changes
    const handleEditorChange = useCallback((value) => {
        const newCode = value || '';

        if (isReceivingUpdate.current) {
            console.log('🔄 Skipping emit (receiving from socket)');
            return;
        }

        console.log('✏️ User editing, new length:', newCode.length);
        setCode(newCode);

        if (socketConnected && synced) {
            emitCodeChange(newCode);
        }
    }, [emitCodeChange, socketConnected, synced]);

    // Code execution
    const captureConsoleLogs = (codeStr) => {
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => logs.push(args.join(' '));

        try {
            eval(codeStr);
        } catch (err) {
            logs.push(`❌ Error: ${err.message}`);
        }

        console.log = originalLog;
        return logs.join('\n');
    };

    const runCode = async () => {
        setIsLoading(true);
        setOutput('');

        const lang = language.toLowerCase();

        if (lang === 'javascript' || lang === 'typescript') {
            const result = captureConsoleLogs(code);
            setOutput(result || '✅ No output');
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
                {
                    source_code: code,
                    language_id: languageMap[lang],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Key': 'e0644127e5msh48223a437a87d4ap1aebe0jsnf9888bc7e8a1',
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                    },
                }
            );

            const data = res.data;
            if (data.stderr) setOutput(data.stderr);
            else setOutput(data.stdout || '✅ No output');
        } catch (err) {
            setOutput(`❌ Error: ${err.message}`);
        }

        setIsLoading(false);
    };

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
        console.log('📝 Editor mounted');
        editor.focus();
    };

    // Debug function
    const debugInfo = () => {
        console.log('=== DEBUG INFO ===');
        console.log('Socket exists:', !!socketRef?.current);
        console.log('Socket connected:', socketRef?.current?.connected);
        console.log('Socket ID:', socketRef?.current?.id);
        console.log('Room ID:', roomId);
        console.log('Code length:', code.length);
        console.log('Socket connected state:', socketConnected);
        console.log('Synced:', synced);
        console.log('Has requested sync:', hasRequestedSync.current);
        console.log('Is receiving update:', isReceivingUpdate.current);
        console.log('ACTIONS.SYNC_CODE:', ACTIONS.SYNC_CODE);

        // Test if socket can receive events
        if (socketRef?.current?.connected) {
            console.log('🧪 Testing socket communication...');
            socketRef.current.emit('test-ping', { message: 'ping' });
        }
        console.log('==================');
    };

    // Manual sync function
    const forceSync = () => {
        if (socketRef?.current && roomId) {
            console.log('🔄 Force sync requested');
            hasRequestedSync.current = false;
            setSynced(false);

            if (socketRef.current.connected) {
                socketRef.current.emit('REQUEST_SYNC', { roomId });
                console.log('✅ Sync request sent');
            } else {
                console.log('❌ Socket not connected');
            }
        } else {
            console.log('❌ Missing socket or room ID');
        }
    };

    // Test socket function
    const testSocket = () => {
        if (socketRef?.current) {
            console.log('🧪 Testing socket...');
            const socket = socketRef.current;

            // Emit a test event
            socket.emit('test-ping', { message: 'Hello from client', roomId });

            // Listen for response
            socket.once('test-pong', (data) => {
                console.log('✅ Socket test successful:', data);
            });

            setTimeout(() => {
                console.log('⚠️ Socket test timeout - no response received');
            }, 3000);
        }
    };

    return (
        <div className="flex-1 p-6 border-r border-gray-200 bg-white">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold">
                    Shared Code Editor
                    <span className={`ml-2 text-sm ${socketConnected ? 'text-green-600' : 'text-red-600'}`}>
                        {socketConnected ? '🟢 Connected' : '🔴 Disconnected'}
                    </span>
                    <span className={`ml-2 text-sm ${synced ? 'text-blue-600' : 'text-orange-600'}`}>
                        {synced ? '🔄 Synced' : '⏳ Syncing...'}
                    </span>
                    {roomId && (
                        <span className="ml-2 text-xs text-gray-500">
                            Room: {roomId.slice(0, 8)}...
                        </span>
                    )}
                </h2>
            </div>

            <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Controls */}
            <div className="flex items-center gap-2 my-4">
                <LanguageDropdown language={language} setLanguage={setLanguage} />
                <button
                    onClick={runCode}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading ? '⏳ Running...' : '💡 Run Code'}
                </button>
                <button
                    onClick={debugInfo}
                    className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
                >
                    Debug
                </button>
                <button
                    onClick={forceSync}
                    className="bg-purple-500 text-white px-2 py-1 rounded text-sm"
                >
                    Force Sync
                </button>
                <button
                    onClick={testSocket}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                >
                    Test Socket
                </button>
            </div>

            {/* Status */}
            <div className="text-sm text-gray-600 mb-2">
                Code: {code.length} chars | Socket: {socketConnected ? 'ON' : 'OFF'} | Sync: {synced ? 'YES' : 'NO'}
            </div>

            {/* Editor */}
            <div className="w-full h-[calc(100vh-380px)] border rounded-lg overflow-hidden">
                <Editor
                    height="100%"
                    language={language.toLowerCase()}
                    theme="vs-dark"
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        automaticLayout: true,
                        selectOnLineNumbers: true,
                    }}
                />
            </div>

            <OutputDisplay output={output} isLoading={isLoading} />
        </div>
    );
}

export default SharedCodeEditor;