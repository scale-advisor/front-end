'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';

// 이메일 인증 핸들러 컴포넌트
function EmailVerificationHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 이메일과 토큰이 모두 있는지 확인
    if (!email || !token) {
      setError('유효하지 않은 인증 링크입니다. 올바른 링크를 사용해 주세요.');
      setIsProcessing(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        // 이메일 인증 확인 API 호출
        await api.post('/auth/email-verification', {
          email,
          token,
        });

        setIsSuccess(true);
        // 이메일 인증 성공 시 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err) {
        console.error('인증 처리 오류:', err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('인증 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      } finally {
        setIsProcessing(false);
      }
    };

    verifyEmail();
  }, [email, token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <h2 className="text-center text-xl font-medium text-gray-900">
              이메일 인증 중...
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              잠시만 기다려주세요.
            </p>
          </div>
        ) : isSuccess ? (
          <div className="flex flex-col items-center justify-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-8 w-8 text-green-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-center text-xl font-medium text-gray-900">
              이메일 인증이 완료되었습니다!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              곧 로그인 페이지로 이동합니다...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-8 w-8 text-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-center text-xl font-medium text-gray-900">
              인증 실패
            </h2>
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
            <div className="mt-5">
              <button
                onClick={() => router.push('/login')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                로그인 페이지로 이동
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트
export default function AuthActionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <EmailVerificationHandler />
    </Suspense>
  );
}
