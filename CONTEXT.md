# Context: 本地化智能材料写作平台前端

## 领域词汇表

| 术语 | 推荐英文命名 | 含义 | 避免 |
| --- | --- | --- | --- |
| 材料 | `material` | 宣传文档的原始素材，由用户上传 | 资料、文档、document、resource |
| 片段 | `segment` | 材料经切分后生成的文本块，带有元数据 | 分片、chunk |
| 来源片段 | `sourceSegment` | 检索命中并用于溯源展示的片段 | source、hit、检索结果 |
| 写作任务 | `writingTask` | 用户发起的一次内容生成请求 | 生成任务、请求 |
| 问答 | `qa` / `questionAnswer` | 用户基于材料提出问题并请求大模型回答的一次交互 | ask、QA、提问接口 |
| Prompt 模板 | `promptTemplate` | 用于组装最终发送给大模型的模板 | 提示词模板、prompt |
| 材料向量维护 | `materialVectorMaintenance` | Java 后端维护材料与片段向量一致性的对接能力 | 知识库 CRUD |

## 系统边界

- 前端只调用 Java 后端 API，不得直连 Python AI 服务
- 调用链：前端 → Java 后端 → Python AI 服务
- AI 相关逻辑（材料解析、片段切分、向量检索、大模型生成）不在前端实现

## 关键模块

| 模块 | 路径 | 职责 |
| --- | --- | --- |
| 材料管理 | `src/pages/material` | 材料 CRUD、上传、处理触发 |
| 写作任务 | `src/pages/writing-task` | 写作任务列表与详情监控 |
| 问答管理 | `src/pages/qa` | 问答会话列表与消息监控 |
| AI 工作台 | `src/pages/workbench` | 材料问答、辅助写作的交互界面 |
| 系统管理 | `src/pages/system` | 用户、角色、菜单、部门、字典、配置、文件、日志 |
| 公共组件 | `src/components/common` | PageHeader、DataTable、SearchFilterBar、Pagination 等 |
| API 层 | `src/api` | Java 后端 API 封装 |
| 类型层 | `src/types` | 领域类型与接口类型 |

## 列表页模式

所有管理端列表页遵循相同模式：

1. `PageHeader` — 标题、描述、主操作按钮
2. `SearchFilterBar` — 筛选表单与查询/重置按钮
3. `section` — `TableToolbar` + `DataTable` + `Pagination`

状态管理：`filters` → `appliedFilters` → `page/pageSize` → `data/total/loading/error`
