'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 회원가입 로직 구현
    console.log('회원가입 시도:', { email, password, agreeTerms });
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const slides = [
    {
      title: '프로젝트 관리가 더 쉬워집니다',
      description:
        '회원가입 후 프로젝트 관리 도구를 통해 업무 효율성을 높이고 팀과 원활하게 소통하세요.',
      svgImage: (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="bg-gradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#e3f2fd" />
              <stop offset="100%" stopColor="#bbdefb" />
            </linearGradient>
          </defs>
          <rect
            x="50"
            y="60"
            width="300"
            height="200"
            rx="15"
            fill="url(#bg-gradient1)"
            stroke="#64b5f6"
            strokeWidth="3"
          />

          {/* 프로젝트 관리 도구 사용 이미지 */}
          <rect
            x="70"
            y="80"
            width="260"
            height="160"
            fill="#90caf9"
            opacity="0.8"
          />
          <text
            x="200"
            y="150"
            fontFamily="Arial"
            fontSize="24"
            fill="#1565c0"
            fontWeight="bold"
            textAnchor="middle"
          >
            프로젝트 관리
          </text>
          <circle cx="150" cy="120" r="10" fill="#64b5f6" />
          <circle cx="250" cy="120" r="10" fill="#64b5f6" />
          <rect x="130" y="180" width="140" height="20" fill="#64b5f6" />
        </svg>
      ),
    },
    {
      title: '데이터 중심 의사결정으로 성과를 높이세요',
      description:
        '다양한 분석 도구와 대시보드를 활용하여 비즈니스 인사이트를 얻고 데이터 기반의 의사결정을 내리세요.',
      svgImage: (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="bg-gradient2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f3e5f5" />
              <stop offset="100%" stopColor="#e1bee7" />
            </linearGradient>
          </defs>
          <rect
            x="50"
            y="60"
            width="300"
            height="200"
            rx="15"
            fill="url(#bg-gradient2)"
            stroke="#ab47bc"
            strokeWidth="3"
          />

          {/* 데이터 분석 대시보드 사용 이미지 */}
          <rect
            x="70"
            y="80"
            width="260"
            height="160"
            fill="#ce93d8"
            opacity="0.8"
          />
          <text
            x="200"
            y="150"
            fontFamily="Arial"
            fontSize="24"
            fill="#ffffff"
            fontWeight="bold"
            textAnchor="middle"
          >
            데이터 분석
          </text>
          <rect x="100" y="120" width="200" height="20" fill="#9c27b0" />
          <rect x="100" y="160" width="200" height="20" fill="#9c27b0" />
          <circle cx="200" cy="200" r="15" fill="#9c27b0" />
        </svg>
      ),
    },
    {
      title: '지금 바로 시작하세요',
      description:
        '회원가입 후 즉시 사용 가능한 플랫폼으로 비즈니스 성장을 가속화하세요. 첫 달 무료 체험을 놓치지 마세요!',
      svgImage: (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="bg-gradient3"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#e8f5e9" />
              <stop offset="100%" stopColor="#c8e6c9" />
            </linearGradient>
          </defs>
          <rect
            x="50"
            y="60"
            width="300"
            height="200"
            rx="15"
            fill="url(#bg-gradient3)"
            stroke="#66bb6a"
            strokeWidth="3"
          />

          {/* 플랫폼 시작 이미지 */}
          <rect
            x="100"
            y="100"
            width="200"
            height="150"
            fill="#4caf50"
            opacity="0.8"
          />
          <text
            x="200"
            y="150"
            fontFamily="Arial"
            fontSize="24"
            fill="#ffffff"
            fontWeight="bold"
            textAnchor="middle"
          >
            시작하기
          </text>
          <polygon points="200,120 220,180 180,180" fill="#ffffff" />
        </svg>
      ),
    },
  ];

  // 자동 슬라이드 기능 구현
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // 5초마다 슬라이드 변경

    return () => clearInterval(slideInterval); // 컴포넌트 언마운트 시 타이머 제거
  }, [slides.length]);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-auto">
      {/* 왼쪽 섹션 - 설명 및 이미지 */}
      <motion.div
        className="w-full md:w-2/5 bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-10 flex flex-col"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 md:mb-8">
          <h2 className="text-blue-600 text-2xl font-bold">Scale Advisor</h2>
        </div>

        <div className="mt-6 md:mt-10">
          <motion.div
            key={activeSlide}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="h-auto md:h-48"
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">
              {slides[activeSlide].title.split(' ').slice(0, -1).join(' ')}
            </h1>
            <h1 className="text-2xl md:text-3xl font-bold">
              {slides[activeSlide].title.split(' ').slice(-1)[0]}
            </h1>

            <p className="text-sm md:text-base text-gray-600 mt-4 md:mt-6 leading-relaxed">
              {slides[activeSlide].description}
            </p>
          </motion.div>
        </div>

        {/* 이미지 */}
        <div className="flex justify-center items-center flex-grow relative mt-4 md:mt-6">
          <motion.div
            key={`image-${activeSlide}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-56 h-56 md:w-80 md:h-80 relative"
          >
            <div className="bg-white w-full h-full rounded-2xl flex items-center justify-center shadow-lg">
              {slides[activeSlide].svgImage}
            </div>
          </motion.div>
        </div>

        {/* 하단 인디케이터 */}
        <div className="flex justify-center gap-2 md:gap-3 mt-6 md:mt-8 mb-4">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 md:h-2.5 rounded-full cursor-pointer ${activeSlide === index ? 'bg-blue-500 w-4 md:w-5' : 'bg-gray-300 w-2 md:w-2.5'}`}
              onClick={() => setActiveSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      </motion.div>

      {/* 오른쪽 섹션 - 회원가입 폼 */}
      <motion.div
        className="w-full md:w-3/5 flex items-center justify-center bg-white p-6 md:p-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md p-6">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-gray-800">
            회원가입
          </h2>

          {/* 회원가입 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
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
                    isEmailFocused
                      ? 'border-blue-500 ring-1 ring-blue-200'
                      : 'border-gray-300'
                  } rounded-lg bg-white focus:outline-none text-sm md:text-base transition-all duration-300`}
                  placeholder="이메일을 입력하세요"
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
                    isPasswordFocused
                      ? 'border-blue-500 ring-1 ring-blue-200'
                      : 'border-gray-300'
                  } rounded-lg bg-white focus:outline-none text-sm md:text-base transition-all duration-300`}
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors duration-300"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 비밀번호 확인 입력 */}
            <div className="relative">
              <label className="block text-sm md:text-base text-gray-600 mb-1.5">
                비밀번호 확인
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setIsConfirmPasswordFocused(true)}
                  onBlur={() => setIsConfirmPasswordFocused(false)}
                  className={`w-full py-2.5 md:py-3 px-3 md:px-4 border ${
                    isConfirmPasswordFocused
                      ? 'border-blue-500 ring-1 ring-blue-200'
                      : 'border-gray-300'
                  } rounded-lg bg-white focus:outline-none text-sm md:text-base transition-all duration-300`}
                  placeholder="비밀번호를 다시 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors duration-300"
                >
                  {showConfirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="flex items-start pt-2">
              <div
                className="relative w-5 h-5 cursor-pointer group mt-0.5"
                onClick={() => setAgreeTerms(!agreeTerms)}
              >
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                  className="sr-only"
                />
                <motion.div
                  initial={{ backgroundColor: '#fff' }}
                  animate={{
                    backgroundColor: agreeTerms ? '#3b82f6' : '#fff',
                    borderColor: agreeTerms ? '#3b82f6' : '#d1d5db',
                  }}
                  transition={{ duration: 0.1 }}
                  className={`w-5 h-5 border rounded transition-colors duration-200 flex items-center justify-center`}
                >
                  {agreeTerms && (
                    <motion.svg
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.1 }}
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </motion.svg>
                  )}
                </motion.div>
              </div>
              <label
                htmlFor="terms"
                className="text-sm md:text-base text-gray-600 cursor-pointer ml-2"
              >
                <span>이용약관 및 개인정보처리방침에 동의합니다.</span>{' '}
                <motion.a
                  href="#"
                  className="text-blue-500 hover:text-blue-700 transition-colors  font-medium"
                  whileHover={{ scale: 1.03 }}
                >
                  약관 보기
                </motion.a>
              </label>
            </div>

            {/* 회원가입 버튼 */}
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl py-3 md:py-3.5 font-medium transition-all duration-300 shadow-md mt-6"
              whileHover={{
                scale: 1.02,
                boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              가입하기
            </motion.button>
          </form>

          {/* 구분선 */}
          <div className="flex items-center justify-center my-6 md:my-8">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="mx-4 text-sm md:text-base text-gray-500">
              또는
            </span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>

          {/* 구글로 계속하기 버튼 */}
          <motion.button
            type="button"
            className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-xl py-3 md:py-3.5 px-4 font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-all duration-300"
            whileHover={{
              scale: 1.02,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              className="mr-3"
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
            구글로 계속하기
          </motion.button>

          {/* 로그인 링크 */}
          <div className="text-center mt-6 md:mt-8 text-sm md:text-base text-gray-600">
            이미 계정이 있으신가요?{' '}
            <motion.a
              href="/login"
              className="text-blue-500 hover:text-blue-700 transition-colors duration-300 font-medium"
              whileHover={{ scale: 1.03 }}
            >
              로그인
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
