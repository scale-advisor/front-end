'use client';

import { useState, useEffect } from 'react';

export default function RequirementAddModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    requirementNumber: '',
    requirementName: '',
    requirementType: '기능',
    requirementDefinition: '',
    requirementDetail: '',
  });

  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({
      requirementNumber: '',
      requirementName: '',
      requirementType: '기능',
      requirementDefinition: '',
      requirementDetail: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">요구사항 추가</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                요구사항 번호
              </label>
              <input
                type="text"
                value={form.requirementNumber}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    requirementNumber: e.target.value,
                  }))
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="요구사항 번호를 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                요구사항명
              </label>
              <input
                type="text"
                value={form.requirementName}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    requirementName: e.target.value,
                  }))
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="요구사항명을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                요구사항 유형
              </label>
              <input
                type="text"
                value={form.requirementType}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    requirementType: e.target.value,
                  }))
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="요구사항 유형을 입력하세요"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              요구사항 정의
            </label>
            <textarea
              value={form.requirementDefinition}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  requirementDefinition: e.target.value,
                }))
              }
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="요구사항 정의를 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상세 내용
            </label>
            <textarea
              value={form.requirementDetail}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  requirementDetail: e.target.value,
                }))
              }
              required
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="상세 내용을 입력하세요"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
