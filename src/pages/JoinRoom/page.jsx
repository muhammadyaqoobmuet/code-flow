import React, { useState } from 'react';

import { User, KeyRound, ArrowRight, Code, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

// Mock room existence check
const MOCK_EXISTING_ROOM_IDS = ["project-phoenix-meeting-abc123", "study-group-xyz789"];

const GridBackground = ({ isDark = false }) => {
    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
        >
            <div
                className={`absolute inset-0 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
                style={{
                    backgroundImage: `
                        linear-gradient(${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
                        linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}
            />
            <div
                className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-indigo-900/20' : 'bg-gradient-to-br from-blue-50/80 via-purple-50/40 to-indigo-50/80'}`}
            />
        </div>
    );
};

const AnimatedButton = ({ children, variant = 'primary', className = '', onClick, disabled = false, type = 'button', ...props }) => {
    const baseClasses = "relative overflow-hidden transition-all duration-200";
    const variantClasses = variant === 'primary'
        ? "bg-[#8D84B2] hover:bg-[#7D84B2] text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        : "border-2 border-current hover:bg-gray-900 hover:text-white backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <button
            type={type}
            className={`${baseClasses} ${variantClasses} ${className} px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3`}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

const AnimatedInput = ({ label, placeholder, error, register, name, isDark, ...props }) => {
    return (
        <div
            className="space-y-2"

        >
            <label className={`text-sm font-medium leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {label}
            </label>
            <div className="relative">
                <input
                    className={`
                        w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 text-lg
                        ${isDark
                            ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-[#8D84B2] focus:bg-gray-800/70'
                            : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-[#8D84B2] focus:bg-white/70'
                        }
                        backdrop-blur-sm shadow-lg focus:shadow-xl focus:outline-none
                        ${error ? 'border-red-500' : ''}
                    `}
                    placeholder={placeholder}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    {...register(name, {
                        required: true,
                        minLength: name === 'username' ? 2 : 3,
                        maxLength: name === 'username' ? 50 : 60
                    })}
                    {...props}
                />
            </div>
            {error && (
                <p
                    className="text-sm font-medium text-red-500"

                >
                    {error.type === "required" && `${label} is required`}
                    {error.type === "minLength" && `${label} must be at least ${name === 'username' ? 2 : 3} characters`}
                    {error.type === "maxLength" && `${label} too long`}
                </p>
            )}
        </div>
    );
};

export default function JoinRoom() {
    const [isDark, setIsDark] = useState(true);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            username: "",
            roomId: "",
        },
    });

   

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleGoBack = () => {
        window.history.back();
    };

    async function onSubmit(values) {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Validate inputs
        if (!values.username || values.username.length < 2) {
            showToast("Invalid Username", 'error');
            setIsSubmitting(false);
            return;
        }

        if (!values.roomId || values.roomId.length < 3) {
            showToast(`The room with ID "${values.roomId}" does not exist. Please check the ID and try again.`, 'error');
            setIsSubmitting(false);
            return;
        }

        // Mock room existence check
        if (!MOCK_EXISTING_ROOM_IDS.includes(values.roomId) && !values.roomId.includes('-')) {
            showToast(`Attempting to join room "${values.roomId}".`, 'success');
            setIsSubmitting(false);
            return;
        }

        showToast("Joining Room...", 'success');

        // Store username in memory (since localStorage isn't available)
        // In a real app, you'd navigate to the editor here
        setTimeout(() => {
            showToast(`Successfully joined room "${values.roomId}" as ${values.username}!`, 'success');
            setIsSubmitting(false);
        }, 1500);
    }

    return (
        <div className={`min-h-screen relative overflow-hidden transition-colors duration-500  ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <GridBackground isDark={isDark} />

            {/* Mouse follower gradient */}
            <div
                className="fixed pointer-events-none z-0 w-96 h-96 rounded-full blur-3xl opacity-20"
                style={{
                    background: isDark
                        ? 'radial-gradient(circle, rgba(125,180,234,0.4) 0%, rgba(99,102,241,0.2) 50%, transparent 100%)'
                        : 'radial-gradient(circle, rgba(125,180,234,0.3) 0%, rgba(99,102,241,0.1) 50%, transparent 100%)'
                }}

            />

            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg ${toast.type === 'error'
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                        }`}

                >
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <header
                className="relative z-20 p-6"

            >
                <nav className="flex justify-between items-center max-w-7xl mx-auto">
                    <div
                        className="flex items-center space-x-2"

                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                            <Code className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'}`} />
                        </div>
                        <Link to="/" className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                            CodeFlow
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleGoBack}
                            className={`p-3 rounded-xl transition-all duration-300 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}

                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => setIsDark(!isDark)}
                            className={`p-3 rounded-xl transition-all duration-300 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}

                        >
                            {isDark ? '🌙' : '☀️'}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="relative z-10 px-6 flex items-center justify-center min-h-[calc(100vh-120px) ]">
                <div className="w-full max-w-md">
                    {/* Form Card */}
                    <div
                        className={`
                            relative p-8 rounded-3xl backdrop-blur-sm shadow-2xl
                            ${isDark ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white/50 border border-gray-200/50'}
                        `}

                    >
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-[#7db4eaae]/20 to-purple-500/10 rounded-3xl opacity-0"
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.1 }}
                        />

                        <div className="relative z-10">
                            {/* Header */}
                            <div
                                className="text-center mb-8"

                            >
                                <div
                                    className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7db4eaae] to-indigo-600 flex items-center justify-center text-white shadow-lg mx-auto mb-4"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <KeyRound className="w-8 h-8" />
                                </div>

                                <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Join an Existing Room
                                </h1>

                                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Enter your username and the ID of the room you want to join.
                                </p>
                            </div>

                            {/* Form */}
                            <div className="space-y-6">
                                <AnimatedInput
                                    label="Username"
                                    placeholder="Enter your username"
                                    icon={User}
                                    error={errors.username}
                                    register={register}
                                    name="username"
                                    isDark={isDark}
                                />

                                <AnimatedInput
                                    label="Room ID"
                                    placeholder="Enter Room ID"
                                    icon={KeyRound}
                                    error={errors.roomId}
                                    register={register}
                                    name="roomId"
                                    isDark={isDark}
                                />

                                <div

                                >
                                    <AnimatedButton
                                        onClick={handleSubmit(onSubmit)}
                                        variant="primary"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div
                                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
                                                />
                                                Joining...
                                            </>
                                        ) : (
                                            <>
                                                Join Room
                                                <div
                                                    whileHover={{ x: 4 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                >
                                                    <ArrowRight className="w-5 h-5" />
                                                </div>
                                            </>
                                        )}
                                    </AnimatedButton>
                                </div>
                            </div>

                            {/* Helper Text */}
                            <div
                                className="mt-6 text-center"

                            >
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Don't have a room ID?
                                    <Link to="/create-room"
                                        className="ml-1 text-[#8D84B2] hover:text-[#7D84B2] font-medium transition-colors"
                                    >
                                        Create a new room
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}