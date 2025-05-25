import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

const AnalysisForm = ({ onPrevious, projectData }) => {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // 분석 로직 구현
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 임시 지연
      setAnalysisResult({
        requirements: [
          '사용자 인증 기능',
          '게시판 CRUD 기능',
          '파일 업로드/다운로드 기능',
        ],
        complexity: 'Medium',
        estimatedTime: '3 months',
        teamRecommendation: projectData.teamSize || '5명',
        costEstimation: {
          min: 15000000,
          max: 25000000,
        },
        techStack: ['React', 'Node.js', 'MongoDB'],
        riskFactors: [
          { level: 'High', description: '데이터 마이그레이션' },
          { level: 'Medium', description: '보안 이슈' },
          { level: 'Low', description: 'UI/UX 디자인' },
        ],
      });
    } catch (err) {
      setError('분석 중 오류가 발생했습니다.');
      console.error('분석 오류:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      console.log(projectData.name, projectData.description);
      const response = await api.post('/projects', {
        name: projectData.name,
        description: projectData.description,
      });

      // 프로젝트 생성 성공 시 프로젝트 목록 페이지로 이동
      router.push('/projects');
    } catch (error) {
      setError('프로젝트 생성 중 오류가 발생했습니다.');
      console.error('프로젝트 생성 오류:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount);
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

        {/* 요구사항 추출 버튼 */}
        {!analysisResult && !isAnalyzing && (
          <div className="text-center py-4">
            <button
              type="button"
              onClick={handleStartAnalysis}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              기능 요구사항 추출 하기
            </button>
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
              {/* 복잡도 및 추정 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-500 mb-1">프로젝트 복잡도</p>
                  <p className="font-medium">{analysisResult.complexity}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-500 mb-1">예상 개발 기간</p>
                  <p className="font-medium">{analysisResult.estimatedTime}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-500 mb-1">권장 팀 규모</p>
                  <p className="font-medium">
                    {analysisResult.teamRecommendation}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-500 mb-1">예상 비용</p>
                  <p className="font-medium">
                    {formatCurrency(analysisResult.costEstimation.min)} ~{' '}
                    {formatCurrency(analysisResult.costEstimation.max)}
                  </p>
                </div>
              </div>

              {/* 권장 기술 스택 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  권장 기술 스택
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* 위험 요소 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  위험 요소
                </h4>
                <ul className="space-y-2">
                  {analysisResult.riskFactors.map((risk, index) => (
                    <li key={index} className="flex items-center">
                      <span
                        className={`inline-block w-16 text-center text-xs px-2 py-1 rounded-full ${
                          risk.level === 'High'
                            ? 'bg-red-100 text-red-800'
                            : risk.level === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {risk.level}
                      </span>
                      <span className="ml-2 text-sm text-gray-700">
                        {risk.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 버튼 영역 */}
        <div className="pt-4 flex justify-between">
          <button
            type="button"
            onClick={onPrevious}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            이전
          </button>
          {analysisResult && (
            <button
              type="button"
              onClick={handleCreateProject}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              프로젝트 생성 하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisForm;
