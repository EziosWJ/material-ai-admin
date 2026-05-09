import { http } from "@/lib/http";
import type { ApiPageResult } from "@/types/api";
import type {
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
