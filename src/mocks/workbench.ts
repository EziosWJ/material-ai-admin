export type MockMaterial = {
  id: string;
  title: string;
  category: string;
  uploadTime: string;
  segmentCount: number;
};

export type MockQaSession = {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
};

export type MockQaMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sourceSegmentCount?: number;
};

export type MockSourceSegment = {
  id: string;
  materialTitle: string;
  segmentIndex: number;
  relevance: number;
  content: string;
};

export type MockWritingTask = {
  id: string;
  type: "outline" | "draft" | "polish" | "title";
  title: string;
  createdAt: string;
  status: "completed" | "generating" | "draft";
};

export const mockMaterials: MockMaterial[] = [
  {
    id: "mat-001",
    title: "2024年企业数字化转型方案",
    category: "政策宣传材料",
    uploadTime: "2024-03-15 10:30",
    segmentCount: 45,
  },
  {
    id: "mat-002",
    title: "公司简介与核心业务介绍",
    category: "企业介绍材料",
    uploadTime: "2024-03-10 14:20",
    segmentCount: 28,
  },
  {
    id: "mat-003",
    title: "高新技术企业认定申报材料",
    category: "项目申报材料",
    uploadTime: "2024-03-08 09:15",
    segmentCount: 62,
  },
  {
    id: "mat-004",
    title: "2024年第一季度工作总结会议纪要",
    category: "会议纪要材料",
    uploadTime: "2024-03-05 16:45",
    segmentCount: 18,
  },
];

export const mockQaSessions: MockQaSession[] = [
  {
    id: "qa-001",
    title: "总结项目亮点",
    updatedAt: "2024-03-15 14:30",
    messageCount: 6,
  },
  {
    id: "qa-002",
    title: "提炼宣传口径",
    updatedAt: "2024-03-14 16:20",
    messageCount: 8,
  },
  {
    id: "qa-003",
    title: "生成对外介绍",
    updatedAt: "2024-03-13 10:15",
    messageCount: 4,
  },
];

export const mockQaMessages: MockQaMessage[] = [
  {
    id: "msg-001",
    role: "user",
    content: "请帮我总结一下公司数字化转型项目的主要亮点和成果。",
    timestamp: "2024-03-15 14:25",
  },
  {
    id: "msg-002",
    role: "assistant",
    content:
      "根据提供的材料，公司数字化转型项目主要有以下几个亮点：\n\n1. **业务流程优化**：通过数字化手段，将原有12个业务流程整合为6个核心流程，效率提升40%。\n\n2. **数据中台建设**：建立了统一的数据中台，实现了数据资产的集中管理和共享，数据利用率从30%提升至75%。\n\n3. **智能化应用**：引入AI辅助决策系统，在客户服务、供应链管理等场景实现智能化，客户满意度提升15个百分点。\n\n4. **降本增效**：项目实施后，年度运营成本降低约1200万元，人效提升35%。",
    timestamp: "2024-03-15 14:26",
    sourceSegmentCount: 5,
  },
  {
    id: "msg-003",
    role: "user",
    content: "这些成果的数据来源是什么？有哪些具体的支撑材料？",
    timestamp: "2024-03-15 14:28",
  },
  {
    id: "msg-004",
    role: "assistant",
    content:
      '以上成果数据主要来源于以下材料：\n\n1. 《2024年企业数字化转型方案》第3章"项目成效"部分\n2. 《2024年第一季度工作总结会议纪要》中的数据汇报环节\n3. 《高新技术企业认定申报材料》中的"技术创新与成果转化"章节\n\n具体数据已在下方来源片段中标注，您可以点击查看详细内容。',
    timestamp: "2024-03-15 14:29",
    sourceSegmentCount: 3,
  },
];

export const mockSourceSegments: MockSourceSegment[] = [
  {
    id: "seg-001",
    materialTitle: "2024年企业数字化转型方案",
    segmentIndex: 12,
    relevance: 0.95,
    content:
      "项目实施后，业务流程从原有的12个整合为6个核心流程，整体效率提升40%。通过流程再造和自动化工具的应用，减少了人工干预环节，降低了操作错误率...",
  },
  {
    id: "seg-002",
    materialTitle: "2024年企业数字化转型方案",
    segmentIndex: 18,
    relevance: 0.92,
    content:
      "数据中台建设完成后，实现了数据资产的集中管理和共享。数据利用率从项目实施前的30%提升至75%，数据查询响应时间从小时级降至秒级...",
  },
  {
    id: "seg-003",
    materialTitle: "高新技术企业认定申报材料",
    segmentIndex: 8,
    relevance: 0.88,
    content:
      "智能化应用方面，引入AI辅助决策系统，在客户服务、供应链管理等核心业务场景实现智能化应用。客户服务响应时间缩短60%，客户满意度从82%提升至97%...",
  },
  {
    id: "seg-004",
    materialTitle: "2024年第一季度工作总结会议纪要",
    segmentIndex: 5,
    relevance: 0.85,
    content:
      "财务部门汇报：数字化转型项目实施以来，年度运营成本降低约1200万元。其中，人力成本节约800万元，物料成本节约400万元。人效指标从人均产值80万元提升至108万元...",
  },
  {
    id: "seg-005",
    materialTitle: "2024年企业数字化转型方案",
    segmentIndex: 25,
    relevance: 0.82,
    content:
      "客户服务智能化改造包括：智能客服机器人上线，处理80%的常见问题；客户画像系统建立，实现精准营销；服务工单自动分配，平均处理时间从24小时降至4小时...",
  },
];

export const mockWritingTasks: MockWritingTask[] = [
  {
    id: "task-001",
    type: "outline",
    title: "企业数字化转型成果汇报提纲",
    createdAt: "2024-03-15 10:00",
    status: "completed",
  },
  {
    id: "task-002",
    type: "draft",
    title: "高新技术企业认定申报书初稿",
    createdAt: "2024-03-14 15:30",
    status: "completed",
  },
  {
    id: "task-003",
    type: "polish",
    title: "公司宣传册文案润色",
    createdAt: "2024-03-13 09:00",
    status: "generating",
  },
  {
    id: "task-004",
    type: "title",
    title: "年度总结报告标题生成",
    createdAt: "2024-03-12 14:20",
    status: "draft",
  },
];

export const mockWritingResult = `# 企业数字化转型成果汇报提纲

## 一、项目背景与目标

### 1.1 行业数字化转型趋势
- 国家政策导向与行业发展趋势
- 企业面临的挑战与机遇

### 1.2 项目总体目标
- 业务流程数字化
- 数据资产价值化
- 决策智能化

## 二、主要建设内容

### 2.1 基础设施建设
- 云计算平台部署
- 网络安全体系构建

### 2.2 数据中台建设
- 数据采集与治理
- 数据资产管理
- 数据服务体系

### 2.3 业务应用系统
- 核心业务系统升级
- 智能化应用开发

## 三、项目成效

### 3.1 效率提升
- 业务流程优化：12个流程整合为6个，效率提升40%
- 数据利用率：从30%提升至75%

### 3.2 成本降低
- 年度运营成本降低1200万元
- 人效提升35%

### 3.3 客户体验改善
- 客户满意度提升15个百分点
- 服务响应时间缩短60%

## 四、创新亮点

### 4.1 技术创新
- AI辅助决策系统
- 智能客服机器人

### 4.2 管理创新
- 数据驱动决策机制
- 敏捷项目管理方法

## 五、下一步计划

### 5.1 深化智能化应用
### 5.2 拓展数据应用场景
### 5.3 加强安全保障体系`;
