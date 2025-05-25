import axios from 'axios';
import useAuthStore from '@/store/useAuthStore';



// 메인 API 인스턴스
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // .env.local에 설정
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함
});

// 토큰 새로고침 함수
const refreshAccessToken = async () => {
  try {
    // /apis/auth/refresh 엔드포인트로 요청
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {},
      { withCredentials: true },
    );

    // 응답에서 새 액세스 토큰 추출 및 저장
    const { accessToken } = response.data;

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', accessToken);
    }

    useAuthStore.getState().updateToken(accessToken);
    return accessToken;
  } catch (error) {
    console.error('액세스 토큰 갱신 실패:', error);
    useAuthStore.getState().logout();

    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
};

// 요청 인터셉터: 토큰이 있으면 Authorization 헤더에 추가
api.interceptors.request.use(
  (config) => {
    // 1. Zustand 스토어에서 토큰 가져오기 시도
    const token = useAuthStore.getState().token;

    // 2. 스토어에 토큰이 없으면 localStorage에서 가져오기 (fallback)
    // Next.js SSR 등에서 문제 없도록 window 체크
    if (!token && typeof window !== 'undefined') {
      const localToken = localStorage.getItem('token');

      if (localToken) {
        // localStorage에 토큰이 있지만 스토어에 없는 경우 스토어 업데이트
        useAuthStore.getState().updateToken(localToken);
        config.headers.Authorization = `Bearer ${localToken}`;
      }
    } else if (token) {
      // 스토어에 토큰이 있는 경우
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 401 에러 시 토큰 갱신 후 요청 재시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // JWT 만료 에러 확인
    if (
      error.response?.status === 401 &&
      error.response?.data?.message?.includes('JWT expired') &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
