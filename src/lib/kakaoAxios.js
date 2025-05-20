import axios from 'axios';

/**
 * 카카오 로그인 전용 axios 인스턴스
 * 토큰 갱신, 인터셉터 등의 복잡한 기능 없이 기본 설정만 포함
 */
const kakaoApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // .env.local에 설정된 동일한 기본 URL 사용
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함
});

export default kakaoApi;
