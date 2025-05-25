'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ProjectInfoForm from '@/components/project/ProjectInfoForm';
import FileUploadForm from '@/components/project/FileUploadForm';
import AnalysisForm from '@/components/project/AnalysisForm';

const CreateProjectPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState({
    name: '',
    budget: '',
    language: '',
    teamSize: '',
    description: '',
  });

  const steps = [
    { number: 1, title: '기본 정보 입력' },
    { number: 2, title: '파일 업로드' },
    { number: 3, title: '분석' },
  ];

  const handleNext = (data) => {
    setProjectData({ ...projectData, ...data });
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCancel = () => {
    // 프로젝트 목록 페이지로 이동
    router.push('/projects');
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProjectInfoForm onNext={handleNext} initialData={projectData} />
        );
      case 2:
        return (
          <FileUploadForm
            onNext={handleNext}
            onPrevious={handlePrevious}
            initialData={projectData}
          />
        );
      case 3:
        return (
          <AnalysisForm onPrevious={handlePrevious} projectData={projectData} />
        );
      default:
        return (
          <ProjectInfoForm onNext={handleNext} initialData={projectData} />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-4xl px-6 pt-16">
          <div className="mb-8">
            {/* 단계 표시기 */}
            <div className="bg-transparent pr-10 rounded-xl mb-6 flex justify-center">
              <div className="relative flex items-center justify-between max-w-2xl w-full">
                {steps.map((step, index) => (
                  <React.Fragment key={step.number}>
                    {/* Step Circle */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
                          ${
                            currentStep === step.number
                              ? 'bg-blue-600 text-white shadow-md'
                              : currentStep > step.number
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-white'
                          }`}
                      >
                        {step.number}
                      </div>
                      <div
                        className={`mt-3 text-sm ${
                          currentStep >= step.number
                            ? 'text-blue-600 font-bold'
                            : 'text-gray-700 font-normal'
                        }`}
                      >
                        {step.title}
                      </div>
                    </div>

                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-4 rounded-full transition-all duration-200 -mt-8
                          ${currentStep > index + 1 ? 'bg-blue-500' : 'bg-gray-200'}`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-xl p-8 shadow-md">
            {renderStepComponent()}
          </div>

          {/* 취소 버튼 */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 font-medium shadow-sm focus:outline-none"
            >
              프로젝트 생성 취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
