# ADR-0002: 统一来源片段类型定义

## 状态

已接受

## 背景

`SourceSegmentVO` 在 `types/writing.ts` 和 `types/qa.ts` 中各定义了一份，结构完全相同（text、materialId、materialTitle、originalFilename、segmentIndex、score），只是 QA 版本叫 `QaSourceSegmentVO`。

领域语言定义"来源片段"为统一概念，不应按使用方分裂。

## 决策

- 将 `SourceSegmentVO` 统一定义在 `types/material.ts`（来源片段是片段的派生，属于材料域）
- 删除 `types/qa.ts` 中的 `QaSourceSegmentVO`，改为引用 `SourceSegmentVO`
- `types/writing.ts` 中的 `SourceSegmentVO` 移除，改为从 `types/material.ts` 引用

## 理由

- 来源片段的字段变更只改一处
- 类型命名与领域语言一致
- 消除两处定义漂移的风险

## 后果

- `qa.ts` 类型文件中的引用需要更新
- `workbench/chat.tsx` 中的 `QaSourceSegmentVO` 引用需要更新
