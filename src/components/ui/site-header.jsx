import { Link } from 'react-router-dom';


import { Github } from 'lucide-react';
import { CodeFlowLogo } from './code-flow';
import { Button } from './button';

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl sm:px-10 md:px-20 items-center justify-between">
                <CodeFlowLogo />
                <nav className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/create-room">Create Room</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/join-room">Join Room</Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild aria-label="GitHub Repository">
                        <a to="https://github.com/FirebaseExtended/ai-prototyping-framework" target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                        </a>
                    </Button>
                </nav>
            </div>
        </header>
    );
}
