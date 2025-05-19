'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AuthSidebar from '@/components/AuthSidebar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 로그인 로직 구현
    console.log('로그인 시도:', { email, password, rememberMe });
  };

  const slides = [
    {
      title: '쉽고 편하게 프로젝트 규모를 추정하세요',
      description:
        '규모산정 자원시간 업데이트 FP, SV/정량, LOC 등을 분석하실 수 있습니다. 목록보기로 프로젝트를 관리하세요!',
      image: 'path/to/estimate-project-size-image.jpg',
    },
    {
      title: '직관적인 분석 도구로 데이터를 시각화하세요',
      description:
        '다양한 차트와 그래프를 통해 프로젝트 진행 상황을 한눈에 파악할 수 있습니다.',
      image: 'path/to/visualize-data-image.jpg',
    },
    {
      title: '팀과 실시간으로 협업하세요',
      description:
        '팀원들과 함께 프로젝트를 관리하고 실시간으로 변경사항을 확인할 수 있습니다.',
      image: 'path/to/collaborate-in-real-time-image.jpg',
    },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-auto">
      {/* 왼쪽 섹션 - 설명 및 이미지 */}
      <AuthSidebar slides={slides} />

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

          {/* 소셜 로그인 버튼들 */}
          <div className="flex justify-center space-x-6 mb-8">
            <motion.button
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Google 로그인"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path
                    fill="#4285F4"
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                  />
                </g>
              </svg>
            </motion.button>

            <motion.button
              className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="GitHub 로그인"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  fill="#333"
                />
              </svg>
            </motion.button>

            <motion.button
              className="w-12 h-12 flex items-center justify-center rounded-full border border-[#FEE500] bg-[#FEE500] text-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Kakao 로그인"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3C7.0374 3 3 6.28866 3 10.3368C3 13.0289 4.7748 15.3683 7.36155 16.5384C7.16807 17.1722 6.45509 19.5369 6.3659 19.9309C6.24932 20.4999 6.59543 20.4964 6.8356 20.3519C7.01992 20.2427 9.95582 18.2364 10.8954 17.6319C11.2605 17.678 11.6266 17.7036 12 17.7036C16.9626 17.7036 21 14.4149 21 10.3368C21 6.28866 16.9626 3 12 3Z"
                  fill="#191919"
                />
              </svg>
            </motion.button>
          </div>

          <div className="flex items-center justify-center mb-6 md:mb-8">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="mx-4 text-sm md:text-base text-gray-500">
              또는
            </span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
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
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  비밀번호 찾기
                </a>
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 md:py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                로그인
              </motion.button>
            </div>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">
                아직 계정이 없으신가요?{' '}
                <a
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  회원가입
                </a>
              </span>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
