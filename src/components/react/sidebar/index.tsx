import { useCallback } from "react";
import { cn } from "../../../lib/utils";

type TocItem = { id: string; label: string };

type SidebarProps = {
  items: TocItem[];
  topOffset?: number;
  widthPx?: number;
  className?: string;
  hasContent?: boolean;
};

export default function Sidebar({
  items,
  widthPx = 320,
  className,
  hasContent = true,
}: SidebarProps) {

  return (
    <aside
      className={cn(
        "hidden lg:block shrink-0 sticky top-0 h-screen border-r border-y border-neutral-200 dark:border-neutral-800 text-gray-900",
        className
      )}
      style={{ width: widthPx }}
      aria-label="Contents"
    >
      <div className="h-full grid grid-cols-[72px_1fr]">
        <div className="relative h-full border-r border-neutral-200 dark:border-neutral-800">
          <div className="absolute left-5 top-0 h-full w-px bg-stone-200" />
        </div>

        {hasContent && (
          <nav className="h-full overflow-y-auto">
            <div>
              <div className="px-3 py-1.5">
                <h2 className="text-3xl font-medium text-gray-900 dark:text-gray-100 font-cormorant">
                  Contents
                </h2>
              </div>

              <ul>
                {items.map((item, idx) => {
                  const isActive = false;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={cn(
                          "w-full text-left p-3 grid items-center relative",
                          "border-t border-neutral-200 dark:border-neutral-800",
                          "font-mono text-xs leading-4 tracking-wider uppercase",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                          "transition-colors duration-200",
                          "cursor-pointer",
                          isActive
                            ? "text-gray-900 dark:text-gray-100"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        )}
                      >
                        <span
                          className={cn(
                            "w-0.5 bg-accent transition-opacity duration-200 absolute left-0 top-0 h-full",
                            isActive ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="flex items-center gap-3">
                          <span className="w-7 text-gray-400">{idx + 1}</span>
                          <span className="truncate">{item.label}</span>
                        </span>
                      </a>
                      {idx === items.length - 1 && (
                        <div className="border-b border-neutral-200 dark:border-neutral-800" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        )}
      </div>
    </aside>
  );
}
