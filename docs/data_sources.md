# 数据来源

## 主来源

- 洛克王国:手游WIKI_BWIKI 精灵图鉴  
  https://wiki.biligame.com/rocom/%E7%B2%BE%E7%81%B5%E5%9B%BE%E9%89%B4

该页面用于确认《洛克王国世界》图鉴编号、中文名称、属性、形态名称和公开立绘条目。页面显示更新日期为 2026-04-05，并标注文字与数据内容采用 CC BY-NC-SA 4.0。

## 单条目示例来源

- 迪莫  
  https://wiki.biligame.com/rocom/%E8%BF%AA%E8%8E%AB

迪莫条目用于补充 NO.001 的分布、简介、部分技能和无法进化信息。

- 喵喵  
  https://wiki.biligame.com/rocom/%E5%96%B5%E5%96%B5
- 喵呜  
  https://wiki.biligame.com/rocom/%E5%96%B5%E5%91%9C
- 魔力猫  
  https://wiki.biligame.com/rocom/%E9%AD%94%E5%8A%9B%E7%8C%AB
- 火花  
  https://wiki.biligame.com/rocom/%E7%81%AB%E8%8A%B1

上述页面用于补充 NO.002-NO.005 的分布、简介和进化链片段。未完整核验的字段继续保留“待确认”。

## 图片策略

当前版本已将前 50 个编号的 55 个形态立绘缓存到本地：

```text
public/images/creatures/
```

图片通过 BWiki 文件页和 `thumb.php` 缩略图接口获取，数据中保留来源页面 URL。由于图片权利状态仍需逐张确认，所有形态仍保留 `imageReviewStatus: "needs-review"`，不得视为商业可用素材。

每个形态已增加：

- `imageSourceUrl`
- `imageLicenseNote`
- `imageReviewStatus`

## 本轮补充来源

- 焰火  
  https://wiki.biligame.com/rocom/%E7%84%B0%E7%81%AB
- 火神  
  https://wiki.biligame.com/rocom/%E7%81%AB%E7%A5%9E
- 水蓝蓝  
  https://wiki.biligame.com/rocom/%E6%B0%B4%E8%93%9D%E8%93%9D
- 波波拉  
  https://wiki.biligame.com/rocom/%E6%B3%A2%E6%B3%A2%E6%8B%89
- 水灵  
  https://wiki.biligame.com/rocom/%E6%B0%B4%E7%81%B5

## 2026-04-27 补充

- 鸭吉吉  
  来源：百度百科"洛克王国：世界"条目（BWiki 无双精灵独立页面）

- 板板壳 / 咔咔壳 / 水泡壳  
  来源：百度百科"洛克王国：世界"条目（BWiki 无双精灵独立页面）
  进化链：板板壳(Lv16)→咔咔壳(Lv36)→水泡壳

- 奇丽草  
  https://wiki.biligame.com/rocom/%E5%A5%87%E4%B8%BD%E8%8D%89  
  含技能列表：能量炮、晒太阳、刺藤、防御

- 奇丽叶 / 奇丽花  
  进化链来自奇丽草 BWiki 页面：奇丽草(Lv16)→奇丽叶(Lv32)→奇丽花

## 待补充页面

以下精灵编号在 BWiki 无双精灵独立页面，百度百科（洛克王国：世界）也暂无收录：
- NO.015-020（锥尾羊系、雪绒鸟系）
- NO.021-023（小灵菇系）
- NO.024-026（石肤蜥系）
- NO.027-029（布是石系）
- NO.030-031（恶魔叮系）
- NO.032-034（毛毛系，含化蝶）
- NO.035（幽影树，BWiki 页面存在但数据抓取未完成）
- NO.036-040（小鼠獭系、矿晶虫系）
- NO.044-046（丢丢系）
- NO.047-050（护主犬系、松鼠系）
