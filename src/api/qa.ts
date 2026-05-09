import { http } from "@/lib/http";
import type { ApiPageResult } from "@/types/api";
import type {
  AskQuestionResponse,
  QaMaterialVO,
  QaMessageVO,
  QaSessionListQuery,
  QaSessionVO,
} from "@/types/qa";

const QA_BASE_PATH = "/api/qa/session";

/** 分页查询问答会话 */
export function getQaSessionPage(query: QaSessionListQuery) {
  return http.get<ApiPageResult<QaSessionVO>>(`${QA_BASE_PATH}/page`, {
    query,
  });
}

/** 获取问答会话详情 */
export function getQaSessionDetail(id: number) {
  return http.get<QaSessionVO>(`${QA_BASE_PATH}/${id}`);
}

/** 获取会话消息列表 */
export function getQaSessionMessages(id: number) {
  return http.get<QaMessageVO[]>(`${QA_BASE_PATH}/${id}/message`, {
    query: { includeSystem: false },
  });
}

/** 创建问答会话 */
export function createQaSession(data: {
  title?: string;
  materialIds?: number[];
}) {
  return http.post<QaSessionVO>(QA_BASE_PATH, data);
}

/** 更新会话关联材料 */
export function updateQaSessionMaterials(
  id: number,
  data: { materialIds: number[] },
) {
  return http.put<QaMaterialVO[]>(`${QA_BASE_PATH}/${id}/material`, data);
}

/** 发送提问 */
export function askQuestion(
  sessionId: number,
  data: { question: string; topK?: number },
) {
  return http.post<AskQuestionResponse>(
    `${QA_BASE_PATH}/${sessionId}/ask`,
    data,
  );
}
