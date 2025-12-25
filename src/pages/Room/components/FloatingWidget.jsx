import React, { useState, useEffect } from 'react';
import { Leaf, Mic, MicOff, ZapOff } from 'lucide-react';

const FloatingWidget = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isMicActive, setIsMicActive] = useState(false);
    const [isHovered, setIsHovered] = useState(true);

    // Auto-hide functionality
    useEffect(() => {


    }, [isHovered, isVisible]);

    // Show widget on mouse movement near the area
    useEffect(() => {
        const handleMouseMove = (e) => {
            const { innerWidth, innerHeight } = window;
            const threshold = 100; // Distance from corner to trigger show

            if (
                e.clientX > innerWidth - threshold &&
                e.clientY > innerHeight - threshold
            ) {
                setIsVisible(true);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const toggleMic = () => {
        setIsMicActive(!isMicActive);
    };

    return (
        <div
            className={`
        fixed bottom-6 right-10 z-50
        transition-all duration-500 ease-in-out transform
        ${isVisible
                    ? 'translate-y-0 opacity-100 scale-100'
                    : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
                }
      `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="
        w-64 h-20 
        bg-gradient-to-r from-[#7db4eaae] via-[#8ea7c0ae] to-blue-200
        backdrop-blur-lg bg-opacity-90
        rounded-2xl shadow-lg hover:shadow-xl
        border border-yellow-300/30
        transition-all duration-300 ease-in-out
        hover:scale-105 hover:-translate-y-1
        flex items-center justify-between px-6
        group
      ">
                {/* Leaf Icon */}
                <div className="
          flex items-center justify-center
          w-12 h-12 rounded-full 
          bg-green-500/20 hover:bg-green-500/30
          transition-all duration-200
          cursor-pointer
          group-hover:scale-110
        ">
                    <ZapOff
                        size={24}
                        className="text-red-600 hover:text-red-700 transition-colors duration-200"
                    ></ZapOff>
                </div>

                {/* Center Divider */}
                <div className="h-8 w-px bg-black/40"></div>

                {/* Mic Icon */}
                <div
                    onClick={toggleMic}
                    className={`
            flex items-center justify-center
            w-12 h-12 rounded-full 
            transition-all duration-200 cursor-pointer
            group-hover:scale-110
            ${isMicActive
                            ? 'bg-red-500/20 hover:bg-red-500/30'
                            : 'bg-blue-500/20 hover:bg-blue-500/30'
                        }
          `}
                >
                    {isMicActive ? (
                        <Mic
                            size={24}
                            className="text-red-600 hover:text-red-700 transition-colors duration-200"
                        />
                    ) : (
                        <MicOff
                            size={24}
                            className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                        />
                    )}
                </div>

                {/* Subtle glow effect */}
                <div className="
          absolute inset-0 rounded-2xl
          bg-gradient-to-r from-red-200/50 to-red-200/50
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          -z-10 blur-xl
        "></div>
            </div>

            {/* Show indicator when hidden */}
            <div className={`
        absolute -top-2 -right-2
        w-4 h-4 bg-red-400 rounded-full
        animate-pulse
        transition-opacity duration-300
        ${isVisible ? 'opacity-0' : 'opacity-100'}
      `}></div>
        </div>
    );
};

export default FloatingWidget;