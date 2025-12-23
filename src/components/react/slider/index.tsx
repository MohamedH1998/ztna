const Slider = ({
    value,
    onChange,
    min = 0,
    max = 100,
    labels,
  }: {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    labels?: string[];
  }) => {
    return (
      <div className="w-full space-y-4">
        <div className="relative w-full h-1 bg-neutral-200 dark:bg-neutral-800">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />
  
          {/* Progress Bar */}
          <div
            className="h-full bg-neutral-900 dark:bg-white pointer-events-none"
            style={{ width: `${((value - min) / (max - min)) * 100}%` }}
          />
  
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black dark:bg-neutral-900 border-2 border-neutral-900 dark:border-white z-10 pointer-events-none"
            style={{ left: `${((value - min) / (max - min)) * 100}%` }}
          />
        </div>
  
        {labels && (
          <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            {labels.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default Slider;
  