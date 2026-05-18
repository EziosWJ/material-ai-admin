import { useCallback, useEffect, useRef, useState } from "react";
import {
  Plus,
  Send,
  FileText,
  User,
  Bot,
  Quote,
  Loader2,
  MessageSquareText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  createQaSession,
  getQaSessionMessages,
  getQaSessionPage,
  askQuestion,
} from "@/api/qa";
import type { QaMessageVO, QaSessionVO } from "@/types/qa";
import type { SourceSegmentVO } from "@/types/material";
import { formatDateTime } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { SourceSegmentPanel } from "@/components/common/source-segment-panel";

export function WorkbenchChatPage() {
  const [sessions, setSessions] = useState<QaSessionVO[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null,
  );
  const [messages, setMessages] = useState<QaMessageVO[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 加载会话列表
  const loadSessions = useCallback(async () => {
    try {
      const result = await getQaSessionPage({ page: 1, pageSize: 100, status: "active" });
      setSessions(result.records);
    } catch {
      // 静默处理加载失败
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // 选中会话时加载消息
  useEffect(() => {
    if (selectedSessionId === null) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    setMessagesLoading(true);

    getQaSessionMessages(selectedSessionId)
      .then((data) => {
        if (!cancelled) {
          setMessages(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMessages([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setMessagesLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSessionId]);

  // 消息更新后滚动到底部（只滚动消息容器，不影响外层页面）
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  // 新建会话
  const handleCreateSession = async () => {
    try {
      const session = await createQaSession({});
      setSessions((prev) => [session, ...prev]);
      setSelectedSessionId(session.id);
    } catch {
      // 静默处理创建失败
    }
  };

  // 发送问题
  const handleSend = async () => {
    const question = inputValue.trim();
    if (!question || selectedSessionId === null || sending) return;

    setInputValue("");
    setSending(true);

    try {
      const result = await askQuestion(selectedSessionId, { question });
      setMessages((prev) => [...prev, result.userMessage, result.assistantMessage]);

      // 刷新会话列表以更新 lastMessageTime / messageCount
      loadSessions();
    } catch {
      // 发送失败后恢复输入内容
      setInputValue(question);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 当前选中会话
  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  // 最后一条 assistant 消息的来源片段
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  const sourceSegments: SourceSegmentVO[] =
    lastAssistantMessage?.sourceSegments ?? [];

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* 左侧：会话列表 */}
      <div className="flex w-64 flex-shrink-0 flex-col border-r border-border bg-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-text-primary">问答会话</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleCreateSession}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 min-h-0">
          {sessions.map((session) => (
            <button
              key={session.id}
              className={cn(
                "flex w-full flex-col items-start gap-1 rounded-lg px-3 py-2.5 text-left transition-colors",
                selectedSessionId === session.id
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-slate-50",
              )}
              onClick={() => setSelectedSessionId(session.id)}
            >
              <span className={cn(
                "line-clamp-1 text-sm",
                selectedSessionId === session.id ? "font-medium text-primary" : "text-text-primary",
              )}>
                {session.title}
              </span>
              <span className={cn(
                "text-xs",
                selectedSessionId === session.id ? "text-primary/70" : "text-text-tertiary",
              )}>
                {formatDateTime(session.lastMessageTime || session.createTime)}
              </span>
            </button>
          ))}
          {sessions.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-4 py-8">
              <MessageSquareText className="h-8 w-8 text-text-tertiary/40" />
              <span className="text-xs text-text-tertiary">暂无会话，点击右上角新建</span>
            </div>
          )}
        </div>
      </div>

      {/* 中间：问答区域 */}
      <div className="flex flex-1 flex-col">
        {/* 顶部标题 */}
        <div className="flex h-12 items-center border-b border-border px-4">
          <h3 className="text-sm font-medium text-text-primary">
            {selectedSession?.title || "选择一个会话"}
          </h3>
        </div>

        {/* 消息列表 */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-3xl space-y-5">
            {messagesLoading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-text-tertiary" />
              </div>
            )}

            {!messagesLoading &&
              messages
                .filter((m) => m.role === "user" || m.role === "assistant")
                .map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-xl px-4 py-3",
                        message.role === "user"
                          ? "bg-primary text-white"
                          : "bg-slate-50 text-text-primary",
                      )}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      {message.role === "assistant" &&
                        message.sourceSegments &&
                        message.sourceSegments.length > 0 && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-text-tertiary">
                            <Quote className="h-3 w-3" />
                            引用 {message.sourceSegments.length} 个来源片段
                          </div>
                        )}
                    </div>
                    {message.role === "user" && (
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-text-secondary">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}

            {!messagesLoading && selectedSessionId !== null && messages.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-16">
                <MessageSquareText className="h-10 w-10 text-text-tertiary/30" />
                <span className="text-sm text-text-tertiary">暂无消息，发送问题开始对话</span>
              </div>
            )}

            {selectedSessionId === null && (
              <div className="flex flex-col items-center gap-3 py-16">
                <MessageSquareText className="h-10 w-10 text-text-tertiary/30" />
                <span className="text-sm text-text-tertiary">请从左侧选择一个会话，或新建会话</span>
              </div>
            )}
          </div>
        </div>

        {/* 底部输入区 */}
        <div className="border-t border-border bg-surface px-4 py-3">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入您的问题..."
                className="min-h-[40px] resize-none"
                rows={1}
                disabled={sending || selectedSessionId === null}
              />
              <Button
                className="h-10 flex-shrink-0"
                disabled={!inputValue.trim() || sending || selectedSessionId === null}
                onClick={handleSend}
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="mt-1.5 text-xs text-text-tertiary">
              回答将基于已选择材料生成
            </p>
          </div>
        </div>
      </div>

      {/* 右侧：材料范围 + 来源片段 */}
      <div className="w-80 flex-shrink-0 border-l border-border bg-surface">
        <div className="flex h-12 items-center border-b border-border px-4">
          <h3 className="text-sm font-semibold text-text-primary">
            材料与来源片段
          </h3>
        </div>

        <div className="overflow-y-auto">
          {/* 当前选择材料 */}
          <div className="border-b border-border p-4">
            <h4 className="mb-2 text-xs font-medium text-text-tertiary">
              当前选择材料
            </h4>
            <div className="space-y-1.5">
              {selectedSession?.materials &&
              selectedSession.materials.length > 0 ? (
                selectedSession.materials.map((material) => (
                  <div
                    key={material.materialId}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <FileText className="h-4 w-4 flex-shrink-0 text-text-tertiary" />
                    <span className="truncate text-sm text-text-primary">
                      {material.title}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center gap-1.5 py-4">
                  <FileText className="h-6 w-6 text-text-tertiary/30" />
                  <span className="text-xs text-text-tertiary">暂未关联材料</span>
                </div>
              )}
            </div>
          </div>

          {/* 来源片段列表 */}
          <SourceSegmentPanel segments={sourceSegments} />
        </div>
      </div>
    </div>
  );
}
