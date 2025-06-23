import React from 'react';

function ParticipantsList({ participants }) {


    return (
        <div className="space-y-3 mt-4 overflow-auto">
            {participants?.map((p, idx) => (
                <div
                    key={idx}
                    className='flex items-center justify-between p-2 rounded hover:bg-gray-100'
                >
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 text-sm font-bold flex items-center justify-center rounded-full mr-3">

                        </div>
                        <span className=''>{p?.username}</span>

                    </div>
                    <div>
                        {p.muted ? '🔇' : '⋯'}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ParticipantsList;