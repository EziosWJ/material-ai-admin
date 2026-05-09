import { RefreshCw, RotateCcw, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getQaSessionPage } from "@/api/qa";
import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Pagination } from "@/components/common/pagination";
import { SearchFilterBar } from "@/components/common/search-filter-bar";
import { StatusTag } from "@/components/common/status-tag";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { QaSessionVO } from "@/types/qa";
import { createQaSessionColumns } from "./columns";
import { QaSessionDetailDialog } from "./qa-session-detail-dialog";
import { buildQuery, DEFAULT_FILTERS, type QaSessionFilterValues } from "./schema";
import { getQaSessionErrorMessage, qaSessionStatusOptions } from "./utils";

export function QaSessionListPage() {
  const [filters, setFilters] = useState<QaSessionFilterValues>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<QaSessionFilterValues>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sessions, setSessions] = useState<QaSessionVO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState<QaSessionVO | null>(null);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getQaSessionPage(
        buildQuery(appliedFilters, page, pageSize),
      );
      setSessions(data.records);
      setTotal(data.total);
    } catch (loadError) {
      setSessions([]);
      setTotal(0);
      setError(getQaSessionErrorMessage(loadError, "会话列表加载失败"));
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, page, pageSize]);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  const submitFilters = (event?: React.FormEvent) => {
    event?.preventDefault();
    setPage(1);
    setAppliedFilters(filters);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const openDetail = (session: QaSessionVO) => {
    setDetailRecord(session);
    setDetailOpen(true);
  };

  const columns = createQaSessionColumns({
    onDetail: openDetail,
  });

  return (
    <>
      <PageHeader
        title="问答会话监控"
        description="查看所有问答会话的基本信息和消息记录。"
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
        <form className="contents" onSubmit={(event) => submitFilters(event)}>
          <Select
            value={filters.status}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                status: event.target.value,
              }))
            }
            aria-label="筛选状态"
          >
            <option value="all">全部状态</option>
            {qaSessionStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </form>
      </SearchFilterBar>

      <section className="rounded-admin border border-border bg-surface shadow-admin">
        <TableToolbar
          title="会话列表"
          description={`共 ${total} 条数据，当前显示 ${sessions.length} 条。`}
          actions={
            <>
              <StatusTag tone={loading ? "warning" : error ? "error" : "info"}>
                {loading ? "加载中" : error ? "加载失败" : "已同步"}
              </StatusTag>
              <Button size="sm" variant="secondary" onClick={loadSessions}>
                <RefreshCw className="h-4 w-4" aria-hidden />
                刷新
              </Button>
            </>
          }
        />
        <DataTable<QaSessionVO>
          columns={columns}
          dataSource={sessions}
          rowKey="id"
          loading={loading}
          error={error}
          minWidth={1080}
          empty={
            <EmptyState
              title="暂无会话数据"
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

      <QaSessionDetailDialog
        open={detailOpen}
        session={detailRecord}
        onCancel={() => setDetailOpen(false)}
      />
    </>
  );
}
