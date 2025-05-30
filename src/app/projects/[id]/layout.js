'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import useProjectStore from '@/store/useProjectStore';
import useAuthStore from '@/store/useAuthStore';
import DashboardSkeleton from '@/components/common/DashboardSkeleton';

export default function ProjectLayout({ children }) {
  const { id: projectId } = useParams();
  const user = useAuthStore((state) => state.user);

  // 개별적으로 상태 구독
  const isLoading = useProjectStore((state) => state.isLoading);
  const error = useProjectStore((state) => state.error);
  const currentProject = useProjectStore((state) => state.currentProject);
  const fetchProjectData = useProjectStore((state) => state.fetchProjectData);

  // 프로젝트 데이터 로딩
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        await fetchProjectData(projectId);
      } catch (error) {
        console.error('프로젝트 데이터 로딩 실패:', error);
      }
    };

    if (projectId) {
      loadProjectData();
    }
  }, [projectId, fetchProjectData]);

  // 디버깅을 위한 상태 로깅
  useEffect(() => {
    console.log('현재 로그인된 사용자:', user);
    console.log('현재 프로젝트:', currentProject);
  }, [user, currentProject]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="text-red-600">에러: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
