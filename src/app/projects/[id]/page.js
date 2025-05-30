'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Card from '@/components/common/Card';
import ProgressBar from '@/components/common/ProgressBar';
import EstimationModal from '@/components/modal/EstimationModal';
import LanguageSelect from '@/components/common/LanguageSelect';
import TeamSizeModal from '@/components/modal/TeamSizeModal';
import DashboardSkeleton from '@/components/common/DashboardSkeleton';
import ProjectPathHeader from '@/components/project/ProjectPathNavbar';
import useProjectStore from '@/store/useProjectStore';
import {
  DocumentTextIcon,
  UserGroupIcon,
  CodeBracketIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/axios';

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const currentProject = useProjectStore((state) => state.currentProject);
  const [isEstimationModalOpen, setIsEstimationModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isTeamSizeModalOpen, setIsTeamSizeModalOpen] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  useEffect(() => {
    // 임시 데이터 (실제로는 API 호출)
    const mockProject = {
      id: String(params.id),
      name: '웹 서비스 현대화 프로젝트',
      rfpFile: 'modernization_rfp_v1.0.pdf',
      version: 'v1.0',
      stats: {
        totalFP: 1234,
        teamSize: 10,
        loc: 500000,
        duration: '10 Month',
        costBefore: 1999999,
        costAfter: 1999999,
      },
      components: [
        { name: 'Internal Logical Files', value: 50 },
        { name: 'External Logical Files', value: 40 },
        { name: 'External Inquires', value: 40 },
        { name: 'External Outputs', value: 40 },
        { name: 'External Inputs', value: 40 },
      ],
    };
    setProject(mockProject);
  }, [params.id]);

  const handleEstimationSubmit = (data) => {
    console.log('예상 개발 기간 데이터:', data);
    setIsEstimationModalOpen(false);
  };

  const handleLanguageSubmit = async (data) => {
    try {
      // API 호출로 언어 설정 업데이트
      await api.post(`/projects/${params.id}/options`, {
        languageList: Object.keys(data.languages),
        languageRatios: Object.entries(data.languages).reduce(
          (acc, [lang, ratio]) => {
            if (ratio !== null) {
              acc[lang] = ratio;
            }
            return acc;
          },
          {},
        ),
      });

      // 성공적으로 업데이트되면 상태 업데이트
      setSelectedLanguages(Object.keys(data.languages));
      setIsLanguageModalOpen(false);
    } catch (error) {
      console.error('언어 설정 업데이트 실패:', error);
    }
  };

  const handleTeamSizeSubmit = async (data) => {
    try {
      // API 호출로 팀 크기 설정 업데이트
      await api.post(`/projects/${params.id}/options`, {
        teamSize: data.teamSize,
      });

      // 성공적으로 업데이트되면 상태 업데이트
      setProject((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          teamSize: data.teamSize,
        },
      }));
      setIsTeamSizeModalOpen(false);
    } catch (error) {
      console.error('팀 크기 설정 업데이트 실패:', error);
    }
  };

  if (!project) {
    return <DashboardSkeleton />;
  }

  // FP 컴포넌트별 색상 정의
  const componentColors = {
    'Internal Logical Files': 'ilf',
    'External Logical Files': 'elf',
    'External Inquires': 'eq',
    'External Outputs': 'eo',
    'External Inputs': 'ei',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <ProjectPathHeader project={currentProject} />
        <div className="py-8">
          {/* 주요 지표 카드 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              title="Total FP"
              value={project.stats.totalFP}
              icon={DocumentTextIcon}
              onSettingClick={() => console.log('설정')}
            />
            <Card
              title="투입 인력수"
              value={project.stats.teamSize}
              icon={UserGroupIcon}
              unit="명"
              onSettingClick={() => setIsTeamSizeModalOpen(true)}
            />
            <Card
              title="LOC"
              value={project.stats.loc.toLocaleString()}
              icon={CodeBracketIcon}
              onSettingClick={() => setIsLanguageModalOpen(true)}
            />
            <Card
              title="예상 개발 기간"
              value={project.stats.duration}
              icon={ClockIcon}
              onSettingClick={() => setIsEstimationModalOpen(true)}
            />
            <Card
              title="보정 전 개발 원가"
              value={project.stats.costBefore.toLocaleString()}
              icon={CurrencyDollarIcon}
              unit="원"
              onSettingClick={() => console.log('설정')}
            />
            <Card
              title="보정 후 개발 원가"
              value={project.stats.costAfter.toLocaleString()}
              icon={CurrencyDollarIcon}
              unit="원"
              onSettingClick={() => console.log('설정')}
            />
          </div>

          {/* FP Component Breakdown */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                FP Component Breakdown
              </h2>
              <div className="space-y-6">
                {project.components.map((component) => (
                  <ProgressBar
                    key={component.name}
                    label={component.name}
                    value={component.value}
                    maxValue={100}
                    color={componentColors[component.name]}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 프로젝트 상세 정보 */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                프로젝트 정보
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    프로젝트 ID
                  </span>
                  <p className="mt-1">{project.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    RFP 파일
                  </span>
                  <p className="mt-1">{project.rfpFile}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    마지막 업데이트
                  </span>
                  <p className="mt-1">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                버전 히스토리
              </h2>
              {project.versionList?.length > 0 ? (
                <ul className="space-y-3">
                  {project.versionList.map((version, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>버전 {index + 1}</span>
                      <span className="text-sm text-gray-500">
                        {new Date().toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">버전 정보가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <EstimationModal
        isOpen={isEstimationModalOpen}
        onClose={() => setIsEstimationModalOpen(false)}
        onSubmit={handleEstimationSubmit}
      />

      <LanguageSelect
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        onSubmit={handleLanguageSubmit}
        enableAdvancedMode={true}
        initialSelectedLanguages={selectedLanguages}
      />

      <TeamSizeModal
        isOpen={isTeamSizeModalOpen}
        onClose={() => setIsTeamSizeModalOpen(false)}
        onSubmit={handleTeamSizeSubmit}
        initialTeamSize={project?.stats.teamSize || 1}
      />
    </div>
  );
}
