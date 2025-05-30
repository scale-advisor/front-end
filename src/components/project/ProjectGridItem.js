import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useProjectStore from '@/store/useProjectStore';

const ProjectGridItem = ({ project }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();
  console.log(project);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return '날짜 없음';

      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '유효하지 않은 날짜';

      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    } catch (error) {
      console.error('날짜 변환 오류:', error);
      return '날짜 변환 오류';
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 메뉴 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const handleProjectClick = () => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleProjectClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {project.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{project.description}</p>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('편집하기');
                      setIsMenuOpen(false);
                    }}
                  >
                    편집하기
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('복제하기');
                      setIsMenuOpen(false);
                    }}
                  >
                    복제하기
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('삭제하기');
                      setIsMenuOpen(false);
                    }}
                  >
                    삭제하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="text-sm text-gray-500">
            마지막 수정일: {formatDate(project.updatedAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectGridItem;
