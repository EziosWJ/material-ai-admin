# ADR-0003: 提取通用错误消息辅助函数

## 状态

已接受

## 背景

每个页面模块的 `utils.ts` 都定义了几乎相同的 `getErrorMessage(error, fallback)` 函数：

```ts
export function getErrorMessage(error: unknown, fallback: string) {
  if (isApiError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}
```

至少 6 处重复：material、writing-task、qa、users（system 各页面）。

## 决策

- 在 `lib/api-error.ts` 中导出 `getErrorMessage(error: unknown, fallback: string): string`
- 各页面 utils 中的重复函数删除，改为从 `lib/api-error` 引用
- 页面 utils 只保留真正页面特定的逻辑（状态选项、格式化函数等）

## 理由

- 消除 6+ 处重复
- 错误处理逻辑变更只改一处
- 页面 utils 更聚焦于页面特定逻辑
