import { useCallback, useEffect, useState } from "react";
import { getProcessRecordPage } from "@/api/material";
import { DataTable } from "@/components/common/data-table";
import { DetailDialog } from "@/components/common/detail-dialog";
import { DetailItem } from "@/components/common/detail-item";
import { EmptyState } from "@/components/common/empty-state";
import { StatusTag } from "@/components/common/status-tag";
import { formatDateTime } from "@/lib/datetime";
import type { DataTableColumn } from "@/types";
import type { MaterialProcessRecord, MaterialRecord } from "@/types/material";
import {
  formatDuration,
  formatFileSize,
  getMaterialErrorMessage,
  processRecordStatusOptions,
  processTypeOptions,
} from "./utils";

/** 材料详情弹窗属性 */
type MaterialDetailDialogProps = {
  open: boolean;
  record: MaterialRecord | null;
  onCancel: () => void;
};

/** 材料状态元数据 */
const materialStatusMeta: Record<
  string,
  { label: string; tone: "warning" | "success" | "error" }
> = {
  processing: { label: "处理中", tone: "warning" },
  available: { label: "可用", tone: "success" },
  failed: { label: "失败", tone: "error" },
};

/** 处理记录状态元数据 */
const recordStatusMeta: Record<
  string,
  { label: string; tone: "success" | "error" }
> = Object.fromEntries(
  processRecordStatusOptions.map((opt) => [
    opt.value,
    {
      label: opt.label,
      tone: opt.value === "success" ? ("success" as const) : ("error" as const),
    },
  ]),
);

/** 处理类型标签映射 */
const processTypeLabelMap: Record<string, string> = Object.fromEntries(
  processTypeOptions.map((opt) => [opt.value, opt.label]),
);

/** 处理记录表格列 */
const processRecordColumns: DataTableColumn<MaterialProcessRecord>[] = [
  {
    title: "处理类型",
    dataIndex: "processType",
    width: 100,
    render: (value) => (
      <span className="text-sm">
        {processTypeLabelMap[String(value)] ?? String(value)}
      </span>
    ),
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 80,
    render: (value) => {
      const meta = recordStatusMeta[String(value)];
      return meta ? (
        <StatusTag tone={meta.tone}>{meta.label}</StatusTag>
      ) : (
        <span>{String(value)}</span>
      );
    },
  },
  {
    title: "片段数",
    dataIndex: "segmentCount",
    width: 80,
    render: (value) => (
      <span className="tabular-nums">{Number(value) || 0}</span>
    ),
  },
  {
    title: "删除向量数",
    dataIndex: "deletedCount",
    width: 100,
    render: (value) => (
      <span className="tabular-nums">{Number(value) || 0}</span>
    ),
  },
  {
    title: "耗时",
    dataIndex: "durationMs",
    width: 90,
    render: (value) => (
      <span className="whitespace-nowrap tabular-nums">
        {formatDuration(value as number | null)}
      </span>
    ),
  },
  {
    title: "开始时间",
    dataIndex: "startedAt",
    width: 170,
    render: (value) => (
      <span className="whitespace-nowrap tabular-nums">
        {formatDateTime(
          typeof value === "string" ? value : value ? String(value) : "",
        )}
      </span>
    ),
  },
  {
    title: "完成时间",
    dataIndex: "finishedAt",
    width: 170,
    render: (value) => (
      <span className="whitespace-nowrap tabular-nums">
        {formatDateTime(
          typeof value === "string" ? value : value ? String(value) : "",
        )}
      </span>
    ),
  },
  {
    title: "错误信息",
    dataIndex: "errorMessage",
    width: 200,
    render: (value) => (
      <span className="block max-w-[200px] truncate text-sm text-error">
        {value ? String(value) : "-"}
      </span>
    ),
  },
];

export function MaterialDetailDialog({
  open,
  record,
  onCancel,
}: MaterialDetailDialogProps) {
  const [records, setRecords] = useState<MaterialProcessRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRecords = useCallback(async (materialId: number) => {
    setLoading(true);
    setError("");
    try {
      const data = await getProcessRecordPage({
        materialId,
        page: 1,
        pageSize: 50,
      });
      setRecords(data.records);
    } catch (loadError) {
      setRecords([]);
      setError(getMaterialErrorMessage(loadError, "处理记录加载失败"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && record) {
      void loadRecords(record.id);
    } else {
      setRecords([]);
      setError("");
    }
  }, [open, record, loadRecords]);

  if (!record) return null;

  const statusMeta = materialStatusMeta[record.status];

  return (
    <DetailDialog
      open={open}
      title="材料详情"
      description={record.title}
      onCancel={onCancel}
    >
      {/* 材料基本信息 */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        <DetailItem label="标题" value={record.title} />
        <DetailItem label="原始文件名" value={record.originalFilename} />
        <DetailItem label="文件类型" value={record.fileType} />
        <DetailItem
          label="文件大小"
          value={formatFileSize(record.fileSize)}
        />
        <DetailItem
          label="状态"
          value={
            statusMeta ? (
              <StatusTag tone={statusMeta.tone}>{statusMeta.label}</StatusTag>
            ) : (
              record.status
            )
          }
        />
        <DetailItem
          label="片段数量"
          value={String(record.segmentCount ?? 0)}
        />
        <DetailItem label="备注" value={record.remark || "-"} />
        <DetailItem
          label="创建时间"
          value={formatDateTime(record.createTime)}
        />
        <DetailItem
          label="更新时间"
          value={formatDateTime(record.updateTime)}
        />
        <DetailItem
          label="最近处理时间"
          value={formatDateTime(record.lastProcessTime)}
        />
        {record.errorMessage && (
          <DetailItem
            className="col-span-2 sm:col-span-3"
            label="错误信息"
            value={
              <span className="text-error">{record.errorMessage}</span>
            }
          />
        )}
      </div>

      {/* 处理记录列表 */}
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-text-primary">
          处理记录
        </h3>
        <div className="rounded-admin border border-border">
          <DataTable<MaterialProcessRecord>
            columns={processRecordColumns}
            dataSource={records}
            rowKey="id"
            loading={loading}
            error={error}
            minWidth={900}
            empty={
              <EmptyState
                title="暂无处理记录"
                description="该材料尚未进行过处理。"
              />
            }
          />
        </div>
      </div>
    </DetailDialog>
  );
}
