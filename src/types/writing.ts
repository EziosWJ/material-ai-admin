import type { ApiPageRequest } from "./api";
import type { SourceSegmentVO } from "./material";
export type { SourceSegmentVO };

/** 写作任务状态 */
export type WritingTaskStatus = "pending" | "running" | "success" | "failed";

/** 写作类型 */
export type WritingType = "outline" | "draft" | "polished" | "title";

/** 写作结果 */
export type WritingResultVO = {
  id: number;
  taskId: number;
  userId: number;
  versionNo: number;
  content: string;
  sourceSegmentsJson: string;
  sourceSegments: SourceSegmentVO[];
  modelName: string;
  aiCallLogId: number;
  createTime: string;
};

/** 写作任务 */
export type WritingTaskVO = {
  id: number;
  userId: number;
  title: string;
  writingType: WritingType;
  topic: string;
  requirement: string;
  inputContent: string;
  status: WritingTaskStatus;
  errorMessage: string;
  materialIds: number[];
  result: WritingResultVO | null;
  startedAt: string | null;
  finishedAt: string | null;
  createTime: string;
  updateTime: string;
};

/** 写作任务列表查询参数 */
export type WritingTaskListQuery = Partial<ApiPageRequest> & {
  writingType?: string;
  status?: string;
  title?: string;
};

// --- 标签与选项映射 ---

export const WRITING_TYPE_LABEL: Record<WritingType, string> = {
  outline: "提纲",
  draft: "初稿",
  polished: "润色",
  title: "标题",
};

export const WRITING_TYPE_OPTIONS: { value: WritingType; label: string }[] = [
  { value: "outline", label: "提纲" },
  { value: "draft", label: "初稿" },
  { value: "polished", label: "润色" },
  { value: "title", label: "标题" },
];

export const WRITING_TASK_STATUS_LABEL: Record<WritingTaskStatus, string> = {
  pending: "待处理",
  running: "运行中",
  success: "成功",
  failed: "失败",
};

export const WRITING_TASK_STATUS_OPTIONS: { value: WritingTaskStatus; label: string }[] = [
  { value: "pending", label: "待处理" },
  { value: "running", label: "运行中" },
  { value: "success", label: "成功" },
  { value: "failed", label: "失败" },
];

export function getWritingTaskStatusMeta(status: string) {
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

export function formatWritingType(type: string) {
  return WRITING_TYPE_LABEL[type as WritingType] ?? type ?? "-";
}
