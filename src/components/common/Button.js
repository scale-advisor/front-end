import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles = 'px-4 py-2 rounded-md transition-colors';

  const variants = {
    primary: `${baseStyles} ${
      disabled
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700 text-white'
    }`,
    secondary: `${baseStyles} border border-gray-300 hover:bg-gray-50 text-gray-700`,
    ghost: `${baseStyles} text-gray-500 hover:text-gray-700`,
  };

  return (
    <button
      className={`${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
