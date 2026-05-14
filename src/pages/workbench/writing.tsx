import { useCallback, useEffect, useState } from "react";
import {
  Copy,
  RefreshCw,
  Download,
  Loader2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "@/components/common/toast-store";
import { createWritingTask } from "@/api/writing";
import { getMaterialPage } from "@/api/material";
import type { WritingType, WritingTaskVO } from "@/types/writing";
import type { MaterialRecord } from "@/types/material";
import { SourceSegmentPanel } from "@/components/common/source-segment-panel";

const writingTypes: { value: WritingType; label: string }[] = [
  { value: "outline", label: "提纲" },
  { value: "draft", label: "初稿" },
  { value: "polished", label: "润色" },
  { value: "title", label: "标题" },
];

const styleOptions = ["正式", "专业", "简洁", "详细"];

export function WorkbenchWritingPage() {
  // 表单状态
  const [selectedType, setSelectedType] = useState<WritingType>("outline");
  const [materials, setMaterials] = useState<MaterialRecord[]>([]);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<Set<number>>(
    new Set()
  );
  const [topic, setTopic] = useState("");
  const [requirement, setRequirement] = useState("");
  const [style, setStyle] = useState("正式");
  const [wordCount, setWordCount] = useState("");
  const [inputContent, setInputContent] = useState("");

  // 生成状态
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<WritingTaskVO | null>(null);
  const [lastTaskId, setLastTaskId] = useState<number | null>(null);

  // 加载材料列表
  useEffect(() => {
    getMaterialPage({ page: 1, pageSize: 100 })
      .then((res) => {
        setMaterials(res.records);
      })
      .catch(() => {
        toast.error("加载材料列表失败");
      });
  }, []);

  const toggleMaterial = (id: number) => {
    setSelectedMaterialIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const buildRequirement = useCallback(() => {
    const parts: string[] = [];
    if (requirement.trim()) parts.push(requirement.trim());
    if (style) parts.push(`语气风格：${style}`);
    if (wordCount.trim()) parts.push(`期望字数：${wordCount.trim()}`);
    return parts.join("。") + (parts.length > 0 ? "。" : "");
  }, [requirement, style, wordCount]);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      toast.warning("请输入写作主题");
      return;
    }

    setGenerating(true);
    setResult(null);

    try {
      const task = await createWritingTask({
        title: topic.trim(),
        writingType: selectedType,
        topic: topic.trim(),
        requirement: buildRequirement() || undefined,
        inputContent:
          selectedType === "polished" ? inputContent || undefined : undefined,
        materialIds:
          selectedMaterialIds.size > 0
            ? Array.from(selectedMaterialIds)
            : undefined,
        topK: 5,
      });

      setResult(task);
      setLastTaskId(task.id);

      if (task.status === "failed") {
        toast.error(task.errorMessage || "写作任务失败");
      } else {
        toast.success("生成完成");
      }
    } catch {
      toast.error("创建写作任务失败");
    } finally {
      setGenerating(false);
    }
  }, [
    topic,
    selectedType,
    buildRequirement,
    inputContent,
    selectedMaterialIds,
  ]);

  const handleCopy = useCallback(async () => {
    const content = result?.result?.content;
    if (!content) {
      toast.warning("暂无内容可复制");
      return;
    }
    try {
      await navigator.clipboard.writeText(content);
      toast.success("已复制到剪贴板");
    } catch {
      toast.error("复制失败");
    }
  }, [result]);

  const handleRegenerate = useCallback(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleExport = useCallback(() => {
    const content = result?.result?.content;
    if (!content) {
      toast.warning("暂无内容可导出");
      return;
    }
    const title = topic.trim() || "写作结果";
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("已导出为 Markdown 文件");
  }, [result, topic]);

  const sourceSegments = result?.result?.sourceSegments ?? [];
  const resultContent = result?.result?.content ?? "";

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* 左侧：写作参数区 */}
      <div className="w-72 flex-shrink-0 border-r border-border bg-surface">
        <div className="flex h-12 items-center border-b border-border px-4">
          <h2 className="text-sm font-semibold text-text-primary">写作参数</h2>
        </div>
        <div className="overflow-y-auto p-4">
          <div className="space-y-4">
            {/* 写作类型 */}
            <div>
              <label className="mb-2 block text-xs font-medium text-text-tertiary">
                写作类型
              </label>
              <div className="grid grid-cols-2 gap-2">
                {writingTypes.map((type) => (
                  <button
                    key={type.value}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm transition-colors",
                      selectedType === type.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-text-secondary hover:border-primary/30"
                    )}
                    onClick={() => setSelectedType(type.value)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 材料范围选择 */}
            <div>
              <label className="mb-2 block text-xs font-medium text-text-tertiary">
                材料范围
              </label>
              <div className="space-y-2">
                {materials.length === 0 ? (
                  <p className="text-xs text-text-tertiary">暂无可用材料</p>
                ) : (
                  materials.map((material) => (
                    <label
                      key={material.id}
                      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMaterialIds.has(material.id)}
                        onChange={() => toggleMaterial(material.id)}
                        className="h-4 w-4 rounded border-border text-primary"
                      />
                      <span className="truncate text-sm text-text-primary">
                        {material.title}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* 写作主题 */}
            <div>
              <label className="mb-2 block text-xs font-medium text-text-tertiary">
                写作主题
              </label>
              <Input
                placeholder="请输入写作主题"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            {/* 写作要求 */}
            <div>
              <label className="mb-2 block text-xs font-medium text-text-tertiary">
                写作要求
              </label>
              <Textarea
                placeholder="请输入写作要求"
                rows={3}
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
              />
            </div>

            {/* 润色原文（仅润色模式显示） */}
            {selectedType === "polished" && (
              <div>
                <label className="mb-2 block text-xs font-medium text-text-tertiary">
                  待润色原文
                </label>
                <Textarea
                  placeholder="请输入需要润色的原文内容"
                  rows={4}
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                />
              </div>
            )}

            {/* 语气风格 */}
            <div>
              <label className="mb-2 block text-xs font-medium text-text-tertiary">
                语气风格
              </label>
              <div className="grid grid-cols-2 gap-2">
                {styleOptions.map((s) => (
                  <button
                    key={s}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm transition-colors",
                      style === s
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-text-secondary hover:border-primary/30"
                    )}
                    onClick={() => setStyle(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 期望字数 */}
            <div>
              <label className="mb-2 block text-xs font-medium text-text-tertiary">
                期望字数
              </label>
              <Input
                type="number"
                placeholder="请输入期望字数"
                value={wordCount}
                onChange={(e) => setWordCount(e.target.value)}
              />
            </div>

            {/* 生成按钮 */}
            <Button
              className="w-full"
              disabled={generating}
              onClick={handleGenerate}
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                "开始生成"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 中间：生成结果区 */}
      <div className="flex flex-1 flex-col">
        {/* 顶部工具栏 */}
        <div className="flex h-12 items-center justify-between border-b border-border px-4">
          <h3 className="text-sm font-medium text-text-primary">
            {writingTypes.find((t) => t.value === selectedType)?.label} -
            生成结果
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={!resultContent}
              onClick={handleCopy}
            >
              <Copy className="mr-1 h-4 w-4" />
              复制
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={generating || !lastTaskId}
              onClick={handleRegenerate}
            >
              <RefreshCw
                className={cn(
                  "mr-1 h-4 w-4",
                  generating && "animate-spin"
                )}
              />
              重新生成
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExport}>
              <Download className="mr-1 h-4 w-4" />
              导出
            </Button>
          </div>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl">
            {generating ? (
              <div className="flex flex-col items-center justify-center py-20 text-text-tertiary">
                <Loader2 className="mb-4 h-8 w-8 animate-spin" />
                <p className="text-sm">正在生成中，请稍候...</p>
              </div>
            ) : result ? (
              result.status === "failed" ? (
                <div className="rounded-admin border border-border bg-surface p-6">
                  <p className="text-sm text-red-500">
                    {result.errorMessage || "生成失败，请重试"}
                  </p>
                </div>
              ) : (
                <div className="rounded-admin border border-border bg-surface p-6">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-text-primary leading-relaxed">
                    {resultContent}
                  </pre>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-text-tertiary">
                <FileText className="mb-4 h-8 w-8" />
                <p className="text-sm">配置参数后点击"开始生成"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 右侧：来源片段 */}
      <div className="w-80 flex-shrink-0 border-l border-border bg-surface">
        <div className="flex h-12 items-center border-b border-border px-4">
          <h3 className="text-sm font-semibold text-text-primary">
            来源片段
          </h3>
        </div>

        <div className="overflow-y-auto">
          <SourceSegmentPanel
            segments={sourceSegments}
            title="本次写作引用的来源片段"
          />
        </div>
      </div>
    </div>
  );
}
