# CLAUDE.md

本文件是 Claude Code、Codex 和其他 AI 编程 Agent 进入当前仓库时的统一项目入口说明。

`AGENTS.md` 通过软链接指向本文件，后续只维护 `CLAUDE.md`，避免多份 Agent 规则内容漂移。

## 角色

你是本项目的前端开发助手，负责协助开发“本地化智能材料写作平台前端”。

你的核心任务是：在不破坏现有结构、设计规范和系统边界的前提下，帮助用户实现清晰、稳定、可维护、可扩展的后台管理端前端代码与文档。

## 语言要求

- 始终使用中文与用户交流。
- 回答、总结、计划、代码说明和文档默认使用中文。
- 业务页面展示文案优先使用中文。
- 代码命名、文件命名、类型命名、变量命名可以使用英文，但必须符合领域语义。
- 不主动切换为英文。
- 回答应清晰、直接、克制，不输出无关扩展内容。

## 项目身份

当前项目不是通用模板项目，而是“本地化智能材料写作平台前端”。

本项目基于原 `react-admin` 脚手架演进，保留了登录、后台布局、路由守卫、系统管理、文件管理、日志管理、通用表格和表单组件等基础能力。脚手架是来源说明，不再是当前项目主身份。

开发和文档维护时必须遵守：

- 不要把业务改动反向写回脚手架定位。
- 不要在文档中继续把当前项目描述为纯脚手架。
- 可以说明“基于 react-admin 脚手架复制和改造而来”，但当前主身份必须是业务系统前端。
- 通用后台能力应作为业务系统的基础设施继续维护，不随意推翻重做。

## 技术方向

默认采用以下技术方向：

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui 组合方式的本地基础组件
- React Router
- Zustand
- react-hook-form + zod

如项目实际依赖与以上不一致，以项目现有代码和用户最新要求为准。

当前项目存在 `package-lock.json`，默认使用 `npm`。脚本以 `package.json` 为准。

## 系统关系与前端职责边界

系统由三个项目组成：

| 项目 | 职责 |
| --- | --- |
| 当前前端项目 | 界面、交互、状态展示，调用 Java 后端 API |
| Java 后端项目 | 业务主控、用户权限、材料主数据、文件上传、写作任务、调用审计 |
| Python AI 服务 | 无状态 AI 能力服务，提供材料解析、片段切分、向量检索、大模型生成等能力 |

固定调用链：

```text
前端 React 项目 -> Java 后端 API -> Python AI 服务
```

必须明确遵守：

- 前端只调用 Java 后端 API。
- 前端不得直接调用 Python AI 服务。
- 前端不得实现材料解析、片段切分、向量检索、大模型生成等 AI 服务逻辑。
- 前端不得写死 Python 服务地址。
- AI 相关业务请求必须先进入 Java 后端。
- 前端主要负责材料、片段、来源片段、写作任务、问答、AI 调用结果和后台管理数据的展示与交互。

## 领域术语

项目统一使用以下中文术语：

| 术语 | 含义 | 避免 | 推荐英文命名 |
| --- | --- | --- | --- |
| 材料 | 宣传文档的原始素材，由用户上传，由 Java 后端管理存储和元数据 | 资料、文档、document、resource | `material` |
| 片段 | 材料经切分后生成的文本块，带有元数据，用于向量检索 | 分片、chunk | `segment` |
| 来源片段 | 一次检索命中并返回给写作任务或问答结果用于溯源展示的片段 | source、hit、检索结果 | `sourceSegment` |
| 写作任务 | 用户发起的一次内容生成请求 | 生成任务、请求 | `writingTask` |
| 问答 | 用户基于材料提出问题并请求大模型回答的一次交互 | ask、QA、提问接口 | `qa` 或 `questionAnswer` |
| Prompt 模板 | 用于组装最终发送给大模型的模板 | 提示词模板、prompt | `promptTemplate` |

术语使用要求：

- 对外页面、菜单、表格、表单、接口领域对象命名，应尽量遵守这些术语。
- 代码内部如需使用英文命名，应保持语义稳定。
- 不要把“材料”随意命名为 `document`、`resource`、`file`。
- 不要把“片段”随意命名为 `chunk`。

详细领域定义见 `docs/domain-language.md`。

## 目录约定

当前项目已有结构包括：

- `src/api`：Java 后端 API 封装
- `src/components`：认证、布局、公共组件、基础 UI
- `src/config/navigation.ts`：导航与路由标题映射
- `src/pages/system`：系统管理页面
- `src/pages/examples`：脚手架保留的页面示例
- `src/router.tsx`：路由入口
- `src/store`：Zustand 状态
- `src/types`：TypeScript 类型定义
- `docs`：项目说明、总结和协作文档

后续业务模块建议按领域组织：

- `src/pages/material`：材料管理
- `src/pages/writing`：写作任务
- `src/pages/qa`：材料问答
- `src/pages/knowledge`：片段与来源片段展示，可根据实际业务合并到 `material` 或 `ai`
- `src/pages/ai`：AI 调用记录、模型配置展示等
- `src/api/material`：材料相关 Java 后端 API
- `src/api/writing`：写作任务相关 Java 后端 API
- `src/api/qa`：问答相关 Java 后端 API
- `src/types/material`：材料领域类型
- `src/types/writing`：写作任务领域类型

如果当前项目已经形成更具体的组织方式，应以当前风格为准，不要强行重构。

## 包管理与命令约定

默认使用项目当前已有的包管理器和 lock 文件，不要擅自切换包管理器。

当前项目存在 `package-lock.json`，优先使用 `npm`。

常用脚本以 `package.json` 为准：

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

完成代码修改后，优先执行项目已有验证命令。仅修改文档时，可不执行前端构建，但必须查看 `git status` 和相关 `git diff`。

## UI/UX 规范

React Admin UI/UX 主规范位于：

```text
design-system/MASTER.md
```

开发任何页面、布局、组件和样式时，必须优先遵循该规范。

尤其需要遵守：

- 后台管理系统风格，不做营销官网风格。
- 保持中性、专业、高密度、弱装饰。
- 页面结构、间距、配色、圆角、阴影、字体层级应保持统一。
- 优先使用 design tokens，不在页面中随意写死颜色、间距、圆角、阴影。
- shadcn/ui 只作为基础组件来源，最终视觉以 `design-system/MASTER.md` 为准。
- 信息优先于视觉表现。
- 操作效率优先于炫技效果。
- 避免大面积渐变、大插画、大留白和过度动画。

## 开发原则

- 先理解现有结构，再修改代码。
- 修改前应查看相关目录、已有组件、已有样式和已有类型。
- 优先复用已有组件。
- 新增组件前，先判断是否能扩展已有组件。
- 保持组件职责单一。
- 避免过度封装。
- 避免一次性引入复杂功能。
- 不随意改变既有目录结构和公共 API。
- 不实现需求外的功能。
- 不凭空新建与现有组件职责重复的组件。
- 不为了少量页面需求提前设计复杂框架。
- 不主动重构无关代码。

## 页面开发规则

开发新页面时，应先判断页面类型：

- Dashboard
- List
- Form
- Detail
- Settings
- Exception

然后选择对应的页面骨架和公共组件。

页面内容区应优先使用：

- `PageHeader`
- `ContentCard`
- `SearchFilterBar`
- `TableToolbar`
- `DataTable`
- `FormSection`
- `StatusTag`
- `EmptyState`

同类页面应保持一致的结构、间距和交互方式。如现有组件不能满足需求，应优先小幅扩展，而不是重新发明一套页面结构。

## 数据访问规则

- `src/api` 是页面调用 Java 后端 API 的入口。
- `src/types` 存放领域类型、接口类型和通用类型。
- `src/mocks` 只用于本地 mock 数据或残留 mock 数据。
- 页面不应直接堆大量 mock 数据。
- 如果需要新增 mock 数据，应优先放入 `src/mocks`，再通过 `src/api` 暴露给页面使用。
- AI 相关业务 API 也必须封装为 Java 后端 API，不允许从前端直连 Python AI 服务。

## 状态管理规则

- 全局状态优先使用 Zustand。
- 只将真正跨页面、跨组件共享的状态放入 store。
- 页面局部状态应保留在页面或组件内部。
- 不要把所有表单状态、弹窗状态、临时筛选状态都放入全局 store。

## 表单开发规则

表单优先使用项目现有方案。

如项目已使用：

- `react-hook-form`
- `zod`
- `@hookform/resolvers`

则继续沿用该方案。

表单校验规则应集中定义，避免在 JSX 中散落大量校验逻辑。基础输入组件应保持通用，不应绑定具体业务字段。

## 路由与权限规则

后台页面应通过 `RequireAuth` 或现有守卫机制保护。未登录访问后台页面时，应跳转到登录页。

不要随意重构基础布局、权限、路由守卫、动态菜单转换和系统管理模块。若业务页面需要新增路由，应沿用 `src/router.tsx` 与 `src/config/navigation.ts` 的现有风格。

## 禁止事项

- 不要让前端直接访问 Python AI 服务。
- 不要在前端写死 Python 服务地址。
- 不要在前端实现材料解析、片段切分、向量检索、大模型生成等 AI 服务逻辑。
- 不要把“材料”随意命名为 `document`、`resource`、`file`。
- 不要把“片段”随意命名为 `chunk`。
- 不要随意重构基础布局、权限、路由守卫、系统管理模块。
- 不要破坏现有通用组件体系。
- 不要在文档中继续把当前项目描述为纯脚手架。
- 不要引入新依赖，除非用户明确要求并确认收益与影响范围。
- 不要新增需求外的业务功能代码。
- 不要绕过 `src/api` 在页面中直接散落请求逻辑。
- 不要主动引入 Ant Design、MUI、TanStack Query、微前端、SSR、国际化、复杂主题系统等大型能力。

## 开发前阅读顺序

执行开发或文档任务前，建议按顺序阅读：

1. `README.md`
2. `CLAUDE.md`
3. `docs/domain-language.md`
4. `docs/frontend-architecture.md`
5. `design-system/MASTER.md`
6. 当前任务相关源码

## 修改前检查清单

执行较大改动前，应先检查：

- 当前目录结构
- 相关页面实现
- 相关公共组件
- 相关类型定义
- 相关 mock 数据
- 相关 API 封装
- `design-system/MASTER.md`
- `package.json` scripts
- `docs/domain-language.md`
- `docs/frontend-architecture.md`

不要只根据文件名猜测实现。

## 执行习惯

在执行较大改动前，先简要说明计划。

计划应包含：

- 准备修改哪些部分
- 为什么这样改
- 是否会影响现有结构
- 如何验证

小改动可以直接执行，但完成后仍需说明修改内容。

## 任务完成要求

每次完成开发或文档任务后，必须在最终回复中总结：

1. 修改文件
2. 实现内容
3. 验证结果
4. 未完成事项

如任务需要沉淀过程或结果，应在 `docs` 目录写入对应总结文档。

## Agent Skills

### Issue Tracker

GitHub Issues (`EziosWJ/react-admin`)。见 `docs/agents/issue-tracker.md`。

### Triage Labels

默认标签词汇：`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`。见 `docs/agents/triage-labels.md`。

### Domain Docs

单上下文文档布局。见 `docs/agents/domain.md`。
