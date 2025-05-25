'use client';

import './globals.css';
import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';

// metadata는 서버 컴포넌트에서만 작동하므로
// 대신 metadata를 헤드 태그에 직접 추가합니다.
export default function RootLayout({ children }) {
  // 하이드레이션 이슈를 방지하기 위한 상태
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 사이드에서만 마운트
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 서버 사이드 렌더링 중이거나 하이드레이션 전이면 컨텐츠만 표시
  if (!isMounted) {
    return (
      <html lang="ko">
        <head>
          <title>Scale Advisor</title>
          <meta name="description" content="Scale Advisor Application" />
        </head>
        <body>{children}</body>
      </html>
    );
  }

  // 클라이언트 사이드에서 마운트된 후에는 AuthGuard 적용
  return (
    <html lang="ko">
      <head>
        <title>Scale Advisor</title>
        <meta name="description" content="Scale Advisor Application" />
      </head>
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}