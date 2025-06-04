'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Card from '@/components/common/Card';
import ProgressBar from '@/components/common/ProgressBar';
import EstimationModal from '@/components/modal/EstimationModal';
import LanguageSelect from '@/components/common/LanguageSelect';
import TeamSizeModal from '@/components/modal/TeamSizeModal';
import UnitCostModal from '@/components/modal/UnitCostModal';
import DashboardSkeleton from '@/components/common/DashboardSkeleton';
import ProjectPathHeader from '@/components/project/ProjectPathNavbar';
import useProjectStore from '@/store/useProjectStore';
import { LANGUAGES } from '@/constants/languages';
import {
  UserGroupIcon,
  CodeBracketIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalculatorIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import {
  COCOMO_CONSTANTS,
  TDEV_CONSTANTS,
  EFFORT_MULTIPLIERS,
  SCALE_FACTORS,
} from '@/constants/cocomo';
import AdjustmentFactorModal from '@/components/modal/AdjustmentFactorModal';
import { ADJUSTMENT_FACTORS } from '@/constants/adjustmentFactors';
import api from '@/lib/axios';

export default function ProjectDetail() {
  const params = useParams();
  const currentProject = useProjectStore((state) => state.currentProject);
  const unitProcesses = useProjectStore((state) => state.unitProcesses);
  const projectOptions = useProjectStore((state) => state.projectOptions);
  const adjustmentFactors = useProjectStore((state) => state.adjustmentFactors);
  const updateProjectOptions = useProjectStore(
    (state) => state.updateProjectOptions,
  );
  console.log(adjustmentFactors);
  // 모달 상태 관리
  const [isEstimationModalOpen, setIsEstimationModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isTeamSizeModalOpen, setIsTeamSizeModalOpen] = useState(false);
  const [isUnitCostModalOpen, setIsUnitCostModalOpen] = useState(false);
  const [isAdjustmentFactorModalOpen, setIsAdjustmentFactorModalOpen] =
    useState(false);

  // 초기 옵션과 수정된 옵션 상태 관리
  const [modifiedOptions, setModifiedOptions] = useState(null);
  console.log(adjustmentFactors);
  // projectOptions가 변경될 때마다 modifiedOptions 업데이트
  useEffect(() => {
    if (projectOptions) {
      setModifiedOptions(projectOptions);
    }
  }, [projectOptions]);

  console.log(modifiedOptions);
  // 변경 사항이 있는지 확인
  const hasChanges =
    JSON.stringify(projectOptions) !== JSON.stringify(modifiedOptions);

  // 옵션 업데이트 함수들
  const handleEstimationSubmit = (data) => {
    setModifiedOptions((prev) => ({
      ...prev,
      cocomoModel: data.cocomoModel,
      projectType: data.projectType,
      scaleFactors: data.scaleFactors,
      costDrivers: data.costDrivers,
    }));
    setIsEstimationModalOpen(false);
  };

  const handleLanguageSubmit = async (languageData) => {
    try {
      if (!languageData || !Array.isArray(languageData)) {
        console.error('유효하지 않은 언어 데이터:', languageData);
        return;
      }

      const languageList = languageData.map(({ serverKey, ratio }) => ({
        language: serverKey,
        rate: ratio,
      }));

      setModifiedOptions((prev) => ({
        ...prev,
        languageList,
      }));
      setIsLanguageModalOpen(false);
    } catch (error) {
      console.error('언어 설정 업데이트 실패:', error);
    }
  };

  const handleTeamSizeSubmit = (data) => {
    setModifiedOptions((prev) => ({
      ...prev,
      teamSize: data.teamSize,
    }));
    setIsTeamSizeModalOpen(false);
  };

  const handleUnitCostSubmit = (data) => {
    setModifiedOptions((prev) => ({
      ...prev,
      unitCost: data.unitCost,
    }));
    setIsUnitCostModalOpen(false);
  };

  const handleAdjustmentFactorSubmit = (data) => {
    setModifiedOptions((prev) => ({
      ...prev,
      adjustmentFactors: data.adjustmentFactors.map((factor) => ({
        adjustmentFactorType: factor.adjustmentFactorType,
        adjustmentFactorValue: factor.adjustmentFactorValue,
        adjustmentFactorLevel:
          ADJUSTMENT_FACTORS[factor.adjustmentFactorType].options.findIndex(
            (option) => option.value === factor.adjustmentFactorValue,
          ) + 1,
      })),
    }));
    setIsAdjustmentFactorModalOpen(false);
  };

  // 모달 닫기 핸들러들 - 취소 시 아무 것도 하지 않음
  const handleEstimationModalClose = () => {
    setIsEstimationModalOpen(false);
  };

  const handleLanguageModalClose = () => {
    setIsLanguageModalOpen(false);
  };

  const handleTeamSizeModalClose = () => {
    setIsTeamSizeModalOpen(false);
  };

  const handleUnitCostModalClose = () => {
    setIsUnitCostModalOpen(false);
  };

  const handleAdjustmentFactorModalClose = () => {
    setIsAdjustmentFactorModalOpen(false);
  };

  // 변경 사항 적용
  const handleApplyChanges = async () => {
    try {
      await updateProjectOptions(params.id, modifiedOptions, adjustmentFactors);
    } catch (error) {
      console.error('프로젝트 옵션 업데이트 실패:', error);
    }
  };

  // 변경 사항 취소 - 초기값으로 복원
  const handleCancelChanges = () => {
    setModifiedOptions(projectOptions);
  };

  const calculateTotalFP = () => {
    const weights = {
      ILF: 7.5,
      ELF: 5.4,
      EI: 4.0,
      EO: 5.2,
      EQ: 3.9,
    };

    if (!unitProcesses?.unitProcessList) return 0;

    return unitProcesses.unitProcessList
      .filter((process) => process.functionType !== 'UNDEFINED')
      .reduce((total, process) => {
        return total + (weights[process.functionType] || 0);
      }, 0);
  };

  const calculateTotalLOC = () => {
    if (
      !modifiedOptions?.languageList ||
      modifiedOptions.languageList.length === 0
    ) {
      return 0;
    }

    const totalFP = calculateTotalFP();
    let totalLOC = 0;

    modifiedOptions.languageList.forEach(({ language, rate }) => {
      const languageInfo = LANGUAGES.find((l) => l.serverKey === language);
      if (languageInfo) {
        totalLOC += totalFP * (rate / 100) * languageInfo.loc;
      }
    });

    return Math.round(totalLOC);
  };

  // FP 타입별 개수 계산
  const getFPTypeCounts = () => {
    const counts = {
      'Internal Logical Files': 0,
      'External Logical Files': 0,
      'External Inquires': 0,
      'External Outputs': 0,
      'External Inputs': 0,
    };

    if (!unitProcesses?.unitProcessList)
      return Object.entries(counts).map(([name]) => ({
        name,
        value: 0,
      }));

    unitProcesses.unitProcessList.forEach((process) => {
      switch (process.functionType) {
        case 'ILF':
          counts['Internal Logical Files']++;
          break;
        case 'ELF':
          counts['External Logical Files']++;
          break;
        case 'EQ':
          counts['External Inquires']++;
          break;
        case 'EO':
          counts['External Outputs']++;
          break;
        case 'EI':
          counts['External Inputs']++;
          break;
      }
    });

    const total =
      Object.values(counts).reduce((sum, count) => sum + count, 0) || 1;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: Number(((count / total) * 100).toFixed(1)),
    }));
  };

  // COCOMO II EAF (Effort Adjustment Factor) 계산
  const calculateEAF = () => {
    if (!modifiedOptions?.costDrivers) return 1;

    let eaf = 1;
    Object.entries(modifiedOptions.costDrivers).forEach(([factor, value]) => {
      if (EFFORT_MULTIPLIERS[factor]) {
        eaf *= EFFORT_MULTIPLIERS[factor][value] || 1;
      }
    });
    return eaf;
  };

  // COCOMO II Scale Factor 계산
  const calculateScaleFactor = () => {
    if (!modifiedOptions?.scaleFactors) return 0;

    let sf = 0;
    Object.entries(modifiedOptions.scaleFactors).forEach(([factor, value]) => {
      if (SCALE_FACTORS[factor]) {
        sf += SCALE_FACTORS[factor][value] || 0;
      }
    });
    return sf;
  };

  // COCOMO II 개발 기간 계산
  const calculateDuration = () => {
    const kloc = calculateTotalLOC() / 1000; // KLOC으로 변환
    if (!kloc || kloc <= 0) return 0;

    // 투입 인력수가 0이면 1로 설정 (나누기 0 방지)
    const teamSize = modifiedOptions?.teamSize || 1;

    if (modifiedOptions?.cocomoModel === 'COCOMO_II') {
      // COCOMO II 계산 로직
      const sf = calculateScaleFactor();
      const eaf = calculateEAF();

      // COCOMO II 기본 상수
      const a = 2.94; // COCOMO II 기본 상수
      const b = 0.91 + 0.01 * sf; // Scale Factor에 따른 지수 조정

      // 노력(Person-Month) = a * EAF * (Size)^(b)
      const effort = a * eaf * Math.pow(kloc, b);

      // 개발 기간(월) = c * (노력/투입인력수)^d
      const duration =
        TDEV_CONSTANTS.c * Math.pow(effort / teamSize, TDEV_CONSTANTS.d);

      return Math.round(duration * 10) / 10; // 소수점 첫째자리까지 표시
    } else {
      // COCOMO I 계산 로직 (기존 코드)
      const projectType = modifiedOptions?.projectType || 'ORGANIC';
      const constants = COCOMO_CONSTANTS[projectType];
      if (!constants) return 0;

      const effort = constants.a * Math.pow(kloc, constants.b);
      // 개발 기간(월) = c * (노력/투입인력수)^d
      const duration =
        TDEV_CONSTANTS.c * Math.pow(effort / teamSize, TDEV_CONSTANTS.d);

      return Math.round(duration * 10) / 10;
    }
  };

  // 보정 후 개발원가 계산
  const calculateAdjustedCost = () => {
    // modifiedOptions이 없으면 store의 값 사용

    const factors = modifiedOptions?.adjustmentFactors || adjustmentFactors;
    console.log(factors);
    if (!factors || !modifiedOptions?.unitCost) return 0;

    // 모든 보정계수 값을 곱함
    const totalAdjustmentFactor = factors.reduce((acc, factor) => {
      return acc * parseFloat(factor.adjustmentFactorValue);
    }, 1);

    // 보정 전 개발원가 계산
    const baseCost = modifiedOptions.unitCost * calculateTotalFP();

    // 보정 후 개발원가 계산
    return Math.round(baseCost * totalAdjustmentFactor);
  };

  if (!currentProject) {
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

  const fpComponents = getFPTypeCounts();
  console.log(projectOptions);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <ProjectPathHeader project={currentProject} />

        {/* 변경 사항이 있을 때 보여줄 알림 바 */}
        {hasChanges && (
          <div className="sticky top-20 z-50 -mx-8">
            <div className="bg-blue-50 shadow-md">
              <div className="max-w-7xl mx-auto px-8 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">
                    저장되지 않은 변경 사항이 있습니다.
                  </span>
                  <div className="space-x-3">
                    <button
                      onClick={handleCancelChanges}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleApplyChanges}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      적용
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              title="예상 개발 기간"
              value={calculateDuration()}
              icon={ClockIcon}
              unit="개월"
              onSettingClick={() => setIsEstimationModalOpen(true)}
            />
            <Card
              title="투입 인력수"
              value={modifiedOptions?.teamSize || 0}
              icon={UserGroupIcon}
              unit="명"
              onSettingClick={() => setIsTeamSizeModalOpen(true)}
            />
            <Card
              title="예상 LOC"
              value={calculateTotalLOC().toLocaleString()}
              icon={CodeBracketIcon}
              onSettingClick={() => setIsLanguageModalOpen(true)}
            />
            <Card
              title="개발 단가"
              value={modifiedOptions?.unitCost?.toLocaleString() || 0}
              icon={CurrencyDollarIcon}
              unit="원"
              onSettingClick={() => setIsUnitCostModalOpen(true)}
            />
            <Card
              title="보정 전 개발원가"
              value={(
                modifiedOptions?.unitCost * calculateTotalFP()
              ).toLocaleString()}
              icon={CalculatorIcon}
              unit="원"
            />
            <Card
              title="보정 후 개발원가"
              value={calculateAdjustedCost().toLocaleString()}
              icon={AdjustmentsHorizontalIcon}
              unit="원"
              onSettingClick={() => setIsAdjustmentFactorModalOpen(true)}
            />
          </div>

          {/* FP Component Breakdown */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  FP Component Breakdown
                </h2>
                <div className="text-2xl font-semibold text-gray-900">
                  Total FP: {calculateTotalFP().toFixed(1)}
                </div>
              </div>
              <div className="space-y-6">
                {fpComponents.map((component) => (
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
                  <p className="mt-1">{projectOptions.projectId}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    RFP 파일
                  </span>
                  <p className="mt-1">{''}</p>
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
              {currentProject.versionList?.length > 0 ? (
                <ul className="space-y-3">
                  {currentProject.versionList.map((version, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>버전 {version}</span>
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

      {/* 모달들 */}
      <EstimationModal
        isOpen={isEstimationModalOpen}
        onClose={handleEstimationModalClose}
        onSubmit={handleEstimationSubmit}
        kloc={calculateTotalLOC() / 1000}
        initialProjectType={modifiedOptions?.projectType || 'ORGANIC'}
      />

      <LanguageSelect
        isOpen={isLanguageModalOpen}
        onClose={handleLanguageModalClose}
        onSubmit={handleLanguageSubmit}
        enableAdvancedMode={true}
        initialSelectedLanguages={
          modifiedOptions?.languageList?.map((lang) => lang.language) || []
        }
        initialRates={
          modifiedOptions?.languageList?.reduce((acc, lang) => {
            acc[lang.language] = lang.rate;
            return acc;
          }, {}) || {}
        }
        totalFP={calculateTotalFP()}
      />

      <TeamSizeModal
        isOpen={isTeamSizeModalOpen}
        onClose={handleTeamSizeModalClose}
        onSubmit={handleTeamSizeSubmit}
        initialTeamSize={modifiedOptions?.teamSize || 1}
      />

      <UnitCostModal
        isOpen={isUnitCostModalOpen}
        onClose={handleUnitCostModalClose}
        onSubmit={handleUnitCostSubmit}
        initialUnitCost={modifiedOptions?.unitCost || 0}
      />

      <AdjustmentFactorModal
        isOpen={isAdjustmentFactorModalOpen}
        onClose={handleAdjustmentFactorModalClose}
        onSubmit={handleAdjustmentFactorSubmit}
        initialFactors={
          (modifiedOptions?.adjustmentFactors || adjustmentFactors)?.reduce(
            (acc, factor) => {
              acc[factor.adjustmentFactorType] = factor.adjustmentFactorValue;
              return acc;
            },
            {},
          ) || {}
        }
      />
    </div>
  );
}
