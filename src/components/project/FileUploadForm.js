import React, { useState } from 'react';

const FileUploadForm = ({ onNext, onPrevious, initialData }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const validateFile = (uploadedFile) => {
    // 파일 확장자 검사
    const extension = uploadedFile.name.toLowerCase().split('.').pop();
    const allowedExtensions = ['hwpx', 'xlsx', 'xls'];

    if (!allowedExtensions.includes(extension)) {
      setError('HWPX 또는 Excel 파일만 업로드 가능합니다.');
      return false;
    }

    // 파일 크기 검사 (예: 100MB 제한)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (uploadedFile.size > maxSize) {
      setError('파일 크기는 100MB를 초과할 수 없습니다.');
      return false;
    }

    setError('');
    return true;
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0]; // 첫 번째 파일만 사용
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (file) return; // 이미 파일이 있으면 추가 업로드 방지
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      setError('파일을 업로드해주세요.');
      return;
    }

    // 파일 정보를 다음 단계로 전달
    onNext({ file });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* 에러 메시지 */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* 파일 업로드 영역 */}
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              file
                ? 'border-gray-200 bg-gray-50 pointer-events-none'
                : isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : error
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
            }`}
            onDragEnter={!file ? handleDragEnter : undefined}
            onDragLeave={!file ? handleDragLeave : undefined}
            onDragOver={!file ? handleDragOver : undefined}
            onDrop={!file ? handleDrop : undefined}
          >
            <div className="flex flex-col items-center">
              {/* 클라우드 아이콘 */}
              <svg
                className={`w-16 h-16 mb-4 ${
                  file
                    ? 'text-gray-400'
                    : error
                      ? 'text-red-500'
                      : 'text-blue-500'
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.9999 14.9999L9.41394 12.414L10.828 11L11.9999 12.1719L13.1719 11L14.5859 12.414L11.9999 14.9999ZM19.3499 16.7559C21.0699 15.4119 21.6129 13.1019 20.5789 11.2219C19.7349 9.72388 18.1649 8.86988 16.5479 8.81788C15.3839 6.46788 13.0159 5.04688 10.4999 5.04688C7.18394 5.04688 4.49994 7.72888 4.49994 11.0469C4.49994 11.8139 4.64994 12.5589 4.92594 13.2489C3.30494 13.6899 2.17194 15.1209 2.17194 16.8359C2.17194 18.9309 3.86694 20.6259 5.96094 20.6259H18.0389C19.6699 20.6259 21.0559 19.3589 21.2139 17.7469C21.2799 17.3979 21.2379 16.9809 19.3499 16.7549V16.7559Z" />
              </svg>

              <p
                className={`text-base font-medium mb-2 ${
                  file ? 'text-gray-400' : 'text-gray-700'
                }`}
              >
                {file
                  ? '파일이 업로드되었습니다'
                  : '제안 요청서 파일을 이곳에 드래그 하거나 클릭하여 업로드 하세요'}
              </p>

              <p
                className={`text-sm mb-6 ${
                  file ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                HWPX 또는 Excel 파일 지원
              </p>

              {!file && (
                <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                  <span>파일 선택하기</span>
                  <input
                    type="file"
                    accept=".hwpx,.xlsx,.xls"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>

          {/* 파일 업로드 주의사항 */}
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-orange-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-orange-800">
                  업로드 전 확인해주세요!
                </h3>
                <div className="mt-2 text-sm text-orange-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>HWPX 또는 Excel 파일만 업로드 가능합니다</li>
                    <li>파일 크기는 100MB를 초과할 수 없습니다</li>
                    <li>기밀정보가 포함된 경우 보안 설정을 수정해 주세요</li>
                    <li>본 서비스는 약 1~2분이 소요됩니다</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 업로드된 파일 표시 */}
          {file && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                업로드된 파일
              </h4>
              <div className="border border-gray-200 rounded-md">
                <div className="px-4 py-3 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-2 flex-1 text-sm text-gray-900">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={onPrevious}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              이전
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              다음
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FileUploadForm;
