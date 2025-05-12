'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 로그인 로직 구현
    console.log('로그인 시도:', { email, password, rememberMe });
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
              <img
                src={slides[activeSlide].image}
                alt={slides[activeSlide].title}
                className="w-full h-full object-cover"
              />
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

            {/* 로그인 상태 유지 */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <div
                  className="relative w-5 h-5 cursor-pointer group"
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="sr-only"
                  />
                  <motion.div
                    initial={{ backgroundColor: '#fff' }}
                    animate={{
                      backgroundColor: rememberMe ? '#3b82f6' : '#fff',
                      borderColor: rememberMe ? '#3b82f6' : '#d1d5db',
                    }}
                    transition={{ duration: 0.1 }}
                    className={`w-5 h-5 border rounded transition-colors duration-200 flex items-center justify-center`}
                  >
                    {rememberMe && (
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
                  htmlFor="remember"
                  className="text-sm md:text-base text-gray-600 cursor-pointer ml-2"
                >
                  로그인 상태 유지
                </label>
              </div>
              <motion.a
                href="#"
                className="text-sm md:text-base text-blue-500 hover:text-blue-700 transition-colors duration-300"
                whileHover={{ scale: 1.03 }}
              >
                비밀번호 찾기
              </motion.a>
            </div>

            {/* 로그인 버튼 */}
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl py-3 md:py-3.5 font-medium transition-all duration-300 shadow-md mt-6"
              whileHover={{
                scale: 1.02,
                boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              로그인
            </motion.button>

            {/* 회원가입 링크 */}
            <div className="text-center mt-6 md:mt-8 text-sm md:text-base text-gray-600">
              계정이 없으신가요?{' '}
              <motion.a
                href="#"
                className="text-blue-500 hover:text-blue-700 transition-colors duration-300 font-medium"
                whileHover={{ scale: 1.03 }}
              >
                회원가입
              </motion.a>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
