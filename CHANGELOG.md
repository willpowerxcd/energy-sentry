# Changelog

## [0.1.0] - 2026-11-18

### Added

- Vue 3.5 + TypeScript + Vite 6 工程骨架，启用 strict、路径别名和 `vue-tsc`。
- Vue Router 4 + Pinia，AdminLayout、可收起侧边栏、顶栏、面包屑式页面标题。
- Element Plus 深度主题覆盖：主色、圆角、输入框、表格、标签、抽屉、弹窗。
- 设计 token：蓝白配色、状态色、字体、间距、阴影、深色大屏 token。
- 登录页：表单校验、记住账号、演示账号一键填充、站内 redirect 校验。
- JWT 登录态：access/refresh token、401 自动刷新、失败清理并跳登录。
- 四角色权限：管理员、后勤、运维、观察员；路由守卫 + 菜单过滤 + 403 页面。
- 首页总览：4 张 KPI 卡、实际/预测曲线、异常点、楼栋排行、高风险告警、底部四指标、60s 轮询。
- 告警详情抽屉：异常事实、时段曲线、三视图分数、原因排序、损失核算、处置时间线、状态流转。
- 深色大屏预览 `/screen`：楼栋排行、目标完成率、KPI、发光曲线、告警列表、告警类型分布、治理措施、设备在线率；1920×1080 下无滚动。
- UI Kit `/dev/ui-kit`：颜色、字体、按钮、表单、标签、KPI 卡、图表、表格集中验收。
- MSW 2 Mock：认证、首页、告警、楼栋、报表 handler；固定种子生成自洽数据。
- API 契约 `docs/api-contract.md`、OpenAPI 检查脚本、开发日志脚本。
- Playwright 验收截图与开发日志 `docs/dev-log/2026-11-18.md`。

### Changed

- 首页 KPI 口径统一为公式计算：月度节省 36,200 元、碳减排 21.3 tCO₂、等效植树 1,274 棵。
- 告警状态在 Mock 中共享，详情抽屉修改后首页列表同步刷新。

### Fixed

- 登录页品牌标题孤字换行。
- BaseChart 的 ECharts 类型冲突（改用 `ReturnType<typeof echarts.init>`）。
- ESLint 未使用变量告警。

### Verified

- `npm run typecheck` 通过。
- `npm run build` 通过。
- `npm run lint` 0 error。
- Playwright（Edge headless）登录、首页、告警抽屉、管理员/观察员权限、403 全链路通过，控制台 0 error。
- 1440×900 与 1920×1080 首页/大屏截图验证，无横向溢出。

### Known

- M3–M7 页面目前为占位页，按里程碑接入。
- Element Plus 与 ECharts 暂为完整引入，构建 chunk 超过 500 kB 警告；M8 做按需引入与分包优化。
- 真实后端尚未接入；`docs/api-contract.md` 为建议契约，后端就绪后运行 `npm run check:api`。
- 深色大屏已按 1920×1080 预览验证，M8 完成等比缩放、轮播和真实指标接入。
