import type { ReactNode } from "react";
import { DetailDialog } from "@/components/common/detail-dialog";
import { StatusTag } from "@/components/common/status-tag";
import { formatDateTime } from "@/lib/datetime";
import type { WritingTaskVO } from "@/types/writing";
import { formatWritingType, getTaskStatusMeta } from "./utils";

type WritingTaskDetailDialogProps = {
  open: boolean;
  detail: WritingTaskVO | null;
  loading: boolean;
  onCancel: () => void;
};

export function WritingTaskDetailDialog({
  open,
  detail,
  loading,
  onCancel,
}: WritingTaskDetailDialogProps) {
  const statusMeta = getTaskStatusMeta(detail?.status ?? "");

  return (
    <DetailDialog
      open={open}
      title="写作任务详情"
      description={loading ? "详情加载中" : `任务 ID：${detail?.id ?? "-"}`}
      loading={loading}
      onCancel={onCancel}
    >
      <div className="space-y-6">
        {/* 基本信息 */}
        <div className="grid gap-4 md:grid-cols-2">
          <DetailItem label="标题" value={detail?.title} />
          <DetailItem
            label="写作类型"
            value={formatWritingType(detail?.writingType ?? "")}
          />
          <DetailItem label="主题" value={detail?.topic} />
          <DetailItem
            label="状态"
            value={<StatusTag tone={statusMeta.tone}>{statusMeta.label}</StatusTag>}
          />
          <DetailItem
            label="开始时间"
            value={
              <span className="whitespace-nowrap tabular-nums">
                {formatDateTime(detail?.startedAt)}
              </span>
            }
          />
          <DetailItem
            label="完成时间"
            value={
              <span className="whitespace-nowrap tabular-nums">
                {formatDateTime(detail?.finishedAt)}
              </span>
            }
          />
          <DetailItem
            label="创建时间"
            value={
              <span className="whitespace-nowrap tabular-nums">
                {formatDateTime(detail?.createTime)}
              </span>
            }
            className="md:col-span-2"
          />
        </div>

        {/* 要求 */}
        {detail?.requirement && (
          <DetailItem label="要求" value={detail.requirement} />
        )}

        {/* 润色原文 */}
        {detail?.inputContent && (
          <DetailItem label="润色原文" value={detail.inputContent} />
        )}

        {/* 错误信息 */}
        {detail?.status === "failed" && detail?.errorMessage && (
          <DetailItem
            label="失败原因"
            value={
              <span className="text-error">{detail.errorMessage}</span>
            }
          />
        )}

        {/* 生成结果 */}
        {detail?.result && (
          <>
            <div className="border-t border-border pt-4">
              <h3 className="mb-4 text-sm font-semibold text-text-primary">
                生成结果
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <DetailItem
                  label="AI 模型"
                  value={detail.result.modelName}
                />
                <DetailItem
                  label="版本号"
                  value={String(detail.result.versionNo)}
                />
              </div>
            </div>

            {/* 生成内容 */}
            {detail.result.content && (
              <DetailItem
                label="生成内容"
                value={
                  <div className="max-h-[300px] overflow-y-auto whitespace-pre-wrap rounded-md border border-border bg-surface-secondary p-3 text-sm">
                    {detail.result.content}
                  </div>
                }
              />
            )}

            {/* 来源片段 */}
            {detail.result.sourceSegments?.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-medium text-text-primary">
                  来源片段（{detail.result.sourceSegments.length}）
                </h4>
                <div className="space-y-3">
                  {detail.result.sourceSegments.map((segment) => (
                    <div
                      key={`${segment.materialId}-${segment.segmentIndex}`}
                      className="rounded-md border border-border bg-surface-secondary p-3"
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
                        <span>材料：{segment.materialTitle || "-"}</span>
                        <span>片段序号：{segment.segmentIndex}</span>
                        <span>
                          相似度：{Number(segment.score).toFixed(4)}
                        </span>
                      </div>
                      <div className="text-sm text-text-primary">
                        {segment.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DetailDialog>
  );
}

/** 详情项组件 */
function DetailItem({
  label,
  value,
  className,
}: {
  label: string;
  value?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-[13px] text-text-tertiary">{label}</div>
      <div className="mt-1 break-words text-sm text-text-primary">
        {value || "-"}
      </div>
    </div>
  );
}
