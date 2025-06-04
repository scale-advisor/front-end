'use client';

import React, { useState, useRef } from 'react';

function ReanalyzeModal({ isOpen, onClose, onClassify, onFullReanalyze }) {
  const [isClassifying, setIsClassifying] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const abortControllerRef = useRef(null);

  const handleClassify = async () => {
    setIsClassifying(true);
    setError(null);
    setSuccess(false);
    abortControllerRef.current = new AbortController();

    try {
      await onClassify();
      setSuccess(true);
      setIsClassifying(false);

      // 2초 후 페이지 새로고침
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setError(error.message || '재분석 작업이 실패했습니다.');
      setIsClassifying(false);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsClassifying(false);
    setError(null);
    setSuccess(false);
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="text-center">
            <div className="mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">분석 완료</h2>
            <p className="text-sm text-gray-600 mb-4">
              FP 기능 유형 분류가 성공적으로 완료되었습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isClassifying) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="animate-spin h-12 w-12 text-blue-500 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              분석 진행 중
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              머신러닝을 활용하여 FP 기능 유형을 분류하고 있습니다...
            </p>
            <button
              onClick={handleCancel}
              className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="text-center">
            <div className="mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">분석 실패</h2>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">재분석 방법 선택</h2>
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

        <div className="space-y-4">
          <button
            onClick={handleClassify}
            className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              FP 기능 분류
            </h3>
            <p className="text-sm text-gray-600">
              머신러닝을 활용하여 현재 단위 프로세스의 FP 기능 유형을
              재분류합니다.
            </p>
          </button>

          <button
            onClick={onFullReanalyze}
            className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              전체 재분석
            </h3>
            <p className="text-sm text-gray-600">
              NLP를 활용하여 요구사항 추출부터 단위 프로세스 분석을 다시
              시작합니다.
            </p>
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReanalyzeModal;
