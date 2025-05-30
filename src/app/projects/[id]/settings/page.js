'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import useProjectStore from '@/store/useProjectStore';
import useAuthStore from '@/store/useAuthStore';

export default function ProjectSettingsPage() {
  const { id: projectId } = useParams();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteComplete, setIsDeleteComplete] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const currentProject = useProjectStore((state) => state.currentProject);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const currentUserRole = useProjectStore((state) => state.currentUserRole);
  const user = useAuthStore((state) => state.user);

  const CONFIRM_TEXT = '폐기하겠습니다';
  const isConfirmValid = confirmText === CONFIRM_TEXT;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage({ type: '', message: '' });

    try {
      const response = await api.put(`/projects/${projectId}`, {
        name: currentProject.name,
        description: currentProject.description,
      });

      setCurrentProject(response.data.responseData);
      setSaveMessage({
        type: 'success',
        message: '프로젝트 설정이 저장되었습니다.',
      });
    } catch (error) {
      setSaveMessage({
        type: 'error',
        message: '프로젝트 설정 저장 중 오류가 발생했습니다.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentProject({
      ...currentProject,
      [field]: value,
    });
  };

  const handleProjectDelete = async () => {
    if (!isConfirmValid) return;

    setIsLoading(true);
    try {
      await api.delete(`/projects/${projectId}`);
      setIsDeleteComplete(true);
      setTimeout(() => {
        router.push('/projects');
      }, 1500);
    } catch (error) {
      console.error('프로젝트 삭제 실패:', error);
      alert('프로젝트 삭제 중 오류가 발생했습니다.');
      setIsDeleteModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsDeleteModalOpen(false);
    setConfirmText('');
  };

  const handleLeaveProject = async () => {
    if (window.confirm('정말로 이 프로젝트를 나가시겠습니까?')) {
      setIsLoading(true);
      try {
        await api.delete(`/projects/${projectId}/users`, {
          data: { email: user.email },
        });
        router.push('/projects'); // 프로젝트 목록 페이지로 이동
      } catch (error) {
        console.error('프로젝트 나가기 실패:', error);
        alert('프로젝트 나가기 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">프로젝트 설정</h1>
          <p className="mt-1 text-sm text-gray-500">
            프로젝트의 기본 정보를 관리할 수 있습니다.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-lg shadow"
        >
          <div>
            <label
              htmlFor="projectName"
              className="block text-sm font-medium text-gray-700"
            >
              프로젝트명
            </label>
            <input
              type="text"
              id="projectName"
              value={currentProject?.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="projectDescription"
              className="block text-sm font-medium text-gray-700"
            >
              프로젝트 설명
            </label>
            <textarea
              id="projectDescription"
              value={currentProject?.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {saveMessage.message && (
            <div
              className={`p-4 rounded-md ${
                saveMessage.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {saveMessage.message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? '저장 중...' : '변경사항 저장'}
            </button>
          </div>
        </form>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-red-600 mb-4">
            {currentUserRole === 'OWNER' ? '위험 구역' : '프로젝트 나가기'}
          </h2>
          <div className="border-t border-gray-200 pt-4">
            {currentUserRole === 'OWNER' ? (
              <>
                <button
                  type="button"
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={isLoading}
                >
                  프로젝트 폐기
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  프로젝트를 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할
                  수 없습니다.
                </p>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                  onClick={handleLeaveProject}
                  disabled={isLoading}
                >
                  {isLoading ? '처리 중...' : '프로젝트 나가기'}
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  프로젝트를 나가면 더 이상 이 프로젝트에 접근할 수 없습니다.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 프로젝트 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            {!isDeleteComplete ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  프로젝트 폐기
                </h3>
                <p className="text-gray-600 mb-6">
                  정말로{' '}
                  <span className="font-semibold">{currentProject?.name}</span>{' '}
                  프로젝트를 폐기하시겠습니까?
                  <br />
                  <span className="text-sm text-red-500 mt-2 block">
                    이 작업은 되돌릴 수 없으며, 모든 프로젝트 데이터가
                    영구적으로 삭제됩니다.
                  </span>
                </p>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    확인을 위해 아래 텍스트를 입력해주세요:
                  </label>
                  <div className="text-sm text-gray-500 mb-2">
                    {CONFIRM_TEXT}
                  </div>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="텍스트를 입력하세요"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleModalClose}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleProjectDelete}
                    className={`px-4 py-2 text-white rounded-md ${
                      isConfirmValid
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                    disabled={!isConfirmValid || isLoading}
                  >
                    {isLoading ? '처리 중...' : '폐기하기'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-green-500"
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  프로젝트 폐기 완료
                </h3>
                <p className="text-gray-600">
                  프로젝트가 성공적으로 폐기되었습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
