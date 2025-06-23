import ChatComponent from "./ChatComponent";

// Participants List Component
function ParticipantsList({ participants = [] }) {
    return (
        <div className="space-y-2">
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
                    <div key={participant.socketId} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/10 hover:bg-gradient-to-r  transition-colors">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {participant.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-white">
                                {participant.username}
                            </div>
                            <div className="text-xs text-gray-500">
                                {participant.socketId.substring(0, 8)}...
                            </div>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                ))
            )}
        </div>
    );
}

// Main Collaboration Panel Component
function CollaborationPanel({ clients, socket, roomId, currentUsername }) {
    return (
        <div className="w-[300px] bg-[#1F2937] p-6 shadow-inner h-full overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-white/50 py-1">
                Collaboration Panel
            </h3>

            {/* Scrollable Section */}
            <div className="flex-1 overflow-y-auto space-y-8">
                {/* Participants List */}
                <div>
                    <ParticipantsList participants={clients} />
                </div>

                {/* Chat Section */}
                <div className="pt-4 border-t border-gray-200">
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
