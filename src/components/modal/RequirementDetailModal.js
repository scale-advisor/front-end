'use client';

export default function RequirementDetailModal({
  isOpen,
  onClose,
  requirement,
}) {
  if (!isOpen || !requirement) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            요구사항 상세 정보
          </h2>
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

        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {requirement.requirementNumber}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {requirement.requirementType}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  요구사항 명: {requirement.requirementName}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  요구사항 정의: {requirement.requirementDefinition}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  상세 내용
                </h4>
                <p className="text-gray-800 whitespace-pre-line">
                  {requirement.requirementDetail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
