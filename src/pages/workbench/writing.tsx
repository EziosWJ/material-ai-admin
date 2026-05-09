import { useState } from "react";
import {
  FileText,
  Copy,
  Save,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockMaterials, mockSourceSegments, mockWritingResult } from "@/mocks/workbench";
import { cn } from "@/lib/utils";

type WritingType = "outline" | "draft" | "polish" | "title";

const writingTypes: { value: WritingType; label: string }[] = [
  { value: "outline", label: "提纲" },
  { value: "draft", label: "初稿" },
  { value: "polish", label: "润色" },
  { value: "title", label: "标题" },
];

export function WorkbenchWritingPage() {
  const [selectedType, setSelectedType] = useState<WritingType>("outline");
  const [expandedSegments, setExpandedSegments] = useState<Set<string>>(
    new Set()
  );

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
                {mockMaterials.slice(0, 3).map((material) => (
                  <label
                    key={material.id}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-border text-primary"
                    />
                    <span className="truncate text-sm text-text-primary">
                      {material.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 写作主题 */}
            <div>
              <label className="mb-2 block text-xs font-medium text-text-tertiary">
                写作主题
              </label>
              <Input placeholder="请输入写作主题" defaultValue="企业数字化转型成果汇报" />
            </div>

            {/* 写作要求 */}
            <div>
              <label className="mb-2 block text-xs font-medium text-text-tertiary">
                写作要求
              </label>
              <Textarea
                placeholder="请输入写作要求"
                defaultValue="请生成一份详细的汇报提纲，包含项目背景、建设内容、成效数据和下一步计划"
                rows={3}
              />
            </div>

            {/* 语气风格 */}
            <div>
              <label className="mb-2 block text-xs font-medium text-text-tertiary">
                语气风格
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["正式", "专业", "简洁", "详细"].map((style) => (
                  <button
                    key={style}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm transition-colors",
                      style === "专业"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-text-secondary hover:border-primary/30"
                    )}
                  >
                    {style}
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
                defaultValue="2000"
              />
            </div>

            {/* 生成按钮 */}
            <Button className="w-full">
              开始生成
            </Button>
          </div>
        </div>
      </div>

      {/* 中间：生成结果编辑区 */}
      <div className="flex flex-1 flex-col">
        {/* 顶部标题 */}
        <div className="flex h-12 items-center justify-between border-b border-border px-4">
          <h3 className="text-sm font-medium text-text-primary">
            {writingTypes.find((t) => t.value === selectedType)?.label} - 生成结果
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Copy className="mr-1 h-4 w-4" />
              复制
            </Button>
            <Button variant="ghost" size="sm">
              <Save className="mr-1 h-4 w-4" />
              保存草稿
            </Button>
            <Button variant="ghost" size="sm">
              <RefreshCw className="mr-1 h-4 w-4" />
              重新生成
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="mr-1 h-4 w-4" />
              导出
            </Button>
          </div>
        </div>

        {/* 内容编辑区 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-admin border border-border bg-surface p-6">
              <pre className="whitespace-pre-wrap font-sans text-sm text-text-primary leading-relaxed">
                {mockWritingResult}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧：来源片段 / 参考材料 */}
      <div className="w-80 flex-shrink-0 border-l border-border bg-surface">
        <div className="flex h-12 items-center border-b border-border px-4">
          <h3 className="text-sm font-semibold text-text-primary">
            来源片段
          </h3>
        </div>

        <div className="overflow-y-auto p-4">
          <p className="mb-4 text-xs text-text-tertiary">
            本次写作引用的来源片段
          </p>
          <div className="space-y-2">
            {mockSourceSegments.slice(0, 4).map((segment) => (
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
  );
}
