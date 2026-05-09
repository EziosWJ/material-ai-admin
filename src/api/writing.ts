import { http } from "@/lib/http";
import type { ApiPageResult } from "@/types/api";
import type { WritingTaskListQuery, WritingTaskVO } from "@/types/writing";

const WRITING_BASE_PATH = "/api/writing/task";

/** 分页查询写作任务 */
export function getWritingTaskPage(query: WritingTaskListQuery) {
  return http.get<ApiPageResult<WritingTaskVO>>(`${WRITING_BASE_PATH}/page`, {
    query,
  });
}

/** 获取写作任务详情 */
export function getWritingTaskDetail(id: number) {
  return http.get<WritingTaskVO>(`${WRITING_BASE_PATH}/${id}`);
}
