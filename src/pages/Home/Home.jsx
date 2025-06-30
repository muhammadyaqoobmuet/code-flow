import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, Edit3, Sparkles, Code, Mic, Github } from 'lucide-react';
import { motion, useScroll, } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Footer } from './Footer';

const GridBackground = ({ isDark = false }) => {
    return (
        <motion.div
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
        </motion.div>
    );
};

const AnimatedButton = ({ children, variant = 'primary', className = '', onClick, ...props }) => {
    const baseClasses = "relative overflow-hidden transition-all duration-150";
    const variantClasses = variant === 'primary'
        ? "bg-[#9D8BE6] hover:bg-[#7D84B2] text-white shadow-lg hover:shadow-xl"
        : "border-2 border-current hover:bg-gray-900 hover:text-white backdrop-blur-sm";

    return (
        <motion.button
            className={`${baseClasses} ${variantClasses} ${className} px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 600, damping: 30, duration: 0.1 }}
            onClick={onClick}
            {...props}
        >
            {children}
            <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 600, damping: 30, duration: 0.1 }}
            >
                <ArrowRight className="w-5 h-5" />
            </motion.div>
        </motion.button>
    );
};

const FeatureCard = ({ feature, index, isDark = false }) => {
    return (
        <motion.div
            className={`
                group relative p-8 rounded-2xl backdrop-blur-sm cursor-pointer
                ${isDark ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white/50 border border-gray-200/50'}
                shadow-xl
            `}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.3,
                delay: index * 0.05,
                type: "spring",
                stiffness: 300
            }}
            whileHover={{
                scale: 1.02,
                boxShadow: isDark
                    ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                    : "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
        >
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#7db4eaae]/20 to-purple-500/10 rounded-2xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
            />

            <div className="relative z-10">
                <motion.div
                    className="mb-6"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 600, damping: 30, duration: 0.1 }}
                >
                    <div className="w-16 h-16 rounded-full bg-[#9d8be6]  flex items-center justify-center text-white shadow-lg">
                        {feature.icon}
                    </div>
                </motion.div>

                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                </h3>

                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    {feature.description}
                </p>

                <motion.div
                    className="mt-6 flex items-center text-[#9d8be6] font-semibold"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 600, damping: 30, duration: 0.1 }}
                >
                    Learn more <ArrowRight className="w-4 h-4 ml-2" />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default function Home() {
    const [isDark, setIsDark] = useState(true);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isImageHovered, setIsImageHovered] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const features = [
        {
            title: "Shared Code Editor",
            description: "Experience seamless real-time coding with advanced syntax highlighting, intelligent autocomplete, and collaborative editing that keeps your team in perfect sync.",
            icon: <Code className="w-8 h-8" />
        },
        {
            title: "Integrated Voice Chat",
            description: "Communicate effortlessly with crystal-clear voice chat, spatial audio, and noise cancellation technology built right into your coding environment.",
            icon: <Mic className="w-8 h-8" />
        },
        {
            title: "AI Code Assistant",
            description: "Leverage advanced AI to get intelligent suggestions, automated code reviews, bug detection, and smart refactoring recommendations in real-time.",
            icon: <Sparkles className="w-8 h-8" />
        }
    ];

    const handleCreateRoom = () => {
        navigate('/create-room');
    };

    const handleJoinRoom = () => {
        navigate('/join-room');
    };

    const handleGithubClick = () => {
        window.open('https://github.com/muhammadyaqoobmuet/code-flow', '_blank');
    };

    const handleImageClick = () => {
        setClickCount(prev => prev + 1);
    };

    return (
        <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <GridBackground isDark={isDark} />

            {/* Mouse follower gradient */}
            <motion.div
                className="fixed pointer-events-none z-0 w-96 h-96 rounded-full blur-3xl opacity-20"
                style={{
                    background: isDark
                        ? 'radial-gradient(circle, rgba(125,180,234,0.4) 0%, rgba(99,102,241,0.2) 50%, transparent 100%)'
                        : 'radial-gradient(circle, rgba(125,180,234,0.3) 0%, rgba(99,102,241,0.1) 50%, transparent 100%)'
                }}
                animate={{
                    left: mousePosition.x - 192,
                    top: mousePosition.y - 192,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 40, duration: 0.1 }}
            />

            {/* Header */}
            <motion.header
                className="relative z-20 p-6"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                <nav className="flex justify-between items-center max-w-7xl mx-auto">
                    <motion.div
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 600, damping: 30, duration: 0.1 }}
                    >
                        <div className="w-10 h-10   rounded-xl flex items-center justify-center">
                            <Code className={`w-6 h-6 ${isDark ? 'text-white ' : 'text-black'}`} />
                        </div>
                        <span className={`text-2xl font-bold bg-gradient-to-r ${isDark ? 'text-[#FFFF]' : "text-black"}  `}>
                            CodeFlow
                        </span>
                    </motion.div>

                    <motion.button
                        onClick={() => setIsDark(!isDark)}
                        className={`p-3 rounded-xl transition-all duration-150 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 600, damping: 30, duration: 0.1 }}
                    >
                        {isDark ? '🌙' : '☀️'}
                    </motion.button>
                </nav>
            </motion.header>

            {/* Main Content */}
            <main className="relative z-10 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <section className="text-center py-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 mt-12">
                                Collaborate in <span className="text-white bg-[#9d8be6] px-2 rounded-sm">Real-Time</span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <p className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Code together, talk together. CodeFlow brings your team closer with a shared code editor and built-in voice chat, no matter where you are.
                            </p>
                        </motion.div>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                        >
                            <AnimatedButton
                                className=''
                                variant="primary"
                                onClick={handleCreateRoom}
                            >
                                <Edit3 className="w-6 h-6" />
                                Create a Room
                            </AnimatedButton>

                            <AnimatedButton
                                variant="outline"
                                className={isDark ? 'text-white border-white' : 'text-gray-900 border-gray-900'}
                                onClick={handleJoinRoom}
                            >
                                <Users className="w-6 h-6" />
                                Join a Room
                            </AnimatedButton>
                        </motion.div>

                        {/* Modern SaaS Hero Image Section */}
                        <motion.div
                            className="relative mb-20"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            {/* Gradient subtitle */}
                            <motion.div
                                className="mb-12"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                            >
                                <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                                    Where Ideas Meet{' '}
                                    <span className="bg-gradient-to-r from-[#9D8BE6] to-[#907be4] bg-clip-text text-transparent">
                                        Instant Collaboration
                                    </span>
                                </h2>
                            </motion.div>

                            {/* Modern image container */}
                            <motion.div
                                className="relative max-w-7xl mx-auto cursor-pointer"
                                onHoverStart={() => setIsImageHovered(true)}
                                onHoverEnd={() => setIsImageHovered(false)}
                                onClick={handleImageClick}
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.998 }}
                                transition={{ type: "spring", stiffness: 400, damping: 40, duration: 0.1 }}
                            >
                                {/* Floating elements for modern SaaS feel */}
                                <motion.div
                                    className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-[#7DB4EA] to-blue-500 rounded-full opacity-60 blur-sm"
                                    animate={{
                                        y: isImageHovered ? [-3, -8, -3] : [0, -5, 0],
                                        x: isImageHovered ? [1, 4, 1] : [0, 2, 0],
                                        rotate: clickCount * 45
                                    }}
                                    transition={{
                                        duration: isImageHovered ? 1 : 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                                <motion.div
                                    className="absolute -top-4 -right-8 w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full opacity-40 blur-sm"
                                    animate={{
                                        y: isImageHovered ? [2, 8, 2] : [0, 6, 0],
                                        x: isImageHovered ? [-2, -5, -2] : [0, -3, 0],
                                        scale: isImageHovered ? [1, 1.1, 1] : [1, 1.05, 1]
                                    }}
                                    transition={{
                                        duration: isImageHovered ? 1.5 : 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 0.5
                                    }}
                                />
                                <motion.div
                                    className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-[#8D84B2] to-purple-600 rounded-full opacity-50"
                                    animate={{
                                        y: isImageHovered ? [-2, -6, -2] : [0, -4, 0],
                                        rotate: isImageHovered ? [0, 180, 360] : [0, 90, 180],
                                        scale: clickCount > 5 ? [1, 1.3, 1] : [1, 1.1, 1]
                                    }}
                                    transition={{
                                        duration: isImageHovered ? 2 : 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1
                                    }}
                                />

                                {/* Main image container with modern styling */}
                                <div className="relative">
                                    {/* Glow effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-[#7DB4EA]/20 via-blue-500/20 to-indigo-600/20 blur-3xl rounded-3xl scale-105"
                                        animate={{
                                            opacity: isImageHovered ? 0.4 : 0.2,
                                            scale: isImageHovered ? 1.08 : 1.05
                                        }}
                                        transition={{ duration: 0.15 }}
                                    />

                                    {/* Image wrapper */}
                                    <motion.div
                                        className={`
                                            relative overflow-hidden rounded-2xl lg:rounded-3xl
                                            ${isDark ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'}
                                            backdrop-blur-xl shadow-2xl
                                            ring-1 ring-white/10
                                        `}
                                        animate={{
                                            borderColor: isImageHovered
                                                ? (isDark ? 'rgba(125, 180, 234, 0.3)' : 'rgba(125, 180, 234, 0.2)')
                                                : (isDark ? 'rgba(107, 114, 128, 0.5)' : 'rgba(229, 231, 235, 0.5)')
                                        }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {/* Top bar like browser/app */}
                                        <div className={`flex items-center gap-2 px-6 py-4 ${isDark ? 'bg-gray-700/50 border-b border-gray-600/50' : 'bg-gray-50/50 border-b border-gray-200/50'}`}>
                                            <div className="flex gap-2">
                                                <motion.div
                                                    className="w-3 h-3 rounded-full bg-red-500/70"
                                                    whileHover={{ scale: 1.15, backgroundColor: '#ef4444' }}
                                                    transition={{ type: "spring", stiffness: 600, damping: 30, duration: 0.1 }}
                                                />
                                                <motion.div
                                                    className="w-3 h-3 rounded-full bg-yellow-500/70"
                                                    whileHover={{ scale: 1.15, backgroundColor: '#eab308' }}
                                                    transition={{ type: "spring", stiffness: 600, damping: 30, duration: 0.1 }}
                                                />
                                                <motion.div
                                                    className="w-3 h-3 rounded-full bg-green-500/70"
                                                    whileHover={{ scale: 1.15, backgroundColor: '#22c55e' }}
                                                    transition={{ type: "spring", stiffness: 600, damping: 30, duration: 0.1 }}
                                                />
                                            </div>
                                            <motion.div
                                                className={`ml-4 px-3 py-1 rounded-md text-sm ${isDark ? 'bg-gray-600/50 text-gray-300' : 'bg-white/50 text-gray-600'}`}
                                                whileHover={{ scale: 1.02 }}
                                                transition={{ type: "spring", stiffness: 600, damping: 30, duration: 0.1 }}
                                            >
                                                codeflow.dev
                                            </motion.div>
                                        </div>

                                        {/* Main image */}
                                        <div className="relative overflow-hidden">
                                            <img
                                                src="./new.png"
                                                alt="CodeFlow collaboration interface"
                                                className="w-full h-auto object-cover"
                                                loading="lazy"
                                            />

                                            {/* Overlay gradient for depth */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"
                                                animate={{
                                                    opacity: isImageHovered ? 0.7 : 0.3
                                                }}
                                                transition={{ duration: 0.15 }}
                                            />

                                            {/* Click effect */}
                                            {clickCount > 0 && (
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-[#7DB4EA]/10 to-purple-500/10"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: [0, 1, 0], scale: [0.9, 1.05, 1] }}
                                                    transition={{ duration: 0.3 }}
                                                    key={clickCount}
                                                />
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Floating badges */}
                                    <motion.div
                                        className={`
                                            absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6
                                            px-4 py-2 rounded-full text-sm font-semibold
                                            ${isDark ? 'bg-gray-800/90 text-white border border-gray-700' : 'bg-white/90 text-gray-900 border border-gray-200'}
                                            backdrop-blur-xl shadow-lg
                                        `}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.7 }}
                                        whileHover={{
                                            scale: 1.05,
                                            rotate: [0, -3, 3, 0],
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        ⚡ Real-time sync
                                    </motion.div>

                                    <motion.div
                                        className={`
                                            absolute -top-4 -left-4 lg:-top-6 lg:-left-6
                                            px-4 py-2 rounded-full text-sm font-semibold
                                            ${isDark ? 'bg-gray-800/90 text-white border border-gray-700' : 'bg-white/90 text-gray-900 border border-gray-200'}
                                            backdrop-blur-xl shadow-lg
                                        `}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.8 }}
                                        whileHover={{
                                            scale: 1.05,
                                            rotate: [0, 3, -3, 0],
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        🎤 Voice chat enabled
                                    </motion.div>

                                    {/* Fun interaction indicator */}
                                    {clickCount > 3 && (
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl"
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{
                                                opacity: [0, 1, 0],
                                                scale: [0, 1.2, 0],
                                                rotate: [0, 180]
                                            }}
                                            transition={{ duration: 0.5 }}
                                            key={`fun-${clickCount}`}
                                        >
                                            {clickCount > 10 ? '🚀' : clickCount > 7 ? '✨' : '🎉'}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* Features Section */}
                    <section className="py-6">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.2 }}
                        >
                            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Why Choose CodeFlow?
                            </h2>
                            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Discover the powerful features that make CodeFlow the ultimate collaboration platform for developers
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {features.map((feature, index) => (
                                <FeatureCard
                                    key={feature.title}
                                    feature={feature}
                                    index={index}
                                    isDark={isDark}
                                />
                            ))}
                        </div>
                    </section>

                    {/* CTA Section */}
                    <motion.section
                        className="py-20 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className={`max-w-4xl mx-auto p-12 rounded-3xl backdrop-blur-sm ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200'} shadow-2xl`}>
                            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Help on Github
                            </h2>
                            <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Join our community on GitHub to contribute, report issues, or just follow along with the latest updates.
                            </p>
                            <div className='mx-auto flex justify-center items-center gap-4'>
                                <AnimatedButton
                                    variant="primary"
                                    onClick={handleGithubClick}
                                >
                                    <Github className="w-6 h-6" />
                                    Visit GitHub
                                </AnimatedButton>
                            </div>
                        </div>
                    </motion.section>
                </div>
            </main>
            <Footer isDark={isDark} />
        </div>
    );
}
