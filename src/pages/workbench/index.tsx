import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquareText,
  PenLine,
  FileText,
  ArrowRight,
} from "lucide-react";
import { getMaterialPage } from "@/api/material";
import { getQaSessionPage } from "@/api/qa";
import { getWritingTaskPage } from "@/api/writing";
import type { MaterialRecord } from "@/types/material";
import type { QaSessionVO } from "@/types/qa";
import type { WritingTaskVO, WritingType, WritingTaskStatus } from "@/types/writing";

const WRITING_TYPE_LABEL: Record<WritingType, string> = {
  outline: "提纲",
  draft: "初稿",
  polished: "润色",
  title: "标题",
};

const TASK_STATUS_LABEL: Record<WritingTaskStatus, string> = {
  pending: "待处理",
  running: "运行中",
  success: "成功",
  failed: "失败",
};

const TASK_STATUS_CLASS: Record<WritingTaskStatus, string> = {
  pending: "bg-slate-100 text-slate-700",
  running: "bg-blue-50 text-blue-700",
  success: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function LoadingRow() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="mt-0.5 h-4 w-4 flex-shrink-0 animate-pulse rounded bg-border" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-border" />
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="px-4 py-6 text-center text-sm text-text-tertiary">
      {message}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="px-4 py-6 text-center text-sm text-text-tertiary">
      {text}
    </div>
  );
}

export function WorkbenchHomePage() {
  const [materials, setMaterials] = useState<MaterialRecord[]>([]);
  const [materialsTotal, setMaterialsTotal] = useState(0);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [materialsError, setMaterialsError] = useState<string | null>(null);

  const [sessions, setSessions] = useState<QaSessionVO[]>([]);
  const [sessionsTotal, setSessionsTotal] = useState(0);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  const [tasks, setTasks] = useState<WritingTaskVO[]>([]);
  const [tasksTotal, setTasksTotal] = useState(0);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setMaterialsLoading(true);
    getMaterialPage({ page: 1, pageSize: 5 })
      .then((res) => {
        if (cancelled) return;
        setMaterials(res.records);
        setMaterialsTotal(res.total);
      })
      .catch(() => {
        if (cancelled) return;
        setMaterialsError("加载材料失败");
      })
      .finally(() => {
        if (cancelled) return;
        setMaterialsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setSessionsLoading(true);
    getQaSessionPage({ page: 1, pageSize: 5, status: "active" })
      .then((res) => {
        if (cancelled) return;
        setSessions(res.records);
        setSessionsTotal(res.total);
      })
      .catch(() => {
        if (cancelled) return;
        setSessionsError("加载问答失败");
      })
      .finally(() => {
        if (cancelled) return;
        setSessionsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setTasksLoading(true);
    getWritingTaskPage({ page: 1, pageSize: 5 })
      .then((res) => {
        if (cancelled) return;
        setTasks(res.records);
        setTasksTotal(res.total);
      })
      .catch(() => {
        if (cancelled) return;
        setTasksError("加载写作任务失败");
      })
      .finally(() => {
        if (cancelled) return;
        setTasksLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
            <span className="text-xs text-text-tertiary">共 {materialsTotal} 份</span>
          </div>
          <div className="divide-y divide-border">
            {materialsLoading ? (
              <>
                <LoadingRow />
                <LoadingRow />
                <LoadingRow />
              </>
            ) : materialsError ? (
              <ErrorState message={materialsError} />
            ) : materials.length === 0 ? (
              <EmptyState text="暂无材料" />
            ) : (
              materials.map((material) => (
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
                      {material.fileType} · {formatDate(material.createTime)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 最近问答 */}
        <div className="rounded-admin border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-text-primary">最近问答</h3>
            <span className="text-xs text-text-tertiary">
              共 {sessionsTotal} 个会话
            </span>
          </div>
          <div className="divide-y divide-border">
            {sessionsLoading ? (
              <>
                <LoadingRow />
                <LoadingRow />
                <LoadingRow />
              </>
            ) : sessionsError ? (
              <ErrorState message={sessionsError} />
            ) : sessions.length === 0 ? (
              <EmptyState text="暂无问答" />
            ) : (
              sessions.map((session) => (
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
                      {session.messageCount} 条消息 · {formatDate(session.lastMessageTime)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 最近写作任务 */}
        <div className="rounded-admin border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-text-primary">
              最近写作任务
            </h3>
            <span className="text-xs text-text-tertiary">
              共 {tasksTotal} 个任务
            </span>
          </div>
          <div className="divide-y divide-border">
            {tasksLoading ? (
              <>
                <LoadingRow />
                <LoadingRow />
                <LoadingRow />
              </>
            ) : tasksError ? (
              <ErrorState message={tasksError} />
            ) : tasks.length === 0 ? (
              <EmptyState text="暂无写作任务" />
            ) : (
              tasks.map((task) => (
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
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TASK_STATUS_CLASS[task.status]}`}
                      >
                        {TASK_STATUS_LABEL[task.status]}
                      </span>
                      <span className="text-xs text-text-tertiary">
                        {WRITING_TYPE_LABEL[task.writingType]}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
