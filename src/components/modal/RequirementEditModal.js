'use client';

import { useState, useEffect } from 'react';

export default function RequirementEditModal({
  isOpen,
  onClose,
  requirement,
  onSave,
}) {
  const [editForm, setEditForm] = useState(
    requirement
      ? {
          requirementNumber: requirement.requirementNumber,
          requirementName: requirement.requirementName,
          requirementDefinition: requirement.requirementDefinition,
          requirementDetail: requirement.requirementDetail,
        }
      : null,
  );

  useEffect(() => {
    if (requirement) {
      setEditForm({
        requirementNumber: requirement.requirementNumber,
        requirementName: requirement.requirementName,
        requirementDefinition: requirement.requirementDefinition,
        requirementDetail: requirement.requirementDetail,
      });
    }
  }, [requirement]);

  if (!isOpen || !requirement || !editForm) return null;

  const handleSave = () => {
    onSave({
      ...requirement,
      requirementName: editForm.requirementName,
      requirementDefinition: editForm.requirementDefinition,
      requirementDetail: editForm.requirementDetail,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">요구사항 수정</h2>
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              요구사항 번호
            </label>
            <input
              type="text"
              value={editForm.requirementNumber}
              disabled
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              요구사항명
            </label>
            <input
              type="text"
              value={editForm.requirementName}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  requirementName: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              요구사항 정의
            </label>
            <textarea
              value={editForm.requirementDefinition}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  requirementDefinition: e.target.value,
                })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상세 내용
            </label>
            <textarea
              value={editForm.requirementDetail}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  requirementDetail: e.target.value,
                })
              }
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
