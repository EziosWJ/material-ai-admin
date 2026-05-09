import { http } from "@/lib/http";
import type { ApiPageResult } from "@/types/api";
import type {
  MaterialBatchDeleteRequest,
  MaterialCreateRequest,
  MaterialListQuery,
  MaterialProcessRecord,
  MaterialProcessTriggerRequest,
  MaterialRecord,
  MaterialUpdateRequest,
  ProcessRecordListQuery,
} from "@/types/material";

const MATERIAL_BASE_PATH = "/api/material";

/** 获取材料分页列表 */
export function getMaterialPage(query: MaterialListQuery) {
  return http.get<ApiPageResult<MaterialRecord>>(
    `${MATERIAL_BASE_PATH}/page`,
    { query },
  );
}

/** 获取材料详情 */
export function getMaterialDetail(id: number) {
  return http.get<MaterialRecord>(`${MATERIAL_BASE_PATH}/${id}`);
}

/** 创建材料 */
export function createMaterial(data: MaterialCreateRequest) {
  return http.post<MaterialRecord>(MATERIAL_BASE_PATH, data);
}

/** 更新材料 */
export function updateMaterial(id: number, data: MaterialUpdateRequest) {
  return http.put<MaterialRecord>(`${MATERIAL_BASE_PATH}/${id}`, data);
}

/** 删除材料 */
export function deleteMaterial(id: number) {
  return http.delete<void>(`${MATERIAL_BASE_PATH}/${id}`);
}

/** 批量删除材料 */
export function batchDeleteMaterials(data: MaterialBatchDeleteRequest) {
  return http.post<void>(`${MATERIAL_BASE_PATH}/batch-delete`, data);
}

/** 获取材料处理记录分页列表 */
export function getProcessRecordPage(query: ProcessRecordListQuery) {
  return http.get<ApiPageResult<MaterialProcessRecord>>(
    `${MATERIAL_BASE_PATH}/process-record/page`,
    { query },
  );
}

/** 获取处理记录详情 */
export function getProcessRecordDetail(id: number) {
  return http.get<MaterialProcessRecord>(
    `${MATERIAL_BASE_PATH}/process-record/${id}`,
  );
}

/** 触发材料处理 */
export function triggerMaterialProcess(
  id: number,
  data?: MaterialProcessTriggerRequest,
) {
  return http.post<MaterialRecord>(
    `${MATERIAL_BASE_PATH}/${id}/process`,
    data,
  );
}

/** 删除材料向量 */
export function deleteMaterialVector(id: number) {
  return http.post<void>(`${MATERIAL_BASE_PATH}/${id}/vector-delete`);
}
