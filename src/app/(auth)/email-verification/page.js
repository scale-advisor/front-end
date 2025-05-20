'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import AuthSidebar from '@/components/AuthSidebar';

// useSearchParams를 사용하는 컴포넌트를 분리
function EmailVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState('');
  const [initialSent, setInitialSent] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const confirmSignupUrl = 'http://localhost:3000';

  // 페이지 로드 시 자동으로 이메일 전송
  useEffect(() => {
    const sendInitialEmail = async () => {
      if (!email || initialSent) return;

      try {
        setError('');
        // 초기 이메일 전송 API 호출 (isResending 상태 변경 없음)
        await api.post('/auth/email-verification/request', {
          email,
          confirmSignupUrl,
        });

        setInitialSent(true);
      } catch (err) {
        console.error('이메일 전송 오류:', err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('이메일 전송 중 오류가 발생했습니다.');
        }
      }
    };

    sendInitialEmail();
  }, [email, initialSent, confirmSignupUrl]);

  // 쿨다운 타이머
  useEffect(() => {
    if (!cooldown) return;

    if (remainingTime <= 0) {
      setCooldown(false);
      return;
    }

    const timer = setTimeout(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown, remainingTime]);

  // 이메일 재전송 요청 함수 (버튼 클릭 시에만 호출)
  const handleResendEmail = async () => {
    if (isResending || !email || cooldown) return;

    try {
      setIsResending(true);
      setError('');

      // 이메일 재전송 API 호출
      await api.post('/auth/email-verification/request', {
        email,
        confirmSignupUrl,
      });

      // 재전송 성공 시 쿨다운 시작
      setCooldown(true);
      setRemainingTime(60);

      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000); // 5초 후 성공 메시지 숨김
    } catch (err) {
      console.error('이메일 재전송 오류:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('이메일 재전송 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-auto">
      {/* 왼쪽 섹션 - AuthSidebar 컴포넌트 */}
      <AuthSidebar />

      {/* 오른쪽 섹션 - 이메일 확인 컨텐츠 */}
      <motion.div
        className="w-full md:w-3/5 flex items-center justify-center bg-white p-6 md:p-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md p-6">
          <div className="flex flex-col items-center">
            {/* 이메일 아이콘 */}
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-blue-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center text-gray-800">
              이메일을 확인해주세요
            </h2>

            {/* 에러 메시지 표시 */}
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md mb-4 w-full">
                {error}
              </div>
            )}

            <p className="text-gray-600 text-center mb-8">
              {email ? (
                <>
                  <span className="font-semibold text-blue-600">{email}</span>{' '}
                  주소로
                  <br />
                  인증 링크가 포함된 이메일을 전송했습니다.
                </>
              ) : (
                <>
                  가입하신 이메일 주소로
                  <br />
                  인증 링크가 포함된 이메일을 전송했습니다.
                </>
              )}
              <br />
              <span className="mt-2 block">
                메일함을 확인하고 인증 링크를 클릭하여 가입을 완료해주세요.
              </span>
            </p>

            {/* 성공 메시지 표시 */}
            {resendSuccess && (
              <div className="p-3 text-sm text-green-500 bg-green-50 rounded-md mb-4 w-full">
                인증 이메일이 성공적으로 재전송되었습니다.
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <motion.button
                onClick={() => router.push('/')}
                className="w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                홈으로 가기
              </motion.button>

              <motion.button
                onClick={handleResendEmail}
                disabled={isResending || !email || cooldown}
                className={`w-full py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm md:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isResending || !email || cooldown ? 'opacity-70 cursor-not-allowed' : ''}`}
                whileHover={{ scale: cooldown ? 1 : 1.01 }}
                whileTap={{ scale: cooldown ? 1 : 0.99 }}
              >
                {isResending ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 text-gray-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    처리 중...
                  </div>
                ) : cooldown ? (
                  `${remainingTime}초 후 재전송 가능`
                ) : (
                  '이메일 다시 보내기'
                )}
              </motion.button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              이메일을 받지 못하셨나요?{' '}
              <a
                href="mailto:support@example.com"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                고객센터 문의하기
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// 메인 페이지 컴포넌트
export default function EmailVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <EmailVerificationContent />
    </Suspense>
  );
}
