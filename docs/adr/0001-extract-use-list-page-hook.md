# ADR-0001: 提取 useListPage Hook 统一列表页数据获取模式

## 状态

已接受

## 背景

所有管理端列表页（材料、写作任务、问答、用户、角色、字典、部门、配置、文件、日志）重复相同的 ~150 行样板代码：

- 10+ 个 `useState`（filters、appliedFilters、page、pageSize、data、total、loading、error）
- `useCallback` 加载数据
- `useEffect` 触发加载
- `submitFilters` / `resetFilters` 函数
- 相同的 JSX 结构

这是典型的浅模块 — 接口（状态 + 回调）几乎和实现一样复杂。

## 决策

提取 `useListPage<TFilters, TRecord>` hook，封装列表页完整的筛选 + 分页 + 数据获取生命周期。

接口设计：

```ts
type UseListPageOptions<TFilters, TRecord> = {
  fetch: (query) => Promise<ApiPageResult<TRecord>>;
  defaultFilters: TFilters;
  toQuery: (filters: TFilters, page: number, pageSize: number) => Record<string, unknown>;
  defaultPageSize?: number;
  onError?: (error: unknown) => void;
};
```

关键行为：

- `setPageSize` 自动重置 page 为 1
- `submitFilters` 将当前 filters 同步到 appliedFilters 并重置 page
- `resetFilters` 恢复默认 filters 并重置 page
- 错误处理通过 `onError` 回调，hook 只负责设置 error 状态
- 不管理表单 UI，页面仍然完全控制筛选控件渲染

## 理由

- 消除 10 个页面 × ~150 行 = ~1500 行重复代码
- 列表页行为变更（如添加防抖、乐观更新）只改一处
- 新增列表页从 ~200 行降到 ~80 行配置
- Hook 可独立测试，无需渲染组件
- 不影响页面灵活性：hook 管状态流转，页面管 UI

## 后果

- 所有列表页需要迁移到新 hook
- 现有页面的 `schema.ts` 中的 `buildQuery` 函数继续保留，作为 `toQuery` 回调传入
