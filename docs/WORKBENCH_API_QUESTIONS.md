# 工作台对接待确认问题

前端工作台对接后端 API 前，需确认以下问题。

---

## 写作模块

### Q1: 写作类型 `polish` 还是 `polished`？

接口文档中写作类型枚举为 `outline / draft / polished / title`，但工作台 Mock 中使用的是 `polish`。请确认正确值。

**后端回复**：正确值是 `polished`。代码中在 `WritingTaskServiceImpl.java:50` 硬编码为字符串集合。

**前端处理**：已确认 `polished`，Mock 已删除，当前代码使用 `polished`。

**状态**：✅ 已确认

### Q2: 语气风格和期望字数如何传递？

工作台 UI 有"语气风格"（正式/专业/简洁/详细）和"期望字数"两个参数，但创建写作任务接口没有对应字段。

建议方案：将这两个参数拼接到 `requirement` 字段中，例如：
```
语言正式，结构清晰。语气风格：专业。期望字数：2000。
```

**后端回复**：同意在 requirement 中拼接。同时后端需将 requirement 传递给 Python AI 服务（PythonAiGenerateRequest 增加 requirement 字段，toGenerateRequest() 和 toGenerateBody() 映射该字段）。

**前端处理**：已实现 requirement 拼接逻辑。

**状态**：✅ 已确认

### Q3: 保存草稿是否有对应 API？

工作台 UI 有"保存草稿"按钮，但接口文档中没有对应 API。

可能方案：
- A）后端新增草稿保存接口
- B）前端本地暂存（localStorage）
- C）移除该功能

**后端回复**：当前无此功能。写作任务是"创建→直接调 AI→返回结果"的同步流程，没有草稿中间态。建议 MVP 阶段移除该按钮，后续可新增 `POST /api/writing/task/draft` 接口。

**前端处理**：已移除"保存草稿"按钮。

**状态**：✅ 已确认

### Q4: 导出功能支持哪些格式？

工作台 UI 有"导出"按钮，但接口文档中没有对应 API。

可能方案：
- A）后端提供导出接口（支持 docx/pdf/txt）
- B）前端直接将内容转为文件下载（纯文本/Markdown）
- C）移除该功能

**后端回复**：建议前端直接转文件下载（纯文本/Markdown），写作结果已有 Markdown 格式文本。docx/pdf 需要服务端转换，可放在后续迭代。

**前端处理**：已实现前端导出为 `.md` 文件下载。

**状态**：✅ 已确认

### Q5: 重新生成如何实现？

工作台 UI 有"重新生成"按钮。实现方式：
- A）重新调用 `POST /api/writing/task` 创建新任务
- B）后端提供专用重新生成接口（保留上下文）

**后端回复**：重新调用 `POST /api/writing/task` 创建新任务。当前没有"保留上下文"的需求，无需新增专用接口。

**前端处理**：当前已通过重新调用 `createWritingTask` 实现。

**状态**：✅ 已确认

### Q6: 创建写作任务的超时策略？

文档说明"同步调用 AI，返回时任务已完成"，但 AI 生成可能耗时较长。

需确认：
- 接口超时时间是多少？
- 前端是否需要轮询任务状态？还是直接等待同步响应？
- 是否有异步模式（创建后轮询 status）？

**后端回复**：当前完全同步阻塞模式，没有超时配置。短期前端直接等待同步响应（配合 loading 状态），后续后端需为 RestClient 配置连接超时和读取超时。

**前端处理**：已展示 loading 状态，同步等待响应。

**状态**：✅ 已确认

---

## 问答模块

### Q7: 问答会话的状态枚举值？

`QaSessionVO.status` 字段的具体枚举值未在文档中列出。需确认：
- 有哪些状态值？（如 active / archived / deleted）
- 前端是否需要按状态筛选？

**后端回复**：`active` / `archived`。当前 Java 代码仅定义了 `STATUS_ACTIVE = "active"`。archived 状态在 DDL 中有记录但 Java 代码未实现。

**前端处理**：列表查询已添加 `status: "active"` 默认筛选。

**状态**：✅ 已确认

### Q8: ask 接口是否支持流式返回？

当前文档说明 `POST /api/qa/session/{id}/ask` 是同步返回（返回 userMessage + assistantMessage）。

需确认：
- 是否有流式返回（SSE/WebSocket）方案？
- 同步模式下，AI 回答的等待时间预期是多少？
- 前端是否需要 loading 状态轮询？

**后端回复**：当前不支持。项目中没有引入任何 WebSocket、SSE、WebFlux 或 Reactor 依赖。后续如果需要流式体验，后端需要引入相关依赖并改造 Python AI 服务。

**前端处理**：当前使用同步请求 + loading 状态，等待响应返回。

**状态**：✅ 已确认

---

## 通用问题

### Q9: 分页接口的 pageSize 上限？

各分页接口是否有 pageSize 最大值限制？工作台首页需要获取"最近 N 条"数据，建议 pageSize 上限是否支持 5-10。

**后端回复**：当前上限为 500（定义在通用基类 `PageQuery.java:14`：`@Max(value = 500)`）。默认 pageSize 为 10。工作台首页 5-10 条完全在支持范围内。

**状态**：✅ 已确认
