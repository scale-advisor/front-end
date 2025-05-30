'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import useAuthStore from '@/store/useAuthStore';
import api from '@/lib/axios';
import DeleteAccountModal from '@/components/modal/DeleteAccountModal';

export default function MyPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 이름 수정
  const handleNameUpdate = async () => {
    try {
      const response = await api.patch('/users/profile', { name: newName });
      updateUser({ name: newName });
      setIsEditing(false);
      setSuccess('이름이 성공적으로 변경되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('이름 변경에 실패했습니다.');
    }
  };

  // 비밀번호 변경
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await api.patch('/users/password', {
        currentPassword,
        newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('비밀번호가 성공적으로 변경되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('비밀번호 변경에 실패했습니다.');
    }
  };

  // 회원 탈퇴
  const handleDeleteAccount = async (password) => {
    try {
      await api.delete('/users/delete-user', {
        data: { pwdRequest: password },
      });
      logout();
      router.push('/');
    } catch (error) {
      throw error; // 에러를 모달로 전파
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 mt-10 overflow-auto">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            {/* 헤더 */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                마이페이지
              </h2>
            </div>

            {/* 알림 메시지 */}
            {error && (
              <div className="m-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="m-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-700">
                {success}
              </div>
            )}

            {/* 프로필 섹션 */}
            <div className="p-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  프로필 정보
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      이메일
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-gray-50 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      이름
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            onClick={handleNameUpdate}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
                          >
                            저장
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 whitespace-nowrap"
                          >
                            취소
                          </button>
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={user?.name || ''}
                            disabled
                            className="bg-gray-50 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-gray-500"
                          />
                          <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 whitespace-nowrap"
                          >
                            수정
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 비밀번호 변경 섹션 */}
              <div className="py-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  비밀번호 변경
                </h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      현재 비밀번호
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      새 비밀번호
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      새 비밀번호 확인
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    비밀번호 변경
                  </button>
                </form>
              </div>

              {/* 회원 탈퇴 섹션 */}
              <div className="pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  계정 삭제
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은
                  되돌릴 수 없습니다.
                </p>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  회원 탈퇴
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={(password) => handleDeleteAccount(password)}
      />
    </div>
  );
}
