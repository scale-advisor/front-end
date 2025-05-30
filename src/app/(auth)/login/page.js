'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthSidebar from '@/components/layout/AuthSidebar';
import useAuthStore from '@/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);

  const handleBasicLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });

      // returnUrl이 있으면 해당 URL로, 없으면 홈으로 리다이렉트
      const searchParams = new URLSearchParams(window.location.search);
      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl) {
        router.push(decodeURIComponent(returnUrl));
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  //카카오 로그인 실행 함수
  const handleKakaoLogin = async () => {
    try {
      console.log('카카오 로그인 실행');
      const response = await api.get('/auth/kakao/authorize');
      const { redirectUrl } = response.data;

      router.push(redirectUrl);
    } catch (err) {
      console.error('카카오 로그인 오류:', err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-auto">
      {/* 왼쪽 섹션 - 설명 및 이미지 */}
      <AuthSidebar />

      {/* 오른쪽 섹션 - 로그인 폼 */}
      <motion.div
        className="w-full md:w-3/5 flex items-center justify-center bg-white p-6 md:p-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md p-6">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-gray-800">
            로그인
          </h2>

          {/* 로그인 폼 */}
          <form
            onSubmit={handleBasicLoginSubmit}
            className="space-y-5 md:space-y-6"
          >
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
                  placeholder="example@example.com"
                  required
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="relative">
              <label className="block text-sm md:text-base text-gray-600 mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className={`w-full py-2.5 md:py-3 px-3 md:px-4 border ${
                    isPasswordFocused ? 'border-blue-500' : 'border-gray-300'
                  } rounded-md focus:outline-none transition-all duration-200 pr-12`}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  로그인 상태 유지
                </label>
              </div>
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  비밀번호 찾기
                </Link>
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
                '로그인'
              )}
            </motion.button>
          </form>

          <div className="flex items-center justify-center my-6 md:my-8">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="mx-4 text-sm md:text-base text-gray-500">
              또는 소셜 계정으로 로그인
            </span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>

          {/* 카카오 로그인 버튼 */}
          <div className="mb-6">
            <motion.button
              onClick={handleKakaoLogin}
              className="w-full flex items-center justify-center py-3 px-4 rounded-md border border-[#FEE500] bg-[#FEE500] text-gray-800 font-medium shadow-sm hover:shadow-md transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Kakao 로그인"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M12 3C7.0374 3 3 6.28866 3 10.3368C3 13.0289 4.7748 15.3683 7.36155 16.5384C7.16807 17.1722 6.45509 19.5369 6.3659 19.9309C6.24932 20.4999 6.59543 20.4964 6.8356 20.3519C7.01992 20.2427 9.95582 18.2364 10.8954 17.6319C11.2605 17.678 11.6266 17.7036 12 17.7036C16.9626 17.7036 21 14.4149 21 10.3368C21 6.28866 16.9626 3 12 3Z"
                  fill="#191919"
                />
              </svg>
              카카오로 로그인
            </motion.button>
          </div>

          <p className="text-center text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              회원가입
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
