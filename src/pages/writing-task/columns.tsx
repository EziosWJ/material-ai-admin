import { Eye } from "lucide-react";
import { StatusTag } from "@/components/common/status-tag";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/datetime";
import type { DataTableColumn } from "@/types";
import type { WritingTaskVO } from "@/types/writing";
import { formatWritingType, getTaskStatusMeta } from "./utils";

type WritingTaskColumnActions = {
  onDetail: (record: WritingTaskVO) => void;
};

/** 创建写作任务表格列定义 */
export function createWritingTaskColumns({
  onDetail,
}: WritingTaskColumnActions): DataTableColumn<WritingTaskVO>[] {
  return [
    {
      title: "标题",
      dataIndex: "title",
      width: 220,
      render: (value) => (
        <span className="font-medium text-text-primary">
          {String(value || "-")}
        </span>
      ),
    },
    {
      title: "写作类型",
      dataIndex: "writingType",
      width: 100,
      render: (value) => formatWritingType(String(value ?? "")),
    },
    {
      title: "主题",
      dataIndex: "topic",
      width: 200,
      render: (value) => (
        <span className="block max-w-[200px] truncate text-text-secondary">
          {String(value || "-")}
        </span>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      render: (value) => {
        const status = String(value ?? "");
        const meta = getTaskStatusMeta(status);
        return <StatusTag tone={meta.tone}>{meta.label}</StatusTag>;
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 180,
      render: (value) => (
        <span className="whitespace-nowrap tabular-nums">
          {formatDateTime(
            typeof value === "string" ? value : value ? String(value) : "",
          )}
        </span>
      ),
    },
    {
      title: "操作",
      key: "actions",
      align: "center",
      width: 100,
      render: (_, record) => (
        <Button size="sm" variant="ghost" onClick={() => onDetail(record)}>
          <Eye className="h-4 w-4" aria-hidden />
          详情
        </Button>
      ),
    },
  ];
}
