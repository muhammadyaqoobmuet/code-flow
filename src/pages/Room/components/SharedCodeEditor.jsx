import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import LanguageDropdown from './LanguageDrop';
import TabSwitcher from './TabSwitch';
import { Editor } from '@monaco-editor/react';
import { ACTIONS } from '../../../../actions';
import { Play, Wifi, WifiOff, RotateCcw, Code2, Activity, Terminal, Monitor } from 'lucide-react';

function OutputDisplay({ output, isLoading }) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-900/50 to-black/50 border-b border-green-300/10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
                    <span className="text-sm font-semibold text-green-400 tracking-wide">Console Output</span>
                </div>
                {isLoading && (
                    <div className="flex items-center gap-3 text-green-400">
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium">Executing</span>
                    </div>
                )}
            </div>
            <div className="flex-1 p-6 overflow-auto bg-gradient-to-br from-gray-900 to-black text-green-300 font-mono text-sm leading-7 whitespace-pre-wrap scrollbar-thin scrollbar-thumb-green-600/50 scrollbar-track-transparent">
                {isLoading ? (
                    <div className="flex items-center gap-4 text-green-400">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span>Running your code...</span>
                    </div>
                ) : (
                    output || <span className="text-green-400/60 italic">Ready to execute code...</span>
                )}
            </div>
        </div>
    );
}

function SharedCodeEditor({ socketRef, roomId }) {
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [synced, setSynced] = useState(false);

    // Mobile-specific states
    const [activeTab, setActiveTab] = useState('editor');

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
            return;
        }

        const socket = socketRef.current;

        const checkConnection = () => {
            const connected = socket.connected;
            setSocketConnected(connected);
        };

        checkConnection();
        const interval = setInterval(checkConnection, 400000);
        return () => clearInterval(interval);
    }, [socketRef]);

    // Socket event listeners
    useEffect(() => {
        if (!socketRef?.current || !roomId) {
            return;
        }

        const socket = socketRef?.current;

        const handleReceiveCode = (data) => {
            if (data) {
                isReceivingUpdate.current = true;
                setCode(data.code);
                setSynced(true);
                hasRequestedSync.current = false;

                setTimeout(() => {
                    isReceivingUpdate.current = false;
                }, 100);
            }
        };

        socket.off(ACTIONS.SYNC_CODE);
        socket.on(ACTIONS.SYNC_CODE, handleReceiveCode);

        const requestSync = () => {
            if (socket.connected && !hasRequestedSync.current && !synced) {
                socket.emit('REQUEST_SYNC', { roomId });
                hasRequestedSync.current = true;

                setTimeout(() => {
                    if (!synced) {
                        setSynced(true);
                        hasRequestedSync.current = false;
                    }
                }, 5000);
            }
        };

        requestSync();

        return () => {
            socket.off(ACTIONS.SYNC_CODE, handleReceiveCode);
        };
    }, [socketRef, roomId, synced]);

    useEffect(() => {
        hasRequestedSync.current = false;
        setSynced(false);
    }, [roomId]);

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
            }
        }, 150);
    }, [socketRef, roomId, synced]);

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

        // On mobile, switch to output tab when running code
        if (window.innerWidth < 1024) {
            setActiveTab('output');
        }

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
        editor.focus();
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
            {/* Clean Header */}
            <header className="flex-shrink-0 bg-white/5 backdrop-blur-xl border-b border-white/10">
                <div className="px-6 py-6 lg:px-8">
                    {/* Mobile Header */}
                    <div className="lg:hidden">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-r from-[#8D84B2] to-purple-600/50 rounded-xl shadow-lg">
                                    <Code2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">CodeFlow</h1>
                                    <p className="text-sm text-gray-400 mt-1">Collaborative Editor</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Indicators */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${socketConnected
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                    {socketConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                                    <span>{socketConnected ? 'Connected' : 'Offline'}</span>
                                </div>

                                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${synced
                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    }`}>
                                    <Activity className="w-4 h-4" />
                                    <span>{synced ? 'Synced' : 'Syncing'}</span>
                                </div>
                            </div>

                            {roomId && (
                                <div className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg">
                                    <span className="text-xs text-gray-400 font-mono">Room: {roomId.slice(0, 6)}...</span>
                                </div>
                            )}
                        </div>

                        {/* Mobile Tabs */}
                        <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 border border-gray-700/50">
                            <button
                                onClick={() => setActiveTab('editor')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'editor'
                                    ? 'bg-gradient-to-r bg-gradient-to-r from-[#8D84B2] to-purple-600/50 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Monitor className="w-4 h-4" />
                                <span>Editor</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('output')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'output'
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Terminal className="w-4 h-4" />
                                <span>Console</span>
                            </button>
                        </div>
                    </div>

                    {/* Desktop Header */}
                    <div className="hidden lg:flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-gradient-to-r from-[#8D84B2] to-purple-600/50 rounded-2xl shadow-lg">
                                    <Code2 className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl  font-bold text-white tracking-tight">CodeFlow</h1>
                                    <p className="text-gray-400 mt-1">Real-time collaborative coding environment</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-semibold ${socketConnected
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                    {socketConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                                    <span>{socketConnected ? 'Connected' : 'Disconnected'}</span>
                                </div>

                                <div className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-semibold ${synced
                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    }`}>
                                    <Activity className="w-4 h-4" />
                                    <span>{synced ? 'Synced' : 'Syncing...'}</span>
                                </div>
                            </div>

                            {roomId && (
                                <div className="px-4 py-2 bg-gray-800/30 border border-gray-700/30 rounded-xl backdrop-blur-sm">
                                    <span className="text-sm text-gray-300 font-mono">Room: {roomId.slice(0, 10)}...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden">
                {/* Mobile Layout */}
                <div className="lg:hidden h-full">
                    {activeTab === 'editor' && (
                        <div className="h-full flex flex-col">
                            {/* Mobile Editor Controls */}
                            <div className="flex-shrink-0 flex items-center justify-between gap-4 px-6 py-4 bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/30">
                                <LanguageDropdown language={language} setLanguage={setLanguage} />
                                <button
                                    onClick={runCode}
                                    disabled={isLoading}
                                    className="flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                                >
                                    {isLoading ? (
                                        <>
                                            <RotateCcw className="w-4 h-4 animate-spin" />
                                            <span>Running</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4" />
                                            <span>Run Code</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Mobile Editor */}
                            <div className="flex-1 overflow-hidden">
                                <Editor
                                    height="100%"
                                    language={language.toLowerCase()}
                                    theme="vs-dark"
                                    value={code}
                                    onChange={handleEditorChange}
                                    onMount={handleEditorDidMount}
                                    options={{
                                        fontSize: 14,
                                        fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        wordWrap: 'on',
                                        automaticLayout: true,
                                        lineNumbers: 'on',
                                        bracketPairColorization: { enabled: true },
                                        tabSize: 2,
                                        insertSpaces: true,
                                        padding: { top: 20, bottom: 20 },
                                        scrollbar: {
                                            verticalScrollbarSize: 8,
                                            horizontalScrollbarSize: 8
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'output' && (
                        <div className="h-full">
                            <OutputDisplay output={output} isLoading={isLoading} />
                        </div>
                    )}
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex gap-6 p-6 h-full">
                    {/* Desktop Editor */}
                    <div className="flex-1 flex flex-col bg-gray-800/20 backdrop-blur-xl rounded-2xl border border-gray-700/30 overflow-hidden shadow-2xl">
                        {/* Desktop Editor Controls */}
                        <div className="flex-shrink-0 flex items-center justify-between gap-4 px-8 py-6 bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/30">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 bg-gradient-to-r from-[#8D84B2] to-purple-600/50 px-4 py-2 rounded-xl font-bold text-white shadow-lg">
                                    <Monitor className="w-5 h-5" />
                                    <span>Code Editor</span>
                                </div>
                            </div>  

                            <div className="flex items-center gap-4">
                                <LanguageDropdown language={language} setLanguage={setLanguage} />
                                <button
                                    onClick={runCode}
                                    disabled={isLoading}
                                    className="flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                                >
                                    {isLoading ? (
                                        <>
                                            <RotateCcw className="w-5 h-5 animate-spin" />
                                            <span>Running...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5" />
                                            <span>Run Code</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Desktop Editor */}
                        <div className="flex-1 overflow-hidden">
                            <Editor
                                height="100%"
                                language={language.toLowerCase()}
                                theme="vs-dark"
                                value={code}
                                onChange={handleEditorChange}
                                onMount={handleEditorDidMount}
                                options={{
                                    fontSize: 15,
                                    fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
                                    minimap: { enabled: window.innerWidth > 1400 },
                                    scrollBeyondLastLine: false,
                                    wordWrap: 'on',
                                    automaticLayout: true,
                                    lineNumbers: 'on',
                                    bracketPairColorization: { enabled: true },
                                    tabSize: 2,
                                    insertSpaces: true,
                                    padding: { top: 24, bottom: 24 },
                                    lineHeight: 1.6,
                                }}
                            />
                        </div>
                    </div>

                    {/* Desktop Output */}
                    <div className="w-96 flex flex-col bg-gray-800/20 backdrop-blur-xl rounded-2xl border border-gray-700/30 overflow-hidden shadow-2xl">
                        <div className="flex-shrink-0 flex items-center justify-between gap-4 px-8 py-6 bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/30">
                            <div className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 rounded-xl font-bold text-white shadow-lg">
                                <Terminal className="w-5 h-5" />
                                <span>Console</span>
                            </div>
                            <button
                                onClick={() => setOutput('')}
                                className="text-gray-400 hover:text-white px-3 py-1 rounded-lg border border-gray-600/50 hover:border-gray-500/50 transition-colors text-sm"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <OutputDisplay output={output} isLoading={isLoading} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SharedCodeEditor;    