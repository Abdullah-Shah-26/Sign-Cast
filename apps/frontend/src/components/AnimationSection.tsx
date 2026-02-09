import React from "react";
import PoseViewer from "./PoseViewer";
import LoadingSpinner from "./LoadingSpinner";

interface AnimationSectionProps {
  poseFile: Blob | null;
  isGeneratingAnimation: boolean;
}

const AnimationSection: React.FC<AnimationSectionProps> = ({
  poseFile,
  isGeneratingAnimation,
}) => (
  <div className="xl:col-span-4 h-full">
    <div className="glass-card h-full flex flex-col">
      <div className="pb-6 border-b border-black/10 dark:border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center shadow-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM6 6v12h12V6H6zm3 3a1 1 0 112 0v6a1 1 0 11-2 0V9zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V9z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-black dark:text-white">
              Animation
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign language animation
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 pt-6 min-h-0 overflow-hidden">
        {(!poseFile || isGeneratingAnimation) && (
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <span className="text-xs font-medium text-black dark:text-gray-400">
              Animation
            </span>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${isGeneratingAnimation ? "bg-yellow-500 animate-pulse" : "bg-gray-400"}`}
              ></div>
              <span className="text-xs text-black dark:text-gray-400">
                {isGeneratingAnimation ? "Loading" : "Empty"}
              </span>
            </div>
          </div>
        )}
        <div className="flex items-center justify-center h-full w-full overflow-hidden">
          {isGeneratingAnimation ? (
            <LoadingSpinner className="high-tech scale-75" text="Generating Pose" />
          ) : poseFile ? (
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <PoseViewer
                poseFile={poseFile}
                onAnimationComplete={() => {}}
                isTranslating={isGeneratingAnimation}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM6 6v12h12V6H6zm3 3a1 1 0 112 0v6a1 1 0 11-2 0V9zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V9z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-black dark:text-white mb-1">
                No animation available
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Translate text to see animation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default AnimationSection;
