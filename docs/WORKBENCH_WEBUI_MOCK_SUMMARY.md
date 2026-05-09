# AI 工作台 WebUI 静态原型总结

## 修改文件

### 新增文件

- `src/components/layout/workbench-layout.tsx` - 工作台独立布局组件
- `src/mocks/workbench.ts` - 工作台 Mock 数据
- `src/pages/workbench/index.tsx` - 工作台首页
- `src/pages/workbench/chat.tsx` - 材料问答页面
- `src/pages/workbench/writing.tsx` - 辅助写作页面

### 修改文件

- `src/router.tsx` - 新增工作台路由配置
- `src/config/navigation.ts` - 新增工作台路由标题映射

## 实现内容

### 1. WorkbenchLayout 布局组件

- 独立于后台管理系统，不嵌入 AppShell
- 复用 AppHeader 的视觉样式（高度、背景、边框）
- 复用 UserMenu 组件，保持用户头像、个人中心、修改密码、退出登录功能
- 顶部导航栏包含：
  - 返回后台管理按钮
  - 系统名称：本地化智能材料写作平台
  - 工作台导航：首页、材料问答、辅助写作
  - 用户菜单
- 主体区域充分利用屏幕宽度，不显示后台左侧菜单

### 2. 工作台首页 (/workbench)

- 欢迎区：标题和副标题
- 两个功能入口卡片：材料问答、辅助写作
- 信息区：最近材料、最近问答、最近写作任务
- 使用 Mock 数据展示

### 3. 材料问答页面 (/workbench/chat)

- 三栏布局：
  - 左侧：会话列表，支持新建问答和会话切换
  - 中间：问答消息列表，区分 user 和 assistant 消息
  - 右侧：材料范围和来源片段展示
- 来源片段支持展开/收起，显示材料名称、片段序号、相关度、摘要
- 底部固定输入区，显示"回答将基于已选择材料生成"提示
- 使用 Mock 会话、消息和来源片段数据

### 4. 辅助写作页面 (/workbench/writing)

- 三栏布局：
  - 左侧：写作参数区，包含写作类型、材料范围、写作主题、写作要求、语气风格、期望字数
  - 中间：生成结果编辑区，显示 Mock 生成结果，支持复制、保存草稿、重新生成、导出操作
  - 右侧：来源片段展示，风格与问答页面一致
- 写作类型支持：提纲、初稿、润色、标题
- 使用 Mock 数据

## 新增路由

| 路由 | 页面 | 布局 |
| --- | --- | --- |
| `/workbench` | 工作台首页 | WorkbenchLayout |
| `/workbench/chat` | 材料问答 | WorkbenchLayout |
| `/workbench/writing` | 辅助写作 | WorkbenchLayout |

路由使用 `RequireAuth` 守卫保护，需要登录后才能访问。

## Mock 数据说明

Mock 数据文件：`src/mocks/workbench.ts`

包含以下数据类型：

- `MockMaterial` - 材料数据（4条）
- `MockQaSession` - 问答会话数据（3条）
- `MockQaMessage` - 问答消息数据（4条）
- `MockSourceSegment` - 来源片段数据（5条）
- `MockWritingTask` - 写作任务数据（4条）
- `mockWritingResult` - 写作生成结果示例

Mock 数据内容：
- 材料：政策宣传材料、企业介绍材料、项目申报材料、会议纪要材料
- 问答会话：总结项目亮点、提炼宣传口径、生成对外介绍
- 来源片段：包含材料名称、片段序号、相关度、摘要正文
- 写作任务：提纲、初稿、润色、标题

## 验证结果

### 构建验证

执行 `npm run build` 构建成功：

```
✓ 1716 modules transformed.
dist/index.html                   0.41 kB │ gzip:   0.28 kB
dist/assets/index-P5a316O6.css   24.70 kB │ gzip:   5.67 kB
dist/assets/index-LnQ93GNm.js   654.27 kB │ gzip: 182.92 kB
✓ built in 5.55s
```

TypeScript 编译和 Vite 构建均无错误。

### 功能验证

- 路由配置正确，三个页面均可访问
- WorkbenchLayout 独立于后台布局
- UserMenu 组件复用成功，功能正常
- 页面间导航正常
- Mock 数据正确展示

## 未完成事项

本次任务为静态 Mock WebUI，以下功能未实现：

1. **真实 API 对接**：所有数据均为 Mock 数据，未接入 Java 后端 API
2. **真实交互功能**：
   - 发送问答消息
   - 生成写作内容
   - 保存草稿
   - 导出文件
3. **状态管理**：未使用 Zustand 管理会话状态
4. **响应式适配**：移动端布局未优化
5. **其他功能**：
   - 新建问答会话
   - 删除会话
   - 搜索会话
   - 材料范围选择交互
   - 写作参数动态调整

## 后续建议

1. **接入真实 API**：对接 Java 后端的问答和写作任务接口
2. **状态管理**：使用 Zustand 管理会话状态和写作任务状态
3. **响应式优化**：优化移动端布局和交互
4. **功能完善**：
   - 实现真实的消息发送和接收
   - 实现写作内容生成和编辑
   - 添加加载状态和错误处理
   - 实现草稿保存和历史记录
5. **性能优化**：
   - 消息列表虚拟滚动
   - 来源片段懒加载
6. **用户体验**：
   - 添加快捷键支持
   - 优化消息动画效果
   - 添加消息复制功能
