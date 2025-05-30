import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import * as XLSX from 'xlsx';

// 요구사항 분류 카테고리
const REQUIREMENT_CATEGORIES = [
  '기능',
  '연계복잡성',
  '성능 요구수준',
  '운영환경 호환성',
  '보안성 요구수준',
];

const AnalysisForm = ({ onPrevious, projectData }) => {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [extractedPrefixes, setExtractedPrefixes] = useState([]);
  const [categoryMappings, setCategoryMappings] = useState({});
  const [requirementObjects, setRequirementObjects] = useState([]);
  const itemsPerPage = 4;

  const CATEGORY_SERVER_KEYS = {
    기능: 'FUNCTION',
    연계복잡성: 'INTEGRATION_COMPLEXITY',
    '성능 요구수준': 'PERFORMANCE',
    '운영환경 호환성': 'OPERATIONAL_COMPATIBILITY',
    '보안성 요구수준': 'SECURITY',
  };

  const handleStartAnalysis = async () => {
    if (!projectData.file) {
      setError('파일이 선택되지 않았습니다.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', projectData.file);

      const response = await fetch('/api/extract-requirements', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '요구사항 추출 중 오류가 발생했습니다.');
      }

      if (!data.requirements || !Array.isArray(data.requirements)) {
        throw new Error('요구사항 데이터 형식이 올바르지 않습니다.');
      }

      console.log('추출된 요구사항 데이터:', data.requirements);

      // 요구사항 접두사 추출 및 중복 제거 (공백 제거 추가)
      const prefixes = [
        ...new Set(
          data.requirements
            .map((req) => {
              // 요구사항 번호에서 공백을 제거하고 접두사 추출
              const requirementNumber = req.requirementNumber.replace(
                /\s+/g,
                '',
              );
              return requirementNumber.split('-')[0];
            })
            .filter((prefix) => prefix),
        ),
      ];

      console.log('공백 제거 후 추출된 고유한 요구사항 접두사:', prefixes);
      setExtractedPrefixes(prefixes);

      setAnalysisResult({ requirements: data.requirements });
    } catch (err) {
      setError(err.message);
      console.error('분석 오류:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      // 프로젝트 생성
      const projectResponse = await api.post('/projects', {
        name: projectData.name,
        description: projectData.description,
        requirementCategories: requirementObjects,
      });

      console.log('requirementObjects', requirementObjects);
      console.log('프로젝트 생성 응답:', projectResponse);

      const projectId = projectResponse.data.responseData.id;
      console.log('생성된 프로젝트 ID:', projectId);
      console.log('언어:', projectData.language);

      // 프로젝트 옵션 설정
      await api.post(`/projects/${projectId}/options`, {
        unitCost: parseInt(projectData.budget.replace(/[^0-9]/g, '')),
        teamSize: parseInt(projectData.teamSize),
        cocomoType: 'ORGANIC',
        languageList: projectData.language,
      });

      console.log('프로젝트 옵션 설정 완료');

      // 파일 업로드
      const formData = new FormData();
      formData.append('file', projectData.file);

      const fileExtension = projectData.file.name
        .split('.')
        .pop()
        .toLowerCase();
      const fileType = fileExtension === 'hwpx' ? 'RFP' : 'REQUIREMENTS';

      const queryParams = new URLSearchParams({
        name: projectData.file.name,
        type: fileType,
      }).toString();

      await api.post(`/projects/${projectId}/files?${queryParams}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('파일 업로드 완료');

      // 요구사항 카테고리 설정
      await api.post(
        `/projects/${projectId}/requirements/categories`,
        requirementObjects,
      );
      console.log('요구사항 카테고리 설정 완료');

      // 요구사항 데이터 전송
      console.log('전송할 요구사항 데이터:', analysisResult.requirements);

      await api.post(
        `/projects/${projectId}/requirements`,
        analysisResult.requirements,
      );

      router.push('/projects');
    } catch (error) {
      console.error('프로젝트 생성 오류:', error);
      setError(error.message || '프로젝트 생성 중 오류가 발생했습니다.');
    }
  };

  const handleDownloadExcel = () => {
    if (!analysisResult?.requirements) return;

    // hwpParser의 generateExcelData 함수를 사용하여 데이터 생성
    const { headers, rows } = generateExcelData(analysisResult.requirements);

    // 워크북 생성
    const workbook = XLSX.utils.book_new();

    // 워크시트 생성 및 헤더 설정
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // 열 너비 설정
    worksheet['!cols'] = headers.map((h) => ({ wch: h.width }));

    // 워크북에 워크시트 추가
    XLSX.utils.book_append_sheet(workbook, worksheet, '요구사항 목록');

    // 파일 다운로드
    XLSX.writeFile(workbook, '요구사항_분석결과.xlsx');
  };

  // 현재 페이지의 요구사항 목록 계산
  const getCurrentPageItems = () => {
    if (!analysisResult?.requirements) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return analysisResult.requirements.slice(
      startIndex,
      startIndex + itemsPerPage,
    );
  };

  // 전체 페이지 수 계산
  const getTotalPages = () => {
    if (!analysisResult?.requirements) return 0;
    return Math.ceil(analysisResult.requirements.length / itemsPerPage);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber, e) => {
    if (e) {
      e.preventDefault();
    }
    setCurrentPage(pageNumber);
  };

  // 페이지네이션 버튼 렌더링
  const renderPaginationButtons = () => {
    const totalPages = getTotalPages();
    const buttons = [];
    const maxVisibleButtons = 5;

    // 이전 페이지 버튼
    buttons.push(
      <button
        key="prev"
        onClick={(e) => handlePageChange(Math.max(1, currentPage - 1), e)}
        disabled={currentPage === 1}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        이전
      </button>,
    );

    // 시작과 끝 페이지 계산
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2),
    );
    let endPage = startPage + maxVisibleButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // 첫 페이지 표시
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={(e) => handlePageChange(1, e)}
          className="px-3 py-1 mx-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          1
        </button>,
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>,
        );
      }
    }

    // 페이지 버튼 생성
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={(e) => handlePageChange(i, e)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {i}
        </button>,
      );
    }

    // 마지막 페이지 표시
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>,
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={(e) => handlePageChange(totalPages, e)}
          className="px-3 py-1 mx-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          {totalPages}
        </button>,
      );
    }

    // 다음 페이지 버튼
    buttons.push(
      <button
        key="next"
        onClick={(e) =>
          handlePageChange(Math.min(totalPages, currentPage + 1), e)
        }
        disabled={currentPage === totalPages}
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        다음
      </button>,
    );

    return buttons;
  };

  const handleCategoryMapping = (category, prefix) => {
    // UI를 위한 categoryMappings 업데이트
    setCategoryMappings((prev) => {
      const newMappings = { ...prev };
      if (!newMappings[category]) {
        newMappings[category] = [];
      }

      if (newMappings[category].includes(prefix)) {
        // 이미 있으면 제거
        newMappings[category] = newMappings[category].filter(
          (p) => p !== prefix,
        );
        // requirementObjects에서도 제거
        setRequirementObjects((prev) =>
          prev.filter(
            (obj) =>
              !(
                obj.requirementCategoryName ===
                  CATEGORY_SERVER_KEYS[category] &&
                obj.requirementCategoryPrefix === prefix
              ),
          ),
        );
      } else {
        // 없으면 추가
        newMappings[category] = [...newMappings[category], prefix];
        // requirementObjects에 새 객체 추가
        setRequirementObjects((prev) => [
          ...prev,
          {
            requirementCategoryName: CATEGORY_SERVER_KEYS[category],
            requirementCategoryPrefix: prefix,
          },
        ]);
      }

      console.log('현재 요구사항 객체들:', requirementObjects);
      return newMappings;
    });
  };

  const getUnmappedPrefixes = () => {
    const mappedPrefixes = new Set(Object.values(categoryMappings).flat());
    return extractedPrefixes.filter((prefix) => !mappedPrefixes.has(prefix));
  };

  return (
    <div>
      <div className="space-y-6">
        {/* 에러 메시지 */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* 프로젝트 정보 요약 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            프로젝트 정보
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">프로젝트 명</p>
              <p className="font-medium">{projectData.name || '미입력'}</p>
            </div>
            <div>
              <p className="text-gray-500">개발 단가</p>
              <p className="font-medium">{projectData.budget || '미입력'}</p>
            </div>
            <div>
              <p className="text-gray-500">사용 언어</p>
              <p className="font-medium">{projectData.language || '미입력'}</p>
            </div>
            <div>
              <p className="text-gray-500">예상 투입 인력</p>
              <p className="font-medium">{projectData.teamSize || '미입력'}</p>
            </div>
          </div>
          {projectData.description && (
            <div className="mt-4">
              <p className="text-gray-500">프로젝트 설명</p>
              <p className="text-sm">{projectData.description}</p>
            </div>
          )}
        </div>

        {/* 파일 업로드 및 요구사항 추출 버튼 */}
        {!analysisResult && !isAnalyzing && (
          <div className="space-y-4">
            {/* 업로드된 파일 정보 표시 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                업로드된 파일
              </h4>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-2 text-sm text-gray-900">
                  {projectData.file?.name || '파일이 선택되지 않았습니다'}
                </span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onPrevious}
                className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                이전
              </button>
              <button
                type="button"
                onClick={handleStartAnalysis}
                className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                기능 요구사항 추출 하기
              </button>
            </div>
          </div>
        )}

        {/* 로딩 인디케이터 */}
        {isAnalyzing && (
          <div className="text-center py-8">
            <svg
              className="animate-spin h-10 w-10 text-blue-500 mx-auto"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="mt-3 text-gray-600">프로젝트 분석 중...</p>
          </div>
        )}

        {/* 분석 결과 */}
        {analysisResult && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">분석 결과</h3>
            </div>
            <div className="p-4 space-y-6">
              {/* 요구사항 분류 매핑 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  요구사항 분류 매핑
                  <span className="text-sm text-gray-500 ml-2">
                    (모든 접두사는 최소 하나의 분류에 매핑되어야 합니다)
                  </span>
                </h4>
                {getUnmappedPrefixes().length > 0 && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-700">
                      미분류 접두사: {getUnmappedPrefixes().join(', ')}
                    </p>
                  </div>
                )}
                <div className="space-y-4">
                  {REQUIREMENT_CATEGORIES.map((category) => (
                    <div
                      key={category}
                      className="border-b border-gray-200 pb-4"
                    >
                      <p className="font-medium text-gray-700 mb-2">
                        {category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {extractedPrefixes.map((prefix) => (
                          <button
                            key={prefix}
                            onClick={() =>
                              handleCategoryMapping(category, prefix)
                            }
                            className={`px-3 py-1 rounded-full text-sm ${
                              categoryMappings[category]?.includes(prefix)
                                ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {prefix}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 전체 요구사항 수 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  총{' '}
                  <span className="font-medium text-blue-700">
                    {analysisResult.requirements.length}
                  </span>
                  개의 요구사항이 추출되었습니다.
                </p>
              </div>

              {/* 요구사항 목록 */}
              <div className="h-[380px] flex flex-col">
                <h4 className="text-sm font-medium text-gray-700 mb-4">
                  요구사항 목록
                </h4>
                {/* 고정 높이의 요구사항 목록 컨테이너 */}
                <div className="flex-1">
                  <div className="space-y-3">
                    {getCurrentPageItems().map((req, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-gray-800">
                            {req.requirementDetailNumber} -{' '}
                            {req.requirementName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {req.requirementDefinition || '정의 없음'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {/* 빈 공간을 채우기 위한 더미 요구사항 */}
                    {getCurrentPageItems().length < itemsPerPage &&
                      Array(itemsPerPage - getCurrentPageItems().length)
                        .fill(null)
                        .map((_, index) => (
                          <div
                            key={`empty-${index}`}
                            className="p-3 bg-gray-50 rounded-lg opacity-0"
                          >
                            <p className="text-sm text-gray-800">빈 공간</p>
                          </div>
                        ))}
                  </div>
                </div>

                {/* 페이지네이션 - 하단에 고정 */}
                <div className="py-4 border-t border-gray-200">
                  <div className="flex justify-center">
                    {renderPaginationButtons()}
                  </div>
                </div>
              </div>

              {/* 프로젝트 생성 버튼 */}
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onPrevious}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={handleDownloadExcel}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  엑셀 다운로드
                </button>
                <button
                  type="button"
                  onClick={handleCreateProject}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  프로젝트 생성
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisForm;
