import { Eye, RefreshCw, RotateCcw, Search } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { getWritingTaskDetail, getWritingTaskPage } from "@/api/writing";
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
import {
  getErrorMessage,
  writingTaskStatusOptions,
  writingTypeOptions,
} from "./utils";
import { WritingTaskDetailDialog } from "./writing-task-detail-dialog";

export function WritingTaskPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tasks, setTasks] = useState<WritingTaskVO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState<WritingTaskVO | null>(null);
  const [detailLoadingId, setDetailLoadingId] = useState<number | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getWritingTaskPage(
        buildQuery(appliedFilters, page, pageSize),
      );
      setTasks(data.records);
      setTotal(data.total);
    } catch (loadError) {
      setTasks([]);
      setTotal(0);
      setError(getErrorMessage(loadError, "写作任务列表加载失败"));
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, page, pageSize]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const submitFilters = (event?: FormEvent) => {
    event?.preventDefault();
    setPage(1);
    setAppliedFilters(filters);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setPage(1);
  };

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

      <form onSubmit={submitFilters}>
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
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            placeholder="搜索标题"
            aria-label="搜索标题"
          />
          <Select
            value={filters.writingType}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                writingType: event.target.value as FilterState["writingType"],
              }))
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
              setFilters((current) => ({
                ...current,
                status: event.target.value as FilterState["status"],
              }))
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
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setPage(1);
          }}
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
