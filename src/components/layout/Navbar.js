'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';

export default function Navbar() {
  const router = useRouter();

  // 클라이언트 사이드 렌더링을 위한 상태들
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Zustand 스토어에서 필요한 상태와 함수 구독
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // 스크롤 상태를 관리하는 state
  const [scrolled, setScrolled] = useState(false);

  // 마운트 상태만 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 스크롤 이벤트 감지
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 이름을 가져오는 함수 (안전하게 처리)
  const getUserName = () => {
    if (!user) return 'User';
    console.log(user);
    // name이 있으면 name 사용, 없으면 email 사용, 둘 다 없으면 'User' 사용
    return user.name || user.email || 'User';
  };

  // 서버 사이드 렌더링 시 최소한의 UI만 표시
  if (!mounted) {
    return (
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 py-4 ${
          scrolled ? 'bg-gray-900 shadow-lg text-white' : 'bg-white shadow-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span
                  className={`text-xl font-bold ${scrolled ? 'text-white' : 'text-blue-600'}`}
                >
                  Scale Advisor
                </span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/"
                  className={`border-transparent ${scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className={`border-transparent ${scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  About
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className={`${scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    scrolled
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 py-4 ${
        scrolled ? 'bg-gray-900 shadow-lg text-white' : 'bg-white shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span
                className={`text-xl font-bold ${scrolled ? 'text-white' : 'text-blue-600'}`}
              >
                Scale Advisor
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`border-transparent ${scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Home
              </Link>
              {isAuthenticated && (
                <Link
                  href="/projects"
                  className={`border-transparent ${scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Projects
                </Link>
              )}
              <Link
                href="/about"
                className={`border-transparent ${scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                About
              </Link>
              <Link
                href="/token-info"
                className={`border-transparent ${scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Token Info
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/mypage')}
                  className={`text-sm ${
                    scrolled
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  } cursor-pointer`}
                >
                  Hello, {getUserName()}님
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    scrolled
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      로그아웃 중...
                    </div>
                  ) : (
                    '로그아웃'
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className={`${scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    scrolled
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
