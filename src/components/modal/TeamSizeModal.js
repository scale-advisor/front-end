import React, { useState } from 'react';
import Modal from './Modal';
import Button from '../common/Button';

const TeamSizeModal = ({ isOpen, onClose, onSubmit, initialTeamSize = 1 }) => {
  const [teamSize, setTeamSize] = useState(initialTeamSize);

  const handleSubmit = () => {
    onSubmit({
      teamSize: teamSize,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="투입 인력 설정">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              총 투입 인력
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setTeamSize((prev) => Math.max(1, prev - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={teamSize}
                onChange={(e) =>
                  setTeamSize(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-16 text-center border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setTeamSize((prev) => prev + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={teamSize < 1}
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TeamSizeModal;
