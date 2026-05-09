import { useCallback, useEffect, useRef, useState } from "react";
import { getQaSessionMessages } from "@/api/qa";
import { DetailDialog } from "@/components/common/detail-dialog";
import { StatusTag } from "@/components/common/status-tag";
import { formatDateTime } from "@/lib/datetime";
import type { QaMessageVO, QaSessionVO } from "@/types/qa";
import { getQaSessionErrorMessage, getQaSessionStatusMeta } from "./utils";

type QaSessionDetailDialogProps = {
  open: boolean;
  session: QaSessionVO | null;
  onCancel: () => void;
};

export function QaSessionDetailDialog({
  open,
  session,
  onCancel,
}: QaSessionDetailDialogProps) {
  const [messages, setMessages] = useState<QaMessageVO[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const requestId = useRef(0);

  const loadMessages = useCallback(async (sessionId: number) => {
    const currentRequestId = ++requestId.current;
    setMessagesLoading(true);
    setMessagesError("");

    try {
      const data = await getQaSessionMessages(sessionId);
      if (requestId.current !== currentRequestId) return;
      setMessages(data);
    } catch (error) {
      if (requestId.current !== currentRequestId) return;
      setMessages([]);
      setMessagesError(getQaSessionErrorMessage(error, "消息列表加载失败"));
    } finally {
      if (requestId.current === currentRequestId) {
        setMessagesLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (open && session) {
      void loadMessages(session.id);
    } else {
      setMessages([]);
      setMessagesError("");
    }
  }, [open, session, loadMessages]);

  if (!session) return null;

  const statusMeta = getQaSessionStatusMeta(session.status);

  return (
    <DetailDialog
      open={open}
      title="会话详情"
      description={`会话 ID: ${session.id}`}
      loading={messagesLoading}
      onCancel={onCancel}
    >
      <div className="space-y-6">
        {/* 基本信息 */}
        <section>
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            基本信息
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-text-tertiary">标题：</span>
              <span className="text-text-primary">{session.title || "-"}</span>
            </div>
            <div>
              <span className="text-text-tertiary">状态：</span>
              <StatusTag tone={statusMeta.tone}>{statusMeta.label}</StatusTag>
            </div>
            <div>
              <span className="text-text-tertiary">消息数量：</span>
              <span className="tabular-nums text-text-primary">
                {session.messageCount ?? 0}
              </span>
            </div>
            <div>
              <span className="text-text-tertiary">创建时间：</span>
              <span className="tabular-nums text-text-primary">
                {formatDateTime(session.createTime)}
              </span>
            </div>
          </div>
        </section>

        {/* 关联材料 */}
        {session.materials && session.materials.length > 0 && (
          <section>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">
              关联材料
            </h3>
            <div className="space-y-2">
              {session.materials.map((material) => (
                <div
                  key={material.materialId}
                  className="flex items-center gap-3 rounded-lg border border-border bg-slate-50 px-4 py-2.5 text-sm"
                >
                  <span className="font-medium text-text-primary">
                    {material.title}
                  </span>
                  <span className="text-text-tertiary">
                    {material.originalFilename}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 消息历史 */}
        <section>
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            消息历史
          </h3>

          {messagesError && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-error">
              {messagesError}
            </div>
          )}

          {messagesLoading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          )}

          {!messagesLoading && !messagesError && messages.length === 0 && (
            <div className="rounded-lg border border-dashed border-border bg-slate-50 px-4 py-8 text-center text-sm text-text-tertiary">
              暂无消息记录
            </div>
          )}

          {!messagesLoading && !messagesError && messages.length > 0 && (
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          )}
        </section>
      </div>
    </DetailDialog>
  );
}

function MessageBubble({ message }: { message: QaMessageVO }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${
          isUser
            ? "bg-primary text-white"
            : "border border-border bg-slate-50 text-text-primary"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {/* 助手消息的来源片段 */}
        {!isUser &&
          message.sourceSegments &&
          message.sourceSegments.length > 0 && (
            <div className="mt-3 border-t border-border pt-3">
              <div className="mb-2 text-xs font-medium text-text-tertiary">
                来源片段
              </div>
              <div className="space-y-2">
                {message.sourceSegments.map((segment, index) => (
                  <div
                    key={index}
                    className="rounded border border-border bg-white px-3 py-2 text-xs"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-medium text-text-primary">
                        {segment.materialTitle}
                      </span>
                      <span className="text-text-tertiary">
                        片段 #{segment.segmentIndex}
                      </span>
                      <span className="text-text-tertiary">
                        相似度: {(segment.score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="line-clamp-3 text-text-secondary">
                      {segment.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* 消息元信息 */}
        <div
          className={`mt-2 flex items-center gap-2 text-xs ${
            isUser ? "text-white/70" : "text-text-tertiary"
          }`}
        >
          {!isUser && message.modelName && (
            <span>{message.modelName}</span>
          )}
          <span>{formatDateTime(message.createTime)}</span>
        </div>
      </div>
    </div>
  );
}
