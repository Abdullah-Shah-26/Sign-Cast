import React from "react";

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="animate-fade-in">
      <div className="glass-card border-red-200 dark:border-red-800">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">
              Error
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {error}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
