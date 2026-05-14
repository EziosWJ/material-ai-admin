import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCw, RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createMaterial,
  deleteMaterial,
  deleteMaterialVector,
  getMaterialDetail,
  getMaterialPage,
  triggerMaterialProcess,
  updateMaterial,
} from "@/api/material";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Pagination } from "@/components/common/pagination";
import { SearchFilterBar } from "@/components/common/search-filter-bar";
import { StatusTag } from "@/components/common/status-tag";
import { TableToolbar } from "@/components/common/table-toolbar";
import { toast } from "@/components/common/toast-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useListPage } from "@/hooks/use-list-page";
import { getErrorMessage, isApiError } from "@/lib/api-error";
import type { MaterialRecord } from "@/types/material";
import { createMaterialColumns } from "./columns";
import {
  buildPayload,
  buildQuery,
  DEFAULT_FILTERS,
  materialFormSchema,
  toFormValues,
  type FilterState,
  type MaterialFormMode,
  type MaterialFormValues,
} from "./schema";
import { MaterialDetailDialog } from "./material-detail-dialog";
import { MaterialFormDialog } from "./material-form-dialog";
import { materialStatusOptions } from "./utils";
import type { FileRecord } from "@/types/file";

/** 确认操作类型 */
type ConfirmAction =
  | { type: "delete"; record: MaterialRecord }
  | { type: "triggerProcess"; record: MaterialRecord }
  | { type: "deleteVector"; record: MaterialRecord };

export function MaterialPage() {
  // 列表数据
  const {
    data: materials,
    total,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    filters,
    setFilter,
    submitFilters,
    resetFilters,
    reload: loadMaterials,
  } = useListPage<FilterState, MaterialRecord>({
    fetch: getMaterialPage,
    defaultFilters: DEFAULT_FILTERS,
    toQuery: (f, p, ps) => buildQuery(f, p, ps),
    onError: (err) =>
      toast.error({
        title: "加载失败",
        description: getErrorMessage(err, "材料列表加载失败"),
      }),
  });

  // 表单状态
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<MaterialFormMode>("create");
  const [editingRecord, setEditingRecord] = useState<MaterialRecord | null>(
    null,
  );
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<FileRecord | null>(null);

  // 确认对话框状态
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null,
  );
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 详情弹窗状态
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState<MaterialRecord | null>(null);

  // 表单
  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialFormSchema),
    defaultValues: toFormValues(),
  });

  // 表单操作
  const openCreateForm = () => {
    setFormMode("create");
    setEditingRecord(null);
    setUploadedFile(null);
    form.reset(toFormValues());
    setFormOpen(true);
  };

  const openEditForm = async (record: MaterialRecord) => {
    setFormMode("edit");
    setEditingRecord(record);
    form.reset(toFormValues(record));
    setFormOpen(true);

    try {
      const detail = await getMaterialDetail(record.id);
      setEditingRecord(detail);
      form.reset(toFormValues(detail));
    } catch (detailError) {
      toast.error({
        title: "材料详情加载失败",
        description: getErrorMessage(detailError, "无法获取材料详情"),
      });
    }
  };

  const handleFileUploaded = (file: FileRecord) => {
    setUploadedFile(file);
  };

  const submitMaterialForm = async (values: MaterialFormValues) => {
    setFormSubmitting(true);

    try {
      if (formMode === "edit" && editingRecord) {
        await updateMaterial(editingRecord.id, buildPayload(values));
        toast.success("材料已更新");
      } else {
        if (!uploadedFile) {
          toast.error({ title: "请先上传文件" });
          return;
        }
        await createMaterial({
          ...buildPayload(values),
          userId: 0, // 由后端处理
          originalFilename: uploadedFile.originalName,
          fileId: uploadedFile.id,
          fileType: uploadedFile.extension,
          fileSize: uploadedFile.fileSize,
          storagePath: uploadedFile.storageName,
        });
        toast.success("材料已创建");
      }

      setFormOpen(false);
      await loadMaterials();
    } catch (submitError) {
      if (isApiError(submitError) && submitError.fieldErrors) {
        Object.entries(submitError.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof MaterialFormValues, { message });
        });
      }

      toast.error({
        title: formMode === "edit" ? "更新失败" : "创建失败",
        description: getErrorMessage(submitError, "请检查表单后重试"),
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  // 删除操作
  const runConfirmAction = async () => {
    if (!confirmAction) return;

    setConfirmLoading(true);
    try {
      if (confirmAction.type === "delete") {
        await deleteMaterial(confirmAction.record.id);
        toast.success("材料已删除");
      } else if (confirmAction.type === "triggerProcess") {
        await triggerMaterialProcess(confirmAction.record.id);
        toast.success("已触发材料处理");
      } else if (confirmAction.type === "deleteVector") {
        await deleteMaterialVector(confirmAction.record.id);
        toast.success("已删除材料向量");
      }

      setConfirmAction(null);
      await loadMaterials();
    } catch (actionError) {
      toast.error({
        title: "操作失败",
        description: getErrorMessage(actionError, "请稍后重试"),
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  // 确认对话框元数据
  const confirmMeta = useMemo(() => {
    if (!confirmAction) return null;

    if (confirmAction.type === "delete") {
      return {
        title: "删除材料",
        description: `确认删除材料「${confirmAction.record.title}」吗？此操作不可恢复。`,
        confirmText: "删除",
        danger: true,
      };
    }

    if (confirmAction.type === "triggerProcess") {
      return {
        title: "触发处理",
        description: `确认对材料「${confirmAction.record.title}」触发处理吗？`,
        confirmText: "确认",
        danger: false,
      };
    }

    return {
      title: "删除向量",
      description: `确认删除材料「${confirmAction.record.title}」的向量数据吗？`,
      confirmText: "确认",
      danger: true,
    };
  }, [confirmAction]);

  // 打开详情弹窗
  const openDetail = (record: MaterialRecord) => {
    setDetailRecord(record);
    setDetailOpen(true);
  };

  // 表格列
  const columns = createMaterialColumns({
    onEdit: (record) => void openEditForm(record),
    onDelete: (record) => setConfirmAction({ type: "delete", record }),
    onDetail: openDetail,
    onTriggerProcess: (record) =>
      setConfirmAction({ type: "triggerProcess", record }),
    onDeleteVector: (record) =>
      setConfirmAction({ type: "deleteVector", record }),
  });

  return (
    <>
      <PageHeader
        title="材料管理"
        description="管理宣传文档的原始素材，支持上传、编辑和删除。"
        actions={
          <Button variant="primary" onClick={openCreateForm}>
            <Plus className="h-4 w-4" aria-hidden />
            新建材料
          </Button>
        }
      />

      <SearchFilterBar
        actions={
          <>
            <Button variant="secondary" onClick={resetFilters}>
              <RotateCcw className="h-4 w-4" aria-hidden />
              重置
            </Button>
            <Button variant="primary" onClick={() => submitFilters()}>
              <Search className="h-4 w-4" aria-hidden />
              查询
            </Button>
          </>
        }
      >
        <form className="contents" onSubmit={(event) => { event.preventDefault(); submitFilters(); }}>
          <Input
            value={filters.title}
            onChange={(event) => setFilter("title", event.target.value)}
            placeholder="材料标题"
          />
          <Select
            value={filters.status}
            onChange={(event) =>
              setFilter("status", event.target.value as FilterState["status"])
            }
            aria-label="筛选状态"
          >
            <option value="all">全部状态</option>
            {materialStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Input
            value={filters.fileType}
            onChange={(event) => setFilter("fileType", event.target.value)}
            placeholder="文件类型"
          />
        </form>
      </SearchFilterBar>

      <section className="rounded-admin border border-border bg-surface shadow-admin">
        <TableToolbar
          title="材料列表"
          description={`共 ${total} 条数据，当前显示 ${materials.length} 条。`}
          actions={
            <>
              <StatusTag tone={loading ? "warning" : error ? "error" : "info"}>
                {loading ? "加载中" : error ? "加载失败" : "已同步"}
              </StatusTag>
              <Button size="sm" variant="secondary" onClick={loadMaterials}>
                <RefreshCw className="h-4 w-4" aria-hidden />
                刷新
              </Button>
            </>
          }
        />
        <DataTable<MaterialRecord>
          columns={columns}
          dataSource={materials}
          rowKey="id"
          loading={loading}
          error={error}
          minWidth={1200}
          empty={
            <EmptyState
              title="暂无材料数据"
              description="点击「新建材料」上传第一份材料。"
              actionText="新建材料"
              onAction={openCreateForm}
            />
          }
        />
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          disabled={loading}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </section>

      <MaterialFormDialog
        open={formOpen}
        mode={formMode}
        form={form}
        loading={formSubmitting}
        onCancel={() => setFormOpen(false)}
        onSubmit={submitMaterialForm}
        onFileUploaded={handleFileUploaded}
      />

      {confirmMeta && (
        <ConfirmDialog
          open={!!confirmAction}
          title={confirmMeta.title}
          description={confirmMeta.description}
          confirmText={confirmMeta.confirmText}
          danger={confirmMeta.danger}
          loading={confirmLoading}
          onConfirm={runConfirmAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      <MaterialDetailDialog
        open={detailOpen}
        record={detailRecord}
        onCancel={() => setDetailOpen(false)}
      />
    </>
  );
}
