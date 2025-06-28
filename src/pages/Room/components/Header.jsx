import React, { useRef } from 'react'

import { CodeFlowLogo } from '../../../components/ui/code-flow'
import { Button } from '../../../components/ui/button'
import { Code, LogOut } from 'lucide-react'
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
        <header
            className="relative z-20 p-4  bg-[#1F2937] text-white shadow-sm"

        >
            <nav className="flex justify-between items-center max-w-7xl mx-auto">
                <div
                    className="flex items-center space-x-2"

                >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                        <Code className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">
                        CodeFlow
                    </span>
                </div>

                {/* Center: Room Info */}
                <div
                    className="text-center leading-tight"

                >
                    <div onClick={handleCopy} className="text-sm font-medium cursor-copy hover:bg-gray-300/10">
                        Room ID: <span ref={textCopy} className="font-semibold text-ellipsis max-w-[20px]  text-white">{roomId || "loading id"}</span>
                    </div>
                    <div className="text-md text-gray-400">
                        Created By - <span className="font-normal">{username || "loading username"}</span>
                    </div>

                </div>

                {/* Right: Leave Button */}
                <div

                >


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
            </nav>
        </header>
    )
}

export default RoomHeader