# 能耗哨兵前端 API 契约

版本：v1.0  
日期：2026-11-18  
状态：建议契约。后端模块 5 实现后，以 FastAPI 自动生成的 `openapi.json` 为最终事实源；本文档与 `src/api/types`、`src/mocks` 保持同步。

## 1. 通用约定

- Base URL：`/api/v1`
- 认证：`Authorization: Bearer <access_token>`
- 请求/响应：`application/json; charset=utf-8`；文件上传使用 `multipart/form-data`
- 时间：ISO 8601，带时区，例如 `2026-06-01T10:23:00+08:00`
- 日期范围：`start` 包含、`end` 不包含，即 `[start, end)`
- 分页：`page` 从 1 开始，`page_size` 默认 20；响应 `{ "items": [], "total": 0 }`
- 空值：筛选参数为空时不传，不传空字符串
- 请求追踪：前端生成 `X-Request-Id`，后端写入日志并在错误响应中回传
- 错误响应：

```json
{
  "code": "AUTH_INVALID",
  "message": "用户名或密码错误",
  "detail": null
}
```

- 前端切换：
  - Mock：`VITE_USE_MOCK=true`（开发环境默认）
  - 真实后端：`VITE_USE_MOCK=false`，`VITE_API_BASE_URL=http://localhost:8000/api/v1`
- 开发环境 CORS：后端放行 `http://localhost:5173`
- 生产建议：Nginx 同源反代 `/api` 到 FastAPI，前端不配置跨域域名

## 2. 认证

### POST /auth/login

请求：

```json
{ "username": "admin", "password": "admin123" }
```

响应 200：

```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 7200,
  "user": {
    "id": 1,
    "username": "admin",
    "display_name": "管理员",
    "roles": ["admin"],
    "permissions": ["alarm:view", "alarm:handle", "settings:manage"]
  }
}
```

### POST /auth/refresh

请求：

```json
{ "refresh_token": "eyJ..." }
```

响应 200：

```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 7200
}
```

### POST /auth/logout

无请求体，响应 204。前端无论成功失败都会清理本地登录态。

### GET /auth/me

响应 200：与登录响应中的 `user` 相同。

### 角色与权限

| 角色 | code | 权限范围 |
|---|---|---|
| 管理员 | `admin` | 全部 |
| 后勤 | `logistics` | 告警处理/派单、建议采纳、报表生成/导出、设备查看 |
| 运维 | `ops` | 告警处理、设备查看/编辑、报表查看/导出 |
| 观察员 | `observer` | 告警/建议/报表/设备只读 |

前端只负责隐藏和拦截，后端必须对每个接口再次校验。

## 3. 首页

### GET /dashboard/summary?date=2026-06-01

```json
{
  "today_kwh": 12860,
  "alarm_count": 18,
  "estimated_saving_yuan": 36200,
  "carbon_reduced_t": 21.3,
  "day_over_day": 0.086,
  "year_over_year": -0.062,
  "target_completion": 0.82,
  "equivalent_trees": 1274
}
```

计算口径：

- `estimated_saving_yuan = 节能量(kWh) × 电价(0.8 元/kWh)`
- `carbon_reduced_t = 节能量(kWh) × 排放因子(0.47 kgCO2/kWh) / 1000`
- `equivalent_trees = carbon_reduced_t × 1000 / 16.7`

### GET /dashboard/series?date=2026-06-01&granularity=day

`granularity`：`day | week | month`

```json
{
  "labels": ["00:00", "01:00", "02:00"],
  "actual": [320, 250, 180],
  "predicted": [300, 240, 190],
  "lower": [280, 220, 175],
  "upper": [330, 265, 205],
  "anomalies": [{ "index": 10, "value": 1335, "alarm_id": 101 }]
}
```

- `labels` 是后端格式化好的展示标签；日粒度 `HH:mm`，周/月粒度 `MM-DD`
- `lower/upper` 可选，用于置信带
- `anomalies[].index` 对应 `labels` 下标

### GET /dashboard/ranking?date=2026-06-01

```json
[
  { "building_id": 2, "building_name": "实验楼B", "kwh": 3280 },
  { "building_id": 3, "building_name": "宿舍楼C", "kwh": 2450 }
]
```

### GET /dashboard/alarms?limit=5

```json
[
  {
    "id": 101,
    "alarm_time": "2026-06-01T10:23:00+08:00",
    "building_id": 2,
    "building_name": "实验楼B",
    "alarm_type": "能耗异常",
    "alarm_level": "severe",
    "suggestion": "检查空调和实验设备",
    "status": "pending"
  }
]
```

`alarm_level`：`normal | attention | warning | severe`  
`status`：`pending | processing | resolved`

## 4. 楼栋

### GET /buildings

```json
[
  {
    "id": 2,
    "building_code": "B01",
    "building_name": "实验楼B",
    "campus_id": 1,
    "building_type": "实验楼",
    "area": 18600,
    "floor_count": 6,
    "address": "东区 2 号",
    "is_active": true
  }
]
```

### GET /buildings/{id}

返回单个楼栋，字段同上；不存在时返回 404。

## 5. 能耗监测

### GET /energy/series?building_id=2&energy_type=electricity&start=2026-05-01&end=2026-06-01&granularity=hour

```json
{
  "labels": ["05-01 00:00", "05-01 01:00"],
  "actual": [320, 250],
  "predicted": [300, 240],
  "lower": [280, 220],
  "upper": [330, 265],
  "anomalies": [{ "index": 10, "value": 1335, "alarm_id": 101 }],
  "quality": {
    "completeness": 0.986,
    "imputed_points": 12,
    "offline_devices": 1,
    "duplicates": 0,
    "negative_values": 0
  }
}
```

`energy_type`：`electricity | chilled_water | steam | hot_water`

### GET /energy/quality?building_id=2&start=2026-05-01&end=2026-06-01

```json
{
  "completeness": 0.986,
  "imputed_points": 12,
  "offline_devices": 1,
  "duplicates": 0,
  "negative_values": 0,
  "offline_events": [
    { "device_id": 12, "device_name": "宿舍楼C-网关", "start": "2026-05-18T02:00:00+08:00", "end": "2026-05-18T05:00:00+08:00" }
  ]
}
```

### POST /energy/upload

`multipart/form-data`：

- `file`：CSV 文件，最大 20 MB
- `building_id`：楼栋 ID
- `energy_type`：能源类型

响应 202：

```json
{ "task_id": "upload_20260601_001", "status": "pending" }
```

### GET /energy/uploads/{task_id}

```json
{
  "task_id": "upload_20260601_001",
  "status": "succeeded",
  "progress": 100,
  "rows_received": 720,
  "rows_accepted": 712,
  "errors": [
    { "row": 18, "field": "energy_value", "message": "负值已剔除" }
  ]
}
```

`status`：`pending | running | succeeded | failed`

## 6. 能效分析

### GET /efficiency/baseline?building_id=2&start=2026-05-01&end=2026-06-01

```json
{
  "mape": 0.087,
  "mae": 86.2,
  "r2": 0.92,
  "series": {
    "labels": ["05-01", "05-02"],
    "actual": [11800, 12200],
    "predicted": [11400, 11700],
    "lower": [11000, 11300],
    "upper": [11800, 12100],
    "anomalies": []
  },
  "residuals": [-200, 100, 350, -80]
}
```

### GET /efficiency/buildings?start=2026-05-01&end=2026-06-01

```json
[
  {
    "building_id": 2,
    "building_name": "实验楼B",
    "building_type": "实验楼",
    "area": 18600,
    "kwh": 98600,
    "eui": 5.3,
    "type_rank": 1,
    "percentile": 0.92
  }
]
```

### GET /efficiency/metrics?start=2026-05-01&end=2026-06-01

```json
{
  "monthly_mape": [{ "month": "2026-04", "value": 0.091 }, { "month": "2026-05", "value": 0.087 }],
  "precision": 0.84,
  "recall": 0.81,
  "f1": 0.825,
  "models": [
    { "name": "LightGBM", "version": "v1.2.0", "mape": 0.087, "trained_at": "2026-05-28T02:00:00+08:00", "status": "active" }
  ]
}
```

## 7. 异常告警

### GET /alarms

查询参数：`page`、`page_size`、`building_id`、`level`、`status`、`type`、`start`、`end`、`keyword`

```json
{
  "items": [
    {
      "id": 101,
      "alarm_time": "2026-06-01T02:00:00+08:00",
      "building_id": 2,
      "building_name": "实验楼B",
      "alarm_type": "夜间空耗",
      "alarm_level": "severe",
      "suggestion": "检查空调和实验设备",
      "status": "pending"
    }
  ],
  "total": 18
}
```

### GET /alarms/{id}

```json
{
  "id": 101,
  "alarm_time": "2026-06-01T02:00:00+08:00",
  "building_id": 2,
  "building_name": "实验楼B",
  "alarm_type": "夜间空耗",
  "alarm_level": "severe",
  "suggestion": "检查空调和实验设备",
  "status": "pending",
  "actual_value": 2160,
  "predicted_value": 1320,
  "residual_rate": 0.636,
  "three_view_scores": { "local": 0.82, "global": 0.74, "external": 0.61 },
  "possible_causes": [
    { "cause": "空调未关闭", "confidence": 0.72, "check": "核查空调定时策略与夜间关机设置" }
  ],
  "loss": { "energy_kwh": 840, "money_yuan": 672, "carbon_kg": 394.8 },
  "handler": null,
  "handle_time": null
}
```

### PATCH /alarms/{id}

请求：

```json
{ "status": "processing", "note": "已派给后勤值班组" }
```

响应：更新后的告警详情。允许的状态流转：`pending → processing → resolved`。

### POST /alarms/{id}/work-orders

请求：

```json
{
  "assignee_id": 2,
  "deadline": "2026-06-02T18:00:00+08:00",
  "note": "优先核查空调定时策略"
}
```

响应 201：

```json
{ "work_order_id": 501, "status": "processing", "assignee": "后勤值班组" }
```

## 8. 节能建议

### GET /suggestions?building_id=2&type=hvac&status=pending

```json
{
  "items": [
    {
      "id": 301,
      "title": "实验楼B空调夜间定时关闭",
      "building_id": 2,
      "building_name": "实验楼B",
      "measure_type": "空调优化",
      "expected_saving_kwh": 4200,
      "expected_saving_yuan": 3360,
      "payback_months": 2,
      "difficulty": "低",
      "status": "pending"
    }
  ],
  "total": 1
}
```

### GET /suggestions/{id}

在列表字段基础上增加：

```json
{
  "evidence": { "alarm_ids": [101], "description": "连续 7 天夜间负荷高于基线" },
  "calculation": "夜间超额电量 4,200 kWh × 0.8 元/kWh = 3,360 元",
  "steps": ["核对空调定时策略", "设置 23:00 自动关机", "连续观察一周"],
  "owner_department": "后勤保障部",
  "expected_effect": "预计每月减少浪费电量 4,200 kWh"
}
```

### POST /suggestions/{id}/adopt

请求：

```json
{ "create_work_order": true, "assignee_id": 2 }
```

响应 200：更新后的建议，`status` 变为 `adopted`。

## 9. 报表

### GET /reports?page=1&page_size=20

```json
{
  "items": [
    {
      "id": 1,
      "title": "2026年5月节能诊断报告",
      "report_type": "monthly",
      "scope": "全校园区",
      "period_start": "2026-05-01",
      "period_end": "2026-05-31",
      "generated_at": "2026-06-01T08:30:00+08:00",
      "status": "completed"
    }
  ],
  "total": 3
}
```

`report_type`：`weekly | monthly | alarm`  
`status`：`generating | completed | failed`

### POST /reports/generate

```json
{
  "template": "monthly",
  "scope": "campus_1",
  "period_start": "2026-05-01",
  "period_end": "2026-05-31"
}
```

响应 202：

```json
{ "report_id": 4, "status": "generating" }
```

前端轮询 `GET /reports/{id}` 直到 `completed` 或 `failed`。

### GET /reports/{id}

```json
{
  "id": 1,
  "title": "2026年5月节能诊断报告",
  "period_start": "2026-05-01",
  "period_end": "2026-05-31",
  "summary": { "total_kwh": 128600, "alarm_count": 18, "saving_yuan": 36200, "carbon_t": 21.3 },
  "anomalies": [],
  "ranking": [],
  "savings": {},
  "causes": [],
  "measures": [],
  "carbon": {},
  "conclusion": "本月异常主要由设备管理不规范及系统效率下降引起……"
}
```

M6 实现报告页时会把 `anomalies/ranking/savings/causes/measures/carbon` 扩展为明确的嵌套结构，届时同步更新本文档和 `src/api/types/report.ts`。

### POST /reports/{id}/exports

```json
{ "format": "pdf" }
```

`format`：`pdf | docx`。响应 202：

```json
{ "task_id": "export_20260601_001", "status": "pending" }
```

### GET /exports/{task_id}

```json
{
  "task_id": "export_20260601_001",
  "status": "succeeded",
  "progress": 100,
  "download_url": "/api/v1/exports/export_20260601_001/download"
}
```

## 10. 设备管理

### GET /devices?building_id=2&status=offline

```json
{
  "items": [
    {
      "id": 12,
      "device_code": "C01-GW-01",
      "device_name": "宿舍楼C-网关",
      "building_id": 3,
      "building_name": "宿舍楼C",
      "device_type": "gateway",
      "status": "offline",
      "last_reported_at": "2026-06-01T05:12:00+08:00",
      "data_completeness": 0.82
    }
  ],
  "total": 1
}
```

`device_type`：`meter | gateway | sensor`  
`status`：`online | offline | abnormal`

### GET /devices/{id}

在列表字段基础上增加 `events`：

```json
[
  { "start": "2026-05-18T02:00:00+08:00", "end": "2026-05-18T05:00:00+08:00", "type": "offline", "note": "网关断电" }
]
```

## 11. 系统设置

| 接口 | 说明 |
|---|---|
| `GET /settings/users` | 用户列表 |
| `POST /settings/users` | 新增用户 |
| `PATCH /settings/users/{id}` | 修改用户 |
| `GET /settings/roles` | 角色与权限 |
| `GET /settings/thresholds` | 告警阈值 |
| `PUT /settings/thresholds` | 更新阈值 |
| `GET /settings/model-versions` | 模型版本 |
| `GET /settings/tasks` | 调度任务 |
| `GET /settings/audit-logs` | 审计日志 |

阈值结构：

```json
{
  "normal_max": 0.10,
  "attention_max": 0.25,
  "warning_max": 0.50,
  "severe_min": 0.50,
  "building_type_overrides": {
    "实验楼": { "warning_max": 0.45 }
  }
}
```

## 12. 错误码

| HTTP | code | 含义 | 前端处理 |
|---|---|---|---|
| 400 | `VALIDATION_ERROR` | 参数校验失败 | 展示 message，定位表单 |
| 401 | `AUTH_INVALID` | 用户名或密码错误 | 登录页提示 |
| 401 | `AUTH_UNAUTHORIZED` | 未登录或 access token 过期 | 尝试 refresh，失败跳登录 |
| 401 | `AUTH_REFRESH_INVALID` | refresh token 无效 | 清理登录态，跳登录 |
| 403 | `FORBIDDEN` | 无权限 | 提示并跳 403 |
| 404 | `NOT_FOUND` | 资源不存在 | 空态或提示 |
| 409 | `CONFLICT` | 状态冲突（如重复派单） | 提示并刷新 |
| 422 | `VALIDATION_ERROR` | FastAPI 校验错误 | 展示字段错误 |
| 500 | `INTERNAL_ERROR` | 服务端异常 | 通用错误提示 |
| 503 | `SERVICE_UNAVAILABLE` | 算法服务不可用 | 提示稍后重试 |

## 13. 后端交付清单

联调前请确认：

- [ ] `/openapi.json` 可访问，路径包含 `/api/v1`
- [ ] CORS 放行 `http://localhost:5173`
- [ ] 登录、刷新、登出、`/auth/me` 可用
- [ ] 种子数据：5–6 栋楼、30 天小时数据、18 条告警、1 份月报
- [ ] 时间字段带 `+08:00`
- [ ] 分页、筛选、错误码符合本文档
- [ ] 报告生成与导出任务可轮询
- [ ] CSV 上传限制与校验结果结构
- [ ] 告警状态流转与工单接口
- [ ] 阈值、模型版本、调度任务、审计日志只读接口

## 14. 契约变更流程

1. 先改本文档，写清字段、类型、示例
2. 同步改 `src/api/types`
3. 同步改 `src/mocks/fixtures` 与 `src/mocks/handlers`
4. 页面只通过 `src/api/modules` 访问，不直接依赖 Mock
5. 后端实现后运行 `npm run check:api`
6. 用 `openapi-typescript` 生成类型并替换手写 DTO
7. 切换 `VITE_USE_MOCK=false` 做真实联调

> 前端隐藏按钮不等于安全，所有权限必须由后端再次校验。
