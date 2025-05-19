'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function RegisterPage() {
  const router = useRouter();
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
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 일치 검증
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 약관 동의 확인
    if (!agreeTerms) {
      setError('이용약관에 동의해주세요.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // 백엔드 API 호출
      await api.post('/auth/register', {
        email,
        password,
      });

      // 회원가입 성공 시 이메일 전송 완료 페이지로 이동
      router.push('/login?registered=true');
    } catch (err) {
      // 오류 처리
      console.error('회원가입 오류:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
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
        className="w-full md:w-3/5 bg-white p-6 md:p-10 flex items-center justify-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md p-6">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-center text-gray-800">
            회원가입
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* 에러 메시지 표시 */}
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            {/* 이메일 입력 필드 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm md:text-base text-gray-600 mb-1.5"
              >
                이메일
              </label>
              <div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  required
                  placeholder="example@example.com"
                  className={`w-full py-2.5 md:py-3 px-3 md:px-4 border ${
                    isEmailFocused ? 'border-blue-500' : 'border-gray-300'
                  } rounded-md focus:outline-none transition-all duration-200`}
                />
              </div>
            </div>

            {/* 비밀번호 입력 필드 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm md:text-base text-gray-600 mb-1.5"
              >
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  required
                  placeholder="비밀번호를 입력하세요"
                  className={`w-full py-2.5 md:py-3 px-3 md:px-4 border ${
                    isPasswordFocused ? 'border-blue-500' : 'border-gray-300'
                  } rounded-md focus:outline-none transition-all duration-200 pr-12`}
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
              <p className="mt-1 text-xs text-gray-500">
                8자 이상의 영문, 숫자, 특수문자 조합
              </p>
            </div>

            {/* 비밀번호 확인 입력 필드 */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm md:text-base text-gray-600 mb-1.5"
              >
                비밀번호 확인
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setIsConfirmPasswordFocused(true)}
                  onBlur={() => setIsConfirmPasswordFocused(false)}
                  required
                  placeholder="비밀번호를 다시 입력하세요"
                  className={`w-full py-2.5 md:py-3 px-3 md:px-4 border ${
                    isConfirmPasswordFocused
                      ? 'border-blue-500'
                      : 'border-gray-300'
                  } rounded-md focus:outline-none transition-all duration-200 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                >
                  {showConfirmPassword ? (
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
              {password && confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>

            {/* 이용약관 동의 */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  <a
                    href="#"
                    className="text-blue-600 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      // 이용약관 보기 로직 추가
                    }}
                  >
                    이용약관
                  </a>{' '}
                  및{' '}
                  <a
                    href="#"
                    className="text-blue-600 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      // 개인정보처리방침 보기 로직 추가
                    }}
                  >
                    개인정보처리방침
                  </a>
                  에 동의합니다
                </label>
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <motion.button
              type="submit"
              disabled={
                isLoading || !agreeTerms || password !== confirmPassword
              }
              className={`w-full flex justify-center py-2.5 md:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                isLoading || !agreeTerms || password !== confirmPassword
                  ? 'opacity-70 cursor-not-allowed'
                  : ''
              }`}
              whileHover={{
                scale: agreeTerms && password === confirmPassword ? 1.01 : 1,
              }}
              whileTap={{
                scale: agreeTerms && password === confirmPassword ? 0.99 : 1,
              }}
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
                '회원가입'
              )}
            </motion.button>

            <p className="mt-4 text-center text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <a
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                로그인
              </a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
