import React from "react";
import SignWritingDisplay from "./SignWritingDisplay";

interface SignWritingSectionProps {
  signWriting: string[];
  isGeneratingSigns: boolean;
}

const SignWritingSection: React.FC<SignWritingSectionProps> = ({
  signWriting,
  isGeneratingSigns,
}) => (
  <div className="xl:col-span-3 h-full">
    <div className="glass-card h-full flex flex-col">
      <div className="pb-6 border-b border-black/10 dark:border-white/10">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-black dark:text-white">
              SignWriting
            </h2>
            <p className="text-sm text-black dark:text-gray-400">
              Written sign language
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 pt-6 min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-black dark:text-gray-400">
            {isGeneratingSigns
              ? "Processing..."
              : `${signWriting.length} sign${signWriting.length !== 1 ? "s" : ""}`}
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isGeneratingSigns ? "bg-yellow-500 animate-pulse" : signWriting.length > 0 ? "bg-emerald-500" : "bg-gray-400"}`}
            ></div>
            <span className="text-xs text-black dark:text-gray-400">
              {isGeneratingSigns
                ? "Loading"
                : signWriting.length > 0
                  ? "Ready"
                  : "Empty"}
            </span>
          </div>
        </div>
        {isGeneratingSigns ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 loading-spinner mx-auto mb-4"></div>
              <p className="text-sm font-medium text-black dark:text-white">
                Processing signs...
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="scrollable-container flex-1 min-h-0">
              <div
                className={
                  signWriting.length === 0
                    ? "flex justify-center items-center h-full w-full"
                    : ""
                }
              >
                <SignWritingDisplay
                  fswTokens={signWriting.length === 0 ? [] : signWriting}
                  direction="col"
                  signSize={24}
                />
              </div>
            </div>
            {signWriting.length > 0 && (
              <div className="mt-4">
                <div className="text-center">
                  <p className="text-xs text-black dark:text-gray-400">
                    Hover for details • Scroll for more
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default SignWritingSection;
