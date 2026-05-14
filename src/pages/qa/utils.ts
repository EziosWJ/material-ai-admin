/** 会话状态选项 */
export const qaSessionStatusOptions = [
  { value: "active", label: "进行中" },
  { value: "closed", label: "已结束" },
  { value: "archived", label: "已归档" },
];

/** 状态样式映射 */
const statusMetaMap: Record<
  string,
  { label: string; tone: "success" | "warning" | "error" | "info" | "neutral" }
> = {
  active: { label: "进行中", tone: "success" },
  closed: { label: "已结束", tone: "neutral" },
  archived: { label: "已归档", tone: "info" },
};

/** 获取会话状态样式 */
export function getQaSessionStatusMeta(status: string) {
  return (
    statusMetaMap[status] ?? { label: status || "未知", tone: "neutral" as const }
  );
}
