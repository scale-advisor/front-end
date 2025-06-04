'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import useProjectStore from '@/store/useProjectStore';
import ProjectPathHeader from '@/components/project/ProjectPathNavbar';
import RequirementList from '@/components/requirement/RequirementList';
import ProcessList from '@/components/process/ProcessList';
import ProcessAddModal from '@/components/modal/ProcessAddModal';
import RequirementAddModal from '@/components/modal/RequirementAddModal';
import ReanalyzeModal from '@/components/modal/ReanalyzeModal';
import api from '@/lib/axios';

export default function AnalysisPage() {
  const currentProject = useProjectStore((state) => state.currentProject);
  const [selectedTab, setSelectedTab] = useState('process');
  const unitProcesses = useProjectStore((state) => state.unitProcesses);
  const requirements = useProjectStore((state) => state.requirements);
  const [tempRequirements, setTempRequirements] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [isProcessAddModalOpen, setIsProcessAddModalOpen] = useState(false);
  const [isRequirementAddModalOpen, setIsRequirementAddModalOpen] =
    useState(false);
  const [isReanalyzeModalOpen, setIsReanalyzeModalOpen] = useState(false);
  const [isRecalculateSuccessModalOpen, setIsRecalculateSuccessModalOpen] =
    useState(false);

  const [processData, setProcessData] = useState(
    unitProcesses?.unitProcessList?.map((process, index) => ({
      id: process.unitProcessId,
      orderNumber: index + 1,
      requirementIdList: process.requirementIdList || [],
      name: process.unitProcessName,
      type: process.functionType,
      originalName: process.unitProcessName,
      originalType: process.functionType,
      isModified: false,
      modificationType: null,
      isAmbiguous: process.isAmbiguous,
    })) || [],
  );

  const shouldShowRecalculate = useMemo(() => {
    return processData.some(
      (process) =>
        process.type !== process.originalType &&
        process.name === process.originalName,
    );
  }, [processData]);

  const shouldShowReanalyze = useMemo(() => {
    const hasProcessNameChanges = processData.some(
      (process) => process.name !== process.originalName,
    );

    const hasNewProcesses =
      processData.length > (unitProcesses?.unitProcessList?.length || 0);

    const hasRequirementChanges =
      tempRequirements &&
      JSON.stringify(tempRequirements) !== JSON.stringify(requirements);

    return hasProcessNameChanges || hasNewProcesses || hasRequirementChanges;
  }, [processData, unitProcesses, tempRequirements, requirements]);

  useEffect(() => {
    if (requirements && !tempRequirements) {
      setTempRequirements(JSON.parse(JSON.stringify(requirements)));
    }
  }, [requirements]);

  useEffect(() => {
    console.log('Requirement Add Modal State:', isRequirementAddModalOpen);
  }, [isRequirementAddModalOpen]);

  const handleRequirementClick = (requirementIds) => {
    const requirementsArray = Array.isArray(requirements)
      ? requirements
      : requirements.requirementList || [];

    const selectedReqs = requirementsArray.filter((req) =>
      requirementIds.includes(req.requirementId),
    );

    setSelectedRequirement(selectedReqs);
    setIsModalOpen(true);
  };

  const handleUpdateProcess = (updatedProcess) => {
    const updatedProcesses = processData.map((p) =>
      p.id === updatedProcess.id ? updatedProcess : p,
    );
    setProcessData(updatedProcesses);
    setHasUnsavedChanges(true);
  };

  const handleCancelProcesses = () => {
    setProcessData(
      unitProcesses?.unitProcessList?.map((process) => ({
        id: process.unitProcessId,
        requirementIdList: process.requirementIdList || [],
        name: process.unitProcessName,
        type: process.functionType,
        originalName: process.unitProcessName,
        originalType: process.functionType,
        isModified: false,
        modificationType: null,
        isAmbiguous: process.isAmbiguous,
      })) || [],
    );
    setHasUnsavedChanges(false);
  };

  const handleSaveRequirement = async (updatedData) => {
    if (!updatedData) return;

    try {
      const updatedList = tempRequirements.requirementList.map((req) =>
        req.requirementId === updatedData.requirementId
          ? {
              ...req,
              requirementName: updatedData.requirementName,
              requirementDefinition: updatedData.requirementDefinition,
              requirementDetail: updatedData.requirementDetail,
            }
          : req,
      );

      const newTempRequirements = {
        ...tempRequirements,
        requirementList: updatedList,
      };

      setTempRequirements(newTempRequirements);
      setHasUnsavedChanges(true);
    } catch (error) {
      console.error('요구사항 수정 중 오류 발생:', error);
    }
  };

  const handleConfirmSave = async () => {
    try {
      // TODO: API 호출
      // const response = await fetch('/api/requirements', {
      //   method: 'PUT',
      //   body: JSON.stringify(tempRequirements),
      // });

      // API 호출 성공 시
      useProjectStore.setState({
        requirements: tempRequirements,
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('요구사항 저장 중 오류 발생:', error);
    }
  };

  const handleCancelChanges = () => {
    setTempRequirements(JSON.parse(JSON.stringify(requirements)));
    setHasUnsavedChanges(false);
  };

  const handleRecalculate = async () => {
    try {
      const requestBody = {
        requirementList:
          tempRequirements?.requirementList.map((req) => ({
            requirementId: req.requirementId,
            requirementNumber: req.requirementNumber,
            requirementName: req.requirementName,
            requirementDefinition: req.requirementDefinition,
            requirementDetail: req.requirementDetail,
            requirementType: req.requirementType,
          })) || [],
        unitProcessList: processData.map((process) => ({
          unitProcessId: process.id.toString(),
          unitProcessName: process.name,
          functionType: process.type,
          isAmbiguous: process.isAmbiguous,
        })),
      };

      const response = await api.put(
        `/projects/${currentProject.id}/versions?versionNumber=1.0`,
        requestBody,
      );
      setHasUnsavedChanges(true);
      setIsRecalculateSuccessModalOpen(true);
    } catch (error) {
      console.error('재산정 중 오류 발생:', error);
      alert('재산정 중 오류가 발생했습니다.');
    }
  };

  const handleReanalyzeClick = () => {
    setIsReanalyzeModalOpen(true);
  };

  //머신러닝 분류만 하는 함수
  const handleClassify = async () => {
    try {
      // 1. 현재 데이터로 새 버전 생성
      const requestBody = {
        requirementList:
          tempRequirements?.requirementList.map((req) => ({
            requirementId: req.requirementId,
            requirementNumber: req.requirementNumber,
            requirementName: req.requirementName,
            requirementDefinition: req.requirementDefinition,
            requirementDetail: req.requirementDetail,
            requirementType: req.requirementType,
          })) || [],
        unitProcessList: processData.map((process) => ({
          unitProcessId: process.id.toString(),
          unitProcessName: process.name,
          functionType: process.type,
          isAmbiguous: process.isAmbiguous,
        })),
      };

      // 새 버전 생성
      const currentVersion = useProjectStore.getState().currentVersion;
      console.log('currentVersion', currentVersion);

      const versionResponse = await api.post(
        `/projects/${currentProject.id}/versions?versionNumber=${currentVersion}`,
        requestBody,
      );
      console.log('newVersionNumber', versionResponse);
      const newVersionNumber = versionResponse.data.responseData.versionNumber;

      // 2. 재분석 작업 시작
      const reclassifyResponse = await api.post(
        `/projects/${currentProject.id}/reclassify?versionNumber=${newVersionNumber}`,
      );
      const jobId = reclassifyResponse.data.jobId;

      // 3. 작업 상태 확인
      const checkJobStatus = async () => {
        const jobResponse = await api.get(
          `/projects/${currentProject.id}/analysis/jobs/${jobId}`,
        );

        if (jobResponse.data.status === 'SUCCESS') {
          // 작업 완료 - 최신 버전으로 이동
          await useProjectStore
            .getState()
            .loadVersion(currentProject.id, newVersionNumber);
          return true;
        } else if (jobResponse.data.status === 'FAILED') {
          throw new Error('재분석 작업이 실패했습니다.');
        } else {
          // 아직 진행 중 - 1초 후 다시 확인
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return checkJobStatus();
        }
      };

      // 최초 상태 확인 시작
      const success = await checkJobStatus();
      if (success) {
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('재분석 중 오류 발생:', error);
      throw error;
    }
  };

  //완전 재분석 하는 함수
  const handleFullReanalyze = async () => {};

  const handleAddProcess = (newProcess) => {
    const newId = processData.length + 1;
    const maxOrderNumber = Math.max(
      ...processData.map((p) => p.orderNumber),
      0,
    );
    const processToAdd = {
      id: newId,
      orderNumber: maxOrderNumber + 1,
      name: newProcess.name,
      type: newProcess.type,
      requirementIdList: newProcess.requirementIdList,
      originalName: newProcess.name,
      originalType: newProcess.type,
      isModified: false,
      modificationType: null,
      isAmbiguous: false,
    };

    setProcessData([...processData, processToAdd]);
    setHasUnsavedChanges(true);
  };

  const handleDeleteProcess = (processId) => {
    const updatedProcesses = processData.filter(
      (process) => process.id !== processId,
    );
    setProcessData(updatedProcesses);
    setHasUnsavedChanges(true);
  };

  const handleAddRequirement = (newRequirement) => {
    const requirementToAdd = {
      requirementId: Date.now().toString(), // 임시 ID
      requirementNumber: `REQ-${(tempRequirements?.requirementList?.length || 0) + 1}`,
      ...newRequirement,
    };

    const newTempRequirements = {
      ...tempRequirements,
      requirementList: [
        ...(tempRequirements?.requirementList || []),
        requirementToAdd,
      ],
    };

    setTempRequirements(newTempRequirements);
    setHasUnsavedChanges(true);
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

            {/* 탭 네비게이션 */}
            <div className="mb-8 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setSelectedTab('process')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'process'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  단위 프로세스
                </button>
                <button
                  onClick={() => setSelectedTab('requirement')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'requirement'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  요구사항 목록
                </button>
              </nav>
            </div>

            {selectedTab === 'process' ? (
              <>
                <ProcessList
                  processData={processData}
                  requirements={requirements}
                  hasUnsavedChanges={hasUnsavedChanges}
                  onCancel={handleCancelProcesses}
                  onUpdate={handleUpdateProcess}
                  onRequirementClick={handleRequirementClick}
                  onRecalculate={handleRecalculate}
                  onReanalyze={handleReanalyzeClick}
                  showRecalculate={
                    shouldShowRecalculate && !shouldShowReanalyze
                  }
                  showReanalyze={shouldShowReanalyze}
                  hasRequirementChanges={
                    tempRequirements !== null &&
                    JSON.stringify(tempRequirements) !==
                      JSON.stringify(requirements)
                  }
                  onAddClick={() => setIsProcessAddModalOpen(true)}
                  onDelete={handleDeleteProcess}
                />
                <ProcessAddModal
                  isOpen={isProcessAddModalOpen}
                  onClose={() => setIsProcessAddModalOpen(false)}
                  onAdd={handleAddProcess}
                  metrics={[
                    { id: 'EIF', name: 'EIF' },
                    { id: 'ILF', name: 'ILF' },
                    { id: 'EO', name: 'EO' },
                    { id: 'EI', name: 'EI' },
                    { id: 'EQ', name: 'EQ' },
                  ]}
                  requirements={tempRequirements}
                />
                <ReanalyzeModal
                  isOpen={isReanalyzeModalOpen}
                  onClose={() => setIsReanalyzeModalOpen(false)}
                  onClassify={handleClassify}
                  onFullReanalyze={handleFullReanalyze}
                />
              </>
            ) : (
              <>
                <RequirementList
                  requirements={requirements}
                  tempRequirements={tempRequirements}
                  hasUnsavedChanges={hasUnsavedChanges}
                  onSave={handleConfirmSave}
                  onCancel={handleCancelChanges}
                  onUpdate={handleSaveRequirement}
                  onAddClick={() => setIsRequirementAddModalOpen(true)}
                  onRecalculate={handleRecalculate}
                  onReanalyze={handleReanalyzeClick}
                  showRecalculate={
                    shouldShowRecalculate && !shouldShowReanalyze
                  }
                  showReanalyze={shouldShowReanalyze}
                />
                <RequirementAddModal
                  isOpen={isRequirementAddModalOpen}
                  onClose={() => setIsRequirementAddModalOpen(false)}
                  onAdd={handleAddRequirement}
                />
                <ReanalyzeModal
                  isOpen={isReanalyzeModalOpen}
                  onClose={() => setIsReanalyzeModalOpen(false)}
                  onClassify={handleClassify}
                  onFullReanalyze={handleFullReanalyze}
                />
              </>
            )}
          </div>
        </div>
        {/* 재산정 성공 모달 */}
        {isRecalculateSuccessModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto transform transition-all">
              <div className="p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="rounded-full bg-green-100 p-3">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
                  재산정 완료
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  재산정이 성공적으로 수행되었습니다.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setIsRecalculateSuccessModalOpen(false)}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
