import React, { useEffect, useState, useRef } from "react";
import SignWritingService from "../services/SignWritingService";
import LoadingSpinner from "./LoadingSpinner";

interface SignWritingDisplayProps {
  fswTokens: string[];
  direction?: "row" | "col";
  signSize?: number;
}

const SignWritingDisplay: React.FC<SignWritingDisplayProps> = ({
  fswTokens,
  direction = "col",
  signSize = 48,
}) => {
  const [loading, setLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [normalizedTokens, setNormalizedTokens] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldCenter = direction === "col" && normalizedTokens.length <= 1;

  useEffect(() => {
    const loadFonts = async () => {
      try {
        setLoading(true);
        await SignWritingService.loadFonts();
        // Wait for all fonts to be truly ready in the browser
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
        setFontsLoaded(true);
      } catch (error) {
        console.error("Failed to load SignWriting fonts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFonts();
  }, []);

  useEffect(() => {
    const normalizeTokens = async () => {
      if (!fontsLoaded) return;

      const results = [];
      for (const token of fswTokens) {
        const normalized = await SignWritingService.normalizeFSW(token);
        if (normalized) {
          results.push(normalized);
        } else {
          results.push(token);
        }
      }
      setNormalizedTokens(results);
    };
    normalizeTokens();
  }, [fswTokens, fontsLoaded]);

  const handleSaveAsImage = async () => {
    if (!containerRef.current) return;
    
    try {
      setIsExporting(true);
      
      // Ensure fonts are ready before we even start
      if (document.fonts) {
        await Promise.all([
          document.fonts.load('1em SuttonSignWritingLine'),
          document.fonts.load('1em SuttonSignWritingFill')
        ]);
      }

      const { default: html2canvas } = await import('html2canvas');
      const element = containerRef.current;
      
      // Wait a bit longer for the web components to be stable
      await new Promise(r => setTimeout(r, 500));
      
      const canvas = await html2canvas(element, {
        backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#0a0a0a' : '#ffffff',
        scale: 3,
        logging: true,
        useCORS: true,
        allowTaint: true,
      });
      
      const image = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = image;
      a.download = `signcast-translation-${new Date().getTime()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      console.log("Image export successful");
    } catch (error) {
      console.error("Failed to export SignWriting image:", error);
      alert("Failed to generate image. Please try taking a manual screenshot.");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner className="scale-75" text="Loading Fonts" />
        </div>
      </div>
    );
  }

  if (!fontsLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full"
            style={{ background: "var(--bg-danger)" }}
          >
            <svg
              className="w-6 h-6 text-danger-600 dark:text-danger-400"
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
          <p className="text-sm text-danger-600 font-medium mb-2">
            Font Loading Failed
          </p>
          <p className="text-xs text-theme-muted">
            Please refresh the page to try again
          </p>
        </div>
      </div>
    );
  }

  if (normalizedTokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-6 sm:py-0">
        <div className="flex flex-col items-center justify-center w-full">
          <div
            className="inline-flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 mb-1 sm:mb-4 rounded-full mx-auto"
            style={{ background: "var(--bg-secondary)" }}
          >
            <svg
              className="w-5 h-5 sm:w-8 sm:h-8 text-secondary-400 dark:text-secondary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p className="text-xs sm:text-sm text-theme-secondary font-medium mb-0.5 sm:mb-1 text-center mx-auto">
            No Signs to Display
          </p>
          <p className="text-[9px] sm:text-xs text-theme-muted text-center mx-auto">
            Enter text and translate to see SignWriting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-0 relative">
      {/* Export Overlay */}
      {isExporting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg">
          <LoadingSpinner className="high-tech scale-75" text="Rendering Export" />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mb-2">
        <button
          onClick={handleSaveAsImage}
          title="Download as PNG"
          className="p-2 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white flex items-center gap-2"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] uppercase font-bold tracking-tight">PNG</span>
        </button>
      </div>
      {/* Signs Container */}
      <div className="flex-1 min-h-0 flex">
        <div
          id="signwriting-container"
          className={`w-full h-full flex flex-${direction} items-center ${shouldCenter ? "justify-center" : "justify-start"} ${direction === "col" ? "space-y-4" : "space-x-4"}`}
          style={{
            fontSize: `${signSize}px`,
            color: "var(--text-primary)",
            fontFamily: "'SuttonSignWritingLine', 'SuttonSignWritingFill', sans-serif",
          }}
          ref={containerRef}
        >
          {normalizedTokens.map((token, index) => (
            <div
              key={index}
              className="group relative"
              style={{
                animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`,
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: `<fsw-sign sign="${token}" style="direction: ltr; display: block; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -webkit-touch-callout: none; color: var(--text-primary); fill: var(--text-primary); filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)); transition: transform 0.2s ease-in-out;" class="hover:scale-105 cursor-pointer"></fsw-sign>`,
                }}
              />

              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-secondary-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Sign {index + 1}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-secondary-900"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SignWritingDisplay;
