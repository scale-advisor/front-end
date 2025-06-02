import React, { useState, useEffect } from 'react';
import CocomoModal from './CocomoModal';
import ProjectTypeModal from './ProjectTypeModal';
import {
  COCOMO_CONSTANTS,
  TDEV_CONSTANTS,
  EFFORT_MULTIPLIERS,
  SCALE_FACTORS,
  SCALE_FACTOR_DESCRIPTIONS,
  COST_DRIVER_DESCRIPTIONS,
  RATING_OPTIONS,
} from '@/constants/cocomo';

// RATING_OPTIONS에서 Scale Factors용 옵션 추출
const SCALE_FACTOR_OPTIONS = [
  'Very Low',
  'Low',
  'Nominal',
  'High',
  'Very High',
];

const EstimationModal = ({
  isOpen,
  onClose,
  onSubmit,
  kloc = 0,
  initialProjectType = 'ORGANIC',
}) => {
  const [isCocomoModalOpen, setIsCocomoModalOpen] = useState(false);
  const [isProjectTypeModalOpen, setIsProjectTypeModalOpen] = useState(false);
  const [selectedCocomoModel, setSelectedCocomoModel] = useState('COCOMO_I');
  const [selectedProjectType, setSelectedProjectType] =
    useState(initialProjectType);
  const [activeTab, setActiveTab] = useState('scale');

  // Scale Factors 초기화
  const [scaleFactors, setScaleFactors] = useState({
    PREC: '',
    FLEX: '',
    RESL: '',
    TEAM: '',
    PMAT: '',
  });

  // Cost Drivers 초기화
  const [costDrivers, setCostDrivers] = useState({
    RCPX: '',
    RUSE: '',
    PDIF: '',
    PERS: '',
    PREX: '',
    FCIL: '',
    SCED: '',
  });

  // 모든 Scale Factors가 선택되었는지 확인
  const isAllScaleFactorsSelected = Object.values(scaleFactors).every(
    (value) => value !== '',
  );

  // 모든 Cost Drivers가 선택되었는지 확인
  const isAllCostDriversSelected = Object.values(costDrivers).every(
    (value) => value !== '',
  );

  // 모든 항목이 선택되었는지 확인
  const isAllSelected = isAllScaleFactorsSelected && isAllCostDriversSelected;

  // Scale Factor 변경 핸들러
  const handleScaleFactorChange = (factor, value) => {
    setScaleFactors((prev) => ({
      ...prev,
      [factor]: value,
    }));
  };

  // Cost Driver 변경 핸들러
  const handleCostDriverChange = (driver, value) => {
    setCostDrivers((prev) => ({
      ...prev,
      [driver]: value,
    }));
  };

  // 모달이 처음 열릴 때만 초기값 설정
  useEffect(() => {
    if (isOpen) {
      setSelectedProjectType(initialProjectType);
    }
  }, [isOpen, initialProjectType]);

  // COCOMO II EAF (Effort Adjustment Factor) 계산
  const calculateEAF = () => {
    let eaf = 1;
    Object.entries(costDrivers).forEach(([factor, value]) => {
      if (EFFORT_MULTIPLIERS[factor] && value) {
        eaf *= EFFORT_MULTIPLIERS[factor][value] || 1;
      }
    });
    return eaf;
  };

  // COCOMO II Scale Factor 계산
  const calculateScaleFactor = () => {
    let sf = 0;
    Object.entries(scaleFactors).forEach(([factor, value]) => {
      if (SCALE_FACTORS[factor] && value) {
        sf += SCALE_FACTORS[factor][value] || 0;
      }
    });
    return sf;
  };

  // 개발 기간 계산
  const calculateDuration = () => {
    if (!kloc || kloc <= 0) return 0;

    if (selectedCocomoModel === 'COCOMO_II') {
      // COCOMO II 계산 로직
      const sf = calculateScaleFactor();
      const eaf = calculateEAF();

      // COCOMO II 기본 상수
      const a = 2.94; // COCOMO II 기본 상수
      const b = 0.91 + 0.01 * sf; // Scale Factor에 따른 지수 조정

      // 노력(Person-Month) = a * EAF * (Size)^(b)
      const effort = a * eaf * Math.pow(kloc, b);

      // 개발 기간(월) = c * (노력)^d
      const duration = TDEV_CONSTANTS.c * Math.pow(effort, TDEV_CONSTANTS.d);

      return Math.round(duration * 10) / 10;
    } else {
      // COCOMO I 계산 로직
      const constants = COCOMO_CONSTANTS[selectedProjectType];
      if (!constants) return 0;

      const effort = constants.a * Math.pow(kloc, constants.b);
      const duration = TDEV_CONSTANTS.c * Math.pow(effort, TDEV_CONSTANTS.d);

      return Math.round(duration * 10) / 10;
    }
  };


  if (!isOpen) return null;

  const handleClose = () => {
    // 취소 시에도 현재 상태 유지
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[800px] max-h-[90vh] overflow-y-auto p-8 shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">예상 개발 기간</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-8">
          {/* COCOMO 모델 선택 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label className="text-base font-semibold text-gray-800">
                COCOMO 모델 선택
              </label>
              <button
                onClick={() => setIsCocomoModalOpen(true)}
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex gap-4">
              <label
                className={`flex items-center px-4 py-3 rounded-lg border cursor-pointer transition-all w-1/2 ${
                  selectedCocomoModel === 'COCOMO_I'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="cocomoModel"
                  value="COCOMO_I"
                  checked={selectedCocomoModel === 'COCOMO_I'}
                  onChange={(e) => setSelectedCocomoModel(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-0"
                />
                <span className="ml-3 text-base text-gray-700">COCOMO I</span>
              </label>
              <label
                className={`flex items-center px-4 py-3 rounded-lg border cursor-pointer transition-all w-1/2 ${
                  selectedCocomoModel === 'COCOMO_II'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="cocomoModel"
                  value="COCOMO_II"
                  checked={selectedCocomoModel === 'COCOMO_II'}
                  onChange={(e) => setSelectedCocomoModel(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-0"
                />
                <span className="ml-3 text-base text-gray-700">COCOMO II</span>
              </label>
            </div>
          </div>

          {/* KLOC 및 개발 기간 표시 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">현재 KLOC</div>
            <div className="text-2xl font-semibold text-gray-900">
              {kloc.toLocaleString()} KLOC
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600">예상 개발 기간</div>
            <div className="text-2xl font-semibold text-blue-900">
              {calculateDuration()} 개월
            </div>
            <div className="mt-2 text-sm text-blue-600">
              *{' '}
              {selectedCocomoModel === 'COCOMO_I'
                ? `COCOMO I ${selectedProjectType.toLowerCase()} 모델`
                : 'COCOMO II'}{' '}
              기준
            </div>
          </div>

          {/* COCOMO I/II에 따른 설정 UI */}
          {selectedCocomoModel === 'COCOMO_I' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="text-base font-semibold text-gray-800">
                  프로젝트 유형
                </label>
                <button
                  onClick={() => setIsProjectTypeModalOpen(true)}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <label
                  className={`flex items-center px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                    selectedProjectType === 'ORGANIC'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="projectType"
                    value="ORGANIC"
                    checked={selectedProjectType === 'ORGANIC'}
                    onChange={(e) => setSelectedProjectType(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-0"
                  />
                  <span className="ml-3 text-base text-gray-700">Organic</span>
                </label>
                <label
                  className={`flex items-center px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                    selectedProjectType === 'SEMI_DETACHED'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="projectType"
                    value="SEMI_DETACHED"
                    checked={selectedProjectType === 'SEMI_DETACHED'}
                    onChange={(e) => setSelectedProjectType(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-0"
                  />
                  <span className="ml-3 text-base text-gray-700">
                    Semi-detached
                  </span>
                </label>
                <label
                  className={`flex items-center px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                    selectedProjectType === 'EMBEDDED'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="projectType"
                    value="EMBEDDED"
                    checked={selectedProjectType === 'EMBEDDED'}
                    onChange={(e) => setSelectedProjectType(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-0"
                  />
                  <span className="ml-3 text-base text-gray-700">Embedded</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex border-b">
                <button
                  className={`px-4 py-2 font-medium text-sm transition-colors relative ${
                    activeTab === 'scale'
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('scale')}
                >
                  Scale Factors
                  {!isAllScaleFactorsSelected && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                  <div
                    className={`absolute bottom-0 left-0 w-full h-0.5 ${
                      activeTab === 'scale' ? 'bg-blue-600' : 'bg-transparent'
                    }`}
                  />
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm transition-colors relative ${
                    activeTab === 'cost'
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('cost')}
                >
                  Cost Drivers
                  {!isAllCostDriversSelected && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                  <div
                    className={`absolute bottom-0 left-0 w-full h-0.5 ${
                      activeTab === 'cost' ? 'bg-blue-600' : 'bg-transparent'
                    }`}
                  />
                </button>
              </div>

              {/* Scale Factors */}
              {activeTab === 'scale' && (
                <div className="space-y-4">
                  {Object.entries(scaleFactors).map(([factor, value]) => (
                    <div key={factor} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {factor}
                        <span className="text-gray-500">
                          ({SCALE_FACTOR_DESCRIPTIONS[factor]})
                        </span>
                      </label>
                      <select
                        value={value}
                        onChange={(e) =>
                          handleScaleFactorChange(factor, e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          value === '' ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">선택해주세요</option>
                        {SCALE_FACTOR_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {/* Cost Drivers */}
              {activeTab === 'cost' && (
                <div className="space-y-4">
                  {Object.entries(costDrivers).map(([driver, value]) => (
                    <div key={driver} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        {driver}
                        <span className="text-gray-500">
                          ({COST_DRIVER_DESCRIPTIONS[driver]})
                        </span>
                      </label>
                      <select
                        value={value}
                        onChange={(e) =>
                          handleCostDriverChange(driver, e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          value === '' ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">선택해주세요</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => {
              if (selectedCocomoModel === 'COCOMO_II' && !isAllSelected) {
                return;
              }
              onSubmit({
                cocomoModel: selectedCocomoModel,
                projectType: selectedProjectType,
                ...(selectedCocomoModel === 'COCOMO_II'
                  ? { scaleFactors, costDrivers }
                  : {}),
              });
            }}
            disabled={selectedCocomoModel === 'COCOMO_II' && !isAllSelected}
            className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${
              selectedCocomoModel === 'COCOMO_II' && !isAllSelected
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {selectedCocomoModel === 'COCOMO_II' && !isAllSelected
              ? '모든 항목을 선택해주세요'
              : '적용하기'}
          </button>
        </div>
      </div>

      <CocomoModal
        isOpen={isCocomoModalOpen}
        onClose={() => setIsCocomoModalOpen(false)}
        onSelect={(model) => {
          setSelectedCocomoModel(model);
          setIsCocomoModalOpen(false);
        }}
      />

      <ProjectTypeModal
        isOpen={isProjectTypeModalOpen}
        onClose={() => setIsProjectTypeModalOpen(false)}
        onSelect={(type) => {
          setSelectedProjectType(type);
          setIsProjectTypeModalOpen(false);
        }}
      />
    </div>
  );
};

export default EstimationModal;
