'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';

export default function InvitationAcceptPage() {
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    let isSubscribed = true;

    const acceptInvitation = async () => {
      const projectId = searchParams.get('projectId');
      const email = searchParams.get('email');
      const token = searchParams.get('token');

      if (!projectId || !email || !token) {
        if (isSubscribed) {
          setStatus('error');
          setErrorMessage('유효하지 않은 초대 링크입니다.');
        }
        return;
      }

      if (!isLoggedIn()) {
        // 로그인 페이지로 리다이렉트하면서 현재 URL을 returnUrl로 저장
        const currentUrl = window.location.href;
        router.push(`/login?returnUrl=${encodeURIComponent(currentUrl)}`);
        return;
      }

      try {
        await api.post(
          `/invitation/accept?projectId=${projectId}&email=${email}&token=${token}`,
        );
        if (isSubscribed) {
          setStatus('success');
          // 5초 후 프로젝트 목록 페이지로 이동
          setTimeout(() => {
            router.push('/projects');
          }, 5000);
        }
      } catch (error) {
        console.log(error);
        if (isSubscribed) {
          setStatus('error');
          setErrorMessage(
            error.response?.data?.message ||
              '초대 수락 중 오류가 발생했습니다.',
          );
        }
      }
    };

    acceptInvitation();

    return () => {
      isSubscribed = false;
    };
  }, [searchParams, router, isLoggedIn]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">초대 수락 중입니다...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              초대 수락 완료!
            </h2>
            <p className="text-gray-600 mb-4">
              프로젝트 초대를 성공적으로 수락했습니다.
            </p>
            <p className="text-sm text-gray-500">
              잠시 후 프로젝트 목록 페이지로 이동합니다...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
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
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              오류가 발생했습니다
            </h2>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <button
              onClick={() => router.push('/projects')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              프로젝트 목록으로 이동
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
