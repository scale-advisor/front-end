'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AuthSidebar from '@/components/layout/AuthSidebar';
import api from '@/lib/axios';

export default function NewPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const [token, setToken] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // URL에서 토큰 파라미터 가져오기
  useEffect(() => {
    if (params.token) {
      setToken(params.token);
    }
  }, [params]);

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

  // 비밀번호 재설정 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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

    setIsLoading(true);

    try {
      // 백엔드 API 호출
      await api.post('/auth/password-reset', {
        token,
        newPassword: password,
      });

      // 성공 시 상태 업데이트
      setIsSuccess(true);

      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      // 오류 처리
      console.error('비밀번호 재설정 오류:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('비밀번호 재설정 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-auto">
      {/* 왼쪽 섹션 - AuthSidebar 컴포넌트 */}
      <AuthSidebar />

      {/* 오른쪽 섹션 - 비밀번호 재설정 폼 */}
      <motion.div
        className="w-full md:w-3/5 flex items-center justify-center bg-white p-6 md:p-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md p-6">
          {!isSuccess ? (
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
                새 비밀번호 설정
              </h2>

              <p className="text-center text-gray-600 mb-8">
                새로운 비밀번호를 입력해주세요. 보안을 위해 강력한 비밀번호를
                설정하시는 것이 좋습니다.
              </p>

              {/* 비밀번호 재설정 폼 */}
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                {/* 에러 메시지 표시 */}
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                    {error}
                  </div>
                )}

                {/* 새 비밀번호 입력 */}
                <div className="relative">
                  <label className="block text-sm md:text-base text-gray-600 mb-1.5">
                    새 비밀번호
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
                          ? 'border-blue-500'
                          : 'border-gray-300'
                      } rounded-md focus:outline-none transition-all duration-200`}
                      placeholder="새 비밀번호"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                  )}
                </div>

                {/* 비밀번호 확인 */}
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
                          ? 'border-blue-500'
                          : 'border-gray-300'
                      } rounded-md focus:outline-none transition-all duration-200`}
                      placeholder="비밀번호 확인"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* 비밀번호 요구사항 안내 */}
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  <p className="text-gray-700 font-medium mb-2">
                    비밀번호 요구사항:
                  </p>
                  <ul className="space-y-1 list-disc pl-5 text-gray-600">
                    <li>최소 8자 이상</li>
                    <li>영문자 포함</li>
                    <li>숫자 포함</li>
                    <li>특수문자 포함 (!@#$%^&*(),.?&quot;:{}|&lt;&gt;)</li>
                  </ul>
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
                    '비밀번호 변경하기'
                  )}
                </motion.button>

                <div className="text-center mt-4">
                  <Link
                    href="/login"
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    로그인으로 돌아가기
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* 비밀번호 변경 성공 화면 */}
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
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center text-gray-800">
                비밀번호가 성공적으로 변경되었습니다
              </h2>

              <p className="text-center text-gray-600 mb-8">
                새 비밀번호로 로그인할 수 있습니다. 잠시 후 로그인 페이지로
                이동합니다.
              </p>

              <div className="text-center">
                <Link href="/login">
                  <motion.button
                    type="button"
                    className="inline-flex justify-center py-2.5 px-6 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    로그인하러 가기
                  </motion.button>
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
