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

// 응답 인터셉터: 401 에러 시 토큰 갱신 후 요청 재시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authStore = useAuthStore.getState();
        const newToken = await authStore.refreshToken();

        // 새로운 토큰으로 헤더 업데이트
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        // 원래 요청 재시도
        return api(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        const authStore = useAuthStore.getState();
        await authStore.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
