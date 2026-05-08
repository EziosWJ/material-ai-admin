# 前端项目文档改造总结

## 修改文件

- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `docs/domain-language.md`
- `docs/frontend-architecture.md`
- `docs/FRONTEND_PROJECT_DOCS_MIGRATION_SUMMARY.md`

## 实现内容

- 将项目主身份从“React Admin Template / 通用后台管理模板”调整为“本地化智能材料写作平台前端”。
- 保留并弱化脚手架来源说明，明确当前项目基于 `react-admin` 脚手架复制和改造而来。
- 明确三项目关系和固定调用链：前端 React 项目 -> Java 后端 API -> Python AI 服务。
- 明确前端职责边界：前端只负责界面、交互、状态展示和调用 Java 后端 API，不直接访问 Python AI 服务。
- 建立统一领域语言，包括材料、片段、来源片段、写作任务、问答、Prompt 模板、材料向量维护。
- 为 Codex、通用 AI 编程 Agent 和 Claude Code 补充开发约束、禁止事项、目录建议和任务完成总结要求。
- 将 `AGENTS.md` 的规则内容合并到 `CLAUDE.md`，并约定 `AGENTS.md` 作为指向 `CLAUDE.md` 的兼容软链接。
- 新增前端架构说明，描述项目定位、技术栈、模块划分、API 调用边界和来源片段展示约定。

## 验证结果

- 已按任务要求检查项目真实结构，包括 `README.md`、`AGENTS.md`、`CLAUDE.md`、`package.json`、`src/router.tsx`、`src/config/navigation.ts`、`src/api`、`src/pages`、`docs`。
- 本次仅修改和新增 Markdown 文档，未修改源码、配置文件、依赖文件或构建脚本。
- 因本次只做文档改造，未执行前端构建。
- 已按要求执行 `git status` 和 `git diff -- README.md AGENTS.md CLAUDE.md docs` 进行最终检查。

## 未完成事项

- 未新增业务页面。
- 未新增前端功能代码。
- 未引入新依赖。
- 后续如开始实现材料、写作任务、问答、来源片段等业务模块，应继续依据 `docs/domain-language.md` 与 `docs/frontend-architecture.md` 执行。
