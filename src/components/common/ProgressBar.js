import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ label, value, maxValue, color = 'primary' }) => {
  const percentage = (value / maxValue) * 100;

  const colors = {
    // FP 컴포넌트용 그라데이션 색상
    ilf: 'bg-gradient-to-r from-[#DBEAFE] to-[#93C5FD]', // 하늘색 계열
    elf: 'bg-gradient-to-r from-[#EDE9FE] to-[#C4B5FD]', // 보라색 계열
    ei: 'bg-gradient-to-r from-[#FEE2E2] to-[#FCA5A5]', // 빨간색 계열
    eo: 'bg-gradient-to-r from-[#FFEDD5] to-[#FDBA74]', // 주황색 계열
    eq: 'bg-gradient-to-r from-[#D1FAE5] to-[#6EE7B7]', // 민트색 계열

    // 기본 색상
    primary: 'bg-gradient-to-r from-[#DBEAFE] to-[#93C5FD]',
    secondary: 'bg-gradient-to-r from-[#EDE9FE] to-[#C4B5FD]',

    // 상태 표시용 색상
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
    info: 'bg-cyan-600',
  };

  const bgColor = colors[color] || colors.primary;

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between mb-1">
        <motion.span
          className="text-sm font-medium text-gray-700"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {label}
        </motion.span>
        <motion.span
          className="text-sm font-medium text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {value}%
        </motion.span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <motion.div
          className={`${bgColor} h-2.5 rounded-full shadow-sm`}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.3,
            ease: 'easeOut',
          }}
        ></motion.div>
      </div>
    </motion.div>
  );
};

export default ProgressBar;
