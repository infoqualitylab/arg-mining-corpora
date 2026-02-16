import { useTheme } from "@mui/material/styles";

function formatAgreement(agreement: any) {
  if (!agreement) return "N/A";
  if (typeof agreement === "number") return agreement;
  if (Array.isArray(agreement)) return `${agreement[0]} - ${agreement[1]}`;
  if (typeof agreement === "object") {
    return Object.entries(agreement)
      .map(([k, v]) => `${k}: ${v}`)
      .join(" | ");
  }
  return agreement;
}

const TASK_COLOR_MAP: Record<string, string> = {
  "Argument Component Segmentation": "#3b82f6",
  "Argument Component Type Classification": "#3b82f6",
  "Argument Relation Identification": "#3b82f6",
  "Argument Relation Type Classification": "#3b82f6",
  "Claim Extraction with Stance Classification": "#3b82f6",

  "Maximal Argument Quality Assessment": "#ef4444",
  "Minimal Argument Quality Assessment": "#ef4444",
  "Argument Type Identification": "#ef4444",
  "Argument Summarization": "#ef4444",

  "Other": "#f59e0b",
  "None": "#f59e0b",
};

function getTaskColor(task: string) {
  return TASK_COLOR_MAP[task] || "#64748b";
}

export { formatAgreement, getTaskColor };
