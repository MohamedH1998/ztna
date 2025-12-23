import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { cn } from "../../../lib/utils";

type TocItem = { id: string; label: string };

type SidebarProps = {
  items: TocItem[];
  topOffset?: number;
  widthPx?: number;
  className?: string;
};

export default function Sidebar({
  items,
  topOffset = 96,
  widthPx = 320,
  className,
}: SidebarProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  useEffect(() => {
    if (!items.length) return;

    const els = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    // Keep a lightweight score per id.
    const ratios = new Map<string, number>();

    const setIfChanged = (id: string) => {
      if (id && id !== activeIdRef.current) {
        activeIdRef.current = id;
        setActiveId(id);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        // Pick the most "visible" among our headings, but keep tie-breaker by document order.
        let bestId = "";
        let bestScore = 0;

        for (const el of els) {
          const score = ratios.get(el.id) ?? 0;
          if (score > bestScore) {
            bestScore = score;
            bestId = el.id;
          }
        }
        // Fallback: if nothing intersects (e.g. fast scroll), keep previous or pick first.
        setIfChanged(bestId || activeIdRef.current || els[0].id);
      },
      {
        root: null,
        // “Active” when heading passes below your sticky header.
        rootMargin: `-${topOffset}px 0px -70% 0px`,
        threshold: 0, // fewer callbacks than [0, 1]
      }
    );

    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, [items, topOffset]);

  const scrollTo = useCallback((id: string) => {
    // Let IntersectionObserver drive activeId; don’t eagerly set state.
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <aside
      className={cn(
        "hidden lg:block shrink-0 sticky top-0 h-screen border-r border-t border-neutral-200 dark:border-neutral-800 text-gray-900",
        className
      )}
      style={{ width: widthPx }}
      aria-label="Contents"
    >
      <div className="h-full grid grid-cols-[72px_1fr]">
        <div className="relative h-full border-r border-neutral-200 dark:border-neutral-800">
          <div className="absolute left-5 top-0 h-full w-px bg-stone-200" />
        </div>

        <nav className="h-full overflow-y-auto">
          <div>
            <div className="px-3 py-1.5">
              <h2 className="text-3xl font-medium text-gray-900 dark:text-gray-100 font-cormorant">
                Contents
              </h2>
            </div>

            <ul>
              {items.map((item, idx) => {
                const isActive = item.id === activeId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(item.id)}
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
                    </button>
                    {idx === items.length - 1 && (
                      <div className="border-b border-neutral-200 dark:border-neutral-800" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
