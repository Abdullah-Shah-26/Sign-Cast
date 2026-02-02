import React from "react";

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
  simplifyText: boolean;
  setSimplifyText: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  theme,
  toggleTheme,
  simplifyText,
  setSimplifyText,
}) => (
  <header className="fixed top-0 left-0 right-0 z-50 glassmorphism-navbar">
    <div className="w-full px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo & Brand - Better Mobile Sizing */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src="/SignCast_Cropped.png"
                alt="SignCast Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-black dark:text-white">
              SignCast
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium hidden sm:block">
              AI Voice-to-Sign Translation
            </p>
          </div>
        </div>

        {/* Navigation Controls - Mobile Optimized but Visible */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          {/* Simplify Toggle - Always Show Label */}
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={simplifyText}
                onChange={(e) => setSimplifyText(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 sm:peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-purple-600"></div>
              <span className="ml-2 text-xs sm:text-sm font-medium text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Simplify
              </span>
            </label>
          </div>

          {/* Professional Theme Toggle - Show Text on Mobile */}
          <button
            onClick={toggleTheme}
            className="relative flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-black/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300 group"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <div className="relative w-4 h-4">
              {theme === "light" ? (
                <svg
                  className="w-4 h-4 text-black group-hover:text-gray-600 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-white group-hover:text-gray-300 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="text-xs font-medium text-black dark:text-white">
              {theme === "light" ? "Dark" : "Light"}
            </span>
          </button>

          {/* Online Status - Hidden only on very small screens */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-black dark:text-white">
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
