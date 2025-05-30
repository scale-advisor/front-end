'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';
import useProjectStore from '@/store/useProjectStore';
import InviteModal from '@/components/modal/InviteModal';
import TeamSkeleton from '@/components/common/TeamSkeleton';
import { useParams } from 'next/navigation';
import ProjectPathHeader from '@/components/project/ProjectPathNavbar';

export default function TeamPage() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [isExpelModalOpen, setIsExpelModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isExpelComplete, setIsExpelComplete] = useState(false);
  const user = useAuthStore((state) => state.user);
  const params = useParams();
  const projectId = params.id;
  const dropdownRef = useRef(null);

  // 프로젝트 스토어에서 멤버 정보와 관련 함수들을 가져옵니다
  const members = useProjectStore((state) => state.members);
  const currentProject = useProjectStore((state) => state.currentProject);
  const setMembers = useProjectStore((state) => state.setMembers);
  const currentUserRole = useProjectStore((state) => state.currentUserRole);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  if (members?.length === 0) {
    return <TeamSkeleton />;
  }

  const getStatusStyle = (state) => {
    switch (state) {
      case 'EMAIL_WAITING':
        return 'bg-yellow-100 text-yellow-800';
      case 'LINK_WAITING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (state) => {
    switch (state) {
      case 'EMAIL_WAITING':
        return '이메일 수락 대기중';
      case 'LINK_WAITING':
        return '링크 수락 대기중';
      case 'ACCEPTED':
        return '활성';
      default:
        return state;
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'OWNER':
        return '관리자';
      case 'EDITOR':
        return '편집자';
      case 'VIEWER':
        return '뷰어';
      default:
        return role;
    }
  };

  // 활성화된 팀원과 대기중인 팀원 분리
  const activeMembers = members.filter((member) => member.state === 'ACCEPTED');
  const pendingMembers = members.filter(
    (member) => member.state !== 'ACCEPTED',
  );
  console.log(currentUserRole);
  const renderMemberTable = (memberList, title, isPending = false) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">({memberList.length}명)</span>
      </div>
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                E-MAIL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                ROLE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                상태
              </th>
              {currentUserRole === 'OWNER' && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {memberList.length > 0 ? (
              memberList.map((member, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">
                        {member.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {currentUserRole === 'OWNER' &&
                    member.role !== 'OWNER' &&
                    member.state === 'ACCEPTED' ? (
                      editingMemberId === member.email ? (
                        <div className="flex items-center space-x-2">
                          <select
                            className="bg-gray-50 border border-gray-200 rounded-md py-1 px-2 text-sm"
                            defaultValue={member.role}
                            onChange={(e) => {
                              const select = e.target;
                              const applyButton = select.nextElementSibling;
                              applyButton.classList.remove('hidden');
                            }}
                          >
                            <option value="EDITOR">편집자</option>
                            <option value="VIEWER">뷰어</option>
                          </select>
                          <button
                            className="hidden px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                            onClick={(e) => {
                              const select = e.target.previousElementSibling;
                              handleRoleChange(member.email, select.value);
                            }}
                          >
                            적용
                          </button>
                          <button
                            className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 text-sm"
                            onClick={() => setEditingMemberId(null)}
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600">
                          {getRoleText(member.role)}
                        </span>
                      )
                    ) : (
                      <span className="text-sm text-gray-600">
                        {getRoleText(member.role)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                        member.state,
                      )}`}
                    >
                      {getStatusText(member.state)}
                    </span>
                  </td>
                  {currentUserRole !== 'OWNER' &&
                  member.state === 'ACCEPTED' &&
                  member.email !== user?.email ? (
                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                      <div className="relative">
                        <button
                          onClick={() => toggleMenu(member.email)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {/* 드롭다운 메뉴 */}
                        {openMenuId === member.email && (
                          <div
                            ref={dropdownRef}
                            className="absolute z-[100] w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 right-0"
                          >
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setEditingMemberId(member.email);
                                  toggleMenu(member.email);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                권한 수정
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedMember(member);
                                  setIsExpelModalOpen(true);
                                  toggleMenu(member.email);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                추방하기
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  ) : currentUserRole === 'OWNER' &&
                    member.state !== 'ACCEPTED' ? (
                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                      <div className="flex justify-end space-x-2">
                        {member.state === 'LINK_WAITING' && (
                          <>
                            <button
                              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
                              onClick={() =>
                                handleAcceptInvitation(member.email)
                              }
                            >
                              수락
                            </button>
                            <button
                              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium"
                              onClick={() =>
                                handleRejectInvitation(member.email)
                              }
                            >
                              거절
                            </button>
                          </>
                        )}
                        {member.state === 'EMAIL_WAITING' && (
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium"
                            onClick={() => handleRejectInvitation(member.email)}
                          >
                            초대 취소
                          </button>
                        )}
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={currentUserRole === 'OWNER' ? 5 : 4}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  {isPending
                    ? '대기중인 팀원이 없습니다.'
                    : '활성화된 팀원이 없습니다.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 초대 수락 핸들러
  const handleAcceptInvitation = async (email) => {
    try {
      // 초대 수락 API 호출
      await api.post(`/projects/${projectId}/invitations/accept`, {
        email: email,
      });

      // 멤버 목록 새로고침
      const response = await api.get(`/projects/${projectId}/users`);
      setMembers(response.data.responseData.members);
    } catch (error) {
      console.error('초대 수락 실패:', error);
    }
  };

  // 초대 거절 핸들러
  const handleRejectInvitation = async (email) => {
    try {
      await api.delete(`/projects/${projectId}/users`, {
        data: { email: email },
      });

      // 멤버 목록 새로고침
      const response = await api.get(`/projects/${projectId}/users`);
      setMembers(response.data.responseData.members);
    } catch (error) {
      console.error('초대 거절 실패:', error);
    }
  };

  // 역할 변경 핸들러
  const handleRoleChange = async (email, newRole) => {
    try {
      await api.patch(`/projects/${projectId}/users/role`, {
        email: email,
        newRole: newRole,
      });
      setEditingMemberId(null);
    } catch (error) {
      console.error('역할 변경 실패:', error);
    }
  };

  // 추방 핸들러
  const handleExpel = async () => {
    if (!selectedMember) return;

    try {
      await handleRejectInvitation(selectedMember.email);
      setIsExpelComplete(true);
      setTimeout(() => {
        setIsExpelModalOpen(false);
        setSelectedMember(null);
        setIsExpelComplete(false);
      }, 1500);
    } catch (error) {
      console.error('멤버 추방 실패:', error);
    }
  };

  // 드롭다운 메뉴 토글
  const toggleMenu = (memberId) => {
    setOpenMenuId(openMenuId === memberId ? null : memberId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <ProjectPathHeader project={currentProject} />
        <div className="py-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">프로젝트 팀 인원 관리</h1>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <span className="mr-2">새 인원 초대</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-600">
              총 {members.length}명의 팀원이 있습니다
              {pendingMembers.length > 0 &&
                ` (대기중: ${pendingMembers.length}명)`}
            </p>
          </div>

          {/* 활성화된 팀원 테이블 */}
          {renderMemberTable(activeMembers, '활성화된 팀원', false)}

          {/* 대기중인 팀원 테이블 */}
          {renderMemberTable(pendingMembers, '대기중인 팀원', true)}

          <div className="mt-8 p-4 bg-orange-50 rounded-lg">
            <h2 className="text-orange-800 font-medium mb-2">팀원 권한 안내</h2>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• 관리자: 모든 권한 (팀원 관리, 프로젝트 수정, 삭제)</li>
              <li>• 뷰어: 프로젝트 조회만 가능</li>
            </ul>
          </div>
        </div>
      </div>
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        projectId={projectId}
        onRefresh={() => {
          // 모달이 닫힐 때 멤버 정보를 새로 가져옵니다
          const fetchMembers = async () => {
            try {
              const response = await api.get(`/projects/${projectId}/users`);
              setMembers(response.data.responseData.members);
            } catch (error) {
              console.error('멤버 정보를 불러오는데 실패했습니다:', error);
            }
          };
          fetchMembers();
        }}
      />

      {/* 추방 확인 모달 */}
      {isExpelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            {!isExpelComplete ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  멤버 추방
                </h3>
                <p className="text-gray-600 mb-6">
                  정말 {selectedMember?.name}님을 추방하시겠습니까?
                  <br />
                  <span className="text-sm text-red-500">
                    이 작업은 되돌릴 수 없습니다.
                  </span>
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsExpelModalOpen(false);
                      setSelectedMember(null);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleExpel}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    추방하기
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  추방 완료
                </h3>
                <p className="text-gray-600">
                  {selectedMember?.name}님이 추방되었습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
