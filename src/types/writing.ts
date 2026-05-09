import type { ApiPageRequest } from "./api";

/** 写作任务状态 */
export type WritingTaskStatus = "pending" | "running" | "success" | "failed";

/** 写作类型 */
export type WritingType = "outline" | "draft" | "polished" | "title";

/** 来源片段 */
export type SourceSegmentVO = {
  text: string;
  materialId: number;
  materialTitle: string;
  originalFilename: string;
  segmentIndex: number;
  score: number;
};

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
