'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

/**
 * 인증이 필요한 페이지를 보호하는 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 보호할 컴포넌트/페이지
 * @param {string[]} [props.publicPaths] - 인증이 필요없는 경로 목록
 * @returns {React.ReactNode} 인증 상태에 따라 자식 컴포넌트 또는 리다이렉트
 */
export default function AuthGuard({ children, publicPaths = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Zustand store에서 필요한 상태들을 가져옴
  const { isAuthenticated, token } = useAuthStore();

  // 기본 공개 경로 (인증 필요 없음)
  const defaultPublicPaths = [
    '/',
    '/about',
    '/token-info',
    '/login',
    '/register',
    '/email-verification',
    '/reset-password',
    '/auth',
    '/forgot-password',
    '/projects/join',
  ];

  const allPublicPaths = [...defaultPublicPaths, ...publicPaths];

  // 공개 경로 체크 함수
  const isPublicPath = (path) => {
    return allPublicPaths.some(
      (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`),
    );
  };

  useEffect(() => {
    // 컴포넌트가 마운트되면 hydration이 완료된 것으로 간주
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // 1. 이미 로그인된 사용자가 로그인/회원가입 페이지 접근 시
    if (
      isAuthenticated &&
      (pathname === '/login' || pathname === '/register')
    ) {
      router.replace('/');
      return;
    }

    // 2. 인증이 필요한 페이지 접근 시
    if (!isPublicPath(pathname)) {
      const localToken = localStorage.getItem('token');
      if (!isAuthenticated && !localToken) {
        router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      }
    }
  }, [mounted, pathname, isAuthenticated, router]);

  // hydration 전에는 아무것도 렌더링하지 않음
  if (!mounted) {
    return null;
  }

  return children;
}
