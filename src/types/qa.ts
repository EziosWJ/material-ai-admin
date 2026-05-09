import type { ApiPageRequest } from "./api";

/** 材料关联信息 */
export type QaMaterialVO = {
  materialId: number;
  title: string;
  originalFilename: string;
};

/** 来源片段 */
export type QaSourceSegmentVO = {
  text: string;
  materialId: number;
  segmentIndex: number;
  score: number;
  materialTitle: string;
  originalFilename: string;
};

/** 问答消息 */
export type QaMessageVO = {
  id: number;
  sessionId: number;
  role: "user" | "assistant" | "system";
  content: string;
  sourceSegments: QaSourceSegmentVO[];
  modelName: string;
  aiCallLogId: number;
  createTime: string;
};

/** 问答会话 */
export type QaSessionVO = {
  id: number;
  title: string;
  status: string;
  lastMessageTime: string;
  messageCount: number;
  materials: QaMaterialVO[];
  createTime: string;
  updateTime: string;
};

/** 问答会话列表查询参数 */
export type QaSessionListQuery = Partial<ApiPageRequest> & {
  status?: string;
};
