# 数据结构说明

核心数据位于 `src/data/creatures.ts`，类型定义位于 `src/types/creature.ts`。

## Creature

- `id`：三位图鉴编号，例如 `001`
- `name`：中文名称
- `attributes`：属性 / 系别数组
- `forms`：形态列表
- `obtainMethods`：获得方式
- `captureLocations`：捕捉地点
- `evolutionMethods`：进化方式
- `isCatchable`：`true`、`false` 或 `unknown`
- `isEventLimited`：`true`、`false` 或 `unknown`
- `availabilityStatus`：`available`、`event-limited`、`unavailable` 或 `unknown`
- `skills`：技能列表
- `description`：简介
- `sources`：数据来源
- `updatedAt`：数据更新时间
- `confidence`：`confirmed`、`partial` 或 `unknown`
- `sourceNote`：来源或校对说明

## Form

- `formId`：形态 ID
- `name`：形态名称
- `stage`：Ⅰ阶、Ⅱ阶、最终形态、地区形态、首领形态或待确认
- `image`：当前展示图片路径
- `sourceUrl`：图片或形态资料来源页面
- `imageSourceUrl`：公开图片文件页或来源页
- `imageLicenseNote`：图片许可与使用限制说明
- `imageReviewStatus`：`needs-review`、`approved-local` 或 `rejected`
- `imageStatus`：`placeholder`、`source-linked` 或 `local`
- `sourceNote`：图片授权和替换说明

## 可信度

- `confirmed`：至少一个可靠公开来源明确确认
- `partial`：核心字段已确认，但仍有字段待核验
- `unknown`：缺少可靠来源，不应推断

## DataGap

- `category`：`image` 或 `facts`
- `field`：缺口字段，例如图片、技能、捕捉地点
- `reason`：缺口原因
