import type { ApiPageRequest } from "./api";
import type { SourceSegmentVO } from "./material";
export type { SourceSegmentVO };

/** 材料关联信息 */
export type QaMaterialVO = {
  materialId: number;
  title: string;
  originalFilename: string;
};

/** 问答消息 */
export type QaMessageVO = {
  id: number;
  sessionId: number;
  role: "user" | "assistant" | "system";
  content: string;
  sourceSegments: SourceSegmentVO[];
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

/** 发送提问响应 */
export type AskQuestionResponse = {
  userMessage: QaMessageVO;
  assistantMessage: QaMessageVO;
};
