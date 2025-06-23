import { ArrowRight, Users, Edit3 } from 'lucide-react';



import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/ui/site-header';
import { PageContainer } from '@/components/ui/page-container';



export default function Home() {
    return (
        <>
            <SiteHeader />
            
            <PageContainer className="flex flex-col items-center justify-center text-center">
                <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] opacity-20"></div>
                <div className="absolute left-0 top-0 -z-10 h-1/3 w-full bg-gradient-to-b from-primary/10 to-transparent"></div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 mt-12 font-headline animate-fade-in-up delay-100 ">
                    Collaborate in <span className="bg-[#7db4eaae] px-2 rounded-sm">Real-Time</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-fade-in-up delay-200">
                    Code together, talk together. CodeFlow brings your team closer with a shared code editor and built-in voice chat, no matter where you are.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-up delay-300">
                    <Button size="lg" className="shadow-soft hover:shadow-soft-lg transition-shadow bg-[#7DB4EA] ">
                        <Link className='flex items-center' to="/create-room">
                            <Edit3 className="mr-2 h-5 w-5" /> Create a Room
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="shadow-soft hover:shadow-soft-lg transition-shadow">
                        <Link to="/join-room">
                            <Users className="mr-2 h-5 w-5 " /> Join a Room <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>

                <div className="w-full max-w-6xl p-2 bg-card/50 backdrop-blur-sm  rounded-xl shadow-soft-lg animate-fade-in-up delay-400">
                    <img
                        src="./image.png"
                        alt="CodeFlow collaboration interface mockup"

                        className="rounded-lg object-cover"
                        loading='lazy'
                    />
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                    {[
                        { title: "Shared Code Editor", description: "Experience seamless real-time coding with syntax highlighting and a clean, light interface.", icon: <Edit3 className="h-8 w-8 text-primary" /> },
                        { title: "Integrated Voice Chat", description: "Communicate effortlessly with crystal-clear voice chat, right within your coding environment.", icon: <Users className="h-8 w-8 text-primary" /> },
                        { title: "AI Code Assistant", description: "Get intelligent suggestions for bugs, errors, and formatting to elevate your code quality.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg> }
                    ].map((feature, index) => (
                        <div key={feature.title} className={`p-6 bg-card/50 backdrop-blur-sm border rounded-lg shadow-soft text-left animate-fade-in-up delay-${500 + index * 100}`}>
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </PageContainer>
        </>
    );
}
