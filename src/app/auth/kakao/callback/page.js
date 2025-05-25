'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import kakaoApi from '@/lib/kakaoAxios';

// 실제 콜백 핸들링 컴포넌트
function KakaoCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const login = useAuthStore((state) => state.login);

  const code = searchParams.get('code');

  useEffect(() => {
    if (!code) {
      setError('인증 코드가 없습니다.');
      setIsProcessing(false);
      return;
    }

    if (isProcessing) {
      const processKakaoLogin = async () => {
        try {
          const response = await kakaoApi.post('/auth/kakao/login', { code });
          const { accessToken, user } = response.data;
          login(user, accessToken);
          router.push('/');
        } catch (err) {
          console.error('카카오 로그인 콜백 처리 오류:', err);
          setError(
            err.response?.data?.message ||
              '로그인 처리 중 오류가 발생했습니다.',
          );
          setIsProcessing(false);
        }
      };

      processKakaoLogin();
    }
  }, [code, router, login, isProcessing]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return <div className="p-4">카카오 로그인 처리 중...</div>;
}

// 메인 페이지 컴포넌트
export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<div className="p-4">로딩 중...</div>}>
      <KakaoCallbackHandler />
    </Suspense>
  );
}
