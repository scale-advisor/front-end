'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

// 실제 콜백 핸들링 컴포넌트
function KakaoCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);

  // AuthStore에서 필요한 함수들을 가져옵니다
  const kakaoLogin = useAuthStore((state) => state.kakaoLogin);
  const setAuthState = useAuthStore((state) => state.setAuthState);

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
          // AuthStore의 kakaoLogin 함수 사용
          const { success, data, error } = await kakaoLogin(code);
          if (success && data) {
            const { accessToken, name, email } = data;
            // AuthStore의 상태 업데이트
            setAuthState(accessToken, name, email);
            router.push('/');
          } else {
            throw new Error(error || '카카오 로그인에 실패했습니다.');
          }
        } catch (err) {
          console.error('카카오 로그인 콜백 처리 오류:', err);
          setError(err.message || '로그인 처리 중 오류가 발생했습니다.');
          setIsProcessing(false);
        }
      };

      processKakaoLogin();
    }
  }, [code, router, kakaoLogin, setAuthState, isProcessing]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="p-4 bg-red-50 text-red-500 rounded-lg shadow">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-4 text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        카카오 로그인 처리 중...
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트
export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="p-4 text-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            로딩 중...
          </div>
        </div>
      }
    >
      <KakaoCallbackHandler />
    </Suspense>
  );
}
