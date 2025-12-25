
import { cn } from '@/lib/utils';



export function PageContainer({ children, className }) {
    return (
        <main className={cn('flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12', className)}>
            {children}
        </main>
    );
}
