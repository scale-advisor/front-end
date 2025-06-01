import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DocumentAnimation from '@/components/common/DocumentAnimation';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* 히어로 섹션 */}
        <section className="flex flex-col items-center px-4 sm:px-6 py-10 md:py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
                <p className="text-blue-600 text-sm md:text-base mb-3">
                  프로젝트 규모 산정, FP 기반의 규모 추정기
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  제안요청서 기반
                  <br />
                  프로젝트 규모 추정기
                </h1>
                <p className="text-gray-600 mb-8 max-w-xl">
                  AI 기반 RFP 분석 프로젝트 규모 산정 솔루션으로 FP(Function
                  Point)를 기반으로 과학적이고 객관적인 정량화된 방법론을 활용해
                  등록 요약 문서를 검토하여 전체 원소스를 규모가 분석되어
                  제시됩니다.
                </p>
                <div className="flex space-x-4">
                  <Link
                    href="/start"
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition shadow-md"
                  >
                    시작하기
                  </Link>
                  <Link
                    href="/more"
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition"
                  >
                    더 알아보기
                  </Link>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="relative w-full max-w-lg">
                  <DocumentAnimation />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works? 섹션 */}
        <section className="py-16 px-4 sm:px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How it Works?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                프로젝트 규모를 산정하는 과정을 더욱 스마트하게 만들어드립니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  제안 요청서 업로드
                </h3>
                <p className="text-gray-600 text-center">
                  간단한 문서 업로드만으로 시작해보세요. 복잡한 설정이 나중에
                  알아서 처리하여 알려드립니다.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  요구사항 자동 추출
                </h3>
                <p className="text-gray-600 text-center">
                  AI가 문서를 분석하여 핵심 요구사항을 자동으로 추출하고
                  분류합니다.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">분석 결과 제공</h3>
                <p className="text-gray-600 text-center">
                  비즈니스에 활용할 FP 기반의 정확한 프로젝트 규모 산정 결과를
                  제공합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI 기반 분석 기술 섹션 */}
        <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">AI 기반 분석 기술</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                최신 AI 기술을 활용하여 문서 구조를 분석하고 NLP를 통해
                요구사항을 추출합니다. Function Point 방식으로 정확한 규모
                산정이 가능합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-700 hover:bg-gray-600 rounded-lg p-6 flex flex-col items-center transition-colors shadow-md">
                <div className="text-blue-400 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI 분석</h3>
                <p className="text-gray-300 text-center">
                  딥러닝 기반 문서 분석
                </p>
              </div>

              <div className="bg-gray-700 hover:bg-gray-600 rounded-lg p-6 flex flex-col items-center transition-colors shadow-md">
                <div className="text-blue-400 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">FP 분석</h3>
                <p className="text-gray-300 text-center">기능점수 기반 산정</p>
              </div>

              <div className="bg-gray-700 hover:bg-gray-600 rounded-lg p-6 flex flex-col items-center transition-colors shadow-md">
                <div className="text-blue-400 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">NLP</h3>
                <p className="text-gray-300 text-center">자연어 처리 기술</p>
              </div>

              <div className="bg-gray-700 hover:bg-gray-600 rounded-lg p-6 flex flex-col items-center transition-colors shadow-md">
                <div className="text-blue-400 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">구조 분석</h3>
                <p className="text-gray-300 text-center">문서 구조 자동 인식</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
