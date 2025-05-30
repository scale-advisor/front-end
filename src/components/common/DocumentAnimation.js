'use client';

import { useState, useEffect } from 'react';

export default function DocumentAnimation() {
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 280, y: 20 });

  useEffect(() => {
    const positions = [
      { x: 200, y: -300 }, // 우측 상단
      { x: 50, y: -300 }, // 좌측 상단
      { x: 200, y: -100}, // 우측 중간
      { x: 50, y: -100 }, // 좌측 중간
    ];

    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % positions.length;
      setMagnifierPosition(positions[currentIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg blur opacity-20"></div>
      <div className="relative h-[500px] flex items-center justify-center">
        {/* 단일 문서 */}
        <div className="relative w-[320px] h-[420px] bg-white rounded-xl shadow-xl p-6">
          {/* 문서 헤더 */}
          <div className="border-b border-gray-100 pb-4 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-100 rounded w-32"></div>
                <div className="h-3 bg-gray-50 rounded w-24 mt-2"></div>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* 문서 내용 - 복잡한 레이아웃 */}
          <div className="grid grid-cols-6 gap-3 mb-6">
            <div className="col-span-4 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-full"></div>
              <div className="h-3 bg-gray-100 rounded w-5/6"></div>
              <div className="h-3 bg-gray-100 rounded w-4/6"></div>
            </div>
            <div className="col-span-2 bg-blue-50 rounded-lg p-2">
              <div className="h-2 bg-blue-200 rounded w-full mb-1"></div>
              <div className="h-2 bg-blue-200/70 rounded w-4/5"></div>
            </div>
          </div>

          {/* 차트형 컨텐츠 */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-lg p-2 flex flex-col items-center"
              >
                <div className="w-full h-[30px] bg-gradient-to-t from-purple-100 to-purple-50 rounded"></div>
                <div className="h-2 bg-gray-200 rounded w-4/5 mt-2"></div>
              </div>
            ))}
          </div>

          {/* 진행 상태 표시 */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2">
              <div className="h-2 bg-blue-400 rounded-full w-3/4"></div>
              <div className="text-xs text-blue-600">75%</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 bg-purple-400 rounded-full w-1/2"></div>
              <div className="text-xs text-purple-600">50%</div>
            </div>
          </div>

          {/* 돋보기 애니메이션 */}
          <div
            className="absolute w-12 h-12 transition-all duration-[1500ms] ease-in-out"
            style={{
              transform: `translate(${magnifierPosition.x}px, ${magnifierPosition.y}px)`,
            }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse"></div>
              <svg
                className="w-full h-full text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
