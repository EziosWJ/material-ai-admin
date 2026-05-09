import { Link } from "react-router-dom";
import {
  MessageSquareText,
  PenLine,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  mockMaterials,
  mockQaSessions,
  mockWritingTasks,
} from "@/mocks/workbench";

export function WorkbenchHomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* 欢迎区 */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">
          本地化智能材料写作平台
        </h1>
        <p className="mt-2 text-text-secondary">
          基于材料库进行问答、提纲、初稿、润色和标题生成
        </p>
      </div>

      {/* 功能入口卡片 */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Link
          to="/workbench/chat"
          className="group rounded-admin border border-border bg-surface p-6 transition-all hover:border-primary/30 hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageSquareText className="h-6 w-6" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">
            材料问答
          </h2>
          <p className="mb-4 text-sm text-text-secondary">
            基于材料库进行智能问答，快速获取信息和答案
          </p>
          <div className="flex items-center gap-1 text-sm font-medium text-primary">
            开始问答
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          to="/workbench/writing"
          className="group rounded-admin border border-border bg-surface p-6 transition-all hover:border-primary/30 hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <PenLine className="h-6 w-6" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">
            辅助写作
          </h2>
          <p className="mb-4 text-sm text-text-secondary">
            生成提纲、初稿、润色和标题，提升写作效率
          </p>
          <div className="flex items-center gap-1 text-sm font-medium text-primary">
            开始写作
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* 信息区 */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* 最近材料 */}
        <div className="rounded-admin border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-text-primary">最近材料</h3>
            <span className="text-xs text-text-tertiary">共 {mockMaterials.length} 份</span>
          </div>
          <div className="divide-y divide-border">
            {mockMaterials.slice(0, 3).map((material) => (
              <div
                key={material.id}
                className="flex items-start gap-3 px-4 py-3"
              >
                <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-text-tertiary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-text-primary">
                    {material.title}
                  </p>
                  <p className="mt-1 text-xs text-text-tertiary">
                    {material.category} · {material.segmentCount} 个片段
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近问答 */}
        <div className="rounded-admin border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-text-primary">最近问答</h3>
            <span className="text-xs text-text-tertiary">
              共 {mockQaSessions.length} 个会话
            </span>
          </div>
          <div className="divide-y divide-border">
            {mockQaSessions.slice(0, 3).map((session) => (
              <div
                key={session.id}
                className="flex items-start gap-3 px-4 py-3"
              >
                <MessageSquareText className="mt-0.5 h-4 w-4 flex-shrink-0 text-text-tertiary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-text-primary">
                    {session.title}
                  </p>
                  <p className="mt-1 text-xs text-text-tertiary">
                    {session.messageCount} 条消息 · {session.updatedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近写作任务 */}
        <div className="rounded-admin border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-text-primary">
              最近写作任务
            </h3>
            <span className="text-xs text-text-tertiary">
              共 {mockWritingTasks.length} 个任务
            </span>
          </div>
          <div className="divide-y divide-border">
            {mockWritingTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 px-4 py-3"
              >
                <PenLine className="mt-0.5 h-4 w-4 flex-shrink-0 text-text-tertiary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-text-primary">
                    {task.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        task.status === "completed"
                          ? "bg-green-50 text-green-700"
                          : task.status === "generating"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {task.status === "completed"
                        ? "已完成"
                        : task.status === "generating"
                          ? "生成中"
                          : "草稿"}
                    </span>
                    <span className="text-xs text-text-tertiary">
                      {task.type === "outline"
                        ? "提纲"
                        : task.type === "draft"
                          ? "初稿"
                          : task.type === "polish"
                            ? "润色"
                            : "标题"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
