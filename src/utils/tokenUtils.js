import { jwtDecode } from 'jwt-decode';

/**
 * JWT 토큰을 디코딩하여 사용자 정보를 반환합니다.
 *
 * @param {string} token JWT 토큰
 * @returns {object} 디코딩된 토큰 페이로드 (사용자 정보)
 */
export const decodeToken = (token) => {
  if (!token) return null;

  try {
    // JWT 토큰 디코딩
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('토큰 디코딩 오류:', error);
    return null;
  }
};

/**
 * 현재 저장된 토큰을 가져와 디코딩합니다.
 *
 * @returns {object|null} 디코딩된 토큰 페이로드 또는 토큰이 없을 경우 null
 */
export const getCurrentUser = () => {
  // 브라우저 환경인지 확인
  if (typeof window === 'undefined') return null;

  // localStorage에서 토큰 가져오기
  const token = localStorage.getItem('token');
  return decodeToken(token);
};

/**
 * JWT 토큰의 만료 여부를 확인합니다.
 *
 * @param {string} token JWT 토큰
 * @returns {boolean} 토큰이 만료되었으면 true, 아니면 false
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);

    // exp는 만료 시간(초 단위)
    // 현재 시간과 비교하여 만료 여부 확인
    const currentTime = Date.now() / 1000; // 밀리초를 초로 변환
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('토큰 만료 확인 오류:', error);
    return true; // 오류 발생 시 만료된 것으로 간주
  }
};
