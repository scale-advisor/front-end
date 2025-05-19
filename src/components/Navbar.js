'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // 스크롤 이벤트를 감지하여 스크롤 상태 업데이트
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#202632] shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto max-w-7xl px-6 h-20 flex items-center sm:px-8">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <Link
              href="/"
              className={`font-bold text-3xl ${scrolled ? 'text-white' : 'text-gray-800'}`}
            >
              ScaleAdvisor
            </Link>
            <div className="hidden md:flex items-center space-x-8 ml-16">
              <Link
                href="/"
                className={`${scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
              >
                Home
              </Link>
              <Link
                href="/how-it-work"
                className={`${scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
              >
                How it Work
              </Link>
              <Link
                href="/how-to-use"
                className={`${scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
              >
                How to use
              </Link>
              <Link
                href="/advisor"
                className={`${scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
              >
                Advisor
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-6 md:space-x-8">
            <Link
              href="/login"
              className={`${scrolled ? 'text-gray-300 hover:text-white' : 'text-blue-600 hover:text-blue-700'} transition-colors px-3 py-2`}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={`${scrolled ? 'bg-blue-500' : 'bg-blue-600'} text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm`}
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
