import { X } from "lucide-react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import type { UseFormReturn } from "react-hook-form";
import { FileUpload } from "@/components/common/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FileRecord } from "@/types/file";
import type { MaterialFormMode, MaterialFormValues } from "./schema";

/** 材料表单弹窗属性 */
type MaterialFormDialogProps = {
  open: boolean;
  mode: MaterialFormMode;
  form: UseFormReturn<MaterialFormValues>;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: MaterialFormValues) => void | Promise<void>;
  onFileUploaded?: (file: FileRecord) => void;
};

export function MaterialFormDialog({
  open,
  mode,
  form,
  loading,
  onCancel,
  onSubmit,
  onFileUploaded,
}: MaterialFormDialogProps) {
  if (!open || typeof document === "undefined") return null;

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = form;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 py-6">
      <section
        className="max-h-[calc(100vh-48px)] w-full max-w-[760px] overflow-hidden rounded-admin border border-border bg-surface shadow-admin"
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              {mode === "create" ? "新建材料" : "编辑材料"}
            </h2>
            <p className="mt-1 text-sm text-text-tertiary">
              {mode === "create"
                ? "上传材料文件并填写基本信息。"
                : "修改材料的基本信息。"}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            disabled={loading}
            onClick={onCancel}
            aria-label="关闭材料表单"
          >
            <X className="h-4 w-4" aria-hidden />
          </Button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid max-h-[calc(100vh-184px)] gap-4 overflow-y-auto px-5 py-4">
            {mode === "create" && (
              <FormField label="上传文件" required>
                <FileUpload
                  businessModule="material"
                  buttonText="选择材料文件"
                  helperText="支持 PDF、Word、TXT 等常见文档格式。"
                  disabled={loading}
                  onUploaded={onFileUploaded}
                />
              </FormField>
            )}
            <FormField label="标题" error={errors.title?.message} required>
              <Input
                {...register("title")}
                placeholder="请输入材料标题"
                disabled={loading}
              />
            </FormField>
            <FormField label="备注" error={errors.remark?.message}>
              <Textarea
                {...register("remark")}
                placeholder="请输入备注"
                disabled={loading}
              />
            </FormField>
          </div>
          <footer className="flex justify-end gap-2 border-t border-border px-5 py-4">
            <Button variant="secondary" disabled={loading} onClick={onCancel}>
              取消
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className={loading ? "cursor-wait" : undefined}
            >
              {loading ? "提交中..." : "保存"}
            </Button>
          </footer>
        </form>
      </section>
    </div>,
    document.body,
  );
}

function FormField({
  label,
  error,
  required = false,
  className,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="ml-1 text-error">*</span>}
      </span>
      {children}
      <span className="mt-1 block min-h-[18px] text-xs text-error">
        {error ?? ""}
      </span>
    </label>
  );
}
