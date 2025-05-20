'use client';

import { useState, useEffect } from 'react';
import useAuthStore from '@/store/useAuthStore';
import { decodeToken } from '@/utils/tokenUtils';
import api from '@/lib/axios';

export default function TokenInfo() {
  const [tokenData, setTokenData] = useState(null);
  const [refreshResult, setRefreshResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cookieInfo, setCookieInfo] = useState('');

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const getUserFromToken = useAuthStore((state) => state.getUserFromToken);
  const updateToken = useAuthStore((state) => state.updateToken);

  useEffect(() => {
    if (token) {
      // 1. 직접 토큰 디코딩
      const decoded = decodeToken(token);

      // 2. 또는 스토어의 함수 사용
      const userData = getUserFromToken();

      setTokenData(decoded);
    }

    // 초기 쿠키 정보 확인
    checkCookies();
  }, [token, getUserFromToken]);

  // 쿠키 정보 확인 함수
  const checkCookies = () => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie;
      setCookieInfo(cookies || '(쿠키 없음)');
      console.log('현재 쿠키:', cookies);
    }
  };

  // 리프레시 토큰 테스트 함수
  const testRefreshToken = async () => {
    setIsLoading(true);
    setError(null);
    setRefreshResult(null);

    try {
      console.log('토큰 갱신 요청 시작...');
      const response = await api.post('/auth/refresh');
      const { accessToken } = response.data;

      console.log('토큰 갱신 성공:', accessToken?.substring(0, 15) + '...');

      // 스토어 업데이트
      updateToken(accessToken);

      // 결과 저장
      setRefreshResult({
        success: true,
        message: '토큰 갱신 성공',
        newToken: accessToken?.substring(0, 20) + '...',
        timestamp: new Date().toLocaleString(),
      });

      // 쿠키 정보 업데이트
      checkCookies();
    } catch (err) {
      console.error('토큰 갱신 실패:', err);
      setError({
        message: err.message || '토큰 갱신 실패',
        status: err.response?.status,
        details: err.response?.data?.message || '',
        timestamp: new Date().toLocaleString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
        <p>로그인이 필요합니다. 토큰 정보를 확인하려면 로그인해주세요.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Token Information</h2>

      {/* 쿠키 정보 섹션 */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">쿠키 정보</h3>
          <button
            onClick={checkCookies}
            className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            새로고침
          </button>
        </div>
        <pre className="bg-white border border-gray-200 p-3 rounded text-sm overflow-auto whitespace-pre-wrap">
          {cookieInfo}
        </pre>
        <p className="text-xs text-gray-500 mt-2">
          리프레시 토큰은 일반적으로 HttpOnly 쿠키로 저장되어 자바스크립트로
          직접 접근할 수 없습니다. 위 텍스트가 비어있어도 HTTP 요청 시 쿠키는
          자동으로 전송될 수 있습니다.
        </p>
      </div>

      {/* 리프레시 토큰 테스트 섹션 */}
      <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
        <h3 className="text-lg font-semibold mb-2">리프레시 토큰 테스트</h3>
        <p className="text-sm text-gray-600 mb-3">
          아래 버튼을 클릭하여 /auth/refresh API를 호출하고 리프레시 토큰으로 새
          액세스 토큰을 발급받을 수 있습니다.
        </p>

        <button
          onClick={testRefreshToken}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-medium transition-colors duration-300`}
        >
          {isLoading ? '처리 중...' : '토큰 갱신 테스트'}
        </button>

        {refreshResult && (
          <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-md">
            <h4 className="font-medium text-green-800">
              ✅ {refreshResult.message}
            </h4>
            <p className="text-sm mt-1">새 토큰: {refreshResult.newToken}</p>
            <p className="text-xs text-gray-500 mt-1">
              {refreshResult.timestamp}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-md">
            <h4 className="font-medium text-red-800">❌ {error.message}</h4>
            {error.status && (
              <p className="text-sm mt-1">상태 코드: {error.status}</p>
            )}
            {error.details && (
              <p className="text-sm mt-1">상세: {error.details}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">{error.timestamp}</p>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">User from Store:</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      {tokenData && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Decoded Token:</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(tokenData, null, 2)}
          </pre>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {tokenData.sub && (
              <div className="bg-blue-50 p-3 rounded">
                <span className="font-medium">Subject:</span> {tokenData.sub}
              </div>
            )}

            {tokenData.email && (
              <div className="bg-blue-50 p-3 rounded">
                <span className="font-medium">Email:</span> {tokenData.email}
              </div>
            )}

            {tokenData.name && (
              <div className="bg-blue-50 p-3 rounded">
                <span className="font-medium">Name:</span> {tokenData.name}
              </div>
            )}

            {tokenData.exp && (
              <div className="bg-blue-50 p-3 rounded">
                <span className="font-medium">Expires:</span>{' '}
                {new Date(tokenData.exp * 1000).toLocaleString()}
              </div>
            )}

            {tokenData.iat && (
              <div className="bg-blue-50 p-3 rounded">
                <span className="font-medium">Issued At:</span>{' '}
                {new Date(tokenData.iat * 1000).toLocaleString()}
              </div>
            )}

            {tokenData.role && (
              <div className="bg-blue-50 p-3 rounded">
                <span className="font-medium">Role:</span> {tokenData.role}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Raw Token:</h3>
        <div className="bg-gray-100 p-3 rounded overflow-auto">
          <code className="text-xs break-all">{token}</code>
        </div>
      </div>
    </div>
  );
}
