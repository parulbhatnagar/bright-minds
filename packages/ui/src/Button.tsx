import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const base =
    'min-h-[48px] min-w-[48px] px-6 py-3 rounded-xl font-semibold text-base transition-colors focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-indigo-700',
    secondary:
      'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:focus:ring-gray-500',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
