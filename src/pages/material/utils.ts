import type { MaterialStatus } from "@/types/material";

/** 格式化文件大小 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/** 材料状态选项 */
export const materialStatusOptions: {
  value: MaterialStatus;
  label: string;
}[] = [
  { value: "processing", label: "处理中" },
  { value: "available", label: "可用" },
  { value: "failed", label: "失败" },
];

/** 处理记录状态选项 */
export const processRecordStatusOptions: {
  value: string;
  label: string;
}[] = [
  { value: "success", label: "成功" },
  { value: "failed", label: "失败" },
];

/** 处理类型选项 */
export const processTypeOptions: {
  value: string;
  label: string;
}[] = [
  { value: "initial", label: "首次处理" },
  { value: "reprocess", label: "重新处理" },
];

/** 格式化耗时 */
export function formatDuration(ms: number | null): string {
  if (ms === null || ms === undefined) return "-";
  if (ms < 1000) return `${ms}ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m${remainingSeconds}s`;
}
