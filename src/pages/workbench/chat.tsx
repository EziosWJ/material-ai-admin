import { useState } from "react";
import {
  Plus,
  Send,
  MessageSquareText,
  FileText,
  ChevronDown,
  ChevronRight,
  User,
  Bot,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  mockQaSessions,
  mockQaMessages,
  mockSourceSegments,
  mockMaterials,
} from "@/mocks/workbench";
import { cn } from "@/lib/utils";

export function WorkbenchChatPage() {
  const [selectedSessionId, setSelectedSessionId] = useState(
    mockQaSessions[0]?.id
  );
  const [expandedSegments, setExpandedSegments] = useState<Set<string>>(
    new Set()
  );
  const [inputValue, setInputValue] = useState("");

  const toggleSegment = (segmentId: string) => {
    setExpandedSegments((prev) => {
      const next = new Set(prev);
      if (next.has(segmentId)) {
        next.delete(segmentId);
      } else {
        next.add(segmentId);
      }
      return next;
    });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* 左侧：会话列表 */}
      <div className="w-64 flex-shrink-0 border-r border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-text-primary">问答会话</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-y-auto">
          {mockQaSessions.map((session) => (
            <button
              key={session.id}
              className={cn(
                "flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition-colors hover:bg-slate-50",
                selectedSessionId === session.id &&
                  "bg-primary/5 border-l-2 border-primary"
              )}
              onClick={() => setSelectedSessionId(session.id)}
            >
              <span className="text-sm text-text-primary">{session.title}</span>
              <span className="text-xs text-text-tertiary">
                {session.updatedAt}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 中间：问答区域 */}
      <div className="flex flex-1 flex-col">
        {/* 顶部标题 */}
        <div className="flex h-12 items-center border-b border-border px-4">
          <h3 className="text-sm font-medium text-text-primary">
            {mockQaSessions.find((s) => s.id === selectedSessionId)?.title ||
              "选择一个会话"}
          </h3>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-3xl space-y-6">
            {mockQaMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-surface border border-border"
                  )}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  {message.sourceSegmentCount && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-text-tertiary">
                      <Quote className="h-3 w-3" />
                      引用 {message.sourceSegmentCount} 个来源片段
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
          </div>
        </div>

        {/* 底部输入区 */}
        <div className="border-t border-border bg-surface p-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="输入您的问题..."
                className="min-h-[44px] resize-none"
                rows={1}
              />
              <Button className="flex-shrink-0" disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-text-tertiary">
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
            <div className="space-y-2">
              {mockMaterials.slice(0, 2).map((material) => (
                <div
                  key={material.id}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
                >
                  <FileText className="h-4 w-4 flex-shrink-0 text-text-tertiary" />
                  <span className="truncate text-sm text-text-primary">
                    {material.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 来源片段列表 */}
          <div className="p-4">
            <h4 className="mb-3 text-xs font-medium text-text-tertiary">
              来源片段
            </h4>
            <div className="space-y-2">
              {mockSourceSegments.map((segment) => (
                <div
                  key={segment.id}
                  className="rounded-lg border border-border"
                >
                  <button
                    className="flex w-full items-start gap-2 px-3 py-2 text-left"
                    onClick={() => toggleSegment(segment.id)}
                  >
                    {expandedSegments.has(segment.id) ? (
                      <ChevronDown className="mt-0.5 h-4 w-4 flex-shrink-0 text-text-tertiary" />
                    ) : (
                      <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-text-tertiary" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-text-primary">
                          {segment.materialTitle}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-text-tertiary">
                        <span>片段 {segment.segmentIndex}</span>
                        <span>·</span>
                        <span>相关度 {(segment.relevance * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </button>
                  {expandedSegments.has(segment.id) && (
                    <div className="border-t border-border px-3 py-2">
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {segment.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
