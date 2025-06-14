import React, { useState } from 'react';
import LanguageSelect from '../common/LanguageSelect';

const ProjectInfoForm = ({ onNext, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    budget: initialData.budget || '',
    language: initialData.language || [],
    languageRates: initialData.languageRates || {},
    teamSize: initialData.teamSize || '',
    description: initialData.description || '',
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 개발 단가와 예상 투입 인력은 숫자만 입력 가능
    if (name === 'budget' || name === 'teamSize') {
      // 숫자가 아닌 문자 제거
      const numericValue = value.replace(/[^0-9]/g, '');

      // 개발 단가의 경우 천 단위 콤마 추가
      if (name === 'budget') {
        const formattedValue = numericValue
          ? Number(numericValue).toLocaleString()
          : '';
        setFormData({
          ...formData,
          [name]: formattedValue,
        });
        return;
      }

      setFormData({
        ...formData,
        [name]: numericValue,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLanguageSubmit = (languages) => {
    const serverKeys = languages.map((lang) => lang.serverKey);
    const rates = languages.reduce((acc, lang) => {
      acc[lang.serverKey] = lang.ratio;
      return acc;
    }, {});

    setFormData((prev) => ({
      ...prev,
      language: serverKeys,
      languageRates: rates,
    }));
    setIsLanguageModalOpen(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '프로젝트 이름을 입력해주세요';
    }

    if (!formData.budget.trim()) {
      newErrors.budget = '개발 단가를 입력해주세요';
    } else if (!/^\d{1,3}(,\d{3})*$/.test(formData.budget)) {
      newErrors.budget = '올바른 형식의 개발 단가를 입력해주세요';
    }

    if (formData.language.length === 0) {
      newErrors.language = '하나 이상의 프로그래밍 언어를 선택해주세요';
    }

    if (!formData.teamSize.trim()) {
      newErrors.teamSize = '예상 투입 인력을 입력해주세요';
    } else if (!/^\d+$/.test(formData.teamSize)) {
      newErrors.teamSize = '숫자만 입력해주세요';
    } else if (parseInt(formData.teamSize) <= 0) {
      newErrors.teamSize = '1명 이상 입력해주세요';
    }

    if (!formData.description.trim()) {
      newErrors.description = '프로젝트 설명을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data on submit:', formData);

    if (validate()) {
      // budget의 콤마 제거
      const submissionData = {
        ...formData,
        budget: formData.budget.replace(/,/g, ''),
      };
      onNext(submissionData);
    }
  };

  const renderInfoIcon = () => (
    <span className="ml-1 inline-block">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </span>
  );

  const renderFormField = (
    label,
    name,
    placeholder,
    type = 'text',
    hasInfoIcon = false,
  ) => (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {hasInfoIcon && renderInfoIcon()}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderFormField('프로젝트 명', 'name', '프로젝트 명을 입력하세요')}
      {renderFormField('개발 단가', 'budget', '예: 300,000', 'text', true)}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          사용 언어
          {renderInfoIcon()}
        </label>
        <div
          onClick={() => setIsLanguageModalOpen(true)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
        >
          {formData.language.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.language.map((serverKey) => (
                <span
                  key={serverKey}
                  className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                >
                  {serverKey}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-500">사용 언어 선택하기 (최대 3개)</span>
          )}
        </div>
        {errors.language && (
          <p className="mt-1 text-sm text-red-600">{errors.language}</p>
        )}
      </div>

      {renderFormField('예상 투입 인력', 'teamSize', '예: 5명', 'text', true)}

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          프로젝트 설명
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          placeholder="프로젝트의 목적, 범위, 주요 기능 등을 입력하세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
        >
          다음
        </button>
      </div>

      <LanguageSelect
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        onSubmit={handleLanguageSubmit}
        initialSelectedLanguages={formData.language}
        initialRates={formData.languageRates}
        enableAdvancedMode={false}
      />
    </form>
  );
};

export default ProjectInfoForm;
