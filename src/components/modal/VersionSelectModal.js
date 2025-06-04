import React, { useMemo, useState } from 'react';
import useProjectStore from '@/store/useProjectStore';
import api from '@/lib/axios';

const VersionSelectModal = ({ isOpen, onClose }) => {
  const currentProject = useProjectStore((state) => state.currentProject);
  const currentVersion = useProjectStore((state) => state.currentVersion);
  const loadVersion = useProjectStore((state) => state.loadVersion);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmVersion, setDeleteConfirmVersion] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 총 버전 수 계산
  const totalVersions = currentProject?.versionList?.length || 0;

  // 버전을 트리 구조로 구성
  const versionTree = useMemo(() => {
    if (!currentProject?.versionList) return {};

    const tree = {};
    currentProject.versionList.forEach((version) => {
      const [major] = version.split('.');
      if (!tree[major]) {
        tree[major] = {
          name: `버전 ${major}`,
          versions: [],
        };
      }
      tree[major].versions.push({
        id: version,
        name: version,
        date: currentProject.updatedAt
          ? new Date(currentProject.updatedAt).toLocaleDateString()
          : '-',
      });
    });

    // 각 메이저 버전 내에서 서브버전 정렬
    Object.values(tree).forEach((majorVersion) => {
      majorVersion.versions.sort((a, b) => {
        const aVer = parseFloat(a.name);
        const bVer = parseFloat(b.name);
        return bVer - aVer; // 내림차순 정렬
      });
    });

    return tree;
  }, [currentProject]);

  const handleVersionSelect = (version) => {
    setSelectedVersion(version.id);
  };

  const handleOpenVersion = async () => {
    if (selectedVersion) {
      setIsLoading(true);
      try {
        await loadVersion(currentProject.id, selectedVersion);
        onClose();
      } catch (error) {
        console.error('버전 데이터 로드 중 오류 발생:', error);
        alert('버전 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmVersion) return;

    setIsDeleting(true);
    try {
      await api.delete(
        `/projects/${currentProject.id}/versions?versionNumber=${deleteConfirmVersion.name}`,
      );

      // 프로젝트 정보 다시 로드
      const updatedProject = await api.get(`/projects/${currentProject.id}`);
      useProjectStore.setState({ currentProject: updatedProject.data });

      setDeleteConfirmVersion(null);

      // 삭제된 버전이 현재 선택된 버전이었다면 선택 해제
      if (selectedVersion === deleteConfirmVersion.id) {
        setSelectedVersion(null);
      }

      // 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('버전 삭제 중 오류 발생:', error);
      alert('버전을 삭제하는 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (e, version) => {
    e.stopPropagation();
    if (totalVersions <= 1) {
      alert('마지막 버전은 삭제할 수 없습니다.');
      return;
    }
    setDeleteConfirmVersion(version);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-[600px] max-h-[80vh] flex flex-col shadow-2xl">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">버전 관리</h2>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-sm text-gray-500">
                  이전 버전을 확인하고 관리할 수 있습니다.
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  현재 버전: {currentVersion}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="p-6 overflow-y-auto">
          <div className="space-y-4">
            {Object.entries(versionTree).map(([majorVersion, data]) => (
              <div key={majorVersion} className="space-y-2">
                {/* 메이저 버전 */}
                <div className="group bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8">
                        <span className="text-gray-400 font-medium">
                          {majorVersion}.0
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {data.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {data.versions.length}개의 버전
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 서브 버전들 */}
                <div className="ml-8 space-y-2">
                  {data.versions.map((version) => (
                    <div
                      key={version.id}
                      onClick={() => handleVersionSelect(version)}
                      className={`group bg-white rounded-xl p-4 transition-all duration-200 border cursor-pointer
                        ${
                          selectedVersion === version.id
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-100 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex items-center justify-center">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                selectedVersion === version.id
                                  ? 'bg-blue-500'
                                  : 'bg-gray-300'
                              }`}
                            ></div>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              버전 {version.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              최종 수정일: {version.date}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDeleteClick(e, version)}
                          className={`p-2 rounded-lg ${
                            totalVersions <= 1
                              ? 'cursor-not-allowed text-gray-300'
                              : 'hover:bg-gray-100 text-red-500'
                          }`}
                          disabled={totalVersions <= 1}
                          title={
                            totalVersions <= 1
                              ? '마지막 버전은 삭제할 수 없습니다'
                              : '버전 삭제'
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            총 {currentProject?.versionList?.length || 0}개의 버전
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              onClick={handleOpenVersion}
              disabled={!selectedVersion || isLoading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                ${
                  selectedVersion && !isLoading
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {isLoading ? '불러오는 중...' : '선택한 버전 열기'}
            </button>
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {deleteConfirmVersion && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              버전 삭제 확인
            </h3>
            <p className="text-gray-600 mb-6">
              버전 {deleteConfirmVersion.name}을(를) 삭제하시겠습니까? 이 작업은
              되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmVersion(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                {isDeleting && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionSelectModal;
