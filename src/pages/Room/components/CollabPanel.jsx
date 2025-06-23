import ParticipantsList from "./ParticipantList";

function CollaborationPanel({ clients }) {
    return (
        <div className="w-[300px] bg-white p-6 shadow-inner   h-full overflow-auto ">
            <h3 className="text-lg font-semibold mb-4">Collaboration Panel</h3>
            <div className="border-b mb-2">
                <button className="pb-2 border-b-2 border-blue-600 text-blue-600">
                    Participants ({clients?.length || 0})
                </button>
                <button className="ml-4 text-gray-500">💬 Chat</button>
            </div>

            {/* Only one ParticipantsList component */}
            <ParticipantsList participants={clients} />

            <p className="text-xs text-gray-400 mt-6">Voice chat features are simulated.</p>
        </div>
    );
}

export default CollaborationPanel;