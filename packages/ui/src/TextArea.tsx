import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextArea({ label, id, className = '', ...props }: TextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full rounded-xl border-2 border-gray-300 p-4 text-lg leading-relaxed
          text-gray-800 placeholder-gray-400 resize-none
          focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-200
          dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500
          dark:focus:border-indigo-400 dark:focus:ring-indigo-800
          min-h-[140px] ${className}`}
        {...props}
      />
    </div>
  );
}
