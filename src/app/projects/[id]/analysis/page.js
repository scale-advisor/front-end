'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import useProjectStore from '@/store/useProjectStore';
import ProjectPathHeader from '@/components/project/ProjectPathNavbar';

export default function AnalysisPage() {
  const { id: projectId } = useParams();
  const currentProject = useProjectStore((state) => state.currentProject);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProcess, setEditingProcess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all'); // 'all', 'name', 'reqId'
  const [changes, setChanges] = useState({
    processNameChanged: false,
    typeChanged: false,
  });
  const [modifiedRows, setModifiedRows] = useState(new Set());
  const itemsPerPage = 10;

  const metrics = [
    {
      id: 'EIF',
      name: 'EIF',
      value: '20%',
      count: 6,
      bgColor: 'bg-[#E3F5FF]',
      textColor: 'text-[#0090FF]',
      borderColor: 'border-[#0090FF]',
    },
    {
      id: 'ILF',
      name: 'ILF',
      value: '27%',
      count: 8,
      bgColor: 'bg-[#E5FFF4]',
      textColor: 'text-[#00C881]',
      borderColor: 'border-[#00C881]',
    },
    {
      id: 'EO',
      name: 'EO',
      value: '17%',
      count: 5,
      bgColor: 'bg-[#F3E8FF]',
      textColor: 'text-[#9747FF]',
      borderColor: 'border-[#9747FF]',
    },
    {
      id: 'EI',
      name: 'EI',
      value: '23%',
      count: 7,
      bgColor: 'bg-[#FFF1E3]',
      textColor: 'text-[#FF8A00]',
      borderColor: 'border-[#FF8A00]',
    },
    {
      id: 'EQ',
      name: 'EQ',
      value: '13%',
      count: 4,
      bgColor: 'bg-[#FFE5E5]',
      textColor: 'text-[#FF4747]',
      borderColor: 'border-[#FF4747]',
    },
  ];

  const [unitProcesses, setUnitProcesses] = useState(
    Array.from({ length: 35 }, (_, index) => ({
      id: index + 1,
      reqId: `REQ-${String(index + 1).padStart(3, '0')}`,
      name: `단위 프로세스 ${index + 1}`,
      type: metrics[index % 5].id,
      originalName: `단위 프로세스 ${index + 1}`,
      originalType: metrics[index % 5].id,
      isModified: false,
      modificationType: null, // 'both', 'name', 'type'
    })),
  );

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

    const updatedProcesses = unitProcesses.map((p) =>
      p.id === editingProcess.id
        ? {
            ...editingProcess,
            isModified: nameChanged || typeChanged,
            modificationType: modificationType,
          }
        : p,
    );

    setUnitProcesses(updatedProcesses);

    setChanges({
      processNameChanged: changes.processNameChanged || nameChanged,
      typeChanged: changes.typeChanged || typeChanged || nameChanged,
    });

    if (nameChanged || typeChanged) {
      setModifiedRows((prev) => new Set([...prev, editingProcess.id]));
    }

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

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const filteredProcesses = unitProcesses.filter((process) => {
    // 먼저 타입 필터 적용
    if (selectedFilter !== 'ALL' && process.type !== selectedFilter) {
      return false;
    }

    // 검색어가 없으면 타입 필터만 적용된 결과 반환
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    // 검색 타입에 따른 필터링
    switch (searchType) {
      case 'name':
        return process.name.toLowerCase().includes(searchLower);
      case 'reqId':
        return process.reqId.toLowerCase().includes(searchLower);
      default: // 'all'
        return (
          process.name.toLowerCase().includes(searchLower) ||
          process.reqId.toLowerCase().includes(searchLower)
        );
    }
  });

  const totalPages = Math.ceil(filteredProcesses.length / itemsPerPage);
  const currentProcesses = filteredProcesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getMetricColors = (type) => {
    const metric = metrics.find((m) => m.id === type);
    return {
      bg: metric?.bgColor || 'bg-gray-50',
      text: metric?.textColor || 'text-gray-700',
    };
  };

  const getRowBackground = (process) => {
    if (!process.isModified) return '';
    return 'bg-yellow-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <ProjectPathHeader project={currentProject} />
        <div className="py-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                단위 프로세스 분석
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {currentProject?.name} 프로젝트의 단위 프로세스 분석 결과입니다.
              </p>
            </div>

            {/* 메트릭스 카드 섹션 */}
            <div className="grid grid-cols-5 gap-6 mb-8">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className={`rounded-lg shadow-sm border ${
                    selectedFilter === metric.id
                      ? 'border-2 ' + metric.borderColor
                      : 'border-gray-100'
                  } ${metric.bgColor} hover:shadow-md transition-shadow`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-lg font-semibold ${metric.textColor}`}
                      >
                        {metric.name}
                      </span>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full bg-white/50 ${metric.textColor}`}
                      >
                        {metric.count}개
                      </span>
                    </div>
                    <div className={`text-2xl font-bold ${metric.textColor}`}>
                      {metric.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 상단 버튼 섹션 추가 */}
            <div className="flex justify-end gap-4 mb-6">
              <div className="relative">
                <button
                  disabled={!changes.typeChanged || changes.processNameChanged}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    changes.typeChanged && !changes.processNameChanged
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  data-tooltip-id="recalculate-tooltip"
                >
                  재산정
                </button>
                {(!changes.typeChanged || changes.processNameChanged) && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {changes.processNameChanged
                      ? '단위프로세스가 변경되어 재분석이 필요합니다'
                      : '분류 변경사항이 없습니다'}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  disabled={!changes.processNameChanged}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    changes.processNameChanged
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  재분석
                </button>
                {!changes.processNameChanged && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    단위프로세스 변경사항이 없습니다
                  </div>
                )}
              </div>
            </div>

            {/* 단위프로세스 목록 섹션 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    단위 프로세스 목록
                  </h3>
                  <div className="flex gap-4">
                    {/* 검색 필터 추가 */}
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
                      {metrics.map((metric) => (
                        <option key={metric.id} value={metric.id}>
                          {metric.name} 보기
                        </option>
                      ))}
                    </select>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                      단위 프로세스 추가
                    </button>
                  </div>
                </div>

                {/* 검색 결과가 없을 때 메시지 표시 */}
                {filteredProcesses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    검색 결과가 없습니다.
                  </div>
                )}

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
                      {currentProcesses.map((process) => (
                        <tr
                          key={process.id}
                          className={`hover:bg-gray-50 ${getRowBackground(process)}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {process.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {process.reqId}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {editingProcess?.id === process.id ? (
                              <input
                                type="text"
                                value={editingProcess.name}
                                onChange={(e) =>
                                  handleChange('name', e.target.value)
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              process.name
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {editingProcess?.id === process.id ? (
                              <select
                                value={editingProcess.type}
                                onChange={(e) =>
                                  handleChange('type', e.target.value)
                                }
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
                              <button
                                onClick={() => handleEdit(process)}
                                className="text-blue-600 hover:text-blue-800"
                                disabled={editingProcess !== null}
                              >
                                수정
                              </button>
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
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredProcesses.length,
                    )}
                    개 표시
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
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
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
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
                        ),
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded ${
                        currentPage === totalPages
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
          </div>
        </div>
      </div>
    </div>
  );
}
