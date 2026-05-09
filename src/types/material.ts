import type { ApiPageRequest } from "./api";

/** 材料状态 */
export type MaterialStatus = "processing" | "available" | "failed";

/** 材料记录 */
export type MaterialRecord = {
  id: number;
  userId: number;
  title: string;
  originalFilename: string;
  fileId: number;
  fileType: string;
  fileSize: number;
  fileMd5: string;
  storagePath: string;
  status: MaterialStatus;
  segmentCount: number;
  lastProcessTime: string | null;
  errorMessage: string | null;
  remark: string;
  createTime: string;
  updateTime: string;
};

/** 材料列表查询参数 */
export type MaterialListQuery = Partial<ApiPageRequest> & {
  userId?: number;
  title?: string;
  fileId?: number;
  fileType?: string;
  status?: string;
};

/** 材料创建请求 */
export type MaterialCreateRequest = {
  userId: number;
  title: string;
  originalFilename: string;
  fileId: number;
  fileType?: string;
  fileSize: number;
  fileMd5?: string;
  storagePath: string;
  status?: string;
  remark?: string;
};

/** 材料更新请求 */
export type MaterialUpdateRequest = {
  title?: string;
  status?: string;
  segmentCount?: number;
  errorMessage?: string;
  remark?: string;
};

/** 材料批量删除请求 */
export type MaterialBatchDeleteRequest = {
  ids: number[];
};

/** 材料处理记录 */
export type MaterialProcessRecord = {
  id: number;
  materialId: number;
  userId: number;
  fileId: number;
  fileMd5: string;
  originalFilename: string;
  processType: "initial" | "reprocess";
  status: "success" | "failed";
  deletedCount: number;
  segmentCount: number;
  errorMessage: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  durationMs: number | null;
  createTime: string;
  updateTime: string;
};

/** 处理记录分页查询参数 */
export type ProcessRecordListQuery = Partial<ApiPageRequest> & {
  materialId?: number;
  userId?: number;
  fileId?: number;
  processType?: string;
  status?: string;
};

/** 触发材料处理请求 */
export type MaterialProcessTriggerRequest = {
  processType?: "initial" | "reprocess";
};
