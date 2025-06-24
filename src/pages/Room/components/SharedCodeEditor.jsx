import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import LanguageDropdown from './LanguageDrop';
import TabSwitcher from './TabSwitch';
import { Editor } from '@monaco-editor/react';
import { ACTIONS } from '../../../../actions';
import { Play } from 'lucide-react';


function OutputDisplay({ output, isLoading }) {
    return (
        <div className="mt-4 p-4  h-[40vh] overflow-auto bg-black text-green-300 rounded  font-mono whitespace-pre-wrap">
            <p>
                {isLoading ? 'Running your code...' : output}
            </p>

        </div>
    );
}

function SharedCodeEditor({ socketRef, roomId }) {
    console.log(roomId, socketRef)
    const [language, setLanguage] = useState('javascript');

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
        if (!socketRef?.current) {
            console.log('❌ Socket reference is not available');
            return
        }

        const socket = socketRef.current;

        const checkConnection = () => {
            const connected = socket.connected;
            setSocketConnected(connected);
            if (connected) {
                console.log('🟢 Socket connected:', socket.id);
            } else {
                console.log('🔴 Socket disconnected');
            }
        };

        checkConnection();

        const interval = setInterval(checkConnection, 10000);

        return () => clearInterval(interval);
    }, [socketRef]);

    // Socket event listeners
    useEffect(() => {
        if (!socketRef?.current || !roomId) {
            console.log('❌ Missing socket or roomId');
            return;
        }

        const socket = socketRef?.current;


        // Handler for receiving code
        const handleReceiveCode = (data) => {

            if (data) {
                isReceivingUpdate.current = true;
                setCode(data.code);
                setSynced(true);
                hasRequestedSync.current = false; // Reset the flag

                setTimeout(() => {
                    isReceivingUpdate.current = false;
                }, 100);
            } else {
                console.log('❌ Invalid sync data received:', data);
            }
        };

        // Test listener to see if events are being received
        const handleTestEvent = (data) => {

            console.log('🔧 Test event received:', data);

        };

        // Remove existing listeners
        socket.off(ACTIONS.SYNC_CODE);
        socket.off('test-event');

        // Add listeners
        socket.on(ACTIONS.SYNC_CODE, handleReceiveCode);
        socket.on('test-event', handleTestEvent);




        // Request initial sync only once
        const requestSync = () => {
            if (socket.connected && !hasRequestedSync.current && !synced) {

                socket.emit('REQUEST_SYNC', { roomId });
                hasRequestedSync.current = true;

                // Fallback if no response
                setTimeout(() => {
                    if (!synced) {

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

        };
    }, [socketRef, roomId, synced]); // Include synced to prevent multiple requests

    // Reset when room changes
    useEffect(() => {
        hasRequestedSync.current = false;
        setSynced(false);

    }, [roomId]);

    // Debounced emit function
    const emitCodeChange = useCallback((newCode) => {
        if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
        }

        syncTimeoutRef.current = setTimeout(() => {
            if (socketRef?.current?.connected && !isReceivingUpdate.current && synced) {

                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    roomId,
                    code: newCode
                });
            } else {
                console.log('❌ Skipping emit (socket not connected or receiving update)');
            }
        }, 150);
    }, [socketRef, roomId, synced]);

    // Handle editor changes
    const handleEditorChange = useCallback((value) => {
        const newCode = value || '';

        if (isReceivingUpdate.current) {

            return;
        }


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





    return (
        <div className=' '>
            {/* Header */}
            <div className="my-2 text-white p-6 bg-[#1F2937] flex items-center justify-between rounded-lg">
                <h2 className="text-lg font-semibold">
                    Shared Code Editor

                </h2>
                <div>
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
                </div>

            </div>

            <div className=" p-4 rounded-xl h-screen overflow-y-auto border-gray-200 bg-[#1F2937] ">
                {/* Controls */}
                <div className="flex justify-between items-center gap-2 rounded-xl">

                    <div className='flex items-center '>
                        <h1 className='text-white text-xl tracking-wide bg-[#7D84B2] px-4 py-1 rounded-lg '>Editor</h1>
                    </div>
                    <div className='flex items-center gap-4'>
                        <LanguageDropdown language={language} setLanguage={setLanguage} />
                        <button
                            onClick={runCode}
                            disabled={isLoading}
                            className="bg-[#7D84B2] text-white px-4 py-2 rounded hover:[#9D84B2] disabled:opacity-50"
                        >
                            {isLoading ? '⏳ Running...' : <p className='flex items-center gap-1'> <Play className='w-3 h-3' /> Run Code</p>}
                        </button>

                    </div>



                </div>

                {/* Status */}
                <div className=" text-white text-sm font-thin  tracking-wide  px-6 rounded-sm   mb-2">
                    Code: {code.length} chars | Socket: {socketConnected ? 'ON' : 'OFF'} | Sync: {synced ? 'YES' : 'NO'}
                </div>

                {/* Editor */}
                <div className="w-full h-[calc(100vh-180px)] border rounded-lg overflow-y-auto">
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
        </div>

    );
}

export default SharedCodeEditor;