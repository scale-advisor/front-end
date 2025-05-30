import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';

const InviteModal = ({ isOpen, onClose, projectId, onRefresh }) => {
  const [inviteType, setInviteType] = useState('email'); // 'email' or 'link'
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isLinkLoading, setIsLinkLoading] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  useEffect(() => {
    // 링크 탭으로 전환될 때 초대 링크 가져오기
    const fetchInvitationLink = async () => {
      if (inviteType === 'link' && !link) {
        setIsLinkLoading(true);
        try {
          const response = await api.post(
            `/projects/${projectId}/invitations/link`,
          );
          console.log(response.data);
          setLink(
            `${process.env.NEXT_PUBLIC_BASE_URL}${response.data.invitationLink}`,
          );
        } catch (error) {
          console.error('초대 링크 가져오기 실패:', error);
        } finally {
          setIsLinkLoading(false);
        }
      }
    };

    fetchInvitationLink();
  }, [inviteType, projectId, link]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inviteType === 'email' && email) {
      setIsInviting(true);
      try {
        await api.post(`/projects/${projectId}/invitation/request`, {
          email: email,
          invitationUrl: process.env.NEXT_PUBLIC_BASE_URL,
        });
        setEmail('');
        setInviteSuccess(true);
        if (onRefresh) onRefresh(); // 성공 시 멤버 새로고침
        setTimeout(() => setInviteSuccess(false), 2000);
      } catch (error) {
        console.error(
          '초대 요청 실패:',
          error.response?.data?.message || error.message,
        );
      } finally {
        setIsInviting(false);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2초 후 상태 초기화
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[480px] relative">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold ml-3">팀원 초대하기</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6">
          {/* 탭 */}
          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                inviteType === 'email'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setInviteType('email')}
            >
              이메일로 초대하기
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                inviteType === 'link'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setInviteType('link')}
            >
              링크 공유하기
            </button>
          </div>

          {/* 이메일 초대 폼 */}
          {inviteType === 'email' && (
            <form onSubmit={handleSubmit}>
              {inviteSuccess && (
                <div className="mb-4 p-2 bg-green-50 border-l-4 border-green-400 text-green-700">
                  초대가 성공적으로 완료되었습니다!
                </div>
              )}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  팀원의 이메일 주소를 입력하세요
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="팀원의 이메일 주소를 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={isInviting}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium ${
                  isInviting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isInviting ? '초대 중...' : '초대하기'}
              </button>
            </form>
          )}

          {/* 링크 공유 */}
          {inviteType === 'link' && (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  초대 링크
                </label>
                <div className="flex">
                  <input
                    type="text"
                    defaultValue={
                      isLinkLoading ? '링크를 가져오는 중...' : link
                    }
                    readOnly
                    className="flex-1 px-4 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50"
                  />
                  <button
                    onClick={handleCopyLink}
                    disabled={isLinkLoading}
                    className={`px-4 py-2 flex items-center transition-all duration-200 ${
                      isLinkLoading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-l-0 border-gray-300 rounded-r-lg'
                        : isCopied
                          ? 'bg-green-100 text-green-700 border border-l-0 border-green-300 rounded-r-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-l-0 border-gray-300 rounded-r-lg'
                    }`}
                  >
                    {isLinkLoading ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                    ) : isCopied ? (
                      <>
                        <svg
                          className="w-5 h-5 mr-1"
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
                        복사완료
                      </>
                    ) : (
                      '복사하기'
                    )}
                  </button>
                </div>
                {isCopied && (
                  <p className="mt-2 text-sm text-green-600 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    클립보드에 복사되었습니다
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 주의사항 */}
          <div className="mt-6 bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center text-orange-800 mb-2">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                초대된 팀원은 다음과 같은 기능을 사용할 수 있습니다.
              </span>
            </div>
            <ul className="text-sm text-orange-700 ml-7 list-disc">
              <li>프로젝트 분석 보기</li>
              <li>보고서 리스트 확인</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
