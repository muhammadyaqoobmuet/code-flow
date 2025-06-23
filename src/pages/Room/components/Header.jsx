import React from 'react'
import { CodeFlowLogo } from '../../../components/ui/code-flow'
import { Button } from '../../../components/ui/button'
import { Github } from 'lucide-react'
import { Link } from 'react-router-dom'

const RoomHeader = ({ roomDetails = { id: '123', username: "jack" } }) => {
    return (
        <header className="sticky top-0 left-0 right-0 z-50 w-full bg-[#1F2937] text-white shadow-sm">
            <div className="flex justify-between items-center h-12 px-4 sm:px-6 md:px-16 py-8">
                {/* Left: Logo */}
                <CodeFlowLogo />

                {/* Right: Room Info + Button */}
                <div className="flex items-center space-x-4">
                    <div className="text-right leading-tight">
                        <div className="text-sm font-medium">
                            Room ID: <span className="font-semibold text-white">{roomDetails.id}</span>
                        </div>
                        <div className="text-md text-gray-400">
                            Username: <span className="font-normal">{roomDetails.username}</span>
                        </div>
                    </div>

                    <Button
                        variant="secondary"
                        size="sm"
                        className="text-sm px-3 py-1.5 flex items-center gap-1  bg-gray-700 text-white rounded-md shadow-sm transition-colors"
                        asChild
                    >
                        <Link to="/">
                            <Github className="w-4 h-4" />
                            Contribute
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default RoomHeader
