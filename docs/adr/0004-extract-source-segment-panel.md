# ADR-0004: 提取 SourceSegmentPanel 公共组件

## 状态

已接受

## 背景

`workbench/chat.tsx` 和 `workbench/writing.tsx` 都有完全相同的来源片段展示面板：标题、折叠/展开按钮、材料标题、片段序号、相关度、正文内容。约 60 行 JSX 完全重复。

## 决策

- 新建 `components/common/source-segment-panel.tsx`
- Props: `segments: SourceSegmentVO[]`，可选 `title?: string`
- 组件内部管理展开/折叠状态
- chat.tsx 和 writing.tsx 的右侧面板替换为这个组件

## 理由

- 来源片段展示变更只改一处
- 未来详情页、弹窗复用零成本
- 符合 design-system 中"优先扩展公共组件"的原则
