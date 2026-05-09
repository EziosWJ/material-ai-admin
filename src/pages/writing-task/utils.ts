import { isApiError } from "@/lib/api-error";
import type { WritingTaskStatus, WritingType } from "@/types/writing";

/** 获取错误信息 */
export function getErrorMessage(error: unknown, fallback: string) {
  if (isApiError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

/** 写作类型选项 */
export const writingTypeOptions: { value: WritingType; label: string }[] = [
  { value: "outline", label: "大纲" },
  { value: "draft", label: "初稿" },
  { value: "polished", label: "润色" },
  { value: "title", label: "标题" },
];

/** 任务状态选项 */
export const writingTaskStatusOptions: {
  value: WritingTaskStatus;
  label: string;
}[] = [
  { value: "pending", label: "待处理" },
  { value: "running", label: "运行中" },
  { value: "success", label: "成功" },
  { value: "failed", label: "失败" },
];

/** 写作类型中文映射 */
const writingTypeMap: Record<WritingType, string> = {
  outline: "大纲",
  draft: "初稿",
  polished: "润色",
  title: "标题",
};

/** 格式化写作类型 */
export function formatWritingType(type: string) {
  return writingTypeMap[type as WritingType] ?? type ?? "-";
}

/** 状态标签样式映射 */
export function getTaskStatusMeta(status: string) {
  switch (status) {
    case "pending":
      return { label: "待处理", tone: "warning" as const };
    case "running":
      return { label: "运行中", tone: "info" as const };
    case "success":
      return { label: "成功", tone: "success" as const };
    case "failed":
      return { label: "失败", tone: "error" as const };
    default:
      return { label: status || "-", tone: "neutral" as const };
  }
}
