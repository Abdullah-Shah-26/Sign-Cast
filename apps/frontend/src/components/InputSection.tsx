import React from "react";

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  isTranscribing: boolean;
  isRecording: boolean;
  handleRecordClick: () => void;
  handleSimplifyAndTranslate: () => void;
  triggerTranslation: (text: string) => void;
  simplifyText: boolean;
  isTranslating: boolean;
}

// Common ActionButton component for reuse
export const ActionButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  color: "primary" | "success";
  children: React.ReactNode;
  ariaLabel?: string;
}> = ({ onClick, disabled, loading, color, children, ariaLabel }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`btn ${color === "success" ? "btn-success" : "btn-primary"} flex-1 py-4 px-6 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
    aria-label={ariaLabel}
  >
    {loading ? (
      <>
        <div className="w-5 h-5 loading-spinner mr-2"></div>
        <span>Loading...</span>
      </>
    ) : (
      children
    )}
  </button>
);

const InputSection: React.FC<InputSectionProps> = ({
  inputText,
  setInputText,
  isTranscribing,
  isRecording,
  handleRecordClick,
  handleSimplifyAndTranslate,
  triggerTranslation,
  simplifyText,
  isTranslating,
}) => (
  <div className="xl:col-span-5 h-full">
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
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white">
              Input
            </h2>
            <p className="text-sm text-black dark:text-gray-400">
              Enter text or record audio
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col pt-6">
        {isTranscribing ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 loading-spinner mx-auto mb-4"></div>
              <p className="text-sm font-medium text-black dark:text-white mb-2">
                Processing voice recording...
              </p>
              <p className="text-xs text-black dark:text-gray-400">
                Converting speech to text
              </p>
            </div>
          </div>
        ) : (
          <div className="relative flex-1">
            <textarea
              className="input w-full h-full resize-none min-h-[180px] text-base leading-relaxed"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message here or use voice recording to get started..."
              aria-label="Input text for translation"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-black dark:text-gray-400">
              <span>{inputText.length} characters</span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>Press Enter to translate</span>
            </div>
          </div>
        )}
        {/* Enhanced Action Buttons */}
        <div className="flex gap-4 mt-6">
          <ActionButton
            onClick={handleRecordClick}
            disabled={isRecording || isTranscribing}
            loading={false}
            color="success"
            ariaLabel="Start recording"
          >
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-2">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>{isRecording ? "Recording..." : "Record Voice"}</span>
            </div>
          </ActionButton>
          <ActionButton
            onClick={
              simplifyText
                ? handleSimplifyAndTranslate
                : () => triggerTranslation(inputText)
            }
            disabled={
              isTranslating || isTranscribing || inputText.trim() === ""
            }
            loading={isTranslating}
            color="primary"
            ariaLabel={
              simplifyText ? "Simplify and translate text" : "Translate text"
            }
          >
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-2">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
              <span>{simplifyText ? "Simplify & Translate" : "Translate"}</span>
            </div>
          </ActionButton>
        </div>
      </div>
    </div>
  </div>
);

export default InputSection;
