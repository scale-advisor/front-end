import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRightIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import VersionSelectModal from '../modal/VersionSelectModal';
import useProjectStore from '@/store/useProjectStore';

const ProjectPathHeader = ({ project }) => {
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const currentVersion = useProjectStore((state) => state.currentVersion);

  return (
    <div className="sticky top-0 bg-gray-50 z-10 py-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/projects" className="hover:text-gray-700">
              프로젝트
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
          
          </div>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
          {project?.name}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsVersionModalOpen(true)}
            className="group flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
          >
            <DocumentTextIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                버전 {currentVersion}
              </span>
              <ChevronDownIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
            </div>
          </button>
          <button className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2">
            <ArrowUpTrayIcon className="h-5 w-5" />
            <span>새 버전 만들기</span>
          </button>
        </div>
      </div>

      <VersionSelectModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
      />
    </div>
  );
};

export default ProjectPathHeader;
