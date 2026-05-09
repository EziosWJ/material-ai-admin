import { Eye, Play, Pencil, Trash2, Trash } from "lucide-react";
import { StatusTag } from "@/components/common/status-tag";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/datetime";
import type { DataTableColumn } from "@/types";
import type { MaterialRecord, MaterialStatus } from "@/types/material";
import { formatFileSize } from "./utils";

/** 材料状态元数据 */
const statusMeta: Record<
  MaterialStatus,
  { label: string; tone: "warning" | "success" | "error" }
> = {
  processing: { label: "处理中", tone: "warning" },
  available: { label: "可用", tone: "success" },
  failed: { label: "失败", tone: "error" },
};

/** 列操作回调 */
type MaterialColumnActions = {
  onEdit: (record: MaterialRecord) => void;
  onDelete: (record: MaterialRecord) => void;
  onDetail: (record: MaterialRecord) => void;
  onTriggerProcess: (record: MaterialRecord) => void;
  onDeleteVector: (record: MaterialRecord) => void;
};

/** 创建材料表格列 */
export function createMaterialColumns({
  onEdit,
  onDelete,
  onDetail,
  onTriggerProcess,
  onDeleteVector,
}: MaterialColumnActions): DataTableColumn<MaterialRecord>[] {
  return [
    {
      title: "标题",
      dataIndex: "title",
      width: 200,
      render: (value, record) => (
        <button
          type="button"
          className="text-left font-medium text-text-primary hover:text-primary hover:underline"
          onClick={() => onDetail(record)}
        >
          {String(value || "-")}
        </button>
      ),
    },
    {
      title: "原始文件名",
      dataIndex: "originalFilename",
      width: 180,
      render: (value) => (
        <span className="block max-w-[180px] truncate text-sm text-text-secondary">
          {String(value || "-")}
        </span>
      ),
    },
    {
      title: "文件类型",
      dataIndex: "fileType",
      width: 100,
      render: (value) => (
        <span className="text-sm text-text-secondary">
          {String(value || "-")}
        </span>
      ),
    },
    {
      title: "文件大小",
      dataIndex: "fileSize",
      width: 100,
      render: (value) => (
        <span className="whitespace-nowrap text-sm tabular-nums">
          {formatFileSize(Number(value) || 0)}
        </span>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 96,
      render: (value) => {
        const status = value as MaterialStatus;
        const meta = statusMeta[status];
        return <StatusTag tone={meta.tone}>{meta.label}</StatusTag>;
      },
    },
    {
      title: "片段数量",
      dataIndex: "segmentCount",
      width: 100,
      render: (value) => (
        <span className="whitespace-nowrap tabular-nums">
          {Number(value) || 0}
        </span>
      ),
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
      width: 260,
      render: (_, record) => (
        <div className="inline-flex flex-wrap items-center justify-center gap-1">
          <Button size="sm" variant="ghost" onClick={() => onDetail(record)}>
            <Eye className="h-4 w-4" aria-hidden />
            详情
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit(record)}>
            <Pencil className="h-4 w-4" aria-hidden />
            编辑
          </Button>
          <Button
            size="icon"
            variant="ghost"
            title="触发处理"
            onClick={() => onTriggerProcess(record)}
          >
            <Play className="h-4 w-4" aria-hidden />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            title="删除向量"
            onClick={() => onDeleteVector(record)}
          >
            <Trash className="h-4 w-4" aria-hidden />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-error hover:text-error"
            title="删除"
            onClick={() => onDelete(record)}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      ),
    },
  ];
}
