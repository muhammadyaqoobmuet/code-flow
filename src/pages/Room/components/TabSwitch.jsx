import React from 'react';

function TabSwitcher({ activeTab, setActiveTab }) {
    return (
        <div className="flex border-b border-gray-200">
            {['Editor', 'AI Suggestions'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 -mb-px ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600 font-semibold' : 'text-gray-500'
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}

export default TabSwitcher;