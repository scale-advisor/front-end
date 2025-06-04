'use client';

import { useState } from 'react';
import RequirementEditModal from '../modal/RequirementEditModal';
import RequirementDetailModal from '../modal/RequirementDetailModal';

export default function RequirementList({
  requirements,
  tempRequirements,
  hasUnsavedChanges,
  onSave,
  onCancel,
  onUpdate,
  onAddClick,
  onRecalculate,
  onReanalyze,
  showRecalculate,
  showReanalyze,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState(null);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const itemsPerPage = 10;

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleEditRequirement = (requirement) => {
    setEditingRequirement(requirement);
    setIsEditModalOpen(true);
  };

  const handleSaveRequirement = (updatedData) => {
    onUpdate(updatedData);
    setIsEditModalOpen(false);
    setEditingRequirement(null);
  };

  const handleViewDetail = (requirement) => {
    setSelectedRequirement(requirement);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900">
              요구사항 목록
            </h3>
            {hasUnsavedChanges && (
              <span className="px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full">
                저장되지 않은 변경사항
              </span>
            )}
          </div>
          <div className="flex gap-4">
            <div className="flex gap-2">
              {hasUnsavedChanges && (
                <>
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    변경사항 취소
                  </button>
                  {showRecalculate && (
                    <button
                      onClick={onRecalculate}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      재산정
                    </button>
                  )}
                  {showReanalyze && (
                    <button
                      onClick={onReanalyze}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      재분석
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="검색어를 입력하세요"
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
              />
              <button
                onClick={onAddClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
              >
                요구사항 추가
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  요구사항 ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  요구사항명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  요구사항 유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  정의
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(tempRequirements?.requirementList || [])
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage,
                )
                .map((requirement) => (
                  <tr
                    key={requirement.requirementId}
                    className={`hover:bg-gray-50 ${
                      JSON.stringify(requirement) !==
                      JSON.stringify(
                        requirements.requirementList.find(
                          (r) => r.requirementId === requirement.requirementId,
                        ),
                      )
                        ? 'bg-yellow-50'
                        : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {requirement.requirementNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {requirement.requirementName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {requirement.requirementType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {requirement.requirementDefinition}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEditRequirement(requirement)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        수정
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center text-sm text-gray-500">
            총 {tempRequirements?.requirementList?.length || 0}개 항목 중{' '}
            {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(
              currentPage * itemsPerPage,
              tempRequirements?.requirementList?.length || 0,
            )}
            개 표시
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              이전
            </button>
            <div className="flex items-center space-x-1">
              {Array.from(
                {
                  length: Math.ceil(
                    (tempRequirements?.requirementList?.length || 0) /
                      itemsPerPage,
                  ),
                },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(
                      (tempRequirements?.requirementList?.length || 0) /
                        itemsPerPage,
                    ),
                  ),
                )
              }
              disabled={
                currentPage ===
                Math.ceil(
                  (tempRequirements?.requirementList?.length || 0) /
                    itemsPerPage,
                )
              }
              className={`px-3 py-1 rounded ${
                currentPage ===
                Math.ceil(
                  (tempRequirements?.requirementList?.length || 0) /
                    itemsPerPage,
                )
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              다음
            </button>
          </div>
        </div>
      </div>

      <RequirementEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingRequirement(null);
        }}
        requirement={editingRequirement}
        onSave={handleSaveRequirement}
      />

      <RequirementDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRequirement(null);
        }}
        requirement={selectedRequirement}
      />
    </div>
  );
}
