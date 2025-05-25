import React, { useState } from 'react';

const LANGUAGES = [
  { name: 'ABAP (SAP)', category: '*' },
  { name: 'ASP', category: '*' },
  { name: 'Assembler', category: '*' },
  { name: 'Brio', category: '+' },
  { name: 'C', category: '*' },
  { name: 'C++', category: '*' },
  { name: 'C#', category: '*' },
  { name: 'COBOL', category: '*' },
  { name: 'Cognos Impromptu Scripts', category: '+' },
  { name: 'Cross System Products (CSP)', category: '+' },
  { name: 'Cool:Gen/IEF', category: '*' },
  { name: 'Datastage', category: '' },
  { name: 'Excel', category: '*' },
  { name: 'Focus', category: '*' },
  { name: 'FoxPro', category: '' },
  { name: 'HTML', category: '*' },
  { name: 'J2EE', category: '*' },
  { name: 'Java', category: '*' },
  { name: 'JavaScript', category: '*' },
  { name: 'JCL', category: '*' },
  { name: 'LINC II', category: '' },
  { name: 'Lotus Notes', category: '*' },
  { name: 'Natural', category: '*' },
  { name: '.NET', category: '*' },
  { name: 'Oracle', category: '*' },
  { name: 'PACBASE', category: '*' },
  { name: 'Perl', category: '*' },
  { name: 'PL/I', category: '*' },
  { name: 'PL/SQL', category: '*' },
  { name: 'Powerbuilder', category: '*' },
  { name: 'REXX', category: '*' },
  { name: 'Sabretalk', category: '*' },
  { name: 'SAS', category: '*' },
  { name: 'Siebel', category: '*' },
  { name: 'SLOGAN', category: '*' },
  { name: 'SQL', category: '*' },
  { name: 'VB.NET', category: '*' },
  { name: 'Visual Basic', category: '*' },
  { name: 'Python', category: '*' },
].sort((a, b) => a.name.localeCompare(b.name));

const LanguageSelectModal = ({
  isOpen,
  onClose,
  selectedLanguages,
  onLanguagesChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLanguages = LANGUAGES.filter((lang) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleLanguageToggle = (language) => {
    if (selectedLanguages.includes(language)) {
      onLanguagesChange(selectedLanguages.filter((lang) => lang !== language));
    } else if (selectedLanguages.length < 3) {
      onLanguagesChange([...selectedLanguages, language]);
    }
  };

  const handleRemoveLanguage = (language) => {
    onLanguagesChange(selectedLanguages.filter((lang) => lang !== language));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">프로그래밍 언어 선택</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="언어 검색..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {selectedLanguages.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="text-sm text-gray-600 mb-2">
              선택된 언어 ({selectedLanguages.length}/3)
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedLanguages.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                  {lang}
                  <button
                    onClick={() => handleRemoveLanguage(lang)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {filteredLanguages.map((lang) => (
            <button
              key={lang.name}
              onClick={() => handleLanguageToggle(lang.name)}
              className={`p-3 text-left rounded-md transition-colors ${
                selectedLanguages.includes(lang.name)
                  ? 'bg-blue-100 border-blue-500 border-2'
                  : 'border border-gray-300 hover:bg-gray-50'
              } ${
                selectedLanguages.length >= 3 &&
                !selectedLanguages.includes(lang.name)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <div className="flex items-center">
                <span className="flex-grow">{lang.name}</span>
                {lang.category && (
                  <span className="text-xs text-gray-500">{lang.category}</span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectModal;
