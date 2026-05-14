# ADR-0005: 集中状态和类型标签映射

## 状态

已接受

## 背景

写作类型（outline、draft、polished、title）和任务状态（pending、running、success、failed）的中文映射在两处独立定义：

- `workbench/index.tsx`: `WRITING_TYPE_LABEL`、`TASK_STATUS_LABEL`、`TASK_STATUS_CLASS`
- `writing-task/utils.ts`: `writingTypeOptions`、`writingTaskStatusOptions`、`writingTypeMap`、`getTaskStatusMeta`

两处定义容易漂移，新增状态需要改两处。

## 决策

- 在 `types/writing.ts` 中集中定义：
  - `WRITING_TYPE_LABEL: Record<WritingType, string>`
  - `WRITING_TYPE_OPTIONS: { value: WritingType; label: string }[]`
  - `WRITING_TASK_STATUS_LABEL: Record<WritingTaskStatus, string>`
  - `WRITING_TASK_STATUS_OPTIONS: { value: WritingTaskStatus; label: string }[]`
  - `getWritingTaskStatusMeta(status: string): { label: string; tone: string }`
  - `formatWritingType(type: string): string`
- `workbench/index.tsx` 和 `writing-task/utils.ts` 都从 `types/writing.ts` 引用

## 理由

- 消除标签不一致风险
- 新增状态/类型只改一处
- 标签映射与类型定义同文件，语义就近
