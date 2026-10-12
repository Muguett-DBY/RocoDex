# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|

*(empty: your first build has nothing to clear, so build whatever the interview
points at. From the second onwards, this table is the constraint.)*

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- cstd-flight：连续世界 grammar（worldflight 固定舞台/航段/台账 HUD 一族）、Ken Burns 视频推动、「证据并网」签名动作、抵达式 CTA 收尾。
- cstd-editorial：章节编辑部 grammar（folio 页码轨/扉页题签/边栏批注/版权页版牌一族）、纸白 atelier 版面、flow-act 计数+揭示峰值。

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.

---

## Registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| cstd-flight (2026-10-13) | Continuous world (worldflight, 9 legs, 11.4vh track) | 城市电网 rail：右侧固定 9 节点充能总线，可点击跳航段（map 即导航） | 定镜内部位：夜幕都市远景 + Ken Burns 推镜 clip，hero 窗 greet 文案 | 9 航段同速率 ~0.215vh/s，峰值段 1.72vh 最长（无 act，无分块） | 抵达「工作站」场景，mailto CTA 作为场所物件，台账结清行收尾 | 「证据并网」：飞越区段即以真实验收数据（7 作品/31 证据/覆盖率/日期）在电网与台账上逐区点亮并入 | 暗夜精密工程城（Neural Industrialism 续篇，现有 18 张 webp + ffmpeg Ken Burns） | 4501（原型）/ 3000（Next 集成） |
| cstd-editorial (2026-10-13) | Chaptered editorial（六章纸面刊物：扉页/方法/作品/札记/实验室/版权页） | folio 左缘页码轨：6 个章节码+可点锚点+逐章进度细线，版权页上翻墨色 | 扉页题签：纸面衬线大字+一次性 IO 入场（无媒体） | 全程文档流；唯一 flow act 在数据页驱动计数 0→1,470,000+图表左揭+微视差；总长 ~6vh | 墨色版权页版牌：CTA 排成行文链接（无按钮岛），masthead+小字版权条 | 「页边批注」：章节边栏短注（真实交叉链接）随段落落位，青铜细线 scaleX 连接 | atelier 正式纸白（#f8f5ef/墨/青铜，CSTD Press Serif，零视频零生成） | 4517（原型）/ 3000（Next 集成） |
