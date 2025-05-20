'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';
import AuthSidebar from '@/components/AuthSidebar';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // 비밀번호 조건 검증 함수
  const validatePassword = (value) => {
    // 최소 8자 이상
    const lengthValid = value.length >= 8;
    // 영문 포함
    const hasLetter = /[A-Za-z]/.test(value);
    // 숫자 포함
    const hasNumber = /\d/.test(value);
    // 특수문자 포함
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!value) return '';
    if (!lengthValid) return '비밀번호는 최소 8자 이상이어야 합니다.';
    if (!hasLetter) return '영문자를 포함해야 합니다.';
    if (!hasNumber) return '숫자를 포함해야 합니다.';
    if (!hasSpecial) return '특수문자를 포함해야 합니다.';

    return '';
  };

  // 비밀번호 입력 시 유효성 검사
  useEffect(() => {
    if (password) {
      const error = validatePassword(password);
      setPasswordError(error);
    } else {
      setPasswordError('');
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 조건 검증
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }

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
      // API 요청 URL 로그 출력
      const endpoint = '/auth/sign-up';
      console.log('API 요청 URL:', api.defaults.baseURL + endpoint);

      // 백엔드 API 호출
      await api.post(endpoint, {
        name,
        email,
        password,
      });

      // 회원가입 성공 시 이메일 확인 페이지로 이동
      router.push(`/email-verification?email=${encodeURIComponent(email)}`);
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

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-auto">
      {/* 왼쪽 섹션 - AuthSidebar 컴포넌트 */}
      <AuthSidebar />

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

            {/* 이름 입력 필드 */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm md:text-base text-gray-600 mb-1.5"
              >
                이름
              </label>
              <div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                  required
                  placeholder="이름을 입력하세요"
                  className={`w-full py-2.5 md:py-3 px-3 md:px-4 border ${
                    isNameFocused ? 'border-blue-500' : 'border-gray-300'
                  } rounded-md focus:outline-none transition-all duration-200`}
                />
              </div>
            </div>

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
                    isPasswordFocused
                      ? 'border-blue-500'
                      : passwordError
                        ? 'border-red-400'
                        : 'border-gray-300'
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
              {password && passwordError ? (
                <p className="mt-1 text-xs text-red-500">{passwordError}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  8자 이상의 영문, 숫자, 특수문자 조합
                </p>
              )}
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
                isLoading
                  ? 'opacity-100 cursor-wait'
                  : !agreeTerms || password !== confirmPassword
                    ? 'opacity-100 cursor-not-allowed'
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
              <Link
                className="font-medium text-blue-600 hover:text-blue-500"
                href="/login"
              >
                로그인
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
