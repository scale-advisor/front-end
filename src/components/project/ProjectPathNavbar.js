import { DocumentTextIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function ProjectPathHeader({ project }) {
  return (
    <div className="sticky top-0 bg-gray-50 z-10 py-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer">
              {project?.name}
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{project?.rfpFile}</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            RFP를 통한 FP 자동 산정 서비스
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
            <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              {project?.version}
            </span>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
            <span>제안서 업로드</span>
          </button>
        </div>
      </div>
    </div>
  );
}
