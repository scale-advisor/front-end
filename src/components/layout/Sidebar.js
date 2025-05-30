import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: '📁', name: '목록', path: '/projects' },
    { icon: '📊', name: '대시보드', path: '/dashboard' },
    { icon: '🔍', name: '분석', path: '/analysis' },
    { icon: '👥', name: '팀', path: '/team' },
    { icon: '⚙️', name: '설정', path: '/settings' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ${
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

      <nav className="flex-1 mt-4">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link href={item.path}>
                <div
                  className={`flex items-center py-3 px-4 mx-2 rounded-lg ${
                    pathname.includes(item.path)
                      ? 'bg-blue-600'
                      : 'hover:bg-gray-800'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <span className={isCollapsed ? '' : 'mr-3'}>{item.icon}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
