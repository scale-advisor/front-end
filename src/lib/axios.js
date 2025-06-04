import axios from 'axios';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

// 메인 API 인스턴스
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // .env.local에 설정
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함
});

// 라우터 인스턴스를 저장할 변수
let router;

// 라우터 설정 함수
export const setRouter = (nextRouter) => {
  router = nextRouter;
};

// 요청 인터셉터: 토큰이 있으면 Authorization 헤더에 추가
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore.getState();
    let token = authStore.token;

    // localStorage fallback
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('token');
      if (token) {
        authStore.updateToken(token);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 401/403 에러 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // 403 에러: 액세스 토큰 만료, 리프레시 토큰으로 재발급 시도
    if (status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authStore = useAuthStore.getState();
        const newToken = await authStore.refreshToken();

        // 새로운 토큰으로 헤더 업데이트
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        // 원래 요청 재시도
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // 401 에러: 리프레시 토큰 만료, 재로그인 필요
    if (status === 401) {
      const authStore = useAuthStore.getState();
      await authStore.logout();
      if (router) {
        router.push('/login');
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api;
