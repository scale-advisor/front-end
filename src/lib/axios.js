import axios from 'axios';
import useAuthStore from '@/store/useAuthStore';

// 요청을 재시도하기 위한 큐
let isRefreshing = false;
let failedQueue = [];

// 요청 실패 큐 처리
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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
    // 이 요청은 쿠키에 저장된 refresh 토큰을 자동으로 포함
    const response = await api.post('/auth/refresh');

    // 응답에서 새 액세스 토큰 추출 및 저장
    const { accessToken } = response.data;

    // localStorage와 Zustand 상태 갱신
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', accessToken);
    }

    // useAuthStore 업데이트
    useAuthStore.getState().updateToken(accessToken);

    return accessToken;
  } catch (error) {
    // 리프레시 토큰도 만료되었거나 문제가 있는 경우
    console.error('액세스 토큰 갱신 실패:', error);

    // 로그아웃 처리
    useAuthStore.getState().logout();

    if (typeof window !== 'undefined') {
      window.location.href = '/login'; // 로그인 페이지로 리다이렉트
    }

    throw error; // 오류 전파
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
    console.log('test')
    const originalRequest = error.config;

    // 토큰 만료 오류(401)이고 재시도하지 않은 요청인 경우
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // 토큰 갱신 중인지 확인
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // 토큰 갱신 시작
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 토큰 갱신 요청
        const newToken = await refreshAccessToken();

        // 토큰 갱신 성공 - 대기 중인 요청들 처리
        processQueue(null, newToken);

        // 새 토큰으로 원래 요청 헤더 업데이트
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;  

        // 원래 요청 다시 시도
        return api(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 - 대기 중인 요청들 모두 거부
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        // 토큰 갱신 상태 초기화
        isRefreshing = false;
      }
    }

    // 그 외 오류는 그대로 반환
    return Promise.reject(error);
  },
);

export default api;
