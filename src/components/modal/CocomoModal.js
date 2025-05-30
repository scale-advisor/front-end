import React from 'react';

const CocomoModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[550px] p-8 shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">COCOMO 모델 선택</h2>
          <button
            onClick={onClose}
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

        <div className="space-y-4">
          {/* COCOMO I */}
          <div
            onClick={() => {
              onSelect('COCOMO_I');
              onClose();
            }}
            className="border rounded-lg p-6 hover:border-blue-500 cursor-pointer transition-all hover:bg-blue-50"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-green-100 rounded-lg shrink-0">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  COCOMO I (기본 모델)
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 간단하고 직톡적인 소프트웨어 개발 프로젝트에 적합</li>
                  <li>• 3가지 개발 모드: Organic, Semi-detached, Embedded</li>
                  <li>• 소프트웨어 규모(LOC)를 기반으로 한 추정</li>
                  <li>• 개발 노력과 일정 산정에 중점</li>
                  <li className="text-red-500">
                    • 단점: 규모는 Organic에 해당하고 팀 경험이 Embedded에
                    해당하는 경우와 같이 혼재된 상황의 정확한 개발 유형 선택의
                    어려움 존재
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* COCOMO II */}
          <div
            onClick={() => {
              onSelect('COCOMO_II');
              onClose();
            }}
            className="border rounded-lg p-6 hover:border-blue-500 cursor-pointer transition-all hover:bg-blue-50"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg shrink-0">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  COCOMO II (Early Design)
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 현대적인 소프트웨어 개발 환경에 최적화</li>
                  <li>• 다양한 비용 동인(Cost Drivers) 고려</li>
                  <li>• 재사용, 소프트웨어 진화 고려</li>
                  <li>• 애플리케이션 구성, 초기 설계, 사후 구조 단계별 추정</li>
                  <li className="text-green-500">
                    • COCOMO I의 개발 유형 선택 문제를 해결하여 더 정확한 추정
                    가능
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CocomoModal;
