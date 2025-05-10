import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

// Simple info icon (lowercase i in a circle)
const InfoIcon = ({ className = "" }) => (
  <svg
    className={"inline-block align-middle w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors " + className}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
    <text x="10" y="15" textAnchor="middle" fontSize="11" fontFamily="Arial, sans-serif" fill="currentColor" aria-hidden="true">i</text>
  </svg>
);

interface InfoTooltipProps {
  label?: string; // Optional aria-label for accessibility
  children?: React.ReactNode; // Tooltip content
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ label = "More info", children }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          tabIndex={0}
          aria-label={label}
          className="ml-1 p-0.5 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 align-middle"
        >
          <InfoIcon />
          <span className="sr-only">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" align="center" className="max-w-xs">
        {children || "More information coming soon."}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default InfoTooltip;
