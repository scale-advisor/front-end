import React, { useState } from 'react';
import Modal from '../modal/Modal';
import Button from './Button';

export const LANGUAGES = [
  { name: 'ABAP (SAP)', category: '*', serverKey: 'ABAP' },
  { name: 'ASP', category: '*', serverKey: 'ASP' },
  { name: 'Assembler', category: '*', serverKey: 'ASSEMBLER' },
  { name: 'Brio', category: '+', serverKey: 'BRIO' },
  { name: 'C', category: '*', serverKey: 'C' },
  { name: 'C++', category: '*', serverKey: 'C_PLUS_PLUS' },
  { name: 'C#', category: '*', serverKey: 'C_SHARP' },
  { name: 'COBOL', category: '*', serverKey: 'COBOL' },
  {
    name: 'Cognos Impromptu Scripts',
    category: '+',
    serverKey: 'COGNOS_IMPROMPTU_SCRIPTS_PLUS',
  },
  {
    name: 'Cross System Products (CSP)',
    category: '+',
    serverKey: 'CROSS_SYSTEM_PRODUCTS_CSP_PLUS',
  },
  { name: 'Cool:Gen/IEF', category: '*', serverKey: 'COOL_GEN_IEF' },
  { name: 'Datastage', category: '', serverKey: 'DATASTAGE' },
  { name: 'Excel', category: '*', serverKey: 'EXCEL' },
  { name: 'Focus', category: '*', serverKey: 'FOCUS' },
  { name: 'FoxPro', category: '', serverKey: 'FOXPRO' },
  { name: 'HTML', category: '*', serverKey: 'HTML' },
  { name: 'J2EE', category: '*', serverKey: 'J2EE' },
  { name: 'Java', category: '*', serverKey: 'JAVA' },
  { name: 'JavaScript', category: '*', serverKey: 'JAVASCRIPT' },
  { name: 'JCL', category: '*', serverKey: 'JCL' },
  { name: 'LINC II', category: '', serverKey: 'LINC_II' },
  { name: 'Lotus Notes', category: '*', serverKey: 'LOTUS_NOTES' },
  { name: 'Natural', category: '*', serverKey: 'NATURAL' },
  { name: '.NET', category: '*', serverKey: 'DOT_NET' },
  { name: 'Oracle', category: '*', serverKey: 'ORACLE' },
  { name: 'PACBASE', category: '*', serverKey: 'PACBASE' },
  { name: 'Perl', category: '*', serverKey: 'PERL' },
  { name: 'PL/I', category: '*', serverKey: 'PL_I' },
  { name: 'PL/SQL', category: '*', serverKey: 'PL_SQL' },
  { name: 'Powerbuilder', category: '*', serverKey: 'POWERBUILDER' },
  { name: 'REXX', category: '*', serverKey: 'REXX' },
  { name: 'Sabretalk', category: '*', serverKey: 'SABRETALK' },
  { name: 'SAS', category: '*', serverKey: 'SAS' },
  { name: 'Siebel', category: '*', serverKey: 'SIEBEL' },
  { name: 'SLOGAN', category: '*', serverKey: 'SLOGAN' },
  { name: 'SQL', category: '*', serverKey: 'SQL' },
  { name: 'VB.NET', category: '*', serverKey: 'VB_NET' },
  { name: 'Visual Basic', category: '*', serverKey: 'VISUAL_BASIC' },
  { name: 'Python', category: '*', serverKey: 'PYTHON' },
].sort((a, b) => a.name.localeCompare(b.name));

const LanguageSelect = ({
  isOpen,
  onClose,
  onSubmit,
  enableAdvancedMode = false,
  initialSelectedLanguages = [],
  maxLanguages = 3,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState(
    initialSelectedLanguages,
  );
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [languageRatios, setLanguageRatios] = useState({});
  const [selectedServerKeys, setSelectedServerKeys] = useState([]);

  const filteredLanguages = LANGUAGES.filter((lang) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleLanguageToggle = (language) => {
    if (selectedLanguages.includes(language.name)) {
      setSelectedLanguages(
        selectedLanguages.filter((lang) => lang !== language.name),
      );
      if (isAdvanced) {
        const { [language.name]: _, ...rest } = languageRatios;
        setLanguageRatios(rest);
      }
      setSelectedServerKeys(
        selectedServerKeys.filter((key) => key !== language.serverKey),
      );
    } else if (selectedLanguages.length < maxLanguages) {
      setSelectedLanguages([...selectedLanguages, language.name]);
      if (isAdvanced) {
        setLanguageRatios({ ...languageRatios, [language.name]: 0 });
      }
      setSelectedServerKeys([...selectedServerKeys, language.serverKey]);
    }
  };

  const handleRemoveLanguage = (language) => {
    setSelectedLanguages(selectedLanguages.filter((lang) => lang !== language));
    if (isAdvanced) {
      const { [language]: _, ...rest } = languageRatios;
      setLanguageRatios(rest);
    }
    setSelectedServerKeys(
      selectedServerKeys.filter((key) => key !== language.serverKey),
    );
  };

  const handleRatioChange = (language, value) => {
    const numValue = Number(value) || 0;
    setLanguageRatios({ ...languageRatios, [language]: numValue });
  };

  const getTotalRatio = () =>
    Object.values(languageRatios).reduce((sum, ratio) => sum + ratio, 0);

  const isValid = isAdvanced
    ? getTotalRatio() === 100 && selectedLanguages.length > 0
    : selectedLanguages.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="프로그래밍 언어 선택">
      <div className="space-y-4">
        {enableAdvancedMode && (
          <div className="flex gap-4 mb-4">
            <label
              className={`flex items-center px-4 py-3 rounded-lg border cursor-pointer transition-all w-1/2 ${
                !isAdvanced
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="settingMode"
                checked={!isAdvanced}
                onChange={() => setIsAdvanced(false)}
                className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-0"
              />
              <span className="ml-3 text-base text-gray-700">일반 설정</span>
            </label>
            <label
              className={`flex items-center px-4 py-3 rounded-lg border cursor-pointer transition-all w-1/2 ${
                isAdvanced
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="settingMode"
                checked={isAdvanced}
                onChange={() => setIsAdvanced(true)}
                className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-0"
              />
              <span className="ml-3 text-base text-gray-700">고급 설정</span>
            </label>
          </div>
        )}

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
              선택된 언어 ({selectedLanguages.length}/{maxLanguages})
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedLanguages.map((lang) => (
                <div key={lang} className="flex items-center gap-2">
                  <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm pl-5 py-1 rounded-full">
                    {lang}
                    <Button
                      variant="ghost"
                      onClick={() => handleRemoveLanguage(lang)}
                      className="ml-1 p-0.5"
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
                    </Button>
                  </span>
                  {isAdvanced && (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={languageRatios[lang] || 0}
                      onChange={(e) => handleRatioChange(lang, e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                    />
                  )}
                </div>
              ))}
            </div>
            {isAdvanced && (
              <div className="mt-2 text-sm font-medium">
                총 비율:{' '}
                <span
                  className={
                    getTotalRatio() === 100 ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {getTotalRatio()}%
                </span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {filteredLanguages.map((lang) => (
            <button
              key={lang.name}
              onClick={() => handleLanguageToggle(lang)}
              className={`p-3 text-left rounded-md transition-colors ${
                selectedLanguages.includes(lang.name)
                  ? 'bg-blue-100 border-blue-500 border-2'
                  : 'border border-gray-300 hover:bg-gray-50'
              } ${
                selectedLanguages.length >= maxLanguages &&
                !selectedLanguages.includes(lang.name)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              disabled={
                selectedLanguages.length >= maxLanguages &&
                !selectedLanguages.includes(lang.name)
              }
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
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            onSubmit(selectedServerKeys);
            onClose();
          }}
          disabled={!isValid}
        >
          {!isValid ? '언어를 선택해주세요' : '확인'}
        </Button>
      </div>
    </Modal>
  );
};

export default LanguageSelect;
