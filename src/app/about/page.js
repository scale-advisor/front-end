'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: '자동 요구사항 추출',
      description:
        'HWPX 파일에서 요구사항 테이블을 자동으로 추출하고 정제합니다.',
      icon: '📄',
      details:
        '제안요청서의 복잡한 구조를 분석하여 핵심 요구사항만을 정확하게 추출합니다.',
    },
    {
      title: 'AI 기반 단위프로세스 분해',
      description:
        '자연어처리 기술로 요구사항을 단위프로세스로 자동 분해합니다.',
      icon: '🤖',
      details:
        '고도화된 NLP 기술을 활용하여 복잡한 요구사항을 관리 가능한 단위로 분해합니다.',
    },
    {
      title: 'BERT 모델 FP 분류',
      description: 'BERT 모델을 활용한 5가지 Function Point 자동 분류',
      icon: '🧠',
      details:
        'EIF, ILF, EO, EI, EQ 5가지 카테고리로 정확한 분류를 제공합니다.',
    },
    {
      title: '실시간 비용 산정',
      description: '대시보드에서 실시간으로 프로젝트 개발비용을 산정합니다.',
      icon: '💰',
      details:
        '다양한 파라미터를 조정하여 즉시 비용 변화를 확인할 수 있습니다.',
    },
    {
      title: '버전 관리',
      description: 'FP 재분류, 단위프로세스 수정 등 모든 변경사항의 버전 관리',
      icon: '📊',
      details:
        '프로젝트의 모든 변경 이력을 추적하고 이전 버전으로 복원할 수 있습니다.',
    },
    {
      title: '팀 협업',
      description: '팀원 초대, 권한 관리 등 완벽한 협업 환경 제공',
      icon: '👥',
      details:
        '여러 프로젝트를 효율적으로 관리하고 팀원들과 실시간으로 협업할 수 있습니다.',
    },
  ];

  const process = [
    { step: 1, title: 'HWPX 업로드', description: '제안요청서 파일 업로드' },
    {
      step: 2,
      title: '요구사항 추출',
      description: '자동으로 요구사항 테이블 추출 및 정제',
    },
    {
      step: 3,
      title: '단위프로세스 분해',
      description: 'NLP를 통한 요구사항 분해',
    },
    {
      step: 4,
      title: 'FP 분류',
      description: 'BERT 모델로 5가지 카테고리 분류',
    },
    {
      step: 5,
      title: '비용 산정',
      description: '대시보드에서 실시간 비용 계산',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      {/* Hero Section */}
      <motion.section
        className="relative py-36 px-6 lg:px-8 mt-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUpVariants}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-8xl mx-auto text-center">
          <motion.h1
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            variants={fadeInUpVariants}
          >
            AI 기반 프로젝트 비용 산정 플랫폼
          </motion.h1>
          <motion.p
            className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            variants={fadeInUpVariants}
          >
            제안요청서에서 시작하여 정확한 개발비용 산정까지,
            <br />
            인공지능이 당신의 프로젝트를 분석합니다.
          </motion.p>
          <motion.div
            className="flex gap-4 justify-center"
            variants={fadeInUpVariants}
          >
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              무료로 시작하기
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            >
              로그인
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Process Flow */}
      <motion.section
        className="py-20 px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-16"
            variants={fadeInUpVariants}
          >
            간단한 5단계 프로세스
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                className="relative flex flex-col items-center"
                variants={fadeInUpVariants}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative z-10 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transform transition-transform hover:scale-110 hover:rotate-3">
                    {item.step}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow w-full text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        className="py-20 px-6 lg:px-8 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12"
            variants={fadeInUpVariants}
          >
            강력한 기능들
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer ${
                  activeFeature === index ? 'ring-2 ring-blue-600' : ''
                }`}
                onClick={() => setActiveFeature(index)}
                variants={fadeInUpVariants}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <p className="text-sm text-gray-500">{feature.details}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Technology Stack */}
      <motion.section
        className="py-20 px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12"
            variants={fadeInUpVariants}
          >
            최신 기술 스택
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { name: 'BERT', color: 'blue', desc: 'AI 분류 모델' },
              { name: 'FastAPI', color: 'green', desc: '고성능 백엔드' },
              { name: 'Next.js', color: 'purple', desc: '모던 프론트엔드' },
              { name: 'NLP', color: 'orange', desc: '자연어 처리' },
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                variants={fadeInUpVariants}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className={`text-3xl font-bold text-${tech.color}-600 mb-2`}
                >
                  {tech.name}
                </div>
                <p className="text-gray-600">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benefits */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                단순한 비용 산정을 넘어선
                <br />
                종합 프로젝트 관리 플랫폼
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    정확한 AI 기반 비용 산정으로 예산 계획 수립
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    버전 관리로 프로젝트 변경사항 추적
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    팀 협업 기능으로 효율적인 프로젝트 관리
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    여러 프로젝트 동시 관리 가능
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">지금 시작하세요!</h3>
                <p className="mb-6">모든 프로젝트를 무료로 분석해드립니다.</p>
                <button
                  onClick={() => router.push('/register')}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  무료 체험하기
                </button>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow-400 rounded-full opacity-20"></div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUpVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold mb-6"
            variants={fadeInUpVariants}
          >
            프로젝트 비용 산정, 이제 AI와 함께하세요
          </motion.h2>
          <motion.p className="text-xl mb-8" variants={fadeInUpVariants}>
            복잡한 요구사항 분석부터 정확한 비용 산정까지,
            <br />
            모든 과정을 자동화하여 시간과 비용을 절약하세요.
          </motion.p>
          <motion.button
            onClick={() => router.push('/register')}
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            variants={fadeInUpVariants}
          >
            지금 바로 시작하기
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}
