'use client';

import { useState } from 'react';
import ProcessMetrics from './ProcessMetrics';
import AmbiguousProcessList from './AmbiguousProcessList';

export default function ProcessList({
  processData,
  requirements,
  hasUnsavedChanges,
  onCancel,
  onUpdate,
  onRequirementClick,
  onRecalculate,
  onReanalyze,
  showRecalculate,
  showReanalyze,
  onAddClick,
  onDelete,
}) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProcess, setEditingProcess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all'); // 'all', 'name', 'reqId'
  const itemsPerPage = 10;

  // 메트릭 정의 및 계산
  const metrics = [
    {
      id: 'EIF',
      name: 'EIF',
      bgColor: 'bg-[#E3F5FF]',
      textColor: 'text-[#0090FF]',
      borderColor: 'border-[#0090FF]',
    },
    {
      id: 'ILF',
      name: 'ILF',
      bgColor: 'bg-[#E5FFF4]',
      textColor: 'text-[#00C881]',
      borderColor: 'border-[#00C881]',
    },
    {
      id: 'EO',
      name: 'EO',
      bgColor: 'bg-[#F3E8FF]',
      textColor: 'text-[#9747FF]',
      borderColor: 'border-[#9747FF]',
    },
    {
      id: 'EI',
      name: 'EI',
      bgColor: 'bg-[#FFF1E3]',
      textColor: 'text-[#FF8A00]',
      borderColor: 'border-[#FF8A00]',
    },
    {
      id: 'EQ',
      name: 'EQ',
      bgColor: 'bg-[#FFE5E5]',
      textColor: 'text-[#FF4747]',
      borderColor: 'border-[#FF4747]',
    },
  ].map((metric) => {
    const classifiedProcesses = processData.filter(
      (p) => p.type !== 'UNDEFINED',
    );
    const totalClassified = classifiedProcesses.length;
    const count = processData.filter((p) => p.type === metric.id).length;
    return {
      ...metric,
      count,
      value: totalClassified
        ? `${Math.round((count / totalClassified) * 100)}%`
        : '0%',
    };
  });

  const getRequirementNumbers = (requirementIdList) => {
    if (!requirementIdList || !requirements) return [];

    const requirementsArray = Array.isArray(requirements)
      ? requirements
      : requirements.requirementList || [];

    return requirementIdList
      .map((reqId) => {
        const requirement = requirementsArray.find(
          (req) => req.requirementId === reqId,
        );
        return requirement ? requirement.requirementNumber : null;
      })
      .filter(Boolean);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleEdit = (process) => {
    setEditingProcess({
      ...process,
      originalName: process.name,
      originalType: process.type,
    });
  };

  const handleSave = () => {
    if (!editingProcess) return;

    const nameChanged = editingProcess.name !== editingProcess.originalName;
    const typeChanged = editingProcess.type !== editingProcess.originalType;

    let modificationType = null;
    if (nameChanged && typeChanged) modificationType = 'both';
    else if (nameChanged) modificationType = 'name';
    else if (typeChanged) modificationType = 'type';

    const updatedProcess = {
      ...editingProcess,
      isModified: nameChanged || typeChanged,
      modificationType: modificationType,
      isAmbiguous: false,
    };

    onUpdate(updatedProcess);
    setEditingProcess(null);
  };

  const handleCancel = () => {
    setEditingProcess(null);
  };

  const handleChange = (field, value) => {
    setEditingProcess((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredProcesses = processData.filter((process) => {
    if (selectedFilter === 'AMBIGUOUS' && !process?.isAmbiguous) {
      return false;
    }
    if (
      selectedFilter !== 'ALL' &&
      selectedFilter !== 'AMBIGUOUS' &&
      process?.type !== selectedFilter
    ) {
      return false;
    }

    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    switch (searchType) {
      case 'name':
        return process?.name?.toLowerCase().includes(searchLower);
      case 'reqId': {
        const requirementNumbers = getRequirementNumbers(
          process?.requirementIdList,
        );
        return requirementNumbers.some((reqNum) =>
          reqNum?.toLowerCase().includes(searchLower),
        );
      }
      default:
        const requirementNumbers = getRequirementNumbers(
          process?.requirementIdList,
        );
        return (
          process?.name?.toLowerCase().includes(searchLower) ||
          requirementNumbers.some((reqNum) =>
            reqNum?.toLowerCase().includes(searchLower),
          )
        );
    }
  });

  const getMetricColors = (type) => {
    const metric = metrics.find((m) => m.id === type);
    return {
      bg: metric?.bgColor || 'bg-gray-50',
      text: metric?.textColor || 'text-gray-700',
    };
  };

  const currentProcesses = filteredProcesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // 변경사항 유형 확인
  const hasTypeChangesOnly = processData.some(
    (process) => process.isModified && process.modificationType === 'type',
  );

  const hasNameChanges = processData.some(
    (process) =>
      process.isModified &&
      (process.modificationType === 'name' ||
        process.modificationType === 'both'),
  );

  // 페이지네이션 헬퍼 함수 추가
  const getPageNumbers = (currentPage, totalPages) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  const getProcessNumber = (processId) => {
    const process = processData.find((p) => p.id === processId);
    return process ? process.orderNumber : '';
  };

  return (
    <>
      <ProcessMetrics
        metrics={metrics}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      <AmbiguousProcessList
        processes={processData.filter((p) => p.isAmbiguous)}
        onEdit={handleEdit}
        editingProcess={editingProcess}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
        getMetricColors={getMetricColors}
        getRequirementNumbers={getRequirementNumbers}
        onRequirementClick={onRequirementClick}
        metrics={metrics}
        getProcessNumber={getProcessNumber}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                전체 단위 프로세스 목록
              </h3>
              
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
                        className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 min-w-[100px]"
                      >
                        재산정
                      </button>
                    )}
                    {showReanalyze && (
                      <button
                        onClick={onReanalyze}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 min-w-[100px]"
                      >
                        재분석
                      </button>
                    )}
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">전체 검색</option>
                  <option value="name">단위프로세스명</option>
                  <option value="reqId">요구사항 ID</option>
                </select>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="검색어를 입력하세요"
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
                />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">전체 보기</option>
                <option value="AMBIGUOUS" className="text-yellow-600">
                  모호한 프로세스
                </option>
                {metrics.map((metric) => (
                  <option key={metric.id} value={metric.id}>
                    {metric.name} 보기
                  </option>
                ))}
              </select>
              <button
                onClick={onAddClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
              >
                단위 프로세스 추가
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    요구사항 ID 출처
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    단위 프로세스명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    분류
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProcesses.map((process, index) => (
                  <tr
                    key={process.id}
                    className={`hover:bg-gray-50 ${
                      process.isModified ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getProcessNumber(process.id)}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-900 cursor-pointer hover:text-blue-600"
                      onClick={() =>
                        onRequirementClick(process.requirementIdList)
                      }
                    >
                      {getRequirementNumbers(process.requirementIdList).join(
                        ', ',
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {editingProcess?.id === process.id ? (
                        <input
                          type="text"
                          value={editingProcess.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{process.name}</span>
                          {process.isAmbiguous && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              모호
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editingProcess?.id === process.id ? (
                        <select
                          value={editingProcess.type}
                          onChange={(e) => handleChange('type', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {metrics.map((metric) => (
                            <option key={metric.id} value={metric.id}>
                              {metric.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            getMetricColors(process.type).bg
                          } ${getMetricColors(process.type).text}`}
                        >
                          {process.type}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingProcess?.id === process.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-800"
                          >
                            저장
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(process)}
                            className="text-blue-600 hover:text-blue-800"
                            disabled={editingProcess !== null}
                          >
                            수정
                          </button>
                          <button
                            onClick={() => onDelete(process.id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={editingProcess !== null}
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="flex items-center text-sm text-gray-500">
              총 {filteredProcesses.length}개 항목 중{' '}
              {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredProcesses.length)}개
              표시
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
              <div className="flex items-center space-x-1 overflow-x-auto max-w-[300px]">
                {getPageNumbers(
                  currentPage,
                  Math.ceil(filteredProcesses.length / itemsPerPage),
                ).map((page, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof page === 'number' && setCurrentPage(page)
                    }
                    className={`px-3 py-1 rounded min-w-[32px] ${
                      page === '...'
                        ? 'cursor-default'
                        : currentPage === page
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
                      Math.ceil(filteredProcesses.length / itemsPerPage),
                    ),
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(filteredProcesses.length / itemsPerPage)
                }
                className={`px-3 py-1 rounded ${
                  currentPage ===
                  Math.ceil(filteredProcesses.length / itemsPerPage)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                다음
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
