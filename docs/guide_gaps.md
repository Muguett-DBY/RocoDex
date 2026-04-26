# 攻略页待补全项

## 当前缺口

- BWiki 图鉴页存在更多基础条目；自动抽取时站点安全策略可能拦截，需要后续人工或稳定脚本补齐全量基础列表。
- 当前 PVE 评级大多为 `未评级`，缺少可靠公开培养资料时不推断。
- 当前 PVP 评级仅覆盖 `/pvp-teams` 当前 META 阵容出现过的精灵。
- 性格、天分与配招若来自阵容定位推导，统一标记 `analysis-derived` 并显示“本站分析”。
- 未进入当前 PVP 资料、且没有可靠培养来源的精灵统一保留 `unknown`。

## 自动统计规则

- `未评级`：PVE 或 PVP tier 为 `未评级`。
- `缺配招`：`moves.sourceBasis = "unknown"`。
- `缺性格`：`nature.sourceBasis = "unknown"`。
- `缺天分`：`talent.sourceBasis = "unknown"`。
- `待复核`：`confidence = "unknown"` 或 `reviewNotes` 中包含待复核说明。

## 后续校对建议

1. 分批补齐 BWiki 图鉴基础条目，保留同编号多形态的 `formName`。
2. 对 PVE 玩法按副本、开荒、捕捉、活动挑战分别收集来源。
3. 对 PVP 社区视频逐条复核完整阵容和技能文本。
4. 每次补充可靠培养资料后同步更新 `docs/guide_sources.md`。
