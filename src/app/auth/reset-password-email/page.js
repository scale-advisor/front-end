'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

//콜백 주소로 이동하는 페이지
// 비밀번호 재설정 핸들러 컴포넌트
function PasswordResetHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 토큰이 있는지 확인
    if (!token) {
      setError(
        '유효하지 않은 비밀번호 재설정 링크입니다. 올바른 링크를 사용해 주세요.',
      );
      setIsProcessing(false);
      return;
    }

    // 비밀번호 재설정 페이지로 리다이렉트
    router.push(`/reset-password/${token}?email=${email}`);
  }, [token, router, email]);

  // 처리 중이거나 오류가 발생한 경우에만 UI 표시
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {isProcessing && !error ? (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <h2 className="text-center text-xl font-medium text-gray-900">
              비밀번호 재설정 페이지로 이동 중...
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              잠시만 기다려주세요.
            </p>
          </div>
        ) : error ? (
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
              비밀번호 재설정 오류
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
        ) : null}
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트
export default function PasswordResetPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <PasswordResetHandler />
    </Suspense>
  );
}
