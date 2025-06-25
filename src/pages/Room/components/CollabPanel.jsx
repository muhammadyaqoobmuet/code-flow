import ChatComponent from "./ChatComponent";

// Participants List Component
function ParticipantsList({ participants = [] }) {
    return (
        <div className="space-y-4">
            <div className="text-sm font-medium text-white mb-3">
                Online ({participants.length})
            </div>

            {participants.length === 0 ? (
                <div className="text-center text-white py-8">
                    <div className="text-2xl mb-2">👥</div>
                    <div>No participants yet</div>
                </div>
            ) : (
                participants.map((participant) => (
                    <div
                        key={participant.socketId}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/10 hover:bg-gradient-to-r from-blue-500/20 to-purple-500/20 transition-all"
                    >
                        <div className="relative w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {participant.username.charAt(0).toUpperCase()}
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-gray-800 rounded-full" />
                        </div>

                        <div className="text-white text-sm font-medium truncate">
                            {participant.username}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

// Main Collaboration Panel Component
function CollaborationPanel({ clients, socket, roomId, currentUsername }) {
    return (
        <div className="p-4 max-w-screen  md:p-6 bg-[#1F2937] shadow-inner h-full flex flex-col w-full md:max-w-[300px]">
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
