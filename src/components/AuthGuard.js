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

  // 클라이언트 사이드 렌더링을 위한 상태
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 기본 공개 경로 (인증 필요 없음)
  const defaultPublicPaths = [
    '/', // 홈 페이지
    '/about', // 서비스 소개 페이지
    '/token-info', // 토큰 정보 페이지
    '/login',
    '/register',
    '/email-verification',
    '/reset-password',
    '/apis/auth',
    '/forgot-password'
  ];

  // 모든 공개 경로 목록
  const allPublicPaths = [...defaultPublicPaths, ...publicPaths];

  useEffect(() => {
    // 마운트 상태 설정 및 인증 상태 확인
    setMounted(true);
    const authState = useAuthStore.getState();
    setIsLoggedIn(authState.isLoggedIn());

    // 인증이 필요없는 경로인지 확인
    const isPublicPath = allPublicPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

    // 사용자가 로그인되지 않고, 공개 경로가 아닌 경우 로그인 페이지로 리다이렉트
    if (authState.isLoggedIn() === false && !isPublicPath) {
      router.push('/login');
    }

    // 사용자가 이미 로그인되어 있고, 로그인/회원가입 페이지에 접근하려는 경우 홈으로 리다이렉트
    if (
      authState.isLoggedIn() === true &&
      (pathname === '/login' || pathname === '/register')
    ) {
      router.push('/');
    }
  }, [pathname, router, allPublicPaths]);

  // 서버 사이드 렌더링이거나 마운트 되지 않은 경우
  if (!mounted) {
    // 공개 경로인 경우에만 컨텐츠 표시, 그렇지 않으면 빈 페이지 표시
    const isPublicPath = allPublicPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

    if (isPublicPath) {
      return children;
    }

    // 로딩 상태 또는 빈 화면 반환
    return null;
  }

  // 인증 상태 확인 후 컨텐츠 표시
  const isPublicPath = allPublicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!isLoggedIn && !isPublicPath) {
    return null; // 리다이렉트 중에는 컨텐츠를 표시하지 않음
  }

  return children;
}
