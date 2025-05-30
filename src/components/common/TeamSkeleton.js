import React from 'react';
import Skeleton from './Skeleton';

const TeamSkeleton = () => {
  const renderTableSkeleton = () => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left w-1/4">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="px-6 py-3 text-left w-1/3">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="px-6 py-3 text-left w-1/6">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="px-6 py-3 text-left w-1/6">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="px-6 py-3 text-right w-1/6">
                <Skeleton className="h-4 w-16 ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(4)].map((_, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-5 w-24" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-5 w-40" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-5 w-16" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-6 w-24 rounded-full" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">팀 관리</h1>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* 활성 팀원 테이블 */}
      {renderTableSkeleton()}

      {/* 대기중인 팀원 테이블 */}
      {renderTableSkeleton()}

      {/* 팀원 권한 안내 */}
      <div className="mt-8 p-4 bg-orange-50 rounded-lg">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default TeamSkeleton;
