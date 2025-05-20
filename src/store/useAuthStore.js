import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { decodeToken } from '@/utils/tokenUtils';
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
  // persist 미들웨어를 사용하여 상태를 로컬 스토리지에 저장
  persist(
    // 스토어 정의
    (set, get) => ({
      // 초기 상태
      isAuthenticated: false,
      user: null,
      token: null,
      tokenExpiry: null,

      // 로그인 액션: 사용자 정보와 토큰을 저장하고 인증 상태를 true로 설정
      login: (userData, token) => {
        console.log('로그인 함수 호출:', { userData, token });

        // localStorage에도 토큰 저장 (axios 인터셉터 등에서 사용)
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }

        // userData가 없는 경우 빈 객체로 초기화
        const safeUserData = userData || {};

        // 토큰에서 추가 정보를 디코딩
        let userInfo = { ...safeUserData };
        let tokenExpiry = null;

        try {
          const decodedToken = decodeToken(token);
          console.log('디코딩된 토큰:', decodedToken);

          // 토큰 만료 시간 저장
          if (decodedToken && decodedToken.exp) {
            tokenExpiry = decodedToken.exp * 1000; // 초를 밀리초로 변환
          }

          // 토큰에서 얻은 정보로 사용자 객체 보강 (안전하게 접근)
          if (decodedToken) {
            // 1. 토큰에서 찾은 name과 email 값
            const tokenName = decodedToken.name || '';
            const tokenEmail = decodedToken.email || '';

            console.log('토큰에서 추출한 정보:', {
              tokenName,
              tokenEmail,
              safeUserData,
            });

            userInfo = {
              ...safeUserData,
              // 명시적으로 우선순위 지정: userData의 값 > 토큰의 값 > 빈 문자열
              email: safeUserData.email || tokenEmail,
              name: safeUserData.name || tokenName,
              role: safeUserData.role || decodedToken.role || '',
              loginType: decodedToken.loginType || safeUserData.loginType || '',
              tokenExp: decodedToken.exp || null,
            };

            // 토큰에 sub 필드가 있고 name이 없는 경우 sub를 name으로 사용
            if (decodedToken.sub && !userInfo.name) {
              userInfo.name = decodedToken.sub;
            }

            console.log('최종 사용자 정보:', userInfo);
          }
        } catch (error) {
          console.error('토큰 디코딩 중 오류:', error);
          // 오류가 있어도 기본 사용자 정보는 저장
        }

        // 상태 업데이트
        set({
          isAuthenticated: true,
          user: userInfo,
          token: token,
          tokenExpiry: tokenExpiry,
        });

        console.log('스토어 상태 업데이트 완료:', {
          isAuthenticated: true,
          user: userInfo,
          token: token?.substring(0, 10) + '...', // 보안을 위해 토큰 일부만 출력
        });
      },

      // 로그아웃 액션: 사용자 정보와 토큰을 제거하고 인증 상태를 false로 설정
      logout: () => {
        // 백엔드에 로그아웃 요청 보내기
        if (typeof window !== 'undefined') {
          // 로그아웃 API 호출 (비동기 처리)
          api
            .post('/auth/logout')
            .then(() => console.log('서버에서 로그아웃 성공'))
            .catch((error) => console.error('서버 로그아웃 실패:', error));

          // 로컬 스토리지에서 토큰 제거
          localStorage.removeItem('token');
        }

        // 상태 업데이트
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          tokenExpiry: null,
        });
      },

      // 사용자 정보 업데이트 액션
      updateUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...(userData || {}) },
        })),

      // 토큰만 업데이트 (토큰 갱신 등에 사용)
      updateToken: (newToken) => {
        console.log('토큰 업데이트 함수 호출');

        if (typeof window !== 'undefined') {
          localStorage.setItem('token', newToken);
        }

        // 토큰에서 정보 디코딩
        let tokenExpiry = null;

        try {
          const decodedToken = decodeToken(newToken);
          console.log('업데이트: 디코딩된 토큰:', decodedToken);

          if (decodedToken) {
            // 토큰 만료 시간 저장
            if (decodedToken.exp) {
              tokenExpiry = decodedToken.exp * 1000; // 초를 밀리초로 변환
            }

            // 현재 사용자 정보에 토큰 정보 병합 (안전하게 처리)
            set((state) => {
              const currentUser = state.user || {};

              // 새 사용자 정보 구성
              const updatedUser = {
                ...currentUser,
                tokenExp: decodedToken.exp || null,
              };

              // name 필드가 토큰에 있으면 명시적으로 업데이트
              if (decodedToken.name) {
                updatedUser.name = decodedToken.name;
              }

              // sub 필드가 있고 name이 없는 경우 sub를 name으로 사용
              if (!updatedUser.name && decodedToken.sub) {
                updatedUser.name = decodedToken.sub;
              }

              // email 필드가 토큰에 있으면 업데이트
              if (decodedToken.email) {
                updatedUser.email = decodedToken.email;
              }

              console.log('업데이트된 사용자 정보:', updatedUser);

              return {
                token: newToken,
                tokenExpiry: tokenExpiry,
                user: updatedUser,
              };
            });
          } else {
            set({
              token: newToken,
              tokenExpiry: tokenExpiry,
            });
          }
        } catch (error) {
          console.error('새 토큰 디코딩 중 오류:', error);
          set({ token: newToken });
        }
      },

      // 인증 여부 확인 (편의 함수)
      isLoggedIn: () => get().isAuthenticated && get().token !== null,

      // 토큰에서 사용자 정보 가져오기
      getUserFromToken: () => {
        const token = get().token;
        if (!token) return null;

        return decodeToken(token);
      },

      // 토큰이 만료됐는지 확인
      isTokenExpired: () => {
        const expiry = get().tokenExpiry;
        if (!expiry) return true;

        return Date.now() > expiry;
      },

      // 현재 로그인된 사용자 이름 반환
      getUserName: () => {
        const user = get().user;
        if (!user) return 'User';

        // 최종 로직: name -> email -> 'User' 순으로 우선순위
        return user.name || user.email || 'User';
      },

      // 토큰 리프레시 요청 (백엔드가 refresh_token 쿠키를 자동으로 사용)
      refreshToken: async () => {
        try {
          // 토큰 갱신 요청 (axios.js의 refreshAccessToken과 유사)
          const response = await api.post('/auth/refresh');
          const { accessToken } = response.data;

          // 스토어 업데이트
          get().updateToken(accessToken);

          return accessToken;
        } catch (error) {
          console.error('토큰 갱신 실패:', error);
          // 리프레시 실패 시 로그아웃
          get().logout();
          throw error;
        }
      },
    }),
    {
      // persist 미들웨어 설정
      name: 'auth-storage', // 로컬 스토리지 키 이름
      storage: createJSONStorage(() => localStorage), // 로컬 스토리지 사용

      // hydration 시 특정 필드만 유지 (선택 사항)
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        tokenExpiry: state.tokenExpiry,
      }),
    },
  ),
);

export default useAuthStore;
