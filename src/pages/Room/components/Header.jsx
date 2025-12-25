import React, { useRef } from 'react'

import { CodeFlowLogo } from '../../../components/ui/code-flow'
import { Button } from '../../../components/ui/button'
import { Code, LogOut, Copy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

const RoomHeader = ({ roomId, username }) => {
    const textCopy = useRef(null)

    const handleCopy = () => {
        if (textCopy.current) {
            navigator.clipboard.writeText(textCopy.current.innerText)
        }
        toast.success('Room ID copied to clipboard!')
    }

    return (
        <header className="relative z-20 p-3 sm:p-4 bg-[#1F2937] text-white shadow-sm">
            <nav className="max-w-7xl mx-auto">
                {/* Mobile Layout - Stacked */}
                <div className="flex flex-col space-y-3 sm:hidden">
                    {/* Top row: Logo and Leave button */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                <Code className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">
                                CodeFlow
                            </span>
                        </div>

                        <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs px-3 py-1.5 flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition-all duration-300"
                            asChild
                        >
                            <Link to="/">
                                <LogOut className="w-3 h-3" />
                                Leave
                            </Link>
                        </Button>
                    </div>

                    {/* Bottom row: Room info centered */}
                    <div className="text-center space-y-1">
                        <div
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1 text-sm font-medium cursor-pointer hover:bg-gray-300/10 px-2 py-1 rounded transition-colors"
                        >
                            <span>Room ID:</span>
                            <span
                                ref={textCopy}
                                className="font-semibold text-white break-all"
                            >
                                {roomId || "loading id"}
                            </span>
                            <Copy className="w-3 h-3 ml-1 opacity-70" />
                        </div>
                        <div className="text-sm text-gray-400">
                            Created By - <span className="font-normal text-gray-300">{username || "loading username"}</span>
                        </div>
                    </div>
                </div>

                {/* Tablet Layout - 2 columns */}
                <div className="hidden sm:flex md:hidden items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center">
                            <Code className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">
                            CodeFlow
                        </span>
                    </div>

                    {/* Right: Room info and Leave button */}
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <div
                                onClick={handleCopy}
                                className="inline-flex items-center gap-1 text-sm font-medium cursor-pointer hover:bg-gray-300/10 px-2 py-1 rounded transition-colors"
                            >
                                <span>Room ID:</span>
                                <span
                                    ref={textCopy}
                                    className="font-semibold text-white"
                                >
                                    {roomId || "loading id"}
                                </span>
                                <Copy className="w-3 h-3 ml-1 opacity-70" />
                            </div>
                            <div className="text-sm text-gray-400">
                                Created By - <span className="font-normal text-gray-300">{username || "loading username"}</span>
                            </div>
                        </div>

                        <Button
                            variant="secondary"
                            size="sm"
                            className="text-sm px-4 py-2 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-sm transition-all duration-300 whitespace-nowrap"
                            asChild
                        >
                            <Link to="/">
                                <LogOut className="w-4 h-4" />
                                Leave
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Desktop Layout - 3 columns */}
                <div className="hidden md:flex items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex items-center space-x-3 flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                            <Code className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">
                            CodeFlow
                        </span>
                    </div>

                    {/* Center: Room Info */}
                    <div className="text-center flex-grow max-w-md mx-8">
                        <div
                            onClick={handleCopy}
                            className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer hover:bg-gray-300/10 px-3 py-2 rounded-lg transition-colors"
                        >
                            <span>Room ID:</span>
                            <span
                                ref={textCopy}
                                className="font-semibold text-white break-all"
                            >
                                {roomId || "loading id"}
                            </span>
                            <Copy className="w-4 h-4 opacity-70" />
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                            Created By - <span className="font-normal text-gray-300">{username || "loading username"}</span>
                        </div>
                    </div>

                    {/* Right: Leave Button */}
                    <div className="flex-shrink-0">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="text-sm px-4 py-2 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-sm transition-all duration-300"
                            asChild
                        >
                            <Link to="/">
                                <LogOut className="w-4 h-4" />
                                Leave
                            </Link>
                        </Button>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default RoomHeader