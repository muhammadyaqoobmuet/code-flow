
import { PageContainer } from "@/components/ui/page-container";
import { SiteHeader } from "@/components/ui/site-header";
import { JoinRoomForm } from "./JoinRoom";



export default function JoinRoom() {
    return (
        <>
            <SiteHeader />
            <PageContainer className="flex flex-col items-center justify-center">
                <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] opacity-20"></div>
                <JoinRoomForm />
            </PageContainer>
        </>
    );
}
