import { Eye } from "lucide-react";
import { StatusTag } from "@/components/common/status-tag";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/datetime";
import type { DataTableColumn } from "@/types";
import type { QaSessionVO } from "@/types/qa";
import { getQaSessionStatusMeta } from "./utils";

type QaSessionColumnActions = {
  onDetail: (session: QaSessionVO) => void;
};

export function createQaSessionColumns({
  onDetail,
}: QaSessionColumnActions): DataTableColumn<QaSessionVO>[] {
  return [
    {
      title: "标题",
      dataIndex: "title",
      width: 260,
      render: (value) => (
        <span className="line-clamp-1 font-medium text-text-primary">
          {String(value ?? "-")}
        </span>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 96,
      render: (value) => {
        const meta = getQaSessionStatusMeta(String(value ?? ""));
        return <StatusTag tone={meta.tone}>{meta.label}</StatusTag>;
      },
    },
    {
      title: "消息数量",
      dataIndex: "messageCount",
      width: 100,
      render: (value) => (
        <span className="tabular-nums">{(value as number) ?? 0}</span>
      ),
    },
    {
      title: "关联材料",
      key: "materials",
      width: 120,
      render: (_value, record) => (
        <span className="tabular-nums">
          {(record as QaSessionVO).materials?.length ?? 0} 个
        </span>
      ),
    },
    {
      title: "最后消息时间",
      dataIndex: "lastMessageTime",
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
      render: (_, session) => (
        <Button size="sm" variant="ghost" onClick={() => onDetail(session)}>
          <Eye className="h-4 w-4" aria-hidden />
          查看
        </Button>
      ),
    },
  ];
}
