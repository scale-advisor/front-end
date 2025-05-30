import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 현재 프로젝트 상세 페이지인지 확인
  const isProjectPath = pathname.startsWith('/projects/');

  // 프로젝트 ID 추출
  const projectId = isProjectPath ? pathname.split('/')[2] : null;

  const menuItems = [
    { icon: '📁', name: '목록', path: '/projects', alwaysEnabled: true },
    {
      icon: '📊',
      name: '대시보드',
      path: projectId ? `/projects/${projectId}` : '#',
      disabled: !projectId,
    },
    {
      icon: '🔍',
      name: '분석',
      path: projectId ? `/projects/${projectId}/analysis` : '#',
      disabled: !projectId,
    },
    {
      icon: '👥',
      name: '팀',
      path: projectId ? `/projects/${projectId}/team` : '#',
      disabled: !projectId,
    },
    {
      icon: '⚙️',
      name: '설정',
      path: projectId ? `/projects/${projectId}/settings` : '#',
      disabled: !projectId,
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // 현재 활성화된 메뉴 아이템 확인
  const isActiveMenuItem = (item) => {
    // 프로젝트 목록 페이지
    if (item.path === '/projects' && pathname === '/projects') {
      return true;
    }

    // 프로젝트 상세 페이지들
    if (projectId) {
      // 대시보드
      if (item.name === '대시보드' && pathname === `/projects/${projectId}`) {
        return true;
      }
      // 다른 메뉴들 (팀, 분석, 설정 등)
      if (
        item.path.includes(`/projects/${projectId}/`) &&
        pathname.includes(item.path)
      ) {
        return true;
      }
    }

    return false;
  };

  return (
    <div
      className={`sticky top-0 h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div
        className={`p-4 flex items-center justify-between ${isCollapsed ? 'justify-center' : ''}`}
      >
        {!isCollapsed && (
          <Link href="/">
            <div>
              <div className="text-xs text-gray-400">FP base</div>
              <h1 className="text-xl font-bold">ScaleAdvisor</h1>
            </div>
          </Link>
        )}

        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white focus:outline-none"
          aria-label={isCollapsed ? '확장' : '축소'}
        >
          {isCollapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="border-t border-gray-700 my-2"></div>

      <nav className="flex-1 overflow-y-auto">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.disabled ? '#' : item.path}
                className={`
                  flex items-center py-3 px-4 mx-2 rounded-lg
                  ${isCollapsed ? 'justify-center' : ''}
                  ${
                    isActiveMenuItem(item) ? 'bg-blue-600' : 'hover:bg-gray-800'
                  }
                  ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                  }
                }}
              >
                <span className={isCollapsed ? '' : 'mr-3'}>{item.icon}</span>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
