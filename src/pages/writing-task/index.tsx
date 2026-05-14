import { RefreshCw, RotateCcw, Search } from "lucide-react";
import { useState } from "react";
import { getWritingTaskDetail, getWritingTaskPage } from "@/api/writing";
import { useListPage } from "@/hooks/use-list-page";
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
import type { WritingTaskVO } from "@/types/writing";
import { createWritingTaskColumns } from "./columns";
import { DEFAULT_FILTERS, buildQuery, type FilterState } from "./schema";
import { getErrorMessage } from "@/lib/api-error";
import { writingTaskStatusOptions, writingTypeOptions } from "./utils";
import { WritingTaskDetailDialog } from "./writing-task-detail-dialog";

export function WritingTaskPage() {
  const {
    data: tasks,
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
    reload: loadTasks,
  } = useListPage<FilterState, WritingTaskVO>({
    fetch: getWritingTaskPage,
    defaultFilters: DEFAULT_FILTERS,
    toQuery: (f, p, ps) => buildQuery(f, p, ps),
    onError: (err) =>
      toast.error({
        title: "加载失败",
        description: getErrorMessage(err, "写作任务列表加载失败"),
      }),
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState<WritingTaskVO | null>(null);
  const [detailLoadingId, setDetailLoadingId] = useState<number | null>(null);

  const openDetail = async (record: WritingTaskVO) => {
    setDetailRecord(record);
    setDetailOpen(true);
    setDetailLoadingId(record.id);

    try {
      const detail = await getWritingTaskDetail(record.id);
      setDetailRecord(detail);
    } catch (detailError) {
      toast.error({
        title: "写作任务详情加载失败",
        description: getErrorMessage(detailError, "无法获取写作任务详情"),
      });
    } finally {
      setDetailLoadingId(null);
    }
  };

  const columns = createWritingTaskColumns({
    onDetail: (record) => void openDetail(record),
  });

  return (
    <>
      <PageHeader
        title="写作任务监控"
        description="查看所有写作任务的执行状态和生成结果。"
      />

      <form onSubmit={(event) => { event.preventDefault(); submitFilters(); }}>
        <SearchFilterBar
          actions={
            <>
              <Button type="submit" variant="primary">
                <Search className="h-4 w-4" aria-hidden />
                查询
              </Button>
              <Button variant="secondary" onClick={resetFilters}>
                <RotateCcw className="h-4 w-4" aria-hidden />
                重置
              </Button>
            </>
          }
        >
          <Input
            value={filters.title}
            onChange={(event) => setFilter("title", event.target.value)}
            placeholder="搜索标题"
            aria-label="搜索标题"
          />
          <Select
            value={filters.writingType}
            onChange={(event) =>
              setFilter("writingType", event.target.value as FilterState["writingType"])
            }
            aria-label="筛选写作类型"
          >
            <option value="all">全部类型</option>
            {writingTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select
            value={filters.status}
            onChange={(event) =>
              setFilter("status", event.target.value as FilterState["status"])
            }
            aria-label="筛选状态"
          >
            <option value="all">全部状态</option>
            {writingTaskStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </SearchFilterBar>
      </form>

      <section className="rounded-admin border border-border bg-surface shadow-admin">
        <TableToolbar
          title="写作任务列表"
          description={`共 ${total} 条记录。`}
          actions={
            <>
              <StatusTag tone={loading ? "warning" : error ? "error" : "info"}>
                {loading ? "加载中" : error ? "加载失败" : "已同步"}
              </StatusTag>
              <Button
                variant="secondary"
                size="sm"
                disabled={loading}
                onClick={() => void loadTasks()}
              >
                <RefreshCw className="h-4 w-4" aria-hidden />
                刷新
              </Button>
            </>
          }
        />
        <DataTable<WritingTaskVO>
          columns={columns}
          dataSource={tasks}
          rowKey="id"
          loading={loading}
          error={error}
          minWidth={900}
          empty={
            <EmptyState
              title="暂无写作任务"
              description="调整筛选条件后重新查询。"
              actionText="重置筛选"
              onAction={resetFilters}
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

      <WritingTaskDetailDialog
        open={detailOpen}
        detail={detailRecord}
        loading={detailLoadingId !== null}
        onCancel={() => setDetailOpen(false)}
      />
    </>
  );
}
