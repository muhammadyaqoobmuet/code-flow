import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, Edit3, Sparkles, Code, Mic, Github, ExternalLink, Heart, Twitter, Linkedin, Instagram, Globe } from 'lucide-react';
import { motion, useScroll, } from 'framer-motion';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

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
    const baseClasses = "relative overflow-hidden transition-all duration-200";
    const variantClasses = variant === 'primary'
        ? "bg-[#8D84B2] hover:bg-[#7D84B2] text-white shadow-lg hover:shadow-xl"
        : "border-2 border-current hover:bg-gray-900 hover:text-white backdrop-blur-sm";

    return (
        <motion.button
            className={`${baseClasses} ${variantClasses} ${className} px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={onClick}
            {...props}
        >
            {children}
            <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
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
                transition={{ duration: 0.3 }}
            />

            <div className="relative z-10">
                <motion.div
                    className="mb-6"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7db4eaae] to-indigo-600 flex items-center justify-center text-white shadow-lg">
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
                    className="mt-6 flex items-center text-[#7db4eaae] font-semibold"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    Learn more <ArrowRight className="w-4 h-4 ml-2" />
                </motion.div>
            </div>
        </motion.div>
    );
};

const SocialLink = ({ href, icon: Icon, label, isDark }) => {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`
                p-3 rounded-xl transition-all duration-300 backdrop-blur-sm
                ${isDark
                    ? 'bg-gray-800/50 hover:bg-gray-700/80 text-gray-300 hover:text-white border border-gray-700/50'
                    : 'bg-white/50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200/50'
                }
                shadow-lg hover:shadow-xl
            `}
            whileHover={{
                scale: 1.1,
                rotate: 5,
                boxShadow: isDark
                    ? "0 10px 30px -5px rgba(0, 0, 0, 0.3)"
                    : "0 10px 30px -5px rgba(0, 0, 0, 0.15)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            aria-label={label}
        >
            <Icon className="w-6 h-6" />
        </motion.a>
    );
};

export const Footer = ({ isDark }) => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            href: "https://yaqoobhalepoto.engineer", // Replace with actual portfolio URL
            icon: Globe,
            label: "Portfolio"
        },
        {
            href: "https://github.com/muhammadyaqoobmuet", // Replace with actual GitHub URL
            icon: Github,
            label: "GitHub"
        },
        {
            href: "https://twitter.com/jackub_halepoto", // Replace with actual Twitter URL
            icon: Twitter,
            label: "Twitter"
        },
        {
            href: "https://linkedin.com/in/yaqoob-halepoto", // Replace with actual LinkedIn URL
            icon: Linkedin,
            label: "LinkedIn"
        },
        {
            href: "https://instagram.com/yaqoob_halepotos", // Replace with actual Instagram URL
            icon: Instagram,
            label: "Instagram"
        }
    ];

    return (
        <motion.footer
            className={`relative mt-20 ${isDark ? 'border-t border-gray-800' : 'border-t border-gray-200'}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            {/* Background gradient */}
            <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-gray-900/50 to-transparent' : 'bg-gradient-to-t from-gray-50/50 to-transparent'}`} />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                    {/* Developer Info */}
                    <motion.div
                        className="text-center lg:text-left"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                            <motion.div
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7db4eaae] to-indigo-600 flex items-center justify-center text-white shadow-lg"
                                whileHover={{ scale: 1.1, rotate: 180 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <Code className="w-6 h-6" />
                            </motion.div>
                            <div>
                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Built by Developer Name
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Full Stack Developer
                                </p>
                            </div>
                        </div>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed max-w-md mx-auto lg:mx-0`}>
                            Passionate about creating seamless collaboration tools and bringing developers together through innovative technology.
                        </p>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="flex gap-4">
                            {socialLinks.map((link, index) => (
                                <motion.div
                                    key={link.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <SocialLink
                                        href={link.href}
                                        icon={link.icon}
                                        label={link.label}
                                        isDark={isDark}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Copyright & Love */}
                    <motion.div
                        className="text-center lg:text-right"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="flex items-center justify-center lg:justify-end gap-2 mb-2">
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Made with
                            </span>
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Heart className="w-4 h-4 text-red-500 fill-current" />
                            </motion.div>
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                and ☕
                            </span>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            © {currentYear} CodeFlow. All rights reserved.
                        </p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                            Open source • MIT License
                        </p>
                    </motion.div>
                </div>

                {/* Bottom border with gradient */}
                <motion.div
                    className="mt-12 pt-8 border-t border-gray-200/20"
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className="text-center">
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            CodeFlow - Where Ideas Meet Instant Collaboration
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default function Home() {
    const [isDark, setIsDark] = useState(true);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
        // Navigate to create room page
        console.log('Navigate to create room');
    };

    const handleJoinRoom = () => {
        // Navigate to join room page
        console.log('Navigate to join room');
    };

    const handleGithubClick = () => {
        window.open('https://github.com/your-username/codeflow', '_blank');
    };

    return (
        <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
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
                transition={{ type: "spring", stiffness: 150, damping: 30 }}
            />

            {/* Header */}
            <motion.header
                className="relative z-20 p-6"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <nav className="flex justify-between items-center max-w-7xl mx-auto">
                    <motion.div
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
                        className={`p-3 rounded-xl transition-all duration-300 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 mt-12">
                                Collaborate in <span className="text-white bg-[#8D84B2] px-2 rounded-sm">Real-Time</span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            <p className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Code together, talk together. CodeFlow brings your team closer with a shared code editor and built-in voice chat, no matter where you are.
                            </p>
                        </motion.div>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
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

                        {/* Hero Image */}
                        <ContainerScroll
                            titleComponent={
                                <h1 className="text-4xl font-semibold text-black dark:text-white">
                                    Where Ideas Meet <br />
                                    <span className="text-4xl md:text-[6rem] font-bold leading-none bg-gradient-to-r from-[#7DB4EA] via-blue-500 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                                        Instant Collaboration
                                    </span>
                                </h1>
                            }
                        >
                            <div
                            >
                                <div className="relative max-w-6xl mx-auto">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#7db4eaae]/20 to-purple-500/20 blur-3xl rounded-3xl" />
                                    <div className={`relative p-4 rounded-3xl backdrop-blur-sm ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200'} shadow-2xl`}>
                                        <img
                                            src="./image.png"
                                            alt="CodeFlow collaboration interface"
                                            className="w-full rounded-2xl shadow-xl"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            </div>
                        </ContainerScroll>
                    </section>

                    {/* Features Section */}
                    <section className="py-6">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3 }}
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
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
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

            {/* Footer */}
            <Footer isDark={isDark} />
        </div>
    );
}