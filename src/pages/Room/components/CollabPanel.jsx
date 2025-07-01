import ChatComponent from "./ChatComponent";
import ParticipantsList from "./ParticipantList";

// Participants List Component


// Main Collaboration Panel Component
function CollaborationPanel({ clients, socket, roomId, currentUsername }) {
    return (
        <div className="p-4 max-w-screen  md:p-6 bg-[#1F2937] shadow-inner h-full flex flex-col w-full md:max-w-[500px]">
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-white/50 pb-2">
                Collaboration Panel
            </h3>

            {/* Scrollable Section */}
            <div className="flex-1 overflow-y-auto space-y-8">
                {/* Participants List */}
                <ParticipantsList participants={clients} />

                {/* Chat Section */}
                <div className="pt-4 border-t border-gray-600">
                    <ChatComponent
                        socket={socket}
                        roomId={roomId}
                        currentUsername={currentUsername}
                    />
                </div>
            </div>
        </div>
    );
}

export default CollaborationPanel;
