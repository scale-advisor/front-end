'use client';

import Navbar from '@/components/Navbar';
import TokenInfo from '@/components/TokenInfo';
import Footer from '@/components/Footer';

export default function TokenInfoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">JWT Token Info</h1>
        <p className="text-center mb-8 text-gray-600">
          이 페이지는 현재 로그인된 사용자의 JWT 토큰 정보를 보여줍니다.
        </p>

        <TokenInfo />
      </main>

      <Footer />
    </div>
  );
}
