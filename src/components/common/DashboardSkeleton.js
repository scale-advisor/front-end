import React from 'react';
import Skeleton from './Skeleton';

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 상단 헤더 스켈레톤 */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-24" />
              <span className="text-gray-300">/</span>
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="mt-2 h-8 w-64" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        {/* 카드 그리드 스켈레톤 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>

        {/* 차트 영역 스켈레톤 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
