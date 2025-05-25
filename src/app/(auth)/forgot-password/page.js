'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AuthSidebar from '@/components/AuthSidebar';
import api from '@/lib/axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const pwdResetRedirectUrl =
    typeof window !== 'undefined' ? window.location.origin : '';
  // 비밀번호 찾기 요청 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log(pwdResetRedirectUrl);
      // 백엔드 API 호출
      await api.post('/auth/password-reset/request', {
        email,
        pwdResetRedirectUrl,
      });

      // 성공 시 제출 상태로 변경
      setIsSubmitted(true);
    } catch (err) {
      // 오류 처리
      console.error('비밀번호 찾기 오류:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('비밀번호 찾기 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-auto">
      {/* 왼쪽 섹션 - AuthSidebar 컴포넌트 */}
      <AuthSidebar />

      {/* 오른쪽 섹션 - 비밀번호 찾기 폼 */}
      <motion.div
        className="w-full md:w-3/5 flex items-center justify-center bg-white p-6 md:p-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md p-6">
          {!isSubmitted ? (
            <>
              {/* 자물쇠 아이콘 */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-blue-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center text-gray-800">
                비밀번호 찾기
              </h2>

              <p className="text-center text-gray-600 mb-8">
                가입하신 이메일을 입력하시면 비밀번호 재설정 링크를
                보내드립니다.
              </p>

              {/* 비밀번호 찾기 폼 */}
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                {/* 에러 메시지 표시 */}
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                    {error}
                  </div>
                )}

                {/* 이메일 입력 */}
                <div className="relative">
                  <label className="block text-sm md:text-base text-gray-600 mb-1.5">
                    이메일
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                      className={`w-full py-2.5 md:py-3 px-3 md:px-4 border ${
                        isEmailFocused ? 'border-blue-500' : 'border-gray-300'
                      } rounded-md focus:outline-none transition-all duration-200`}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2.5 md:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                    isLoading ? 'opacity-70 cursor-wait' : ''
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                  ) : (
                    '비밀번호 재설정 링크 받기'
                  )}
                </motion.button>

                <div className="text-center mt-4">
                  {' '}
                  <Link
                    href="/login"
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    {' '}
                    로그인으로 돌아가기{' '}
                  </Link>{' '}
                </div>
              </form>
            </>
          ) : (
            <>
              {/* 이메일 전송 완료 화면 */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-green-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center text-gray-800">
                이메일이 전송되었습니다
              </h2>

              <p className="text-center text-gray-600 mb-8">
                {email}로 비밀번호 재설정 링크를 보냈습니다. 메일함을
                확인해주세요.
              </p>

              <div className="text-center">
                {' '}
                <Link href="/login">
                  {' '}
                  <motion.button
                    type="button"
                    className="inline-flex justify-center py-2.5 px-6 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {' '}
                    로그인으로 돌아가기{' '}
                  </motion.button>{' '}
                </Link>{' '}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
