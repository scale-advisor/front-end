'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AuthSidebar({ slides }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  // 자동 슬라이드 기능 구현
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // 5초마다 슬라이드 변경

    return () => clearInterval(slideInterval); // 컴포넌트 언마운트 시 타이머 제거
  }, [slides.length]);

  return (
    <motion.div
      className="w-full md:w-2/5 bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-10 flex flex-col"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 md:mb-8">
        <Link href="/">
          <h2 className="text-blue-600 text-2xl font-bold">Scale Advisor</h2>
        </Link>
      </div>

      <div className="mt-6 md:mt-10">
        <motion.div
          key={activeSlide}
          custom={1}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="h-auto md:h-48"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">
            {slides[activeSlide].title.split(' ').slice(0, -1).join(' ')}
          </h1>
          <h1 className="text-2xl md:text-3xl font-bold">
            {slides[activeSlide].title.split(' ').slice(-1)[0]}
          </h1>

          <p className="text-sm md:text-base text-gray-600 mt-4 md:mt-6 leading-relaxed">
            {slides[activeSlide].description}
          </p>
        </motion.div>
      </div>

      {/* 이미지 */}
      <div className="flex justify-center items-center flex-grow relative mt-4 md:mt-6">
        <motion.div
          key={`image-${activeSlide}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-56 h-56 md:w-80 md:h-80 relative"
        >
          <div className="bg-white w-full h-full rounded-2xl flex items-center justify-center shadow-lg">
            {slides[activeSlide].svgImage ? (
              slides[activeSlide].svgImage
            ) : (
              <img
                src={slides[activeSlide].image}
                alt={slides[activeSlide].title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* 하단 인디케이터 */}
      <div className="flex justify-center gap-2 md:gap-3 mt-6 md:mt-8 mb-4">
        {slides.map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 md:h-2.5 rounded-full cursor-pointer ${
              activeSlide === index
                ? 'bg-blue-500 w-4 md:w-5'
                : 'bg-gray-300 w-2 md:w-2.5'
            }`}
            onClick={() => setActiveSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
