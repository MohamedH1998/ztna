import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../../lib/utils";

type Verdict = "ALLOW" | "DENY";
type CellSource = "OIDC" | "WARP" | "HTTP" | "POLICY";
type CellResult = "pass" | "fail" | "na";

type ColumnKey =
  | "req"
  | "identity"
  | "device"
  | "context"
  | "policy"
  | "decision";

type PredicateCell = {
  value: string;
  result: CellResult; // pass/fail/na
  reason?: string; // shown when fail (and sometimes pass)
  source?: CellSource;
};

type RequestRow = {
  id: string; // "REQ 01"
  identity: PredicateCell;
  device: PredicateCell;
  context: PredicateCell;
  policy: PredicateCell;
  decision: {
    verdict: Verdict;
    reason: string; // single-line explanation (default deny, posture fail, etc.)
  };
};

const EVAL_ORDER: Array<Exclude<ColumnKey, "req">> = [
  "identity",
  "device",
  "context",
  "policy",
  "decision",
];

function cellGlyph(result: CellResult) {
  if (result === "pass") return "✓";
  if (result === "fail") return "✕";
  return "—";
}

function cellTint(result: CellResult) {
  if (result === "pass") return "text-emerald-600 dark:text-emerald-400";
  if (result === "fail") return "text-rose-600 dark:text-rose-400";
  return "text-neutral-400 dark:text-neutral-600";
}

function firstFailColumn(
  row: RequestRow
): Exclude<ColumnKey, "req" | "decision"> | null {
  const cols: Array<Exclude<ColumnKey, "req" | "decision">> = [
    "identity",
    "device",
    "context",
    "policy",
  ];
  for (const c of cols) {
    if (row[c].result === "fail") return c;
  }
  return null;
}

// ---------- component ----------
type TruthTableProps = {
  // Realistic mode: stop evaluation at first failure (default true)
  stopOnFirstFailure?: boolean;
  // Auto-run when in view (default true)
  autoPlay?: boolean;
};

export default function TruthTable({
  stopOnFirstFailure = true,
  autoPlay = true,
}: TruthTableProps) {
  const rows: RequestRow[] = useMemo(
    () => [
      {
        id: "REQ 01",
        identity: {
          value: "john@company.com",
          result: "pass",
          reason: "Valid",
          source: "OIDC",
        },
        device: {
          value: "macOS · Compliant",
          result: "pass",
          reason: "Passed",
          source: "WARP",
        },
        context: {
          value: "GET /admin",
          result: "pass",
          reason: "Protected",
          source: "HTTP",
        },
        policy: {
          value: "Rule #2",
          result: "pass",
          reason: "Match",
          source: "POLICY",
        },
        decision: {
          verdict: "ALLOW",
          reason: "Access granted",
        },
      },
      {
        id: "REQ 02",
        identity: {
          value: "anon@company.com",
          result: "pass",
          reason: "Valid",
          source: "OIDC",
        },
        device: {
          value: "Windows · Failed",
          result: "fail",
          reason: "Posture check failed",
          source: "WARP",
        },
        context: {
          value: "GET /v1/keys",
          result: "pass",
          reason: "Sensitive",
          source: "HTTP",
        },
        policy: {
          value: "Admins + Compliant",
          result: "fail",
          reason: "Requirement not met",
          source: "POLICY",
        },
        decision: {
          verdict: "DENY",
          reason: "Device posture failed",
        },
      },
      {
        id: "REQ 03",
        identity: {
          value: "contractor@vendor.com",
          result: "pass",
          reason: "Valid",
          source: "OIDC",
        },
        device: {
          value: "macOS · Compliant",
          result: "pass",
          reason: "Passed",
          source: "WARP",
        },
        context: {
          value: "GET /internal",
          result: "pass",
          reason: "Protected",
          source: "HTTP",
        },
        policy: {
          value: "No rule match",
          result: "fail",
          reason: "No matching policy",
          source: "POLICY",
        },
        decision: {
          verdict: "DENY",
          reason: "Implicit deny",
        },
      },
    ],
    []
  );

  // Intersection observer
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        threshold: 0.25,
      }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Timeline (single source of truth)
  // stepIndex = number of evaluated steps across all rows, in strict row-major order.
  const steps = useMemo(() => {
    type Step = { rowIndex: number; col: Exclude<ColumnKey, "req"> };
    const s: Step[] = [];
    rows.forEach((row, r) => {
      const failAt = firstFailColumn(row);
      for (const col of EVAL_ORDER) {
        // stop early (realistic) — decision is still computed when we stop.
        if (stopOnFirstFailure && failAt) {
          // evaluate columns up to the failing column
          if (col === "decision") {
            s.push({ rowIndex: r, col: "decision" });
            break;
          }
          s.push({ rowIndex: r, col });
          if (col === failAt) {
            // in realistic mode, we jump to decision next
            s.push({ rowIndex: r, col: "decision" });
            break;
          }
        } else {
          s.push({ rowIndex: r, col });
        }
      }
    });
    return s;
  }, [rows, stopOnFirstFailure]);

  const [playing, setPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Start/stop logic
  useEffect(() => {
    if (!autoPlay) return;
    if (!inView) {
      setPlaying(false);
      return;
    }
    setPlaying(true);
  }, [inView, autoPlay]);

  // Restart when entering view
  useEffect(() => {
    if (!inView) return;
    setStepIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // Drive the timeline
  useEffect(() => {
    if (!playing) return;
    if (stepIndex >= steps.length) return;

    const base = 120; // ms
    const id = window.setTimeout(() => setStepIndex((s) => s + 1), base);
    return () => window.clearTimeout(id);
  }, [playing, stepIndex, steps.length]);

  // Derived evaluated map from stepIndex
  const evaluated = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < Math.min(stepIndex, steps.length); i++) {
      const st = steps[i];
      set.add(`${st.rowIndex}-${st.col}`);
    }
    return set;
  }, [stepIndex, steps]);

  const isEvaluated = (rowIndex: number, col: Exclude<ColumnKey, "req">) =>
    evaluated.has(`${rowIndex}-${col}`);

  // Active caret position (rail)
  const activeStep = steps[Math.min(stepIndex, steps.length - 1)];
  const activeCol = activeStep?.col ?? "identity";

  // Explain mode
  const [focused, setFocused] = useState<{ rowIndex: number } | null>(null);

  return (
    <div ref={containerRef} className="w-full">
      {/* Table */}
      <div className="w-full overflow-x-auto bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
        <table className="w-full min-w-[800px] border-collapse table-fixed">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
              <th className="sticky left-0 z-10 w-20 text-left py-2 px-3 font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-500 font-medium bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800">
                Req
              </th>
              {(
                ["identity", "device", "context", "policy", "decision"] as const
              ).map((h) => (
                <th
                  key={h}
                  className="text-left py-2 px-3 font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-500 font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, r) => {
              const failAt = firstFailColumn(row);
              const highlightFail =
                focused?.rowIndex === r && row.decision.verdict === "DENY"
                  ? failAt
                  : null;

              return (
                <tr
                  key={row.id}
                  onMouseEnter={() => setFocused({ rowIndex: r })}
                  onMouseLeave={() => setFocused(null)}
                  onFocus={() => setFocused({ rowIndex: r })}
                  onBlur={() => setFocused(null)}
                  tabIndex={0}
                  className={cn(
                    "group border-b last:border-b-0 border-neutral-200 dark:border-neutral-800",
                    "outline-none focus-visible:bg-neutral-50 dark:focus-visible:bg-neutral-900"
                  )}
                >
                  {/* REQ */}
                  <td className="sticky left-0 z-10 py-3 px-3 align-top font-mono text-xs text-neutral-500 dark:text-neutral-500 bg-white dark:bg-neutral-950 group-focus-visible:bg-neutral-50 dark:group-focus-visible:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800">
                    {row.id}
                  </td>

                  {/* identity/device/context/policy */}
                  {(["identity", "device", "context", "policy"] as const).map(
                    (col) => {
                      const cell = row[col];
                      const evaluatedNow = isEvaluated(r, col);
                      const shouldDim =
                        stopOnFirstFailure &&
                        failAt &&
                        // dim anything after the failing column when DENY (realistic)
                        EVAL_ORDER.indexOf(col) > EVAL_ORDER.indexOf(failAt) &&
                        row.decision.verdict === "DENY";

                      const isFailHighlight = highlightFail === col;

                      return (
                        <td
                          key={col}
                          className={cn(
                            "py-3 px-3 align-top",
                            "transition-all duration-300",
                            evaluatedNow ? "opacity-100" : "opacity-30",
                            shouldDim && evaluatedNow && "opacity-40",
                            isFailHighlight &&
                              "bg-rose-50/50 dark:bg-rose-950/20"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="font-mono text-xs text-neutral-900 dark:text-neutral-100 break-words leading-tight space-x-1">
                                <span>
                                  {evaluatedNow ? cell.value : cell.value}
                                </span>
                                <span
                                  className={cn(
                                    "",
                                    evaluatedNow
                                      ? cellTint(cell.result)
                                      : "text-neutral-300 dark:text-neutral-700"
                                  )}
                                  aria-hidden
                                >
                                  {evaluatedNow ? cellGlyph(cell.result) : "·"}
                                </span>
                              </div>

                              <div
                                className={cn(
                                  "mt-1.5 font-mono text-[10px] leading-relaxed text-neutral-500 dark:text-neutral-500",
                                  !evaluatedNow && "opacity-0"
                                )}
                              >
                                <span>
                                  {cell.result === "pass" ||
                                  cell.result === "fail"
                                    ? cell.reason
                                    : ""}
                                  {cell.result === "na" ? "Not evaluated" : ""}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      );
                    }
                  )}

                  {/* decision */}
                  <td
                    className={cn(
                      "py-3 px-3 align-top transition-all duration-300",
                      isEvaluated(r, "decision") ? "opacity-100" : "opacity-30"
                    )}
                  >
                    <div
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 border",
                        isEvaluated(r, "decision")
                          ? row.decision.verdict === "ALLOW"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400"
                            : "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400"
                          : "bg-neutral-50 border-neutral-200 text-neutral-400 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-600"
                      )}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-wider">
                        {row.decision.verdict}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "mt-2 font-mono text-[10px] leading-relaxed text-neutral-600 dark:text-neutral-400",
                        !isEvaluated(r, "decision") && "opacity-0"
                      )}
                    >
                      {row.decision.reason}
                    </div>
                    {row.decision.verdict === "DENY" && (
                      <div
                        className={cn(
                          "mt-1 font-mono text-[10px] text-rose-600/75 dark:text-rose-400/75",
                          !isEvaluated(r, "decision") && "opacity-0"
                        )}
                      >
                        {failAt
                          ? `First failure: ${failAt}`
                          : "First failure: policy"}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
