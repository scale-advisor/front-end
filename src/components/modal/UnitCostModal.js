import React, { useState, useEffect } from 'react';

const UnitCostModal = ({ isOpen, onClose, onSubmit, initialUnitCost = 0 }) => {
  const [unitCost, setUnitCost] = useState(
    initialUnitCost?.toLocaleString() || '0',
  );

  // 모달이 열릴 때마다 현재 값으로 설정
  useEffect(() => {
    if (isOpen) {
      setUnitCost(initialUnitCost?.toLocaleString() || '0');
    }
  }, [isOpen, initialUnitCost]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // 콤마 제거하고 숫자로 변환
    const numericValue = Number(unitCost.replace(/,/g, '')) || 0;
    onSubmit({ unitCost: numericValue });
    onClose();
  };

  const formatNumber = (value) => {
    // 숫자와 콤마만 남기고 모두 제거
    const numbers = value.replace(/[^\d,]/g, '');
    // 콤마 제거
    const plainNumber = numbers.replace(/,/g, '');
    // 숫자가 아니거나 빈 문자열이면 0 반환
    if (!plainNumber || isNaN(plainNumber)) return '0';
    // 천 단위 콤마 추가
    return Number(plainNumber).toLocaleString();
  };

  const handleChange = (e) => {
    const formattedValue = formatNumber(e.target.value);
    setUnitCost(formattedValue);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[400px] p-8 shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">개발 단가 설정</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              개발 단가 (원/MM)
            </label>
            <div className="relative">
              <input
                type="text"
                value={unitCost}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="개발 단가를 입력하세요"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                원
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitCostModal;
