# 本地化智能材料写作平台前端

本项目是“本地化智能材料写作平台”的前端管理端，负责后台管理界面、材料相关业务界面、写作与问答过程展示，以及 AI 调用结果的前端呈现。

项目基于原 `react-admin` 脚手架复制和改造而来，保留了通用后台管理系统的基础能力，例如登录、布局、路由守卫、系统管理、文件管理、日志管理、通用表格和表单组件。当前仓库的主身份已经从“通用后台管理模板”转为具体业务系统前端，脚手架只作为来源说明和基础能力来源。

## 技术栈

- React 19
- TypeScript
- Vite 6
- Tailwind CSS
- shadcn/ui 组合方式的本地基础组件
- React Router 7
- Zustand
- react-hook-form + zod
- lucide-react

## 系统关系

平台由三个项目组成：

| 项目 | 职责 |
| --- | --- |
| 当前前端项目 | 界面、交互、状态展示，调用 Java 后端 API |
| Java 后端项目 | 业务主控、用户权限、材料主数据、文件上传、写作任务、调用审计 |
| Python AI 服务 | 无状态 AI 能力服务，提供材料解析、片段切分、向量检索、大模型生成等能力 |

系统调用链固定为：

```text
前端 React 项目 -> Java 后端 API -> Python AI 服务
```

前端不得直接调用 Python AI 服务，不得写死 Python 服务地址。所有材料解析、片段切分、向量检索、大模型生成等 AI 相关请求都必须先进入 Java 后端。

## 前端职责

当前前端负责以下界面与展示能力：

- 登录与权限相关界面
- 系统管理界面
- 材料管理界面
- 写作任务界面
- 材料问答界面
- 来源片段展示
- AI 调用结果展示
- 操作日志、登录日志等后台能力展示

其中，系统管理、文件管理、日志管理、个人中心和页面示例来自脚手架基础能力；材料管理、写作任务、问答、来源片段和 AI 调用展示是后续业务演进方向。新增业务页面时应保持与现有后台管理风格一致。

## 本地启动

项目当前使用 `npm`，以 `package-lock.json` 为准。

```bash
npm install
npm run dev
```

其他已有脚本：

```bash
npm run build
npm run lint
npm run preview
```

`npm run build` 会执行 TypeScript 构建检查并生成 Vite 构建产物。

## 文档入口

| 文档 | 说明 |
| --- | --- |
| `CLAUDE.md` | Claude Code、Codex 和其他 AI 编程 Agent 的统一项目规则入口 |
| `AGENTS.md` | 指向 `CLAUDE.md` 的软链接，用于兼容读取 `AGENTS.md` 的 Agent |
| `docs/domain-language.md` | 领域语言，统一材料、片段、来源片段、写作任务、问答等术语 |
| `docs/frontend-architecture.md` | 前端架构边界，说明前端、Java 后端、Python AI 服务的关系 |
| `design-system/MASTER.md` | 后台管理 UI/UX 主规范 |

后续维护 Agent 规则时，只修改 `CLAUDE.md`，不要分别维护两份内容。

## 目录结构

```text
src/
  api/                # Java 后端 API 调用封装
    auth.ts           # 登录、退出、当前用户、菜单
    user.ts           # 用户管理
    rbac.ts           # 角色与菜单管理
    dept.ts           # 部门管理
    system.ts         # 字典与系统配置
    file.ts           # 文件上传与管理
    log.ts            # 登录日志与操作日志
    account.ts        # 个人中心
  components/
    auth/             # RequireAuth、PermissionGuard
    common/           # PageHeader、ContentCard、DataTable、FormDialog 等公共组件
    layout/           # AppShell、AppSidebar、AppHeader
    ui/               # Button、Input、Select、Switch、Textarea 等基础组件
  config/
    navigation.ts     # 默认导航、动态菜单转换、路由标题映射
  constants/          # 常量
  hooks/              # 通用 hooks
  lib/                # http、错误处理、时间格式化、图标映射等工具
  mocks/              # 本地 mock 数据或残留 mock 数据
  pages/
    system/           # 系统管理页面
      users/          # 用户管理
      roles/          # 角色管理
      menus/          # 菜单管理
      depts/          # 部门管理
      dicts/          # 字典管理
      configs/        # 配置管理
      files/          # 文件管理
      logs/           # 登录日志、操作日志
    examples/         # 页面示例
    dashboard.tsx     # Dashboard
    login.tsx         # 登录页
    settings.tsx      # 系统设置示例
    account-profile.tsx
    change-password.tsx
  router.tsx          # 静态路由配置与登录态守卫入口
  store/              # Zustand 状态
  styles/             # 全局样式与 design tokens
  types/              # TypeScript 类型
```

后续业务模块建议按领域组织，例如：

```text
src/pages/material
src/pages/writing
src/pages/qa
src/pages/knowledge
src/pages/ai
src/api/material
src/api/writing
src/api/qa
src/types/material
src/types/writing
```

如果实际业务落地时已有更细的组织方式，应优先遵循项目现有风格，不做无关重构。

## 现有基础模块

| 模块 | 路由 | 说明 |
| --- | --- | --- |
| Dashboard | `/dashboard` | 后台首页 |
| 用户管理 | `/system/user` | 用户管理 |
| 角色管理 | `/system/role` | 角色管理、菜单权限分配 |
| 菜单管理 | `/system/menu` | 后台菜单管理 |
| 部门管理 | `/system/dept` | 部门树管理 |
| 字典管理 | `/system/dict` | 字典类型与字典数据 |
| 配置管理 | `/system/config` | 系统配置 |
| 文件管理 | `/system/file` | 文件上传、预览、下载、元数据编辑 |
| 登录日志 | `/system/login-log` | 登录记录查询 |
| 操作日志 | `/system/oper-log` | 操作记录查询 |
| 个人中心 | `/account/profile` | 个人信息 |
| 修改密码 | `/account/change-password` | 密码修改 |

## 领域术语

项目统一使用中文领域语言：

| 术语 | 含义 |
| --- | --- |
| 材料 | 宣传文档的原始素材，由用户上传，由 Java 后端管理存储和元数据 |
| 片段 | 材料经切分后生成的文本块，带有元数据，用于向量检索 |
| 来源片段 | 检索命中并返回给写作任务或问答结果用于溯源展示的片段 |
| 写作任务 | 用户发起的一次内容生成请求 |
| 问答 | 用户基于材料提出问题并请求大模型回答的一次交互 |
| Prompt 模板 | 用于组装最终发送给大模型的模板 |

详细说明见 `docs/domain-language.md`。

## 开发约定

- 默认使用中文领域术语，页面文案、菜单、表格、表单优先使用中文。
- 代码命名可以使用英文，但应保持领域语义稳定，例如 `material`、`segment`、`sourceSegment`、`writingTask`、`qa`、`promptTemplate`。
- 新业务页面按领域组织，优先复用现有 `PageHeader`、`ContentCard`、`SearchFilterBar`、`TableToolbar`、`DataTable`、`FormSection`、`StatusTag`、`EmptyState` 等公共组件。
- 通用后台能力来自脚手架基础，不要为了业务页面随意重构基础布局、路由守卫、系统管理和公共组件体系。
- 前端 API 只封装 Java 后端接口；AI 相关能力由 Java 后端编排，前端只展示请求状态与结果。
- 不因单个页面需求引入新依赖或复杂框架。
- AI 编程 Agent 进入项目前应先阅读 `CLAUDE.md`，并遵守其中的系统边界、术语和禁止事项。

## 相关文档

- `CLAUDE.md`：AI 编程 Agent 统一项目规则入口
- `AGENTS.md`：兼容入口，软链接到 `CLAUDE.md`
- `docs/domain-language.md`：领域语言
- `docs/frontend-architecture.md`：前端架构边界
- `design-system/MASTER.md`：后台管理 UI/UX 主规范
