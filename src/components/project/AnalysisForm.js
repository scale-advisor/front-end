import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import * as XLSX from 'xlsx';
import { downloadRequirementsExcel } from '@/utils/excelUtils';

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
  const [analysisStatus, setAnalysisStatus] = useState('IDLE');
  const [analysisStep, setAnalysisStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const itemsPerPage = 4;

  const CATEGORY_SERVER_KEYS = {
    기능: 'FUNCTION',
    연계복잡성: 'INTEGRATION_COMPLEXITY',
    '성능 요구수준': 'PERFORMANCE',
    '운영환경 호환성': 'OPERATIONAL_COMPATIBILITY',
    '보안성 요구수준': 'SECURITY',
  };

  const analysisPhrases = [
    {
      text: '전문가가 제안요청서를 검토하고 있습니다',
      icon: (
        <svg
          className="w-16 h-16 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      text: '요구사항을 추출하고 있습니다',
      icon: (
        <svg
          className="w-16 h-16 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
    },
    {
      text: '요구사항을 분류하고 있습니다',
      icon: (
        <svg
          className="w-16 h-16 text-indigo-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      text: '복잡도를 분석하고 있습니다',
      icon: (
        <svg
          className="w-16 h-16 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      text: '개발 공수를 산정하고 있습니다',
      icon: (
        <svg
          className="w-16 h-16 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      text: 'AI가 최종적으로 검토하고 있습니다',
      icon: (
        <svg
          className="w-16 h-16 text-purple-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    let interval;
    let messageInterval;

    if (analysisStatus === 'RUNNING') {
      // 프로그레스 바 업데이트를 위한 간격 설정
      const duration = 15000; // 전체 진행 시간 (15초)
      const steps = 100; // 프로그레스 바 업데이트 단계
      const stepTime = duration / steps;
      const maxProgress = 90; // 최대 진행률을 90%로 제한

      interval = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= maxProgress) {
            clearInterval(interval);
            return maxProgress;
          }
          return prev + maxProgress / steps;
        });
      }, stepTime);

      // 메시지 변경을 위한 간격 설정
      messageInterval = setInterval(() => {
        setAnalysisStep((prev) => {
          if (prev >= analysisPhrases.length - 1) {
            clearInterval(messageInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);

      return () => {
        clearInterval(interval);
        clearInterval(messageInterval);
      };
    } else if (analysisStatus === 'SUCCESS') {
      // 성공 시 프로그레스 바를 100%로 설정
      setProgressPercent(100);
    }
  }, [analysisStatus]);

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
    let projectId = null;
    try {
      // 프로젝트 생성
      const projectResponse = await api.post('/projects', {
        name: projectData.name,
        description: projectData.description,
        requirementCategories: requirementObjects,
      });

      console.log('requirementObjects', requirementObjects);
      console.log('프로젝트 생성 응답:', projectResponse);

      projectId = projectResponse.data.responseData.id;
      console.log('생성된 프로젝트 ID:', projectId);
      console.log('언어:', projectData.language);

      try {
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

        await api.post(
          `/projects/${projectId}/files?${queryParams}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

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

        // 분석 작업 시작
        const analysisResponse = await api.post(
          `/projects/${projectId}/analysis?versionNumber=1.0`,
        );
        console.log(analysisResponse);
        const jobId = analysisResponse.data.jobId;
        console.log('jobId', jobId);

        // 분석 상태 모니터링 시작
        setAnalysisStatus('RUNNING');

        const checkAnalysisStatus = async () => {
          try {
            const statusResponse = await api.get(
              `/projects/${projectId}/analysis/projects/${projectId}/analysis/jobs/${jobId}`,
            );
            const status = statusResponse.data.status;

            if (status === 'RUNNING') {
              console.log('분석 진행중');
              setTimeout(checkAnalysisStatus, 1000);
            } else if (status === 'SUCCESS') {
              setAnalysisStatus('SUCCESS');
              setTimeout(() => {
                router.push(`/projects/${projectId}`);
              }, 3000);
            } else if (status === 'FAILED') {
              setAnalysisStatus('FAILED');
              setError('분석 작업이 실패했습니다. 다시 시도해주세요.');
              // 분석 실패 시 프로젝트 삭제
              await api.delete(`/projects/${projectId}`);
            }
          } catch (error) {
            setAnalysisStatus('FAILED');
            setError(
              '분석 상태 확인 중 오류가 발생했습니다. 다시 시도해주세요.',
            );
            // 에러 발생 시 프로젝트 삭제
            if (projectId) {
              await api.delete(`/projects/${projectId}`);
            }
          }
        };

        // 상태 체크 시작
        checkAnalysisStatus();
      } catch (error) {
        console.error('프로젝트 설정 오류:', error);
        setError(error.message || '프로젝트 설정 중 오류가 발생했습니다.');
        // 설정 단계 실패 시 프로젝트 삭제
        if (projectId) {
          await api.delete(`/projects/${projectId}`);
        }
        throw error;
      }
    } catch (error) {
      console.error('프로젝트 생성 오류:', error);
      setError(error.message || '프로젝트 생성 중 오류가 발생했습니다.');
      // 최상위 에러 발생 시에도 프로젝트가 생성되어 있다면 삭제
      if (projectId) {
        await api.delete(`/projects/${projectId}`);
      }
    }
  };

  const handleDownloadExcel = () => {
    if (!analysisResult?.requirements) {
      setError('다운로드할 요구사항 데이터가 없습니다.');
      return;
    }

    try {
      downloadRequirementsExcel(analysisResult.requirements);
    } catch (error) {
      console.error('엑셀 다운로드 오류:', error);
      setError(error.message || '엑셀 파일 생성 중 오류가 발생했습니다.');
    }
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

        {/* 프로젝트 분석 상태 */}
        {(analysisStatus === 'RUNNING' || analysisStatus === 'SUCCESS') && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-lg w-full mx-4">
              {analysisStatus === 'RUNNING' ? (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    {analysisPhrases[analysisStep].icon}
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-blue-500 transition-all duration-300 ease-linear"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="min-h-[3rem]">
                    <p className="text-lg font-medium text-gray-900 animate-fade-in">
                      {analysisPhrases[analysisStep].text}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      잠시만 기다려주세요
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <svg
                    className="h-12 w-12 text-green-500 mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-900">
                    분석이 완료되었습니다!
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    잠시 후 분석 대시보드로 이동합니다...
                  </p>
                </>
              )}
            </div>
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
                      <p className="font-medium text-gray-700 mb-2 flex items-center">
                        {category}
                        {category === '기능' && (
                          <span className="ml-2 text-red-500 text-sm font-normal flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            필수
                          </span>
                        )}
                      </p>
                      {category === '기능' &&
                        !categoryMappings[category]?.length && (
                          <div className="mb-2 text-sm text-red-500">
                            기능 분류에는 최소 하나 이상의 접두사가 매핑되어야
                            합니다.
                          </div>
                        )}
                      <div className="flex flex-wrap gap-2">
                        {extractedPrefixes.map((prefix) => (
                          <button
                            key={prefix}
                            onClick={() =>
                              handleCategoryMapping(category, prefix)
                            }
                            className={`px-3 py-1 rounded-full text-sm ${
                              categoryMappings[category]?.includes(prefix)
                                ? category === '기능'
                                  ? 'bg-red-100 text-red-800 border-2 border-red-500'
                                  : 'bg-blue-100 text-blue-800 border-2 border-blue-500'
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
