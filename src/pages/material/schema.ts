import { z } from "zod";
import type { MaterialRecord, MaterialStatus } from "@/types/material";

/** 表单模式 */
export type MaterialFormMode = "create" | "edit";

/** 筛选状态 */
export type FilterState = {
  title: string;
  status: "all" | MaterialStatus;
  fileType: string;
};

/** 默认筛选条件 */
export const DEFAULT_FILTERS: FilterState = {
  title: "",
  status: "all",
  fileType: "",
};

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null ? undefined : value;

/** 材料表单 schema */
export const materialFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "标题不能为空")
    .max(200, "标题不能超过 200 个字符"),
  remark: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(500, "备注不能超过 500 个字符").optional(),
  ),
});

/** 材料表单值类型 */
export type MaterialFormValues = z.infer<typeof materialFormSchema>;

/** 将记录转换为表单值 */
export function toFormValues(record?: MaterialRecord): MaterialFormValues {
  return {
    title: record?.title ?? "",
    remark: record?.remark ?? "",
  };
}

/** 构建创建/更新请求体 */
export function buildPayload(values: MaterialFormValues) {
  return {
    title: values.title.trim(),
    remark: values.remark?.trim(),
  };
}

/** 构建分页查询参数 */
export function buildQuery(
  filters: FilterState,
  page: number,
  pageSize: number,
) {
  return {
    page,
    pageSize,
    title: filters.title.trim() || undefined,
    status: filters.status === "all" ? undefined : filters.status,
    fileType: filters.fileType.trim() || undefined,
  };
}
