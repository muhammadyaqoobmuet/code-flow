import React from 'react';

function LanguageDropdown({ language, setLanguage }) {
    const languages = ['JavaScript', 'Python', 'TypeScript', 'cpp'];

    return (
        <div className="flex justify-center items-center py-4">
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-white text-sm px-4 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            >
                {languages.map((lang) => (
                    <option key={lang} value={lang} className="text-black">
                        {lang}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default LanguageDropdown;
