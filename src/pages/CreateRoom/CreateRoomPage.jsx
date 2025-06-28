import React, { useState, useEffect } from 'react';
import { User, Edit3, ArrowRight, Code, ArrowLeft, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

// Simple UUID generator (simplified version)
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const GridBackground = ({ isDark = false }) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

const SimpleButton = ({ children, variant = 'primary', className = '', onClick, disabled = false, type = 'button', ...props }) => {
    const baseClasses = "transition-all duration-200 font-semibold flex items-center justify-center gap-3";
    const variantClasses = variant === 'primary'
        ? "bg-[#8D84B2] hover:bg-[#7D84B2] text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        : variant === 'ghost'
            ? "hover:bg-gray-100 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            : "border-2 border-current hover:bg-gray-900 hover:text-white backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <button
            type={type}
            className={`${baseClasses} ${variantClasses} ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

const SimpleInput = ({ label, placeholder, icon: Icon , error, register, name, isDark, disabled = false, value, ...props }) => {
    return (
        <div className="space-y-2">
            <label className={`text-sm font-medium leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {label}
            </label>
            <div className="relative">
                <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                    className={`
                        w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 text-lg
                        ${isDark
                            ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-[#8D84B2] focus:bg-gray-800/70'
                            : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-[#8D84B2] focus:bg-white/70'
                        }
                        backdrop-blur-sm shadow-lg focus:shadow-xl focus:outline-none
                        ${error ? 'border-red-500' : ''}
                        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
                    `}
                    placeholder={placeholder}
                    disabled={disabled}
                    value={value}
                    {...(register ? register(name, {
                        required: true,
                        minLength: name === 'username' ? 2 : 3,
                        maxLength: name === 'username' ? 50 : 60
                    }) : {})}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm font-medium text-red-500">
                    {error.type === "required" && `${label} is required`}
                    {error.type === "minLength" && `${label} must be at least ${name === 'username' ? 2 : 3} characters`}
                    {error.type === "maxLength" && `${label} too long`}
                </p>
            )}
        </div>
    );
};

export default function CreateRoom() {
    const [isDark, setIsDark] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const [roomId, setRoomId] = useState('');
    const router = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,

    } = useForm({
        defaultValues: {
            username: "",
            roomId: "",
        },
    });

    // Generate initial room ID on mount
    useEffect(() => {
        const initialId = generateUUID();
        setRoomId(initialId);
        setValue('roomId', initialId);
    }, [setValue]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleGoBack = () => {
        router('/')
    };

    const handleGenerateId = () => {
        const newId = generateUUID();
        setRoomId(newId);
        setValue('roomId', newId);
        showToast('New room ID generated!', 'success');
    };

    const onSubmit = async (values) => {
        if (!values.username || values.username.length < 2) {
            showToast('Please enter a valid username', 'error');
            return;
        }
        if (!values.roomId || values.roomId.length < 3) {
            showToast('Room ID is required', 'error');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call

        router(`/editor/${values.roomId}`, {
            state: {
                username: values.username
            }
        });
        showToast(`Room "${values.roomId}" created successfully!`, 'success');




    };



    return (
        <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <GridBackground isDark={isDark} />

            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg transition-all duration-300 ${toast.type === 'error'
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                        }`}
                >
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <header className="relative z-20 p-6">
                <nav className="flex justify-between items-center max-w-7xl mx-auto">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                            <Code className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'}`} />
                        </div>
                        <Link to='/' className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
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
            <main className="relative z-10 px-6 flex items-center justify-center min-h-[calc(100vh-120px)]">
                <div className="w-full max-w-md">
                    {/* Form Card */}
                    <div
                        className={`
                            relative p-8 rounded-3xl backdrop-blur-sm shadow-2xl
                            ${isDark ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white/50 border border-gray-200/50'}
                        `}
                    >
                        <div className="relative z-10">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7db4eaae] to-indigo-600 flex items-center justify-center text-white shadow-lg mx-auto mb-4">
                                    <Edit3 className="w-8 h-8" />
                                </div>

                                <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Create a New Room
                                </h1>

                                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Enter your username and a name for your new collaborative room.
                                </p>
                            </div>

                            {/* Form */}
                            <div className="space-y-6">
                                <SimpleInput
                                    label="Username"
                                    placeholder="Enter your username"
                                    icon={User}
                                    error={errors.username}
                                    register={register}
                                    name="username"
                                    isDark={isDark}
                                />

                                <div className="space-y-2">
                                    <label className={`text-sm font-medium leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Room ID
                                    </label>
                                    <div className="relative">
                                        <Edit3 className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <input
                                            className={`
                                                w-full pl-12 pr-32 py-4 rounded-xl border-2 transition-all duration-200 text-lg
                                                ${isDark
                                                    ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400'
                                                    : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500'
                                                }
                                                backdrop-blur-sm shadow-lg opacity-60 cursor-not-allowed
                                            `}
                                            value={roomId}
                                            disabled
                                            placeholder="auto-generated-id"
                                            {...register('roomId')}
                                        />
                                        <SimpleButton
                                            onClick={handleGenerateId}
                                            variant="ghost"
                                            className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-2 text-sm rounded-lg border-l-2 border-gray-300"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Generate
                                        </SimpleButton>
                                    </div>
                                    {errors.roomId && (
                                        <p className="text-sm font-medium text-red-500">
                                            Room ID is required
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <SimpleButton
                                        onClick={handleSubmit(onSubmit)}
                                        variant="primary"
                                        className="w-full px-8 py-4 rounded-xl text-lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Creating Room...
                                            </>
                                        ) : (
                                            <>
                                                Create & Join Room
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </SimpleButton>
                                </div>
                            </div>

                            {/* Helper Text */}
                            <div className="mt-6 text-center">
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Already have a room ID?
                                    <Link to="/join-room"

                                        className="ml-1 text-[#8D84B2] hover:text-[#7D84B2] font-medium transition-colors"
                                    >
                                        Join existing room
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