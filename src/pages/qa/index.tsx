import { RefreshCw, RotateCcw, Search } from "lucide-react";
import { useState } from "react";
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
import { useListPage } from "@/hooks/use-list-page";
import type { QaSessionVO } from "@/types/qa";
import { createQaSessionColumns } from "./columns";
import { QaSessionDetailDialog } from "./qa-session-detail-dialog";
import { buildQuery, DEFAULT_FILTERS, type QaSessionFilterValues } from "./schema";
import { getErrorMessage } from "@/lib/api-error";
import { qaSessionStatusOptions } from "./utils";
import { toast } from "@/components/common/toast-store";

export function QaSessionListPage() {
  const {
    data: sessions,
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
    reload: loadSessions,
  } = useListPage<QaSessionFilterValues, QaSessionVO>({
    fetch: getQaSessionPage,
    defaultFilters: DEFAULT_FILTERS,
    toQuery: (f, p, ps) => buildQuery(f, p, ps),
    onError: (err) =>
      toast.error({
        title: "加载失败",
        description: getErrorMessage(err, "会话列表加载失败"),
      }),
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState<QaSessionVO | null>(null);

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
        <form className="contents" onSubmit={(event) => { event.preventDefault(); submitFilters(); }}>
          <Select
            value={filters.status}
            onChange={(event) => setFilter("status", event.target.value)}
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
          onPageSizeChange={setPageSize}
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
