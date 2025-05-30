import React from 'react';

const ProjectTypeModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[500px] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">프로젝트 유형 설명</h2>
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
          {/* Organic */}
          <div
            className="border rounded-lg p-4 hover:border-green-500 cursor-pointer transition-colors"
            onClick={() => {
              onSelect('ORGANIC');
              onClose();
            }}
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Organic</h3>
            </div>
            <p className="text-sm text-gray-600 ml-11">
              소규모 팀 (3~25명) - 안정적이고 친숙한 개발 환경 - 낮은 복잡도의
              프로젝트 - 유연한 요구사항
            </p>
          </div>

          {/* Semi-detached */}
          <div
            className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
            onClick={() => {
              onSelect('SEMI_DETACHED');
              onClose();
            }}
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Semi-detached</h3>
            </div>
            <p className="text-sm text-gray-600 ml-11">
              중간 규모 팀 (25~50명) - 중간 수준의 경험과 친숙도 - 중간 수준의
              복잡도 - 적당한 수준의 요구사항 제약
            </p>
          </div>

          {/* Embedded */}
          <div
            className="border rounded-lg p-4 hover:border-red-500 cursor-pointer transition-colors"
            onClick={() => {
              onSelect('EMBEDDED');
              onClose();
            }}
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Embedded</h3>
            </div>
            <p className="text-sm text-gray-600 ml-11">
              대규모 팀 (50명 이상) - 복잡한 하드웨어/소프트웨어 인터페이스 -
              높은 기술적 복잡도 - 엄격한 요구사항과 제약조건
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
          <p className="text-sm text-yellow-700">
            ⚠️ 주의: 인원 수와 프로젝트 요구 사항 수준이 일치하지 않을 수
            있습니다 (COCOMO I 모델의 단점)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectTypeModal;
