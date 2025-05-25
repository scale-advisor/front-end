import React from 'react';
import { useRouter } from 'next/navigation';

const CreateProjectButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/projects/create');
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none"
    >
      프로젝트 생성하기
    </button>
  );
};

export default CreateProjectButton;
