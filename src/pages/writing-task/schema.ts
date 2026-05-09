import type { WritingTaskStatus, WritingType } from "@/types/writing";

/** 筛选条件状态 */
export type FilterState = {
  title: string;
  writingType: "all" | WritingType;
  status: "all" | WritingTaskStatus;
};

/** 默认筛选条件 */
export const DEFAULT_FILTERS: FilterState = {
  title: "",
  writingType: "all",
  status: "all",
};

/** 构建查询参数 */
export function buildQuery(
  filters: FilterState,
  page: number,
  pageSize: number,
) {
  return {
    page,
    pageSize,
    title: filters.title.trim() || undefined,
    writingType:
      filters.writingType === "all" ? undefined : filters.writingType,
    status: filters.status === "all" ? undefined : filters.status,
  };
}
