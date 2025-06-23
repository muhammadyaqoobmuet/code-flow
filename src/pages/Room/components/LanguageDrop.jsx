import React from 'react';

function LanguageDropdown({ language, setLanguage }) {
    const languages = ['JavaScript', 'Python', 'TypeScript', 'C++',];

    return (
        <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded bg-white"
        >
            {languages.map((lang) => (
                <option key={lang} value={lang}>
                    {lang}
                </option>
            ))}
        </select>
    );
}

export default LanguageDropdown;
