import React from "react";

interface TranscriptionDisplayProps {
  transcription: string;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcription,
}) => {
  if (!transcription) return null;

  return (
    <div className="animate-fade-in">
      <div className="glass-card">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">
              Transcription
            </h3>
            <p className="text-black dark:text-white leading-relaxed">
              {transcription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionDisplay;
