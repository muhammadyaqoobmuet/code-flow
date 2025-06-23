import { Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';


export function CodeFlowLogo({ size = 'default' }) {
    const textSizeClass = size === 'small' ? 'text-xl' : size === 'large' ? 'text-4xl' : 'text-3xl';
    const iconSize = size === 'small' ? 5 : size === 'large' ? 8 : 6;

    return (
        <Link to="/" className="flex items-center gap-2 group" aria-label="CodeFlow Home">
            <Terminal className={`h-${iconSize} w-${iconSize} text-primary group-hover:animate-pulse`} />
            <h1 className={`${textSizeClass} font-bold text-foreground group-hover:text-primary transition-colors`}>
                CodeFlow
            </h1>
        </Link>
    );
}
