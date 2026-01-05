import React from "react";
import { cn } from "../../../lib/utils";

interface TabItem {
  id: string;
  label: string;
}

interface TabProps {
  items: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  className?: string;
}

const Tab: React.FC<TabProps> = ({ items, activeTab, onChange, disabled = false, className }) => {
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex;
    
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    } else if (e.key === "Home") {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      newIndex = items.length - 1;
    } else {
      return;
    }
    
    onChange(items[newIndex].id);
  };

  return (
    <div
      role="tablist"
      aria-label="Content tabs"
      className={cn(
        "flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800",
        className
      )}
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          role="tab"
          aria-selected={activeTab === item.id}
          aria-controls={`tabpanel-${item.id}`}
          id={`tab-${item.id}`}
          tabIndex={activeTab === item.id ? 0 : -1}
          onClick={() => onChange(item.id)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={disabled}
          className={cn(
            "px-3 py-1.5 h-8 text-[11px] font-medium transition-all flex-1 text-center whitespace-nowrap border border-transparent font-mono uppercase",
            disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
            activeTab === item.id
              ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 border-neutral-200 dark:border-neutral-800"
              : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Tab;
