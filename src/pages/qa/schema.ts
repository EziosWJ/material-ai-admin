import type { QaSessionListQuery } from "@/types/qa";

/** 筛选条件状态 */
export type QaSessionFilterValues = {
  status: "all" | string;
};

/** 默认筛选条件 */
export const DEFAULT_FILTERS: QaSessionFilterValues = {
  status: "all",
};

/** 构建查询参数 */
export function buildQuery(
  filters: QaSessionFilterValues,
  page: number,
  pageSize: number,
): QaSessionListQuery {
  return {
    page,
    pageSize,
    status: filters.status === "all" ? undefined : filters.status,
  };
}
