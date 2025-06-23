import React from 'react'
import { CodeFlowLogo } from '../../../components/ui/code-flow'
import { Button } from '../../../components/ui/button'
import { Github } from 'lucide-react'
import { Link } from 'react-router-dom'

const RoomHeader = ({ roomDetails = { id: '123', username: "jack" } }) => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl sm:px-10 md:px-20 items-center justify-between">
                <CodeFlowLogo />
                <nav className="flex flex-1 justify-center items-center space-x-2">
                    <div className='flex flex-col items-start'>
                        <span className='text-sm font-semibold'>Room ID: {roomDetails.id}</span>
                        <span className='text-xs text-muted-foreground'>Username: {roomDetails.username}</span>
                    </div>

                </nav>
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/"><Github /> Contribute</Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default RoomHeader
