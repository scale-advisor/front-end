import React, { useState, useEffect } from 'react';
import Modal from '../modal/Modal';
import Button from './Button';
import { LANGUAGES } from '@/constants/languages';

const LanguageSelect = ({
  isOpen,
  onClose,
  onSubmit,
  enableAdvancedMode = false,
  initialSelectedLanguages = [],
  initialRates = {},
  maxLanguages = 3,
  totalFP = 0,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [languageRatios, setLanguageRatios] = useState({});
  const [selectedServerKeys, setSelectedServerKeys] = useState([]);

  // 모달이 열릴 때마다 현재 값으로 설정
  useEffect(() => {
    if (isOpen) {
      // 선택된 언어 설정
      const languages = initialSelectedLanguages
        .map((serverKey) => {
          const language = LANGUAGES.find((l) => l.serverKey === serverKey);
          return language?.name;
        })
        .filter(Boolean);

      setSelectedLanguages(languages);
      setSelectedServerKeys(initialSelectedLanguages);
      setIsAdvanced(false); // 항상 일반 설정으로 시작

      // 비율 초기화
      if (enableAdvancedMode) {
        const ratios = {};
        languages.forEach((lang) => {
          const serverKey = LANGUAGES.find((l) => l.name === lang)?.serverKey;
          if (serverKey) {
            ratios[lang] = initialRates[serverKey] || 0;
          }
        });
        setLanguageRatios(ratios);
      }
    }
  }, [isOpen, initialSelectedLanguages, initialRates, enableAdvancedMode]);

  const filteredLanguages = LANGUAGES.filter((lang) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleLanguageToggle = (language) => {
    if (selectedLanguages.includes(language.name)) {
      setSelectedLanguages(
        selectedLanguages.filter((lang) => lang !== language.name),
      );
      setSelectedServerKeys(
        selectedServerKeys.filter((key) => key !== language.serverKey),
      );
      if (isAdvanced) {
        const { [language.name]: _, ...rest } = languageRatios;
        setLanguageRatios(rest);
      }
    } else if (selectedLanguages.length < maxLanguages) {
      setSelectedLanguages([...selectedLanguages, language.name]);
      setSelectedServerKeys([...selectedServerKeys, language.serverKey]);
      if (isAdvanced) {
        // 새로운 언어 추가시 남은 비율을 균등하게 분배
        const currentTotal = Object.values(languageRatios).reduce(
          (sum, rate) => sum + rate,
          0,
        );
        const remainingRatio = 100 - currentTotal;
        const newRatio = remainingRatio > 0 ? remainingRatio : 0;
        setLanguageRatios({ ...languageRatios, [language.name]: newRatio });
      }
    }
  };

  const handleRemoveLanguage = (language) => {
    const targetLanguage = LANGUAGES.find((l) => l.name === language);
    if (targetLanguage) {
      setSelectedLanguages(
        selectedLanguages.filter((lang) => lang !== language),
      );
      setSelectedServerKeys(
        selectedServerKeys.filter((key) => key !== targetLanguage.serverKey),
      );
      if (isAdvanced) {
        const { [language]: removedRatio, ...rest } = languageRatios;
        // 제거된 언어의 비율을 나머지 언어들에게 균등하게 분배
        const remainingLanguages = Object.keys(rest).length;
        if (remainingLanguages > 0) {
          const redistributeRatio = removedRatio / remainingLanguages;
          const newRatios = Object.fromEntries(
            Object.entries(rest).map(([lang, ratio]) => [
              lang,
              ratio + redistributeRatio,
            ]),
          );
          setLanguageRatios(newRatios);
        } else {
          setLanguageRatios({});
        }
      }
    }
  };

  const handleRatioChange = (language, value) => {
    const numValue = Math.min(Math.max(Number(value) || 0, 0), 100);
    setLanguageRatios({ ...languageRatios, [language]: numValue });
  };

  const getTotalRatio = () =>
    Object.values(languageRatios).reduce((sum, ratio) => sum + ratio, 0);

  const isValid = isAdvanced
    ? getTotalRatio() === 100 && selectedLanguages.length > 0
    : selectedLanguages.length > 0;

  const handleSubmit = () => {
    const result = selectedServerKeys.map((serverKey) => {
      const language = LANGUAGES.find((l) => l.serverKey === serverKey);
      const ratio =
        language && isAdvanced ? languageRatios[language.name] || 0 : 0;
      return {
        serverKey,
        ratio: isAdvanced ? ratio : 100 / selectedServerKeys.length,
      };
    });

    onSubmit(result);
  };

  // LOC 계산 함수
  const calculateTotalLOC = () => {
    if (selectedLanguages.length === 0) return 0;

    let totalLOC = 0;
    if (isAdvanced) {
      // 고급 설정: 입력된 비율에 따라 LOC 계산
      selectedLanguages.forEach((langName) => {
        const language = LANGUAGES.find((l) => l.name === langName);
        const ratio = languageRatios[langName] || 0;
        if (language) {
          totalLOC += totalFP * (ratio / 100) * language.loc;
        }
      });
    } else {
      // 일반 설정: 균등하게 분배
      const equalRate = 1 / selectedLanguages.length;
      selectedLanguages.forEach((langName) => {
        const language = LANGUAGES.find((l) => l.name === langName);
        if (language) {
          totalLOC += totalFP * equalRate * language.loc;
        }
      });
    }

    return Math.round(totalLOC);
  };

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
          <div className="mb-4 p-3 bg-gray-50 rounded-md space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                선택된 언어 ({selectedLanguages.length}/{maxLanguages})
              </div>
              <div className="text-sm font-medium text-blue-600">
                예상 LOC: {calculateTotalLOC().toLocaleString()}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedLanguages.map((lang) => (
                <div key={lang} className="flex items-center gap-2">
                  <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm pl-3 pr-2 py-1 rounded-full">
                    {lang}
                    <button
                      onClick={() => handleRemoveLanguage(lang)}
                      className="ml-1 p-0.5 hover:text-blue-600"
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
              <div className="text-sm font-medium">
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
        <Button
          variant="secondary"
          onClick={onClose}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          취소
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!isValid}>
          {!isValid
            ? isAdvanced
              ? '비율의 합이 100%가 되어야 합니다'
              : '언어를 선택해주세요'
            : '확인'}
        </Button>
      </div>
    </Modal>
  );
};

export default LanguageSelect;
