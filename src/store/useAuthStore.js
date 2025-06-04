import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

/**
 * 인증 상태를 관리하는 Zustand 스토어
 *
 * 기능:
 * - 로그인/로그아웃 상태 관리
 * - 사용자 정보 저장
 * - 토큰 저장
 * - 인증 상태 확인
 * - 로컬 스토리지 연동 (새로고침해도 상태 유지)
 */

const useAuthStore = create(
  persist(
    (set, get) => ({
      // 기본 상태
      name: null,
      token: null,
      email: null,
      isAuthenticated: false,

      // 토큰 관리 (단일 진실 공급원)
      setAuthState: (token, name, email) => {
        if (token) {
          // 토큰이 있는 경우 - 로그인
          localStorage.setItem('token', token);
          set({
            token,
            user: name,
            email: email,
            isAuthenticated: true,
          });
        } else {
          // 토큰이 없는 경우 - 로그아웃
          localStorage.removeItem('token');
          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });
        }
      },

      // 이메일 로그인
      login: async (credentials) => {
        try {
          // 백엔드 API 호출
          const response = await api.post('/auth/login/email', {
            email: credentials.email,
            password: credentials.password,
          });

          // 응답에서 토큰과 사용자 정보 추출
          const { accessToken, name, email } = response.data;

          console.log(response.data);
          // Zustand 스토어에 로그인 정보 저장
          get().setAuthState(accessToken, name, email);

          return { success: true, data: response.data };
        } catch (err) {
          console.error('로그인 오류:', err);
          throw err;
        }
      },

      // 카카오 로그인
      kakaoLogin: async (code) => {
        try {
          // 백엔드 API 호출
          const response = await api.post('/auth/kakao/login', { code });
          console.log(response.data);
          // 응답에서 토큰과 사용자 정보 추출
          const { accessToken, user } = response.data;

          // Zustand 스토어에 로그인 정보 저장
          get().setAuthState(accessToken, user);

          return { success: true, data: response.data };
        } catch (err) {
          console.error('카카오 로그인 오류:', err);
          throw err;
        }
      },

      // 로그아웃
      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('로그아웃 API 호출 실패:', error);
        } finally {
          get().setAuthState(null);
        }
      },

      // 토큰 갱신
      refreshToken: async () => {
        try {
          const response = await api.post('/auth/refresh');
          const { accessToken, user } = response.data;
          get().setAuthState(accessToken, user);
          return accessToken;
        } catch (error) {
          get().setAuthState(null);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        email: state.email,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
