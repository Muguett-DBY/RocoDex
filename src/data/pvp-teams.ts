import type { PvpMove, PvpSource, PvpTeam } from "@/types/pvp-team";

const META_DATE = "2026-04-26";
const VERIFIED_AFTER = "2026-04-15";
const ANALYSIS_DISCLAIMER = "性格、天分与部分配招为本站分析，非来源原文；阵容成员优先按 2026-04-15 之后公开资料录入。";

const sources = {
  official0423: {
    title: "《洛克王国：世界》4月23日版本更新公告",
    url: "https://www.bilibili.com/opus/1194090247921598497",
    publisher: "官方B站动态",
    publishedAt: "2026-04-23",
    tier: "official",
    note: "确认 2026-04-24 起闪耀周末会提供限免精灵与最多 3 套推荐阵容，但未公开具体 6 人名单。",
  },
  news17173: {
    title: "洛克王国世界PVP阵容推荐，S1赛季有哪些强力的PK队伍？",
    url: "https://news.17173.com/content/04192026/211603677.shtml",
    publisher: "17173",
    publishedAt: "2026-04-19",
    tier: "guide",
    note: "页面明确标注为第三方 AI 提炼总结，阵容成员可参考，可信度统一标 partial。",
  },
  wywyx0424: {
    title: "洛克王国世界PVP强力阵容推荐",
    url: "https://www.wywyx.com/gonglue/560173.html",
    publisher: "玩一玩",
    publishedAt: "2026-04-24",
    tier: "guide",
  },
  sina0422: {
    title: "洛克王国 PVP最新强势阵容",
    url: "https://www.sina.cn/news/detail/5290547365548515.html",
    publisher: "新浪聚合",
    publishedAt: "2026-04-22",
    tier: "community",
    note: "聚合微博内容，只能作为社区热度与体系参考。",
  },
  biliIce0417: {
    title: "雪影受队2.5 PVP手感舒适的全新版本",
    url: "https://search.bilibili.com/all?keyword=%E9%9B%AA%E5%BD%B1%E5%8F%97%E9%98%9F2.5%20PVP",
    publisher: "B站搜索结果",
    publishedAt: "2026-04-17",
    tier: "needs-review",
    note: "搜索结果可确认发布时间与主题，具体成员仍需人工复核视频内容。",
  },
  biliGhost0419: {
    title: "PVP周免精灵第三期！减能幽灵队 配队思路+实战",
    url: "https://search.bilibili.com/all?keyword=PVP%E5%91%A8%E5%85%8D%E7%B2%BE%E7%81%B5%E7%AC%AC%E4%B8%89%E6%9C%9F%20%E5%87%8F%E8%83%BD%E5%B9%BD%E7%81%B5%E9%98%9F",
    publisher: "B站搜索结果",
    publishedAt: "2026-04-19",
    tier: "needs-review",
    note: "搜索结果可确认发布时间与主题，具体成员仍需人工复核视频内容。",
  },
  biliMaster0422: {
    title: "21连胜92%胜率最速从零速通大师阵容",
    url: "https://search.bilibili.com/all?keyword=21%E8%BF%9E%E8%83%9C92%25%E8%83%9C%E7%8E%87%E6%9C%80%E9%80%9F%E4%BB%8E%E9%9B%B6%E9%80%9F%E9%80%9A%E5%A4%A7%E5%B8%88%E9%98%B5%E5%AE%B9%20%E6%B4%9B%E5%85%8B%E7%8E%8B%E5%9B%BD%E4%B8%96%E7%95%8C",
    publisher: "B站搜索结果",
    publishedAt: "2026-04-22",
    tier: "needs-review",
    note: "搜索结果可确认雪影娃娃与松鼠为主题，完整 6 人仍需人工复核。",
  },
  biliFire0423: {
    title: "纯度火狗！大师局四回合零封",
    url: "https://search.bilibili.com/all?keyword=%E7%BA%AF%E5%BA%A6%E7%81%AB%E7%8B%97%20%E5%A4%A7%E5%B8%88%E5%B1%80%E5%9B%9B%E5%9B%9E%E5%90%88%E9%9B%B6%E5%B0%81%20%E6%B4%9B%E5%85%8B%E7%8E%8B%E5%9B%BD",
    publisher: "B站搜索结果",
    publishedAt: "2026-04-23",
    tier: "needs-review",
    note: "搜索结果可确认火狗速攻主题，完整 6 人仍需人工复核。",
  },
} satisfies Record<string, PvpSource>;

const archivedSources = {
  ali0324: {
    title: "洛克王国世界PVP精灵配队攻略",
    url: "https://app.ali213.net/gl/1756863.html",
    publisher: "游侠手游",
    publishedAt: "2026-03-24",
    tier: "guide",
  },
  ali0401: {
    title: "洛克王国世界pvp最强阵容搭配推荐",
    url: "https://app.ali213.net/gl/1759313.html",
    publisher: "游侠手游",
    publishedAt: "2026-04-01",
    tier: "guide",
  },
  ld0407: {
    title: "洛克王国世界PVP阵容怎么搭配",
    url: "https://www.ldmnq.com/6190/zixun/1048609.html",
    publisher: "雷电模拟器",
    publishedAt: "2026-04-07",
    tier: "guide",
  },
} satisfies Record<string, PvpSource>;

const wikiImageUrl = (name: string) =>
  `https://wiki.biligame.com/rocom/${encodeURIComponent(`文件:页面 宠物 立绘 ${name} 1.png`)}`;

const moves = (sourceBasis: "source-derived" | "analysis-derived", ...names: string[]): PvpMove[] =>
  names.map((name) => ({
    name,
    sourceBasis,
  }));

const natureFor = (role: string) => {
  if (role.includes("承伤") || role.includes("前排")) {
    return { value: "大胆 / 沉着", sourceBasis: "analysis-derived" as const, reason: "按承伤定位推导，优先提升防御或魔防。" };
  }
  if (role.includes("控制") || role.includes("辅助") || role.includes("控场") || role.includes("减能")) {
    return { value: "胆小 / 开朗", sourceBasis: "analysis-derived" as const, reason: "按辅助控场定位推导，优先速度保证先手节奏。" };
  }
  if (role.includes("魔攻")) {
    return { value: "保守 / 胆小", sourceBasis: "analysis-derived" as const, reason: "按魔攻输出定位推导，优先魔攻或速度。" };
  }
  return { value: "固执 / 开朗", sourceBasis: "analysis-derived" as const, reason: "按物攻输出定位推导，优先物攻或速度。" };
};

const talentFor = (role: string) => {
  if (role.includes("承伤") || role.includes("前排")) {
    return { priority: ["生命", "物防", "魔防"], sourceBasis: "analysis-derived" as const, reason: "承伤位优先耐久三项。" };
  }
  if (role.includes("控制") || role.includes("辅助") || role.includes("控场") || role.includes("减能")) {
    return { priority: ["速度", "生命", "双防"], sourceBasis: "analysis-derived" as const, reason: "辅助控场位优先出手与生存。" };
  }
  if (role.includes("魔攻")) {
    return { priority: ["速度", "魔攻", "生命"], sourceBasis: "analysis-derived" as const, reason: "魔攻位优先速度与魔攻。" };
  }
  return { priority: ["速度", "物攻", "生命"], sourceBasis: "analysis-derived" as const, reason: "物攻位优先速度与物攻。" };
};

const member = (
  name: string,
  role: string,
  moveNames: string[],
  note?: string,
  imageName = name,
  moveBasis: "source-derived" | "analysis-derived" = "analysis-derived",
) => ({
  name,
  image: `/images/pvp/${imageName}.png`,
  imageSourceUrl: wikiImageUrl(imageName),
  imageReviewStatus: "needs-review" as const,
  role,
  moves: moves(moveBasis, ...moveNames),
  nature: natureFor(role),
  talent: talentFor(role),
  note,
});

const currentTeam = (team: Omit<PvpTeam, "metaDate" | "sourceFreshness" | "verifiedAfter" | "analysisDisclaimer">): PvpTeam => ({
  ...team,
  metaDate: META_DATE,
  sourceFreshness: "current",
  verifiedAfter: VERIFIED_AFTER,
  analysisDisclaimer: ANALYSIS_DISCLAIMER,
});

const archivedTeam = (team: Omit<PvpTeam, "metaDate" | "sourceFreshness" | "verifiedAfter" | "analysisDisclaimer" | "lineupCompleteness" | "sourceTier">): PvpTeam => ({
  ...team,
  metaDate: META_DATE,
  sourceFreshness: "archived",
  verifiedAfter: "未采用，来源早于 2026-04-15",
  sourceTier: "guide",
  lineupCompleteness: "complete",
  analysisDisclaimer: "历史阵容仅作旧版本参考，不参与当前 META 统计。",
});

const burstMembers = [
  member("翠顶夫人", "全队增益辅助", ["暴击增益", "伤害增幅", "命中增益", "续航支援"]),
  member("独角兽", "光系爆发核心", ["折射", "光翼爆发", "续航强化", "收割"]),
  member("化蝶", "续航减伤辅助", ["减速", "回血", "减伤", "奉献"]),
  member("红绒十字", "控制补伤", ["眩晕", "破甲", "补伤", "干扰"]),
  member("尖嘴狐仙", "火冰双系收割", ["火系压制", "冰系补盲", "残血收割", "换入反打"]),
  member("帕帕斯卡", "拦截破甲", ["拦截", "破甲", "草系反制", "补输出"]),
];

export const pvpTeams: PvpTeam[] = [
  currentTeam({
    id: "wywyx-burst-buff-0424",
    name: "爆发增益流",
    strength: "T0",
    archetype: "爆发",
    suitableFor: "想用高速增益和独角兽爆发快速结束战斗的玩家",
    summary: "玩一玩 4月24日推荐的速战速决阵容，核心是翠顶夫人叠全队增益后让独角兽与副输出完成清场。",
    playstyle: ["翠顶夫人先手开增益", "独角兽承担主要爆发", "化蝶稳血线，红绒十字和帕帕斯卡补控制与破甲"],
    counters: ["慢速队", "缺少净化的冰控队", "虫队"],
    risks: ["内战高度依赖速度", "被高强度驱散或反控会掉节奏"],
    members: burstMembers,
    sources: [sources.wywyx0424],
    confidence: "partial",
    sourceTier: "guide",
    lineupCompleteness: "complete",
    sourceConflict: "17173 同体系第 6 位使用黑猫巫师；本站保留为另一套变体，不合并。",
  }),
  currentTeam({
    id: "news17173-black-cat-burst-0419",
    name: "黑猫白金爆发队",
    strength: "T0",
    archetype: "爆发",
    suitableFor: "偏好黑猫巫师首发压血和白金独角兽续航爆发的玩家",
    summary: "17173 4月19日给出的增益爆发变体，使用黑猫巫师作为首发压制点。",
    playstyle: ["黑猫巫师首发压低关键目标", "翠顶夫人进场开全队增益", "首领白金独角兽叠加折射与续航"],
    counters: ["毒队", "冰队", "虫队"],
    risks: ["来源页面标注为 AI 提炼总结", "黑猫巫师与独角兽速度线需要实战复核"],
    members: [
      member("首领白金独角兽", "光系爆发核心", ["折射", "光翼爆发", "续航强化", "收割"], "来源写作首领白金独角兽，立绘暂用独角兽。", "独角兽"),
      member("翠顶夫人", "全队增益辅助", ["暴击增益", "伤害增幅", "命中增益", "续航支援"]),
      member("化蝶", "续航减伤辅助", ["减速", "回血", "减伤", "奉献"]),
      member("红绒十字", "控制补伤", ["眩晕", "破甲", "补伤", "干扰"]),
      member("帕帕斯卡", "拦截破甲", ["拦截", "破甲", "草系反制", "补输出"]),
      member("黑猫巫师", "首发魔攻压制", ["魔能爆", "彗星", "自保反杀", "压低脆皮"]),
    ],
    sources: [sources.news17173],
    confidence: "partial",
    sourceTier: "guide",
    lineupCompleteness: "complete",
    sourceConflict: "与玩一玩 4月24日爆发增益流成员不同，黑猫巫师替换尖嘴狐仙。",
  }),
  currentTeam({
    id: "wywyx-ice-control-0424",
    name: "冰控冻结流",
    strength: "T0",
    archetype: "冰控",
    suitableFor: "想用冻结链控场、容错较高的玩家",
    summary: "玩一玩 4月24日推荐的冰控队，雪影娃娃主控冻结，冰钻布鲁斯和圣代甜甜提供稳定冻结链。",
    playstyle: ["圣代甜甜和冰钻布鲁斯建立冻结节奏", "雪影娃娃持续控场", "尖嘴狐仙补火伤反制草系，化蝶提供解控续航"],
    counters: ["慢速高坦队", "缺少解控的爆发队"],
    risks: ["怕高解控阵容", "遇到地系与高抗性队伍需要频繁换位"],
    members: [
      member("雪影娃娃", "冻结控场核心", ["高概率冰冻", "冰系压制", "控场续航", "残血收割"]),
      member("冰钻布鲁斯", "冰系承伤控场", ["寒霜护盾", "加固", "冻结封锁", "连击压制"]),
      member("圣代甜甜", "首发冻结辅助", ["双层冰冻", "削弱", "冰系接力", "控场开局"]),
      member("雪巨人", "群体冰冻 / 承伤", ["群体冻结", "承伤", "冰系压制", "保护核心"]),
      member("尖嘴狐仙", "火冰补盲收割", ["火系压制", "冰系补盲", "残血收割", "换入反打"]),
      member("化蝶", "解控续航", ["解控", "回血", "减伤", "奉献"]),
    ],
    sources: [sources.wywyx0424],
    confidence: "partial",
    sourceTier: "guide",
    lineupCompleteness: "complete",
    sourceConflict: "17173 同体系第 5 位使用帅帅魔偶；本站保留为另一套变体。",
  }),
  currentTeam({
    id: "news17173-freeze-puppet-0419",
    name: "冻结控场流",
    strength: "T0",
    archetype: "冰控",
    suitableFor: "喜欢稳定控场、靠连续冻结剥夺行动的玩家",
    summary: "17173 4月19日给出的冰控变体，加入帅帅魔偶提高复制技能与反制能力。",
    playstyle: ["圣代甜甜首发叠冻结", "冰钻布鲁斯提高控场命中与承伤", "帅帅魔偶复制关键技能补控"],
    counters: ["非地系阵容", "爆发流"],
    risks: ["怕高解控队", "来源页面标注为 AI 提炼总结"],
    members: [
      member("圣代甜甜", "首发冻结辅助", ["双层冰冻", "削弱", "冰系接力", "控场开局"]),
      member("冰钻布鲁斯", "冰系承伤控场", ["寒霜护盾", "加固", "冻结封锁", "连击压制"]),
      member("雪影娃娃", "冻结控场核心", ["高概率冰冻", "冰系压制", "控场续航", "残血收割"]),
      member("雪巨人", "群体冰冻 / 承伤", ["群体冻结", "承伤", "冰系压制", "保护核心"]),
      member("帅帅魔偶", "复制技能 / 反制", ["技能复制", "摄魂", "节奏干扰", "补控"]),
      member("尖嘴狐仙", "火冰补盲收割", ["火系压制", "冰系补盲", "残血收割", "换入反打"]),
    ],
    sources: [sources.news17173],
    confidence: "partial",
    sourceTier: "guide",
    lineupCompleteness: "complete",
    sourceConflict: "与玩一玩 4月24日冰控冻结流成员不同，帅帅魔偶替换化蝶。",
  }),
  currentTeam({
    id: "news17173-starfall-0419",
    name: "星陨印记流",
    strength: "T0",
    archetype: "星陨",
    suitableFor: "喜欢叠层后爆发击穿坦克的玩家",
    summary: "17173 4月19日给出的星陨队，核心是叠星陨印记并在高层数时引爆收割。",
    playstyle: ["落陨星兔负责叠印记", "小皮球传递印记", "怖哭菇引爆收割，秩序鱿墨协防"],
    counters: ["毒队", "坦克队"],
    risks: ["怕幻系规避印记", "叠层窗口被打断会明显降速"],
    members: [
      member("落陨星兔", "星陨叠层核心", ["星陨印记", "叠层", "爆发铺垫", "收割"]),
      member("小皮球", "印记传递辅助", ["传递印记", "保护核心", "节奏支援", "换位辅助"]),
      member("怖哭菇", "引爆收割", ["引爆印记", "残局收割", "幽系压制", "补伤害"]),
      member("秩序鱿墨", "协防干扰", ["协防", "控场", "幽萌补盲", "保护核心"]),
      member("音速犬", "高速补伤", ["火系补伤", "高速收割", "压低血线", "反草虫"]),
      member("坟场搏击手", "武系拦截", ["武系拦截", "近战压制", "保护后排", "残局补刀"], "本地立绘未能稳定匹配，暂用待复核占位图。", "待复核占位"),
    ],
    sources: [sources.news17173],
    confidence: "partial",
    sourceTier: "guide",
    lineupCompleteness: "complete",
  }),
  currentTeam({
    id: "news17173-poison-0419",
    name: "毒伤持续流",
    strength: "T1",
    archetype: "毒伤",
    suitableFor: "偏好挂毒、控场、消耗取胜的玩家",
    summary: "17173 4月19日给出的毒伤队，靠千棘盔和琉璃水母持续挂毒，厉毒修萝负责收割。",
    playstyle: ["千棘盔与琉璃水母持续挂毒", "迷迷箱怪叠印记，声波缇塔控场", "厉毒修萝在中后期收割"],
    counters: ["续航流", "脆皮队"],
    risks: ["怕星陨队", "怕高净化阵容"],
    members: [
      member("千棘盔", "挂毒前排", ["毒伤铺垫", "承伤", "尖刺压制", "保护后排"]),
      member("琉璃水母", "挂毒辅助", ["挂毒", "水系牵制", "消耗", "换位支援"]),
      member("厉毒修萝", "毒系收割", ["毒伤引爆", "收割", "持续压血", "补刀"]),
      member("迷迷箱怪", "印记干扰", ["叠印记", "干扰", "控场", "续航牵制"]),
      member("声波缇塔", "控场辅助", ["声波控场", "减速", "节奏干扰", "保护核心"]),
      member("画间沉铁兽", "武系拦截", ["拦截武系", "承伤", "反打", "保护毒核"], "来源写作画间沉铁兽，立绘暂用沉铁兽。", "沉铁兽"),
    ],
    sources: [sources.news17173],
    confidence: "partial",
    sourceTier: "guide",
    lineupCompleteness: "complete",
  }),
  currentTeam({
    id: "wywyx-balance-counter-0424",
    name: "均衡反制流",
    strength: "T1",
    archetype: "平衡",
    suitableFor: "想用坦、控、续航、异常状态应对复杂环境的玩家",
    summary: "玩一玩 4月24日给出 5 名核心，本站补入化蝶作为第 6 位续航补位，并明确标记为分析扩展。",
    playstyle: ["罗隐与火神负责主输出", "奇丽花承伤控场，嘟嘟锅持续挂毒", "薪燃虫补能与灼烧，化蝶提供续航"],
    counters: ["爆发队", "控场队"],
    risks: ["第 6 位非来源原文", "输出速度线不如纯速攻队"],
    members: [
      member("罗隐", "物攻吸血核心", ["吸血", "恶石压制", "站场强化", "反制坦克"]),
      member("奇丽花", "草系前排承伤", ["嘲讽", "回血", "草系承伤", "控场"]),
      member("火神", "火系魔攻压场", ["流星火雨", "火轮车", "点燃", "火系AOE"]),
      member("薪燃虫", "灼烧 / 回能", ["灼烧递增", "回能", "火草补盲", "辅助压血"]),
      member("嘟嘟锅", "挂毒消耗", ["挂毒", "持续掉血", "消耗", "干扰"]),
      member("化蝶", "本站分析补位", ["解控", "回血", "减伤", "奉献"], "玩一玩原文仅列出 5 名成员；此位为本站按续航需求补位。"),
    ],
    sources: [sources.wywyx0424],
    confidence: "partial",
    sourceTier: "guide",
    lineupCompleteness: "analysis-expanded",
    sourceConflict: "原文只列出 5 名成员，化蝶为本站分析补位，需后续实战来源确认。",
  }),
  currentTeam({
    id: "bili-snow-stall-0417",
    name: "雪影受队2.5",
    strength: "T1",
    archetype: "冰控",
    suitableFor: "偏好大师局高容错受队和冰控反打的玩家",
    summary: "4月17日后社区实战视频主题显示雪影受队仍在更新；完整成员需要人工复核，因此当前按已知冰控受队框架分析扩展。",
    playstyle: ["雪影娃娃与冰钻布鲁斯建立冻结压力", "瞌睡王和雪巨人承担耐久", "独角兽与寂灭骨龙提供反打窗口"],
    counters: ["短爆发队", "缺少解控的中速队"],
    risks: ["成员来自社区视频主题扩展，需复核视频正文", "对局时间偏长"],
    members: [
      member("雪影娃娃", "冻结控场核心", ["高概率冰冻", "冰系压制", "控场续航", "残血收割"]),
      member("冰钻布鲁斯", "冰系承伤控场", ["寒霜护盾", "加固", "冻结封锁", "连击压制"]),
      member("瞌睡王", "高耐久承伤", ["承伤", "反打", "拖节奏", "保护核心"]),
      member("雪巨人", "群体冰冻 / 承伤", ["群体冻结", "承伤", "冰系压制", "保护核心"]),
      member("独角兽", "光系反打核心", ["折射", "光翼爆发", "续航强化", "收割"]),
      member("寂灭骨龙", "联防反打", ["龙吼", "隼鳞", "风墙", "坟场搏击"]),
    ],
    sources: [sources.biliIce0417],
    confidence: "partial",
    sourceTier: "needs-review",
    lineupCompleteness: "analysis-expanded",
    sourceConflict: "B站搜索结果只确认主题与日期，完整 6 人为本站按冰控受队框架补齐。",
  }),
  currentTeam({
    id: "bili-energy-ghost-0419",
    name: "减能幽灵队",
    strength: "T1",
    archetype: "减能",
    suitableFor: "想用幽灵系减能、控场和换宠惩罚打乱对手节奏的玩家",
    summary: "4月19日社区视频主题为减能幽灵队；当前以幽灵减能框架分析扩展，等待逐帧核验。",
    playstyle: ["夜枭与梦悠悠进行幽灵压制", "花影羚羊和寂灭骨龙提供反打", "帕帕斯卡和兽花蕾补足破甲与续航"],
    counters: ["高费爆发队", "缺少净化的慢速队"],
    risks: ["完整成员需复核视频", "遇到高速度光系爆发风险较高"],
    members: [
      member("夜枭", "幽灵减能核心", ["减能", "幽灵压制", "干扰", "收割"]),
      member("梦悠悠", "幽灵辅助", ["催眠", "消耗", "幽灵补盲", "保护核心"]),
      member("花影羚羊", "高速反打", ["啮合", "强化", "机械反制", "高速收割"]),
      member("寂灭骨龙", "联防反打", ["龙吼", "隼鳞", "风墙", "坟场搏击"]),
      member("帕帕斯卡", "拦截破甲", ["拦截", "破甲", "草系反制", "补输出"]),
      member("兽花蕾", "续航辅助", ["回血", "草系控场", "保护后排", "消耗"]),
    ],
    sources: [sources.biliGhost0419],
    confidence: "partial",
    sourceTier: "needs-review",
    lineupCompleteness: "analysis-expanded",
    sourceConflict: "社区视频搜索结果未公开完整名单，6 人为本站按减能幽灵思路补齐。",
  }),
  currentTeam({
    id: "bili-fire-dog-0423",
    name: "火狗速攻队",
    strength: "T1",
    archetype: "速攻",
    suitableFor: "偏好大师局短回合压制、用火狗打开突破口的玩家",
    summary: "4月23日社区视频主题强调火狗大师局速攻；当前以火狗速攻框架分析扩展。",
    playstyle: ["音速犬作为火狗承担抢速和压血", "恶魔狼与独角兽接力爆发", "红绒十字、尖嘴狐仙和帕帕斯卡补控制与破甲"],
    counters: ["脆皮队", "慢速无先手队"],
    risks: ["完整成员需复核视频", "被高耐久受队拖住后容错下降"],
    members: [
      member("音速犬", "高速火系突破", ["火系补伤", "高速收割", "压低血线", "反草虫"]),
      member("恶魔狼", "恶系爆发核心", ["恶系爆发", "残局强化", "追击", "收割"]),
      member("独角兽", "光系爆发核心", ["折射", "光翼爆发", "续航强化", "收割"]),
      member("红绒十字", "控制补伤", ["眩晕", "破甲", "补伤", "干扰"]),
      member("尖嘴狐仙", "火冰补盲收割", ["火系压制", "冰系补盲", "残血收割", "换入反打"]),
      member("帕帕斯卡", "拦截破甲", ["拦截", "破甲", "草系反制", "补输出"]),
    ],
    sources: [sources.biliFire0423],
    confidence: "partial",
    sourceTier: "needs-review",
    lineupCompleteness: "analysis-expanded",
    sourceConflict: "社区视频搜索结果未公开完整名单，6 人为本站按火狗速攻思路补齐。",
  }),
];

export const archivedPvpTeams: PvpTeam[] = [
  archivedTeam({
    id: "archived-national-core",
    name: "国家队（旧版参考）",
    strength: "T0",
    archetype: "全能",
    suitableFor: "历史参考，不作为 4月15日后 META",
    summary: "早期公测攻略中的多核标准队，默认不再展示为当前版本答案。",
    playstyle: ["骨龙和翼王轮转", "泥吼牙控场", "火神与疾光千兽收割"],
    counters: ["慢速队"],
    risks: ["来源早于 2026-04-15"],
    members: [
      member("寂灭骨龙", "核心联防 / 物攻", ["隼鳞", "龙吼", "风墙", "坟场搏击"]),
      member("古卷执政官", "辅助控场", ["许愿星", "虹光冲击", "无畏之心", "有效防御"]),
      member("圣羽翼王", "高速魔攻核心", ["羽化加速", "虹光冲击", "回旋风暴", "魔法增效"]),
      member("泥吼牙", "控场辅助", ["落石", "倾泻", "鸣沙陷阱", "羽化加速"]),
      member("火神", "火系魔攻收割", ["流星火雨", "力量增效", "火轮车", "吹火"]),
      member("疾光千兽", "高速物攻收割", ["羽化加速", "无影脚", "光刃", "三股作气"]),
    ],
    sources: [archivedSources.ali0324],
    confidence: "partial",
  }),
  archivedTeam({
    id: "archived-ice-team",
    name: "冰队（旧版参考）",
    strength: "T0",
    archetype: "冰控",
    suitableFor: "历史参考，不作为 4月15日后 META",
    summary: "早期攻略中的冰控队，已被 4月19日与 4月24日资料拆分为不同变体。",
    playstyle: ["雪影娃娃控场", "雪巨人承伤", "尖嘴狐仙收割"],
    counters: ["慢速队"],
    risks: ["来源早于 2026-04-15"],
    members: [
      member("雪影娃娃", "冻结控场核心", ["高概率冰冻", "冰系压制", "控场续航", "残血收割"]),
      member("嗜波螺", "水系辅助", ["水系压制", "承伤", "控场", "保护核心"]),
      member("雪巨人", "群体冰冻 / 承伤", ["群体冻结", "承伤", "冰系压制", "保护核心"]),
      member("尖嘴狐仙", "火冰补盲收割", ["火系压制", "冰系补盲", "残血收割", "换入反打"]),
      member("帕帕斯卡", "拦截破甲", ["拦截", "破甲", "草系反制", "补输出"]),
      member("圣代甜甜", "首发冻结辅助", ["双层冰冻", "削弱", "冰系接力", "控场开局"]),
    ],
    sources: [archivedSources.ali0401, archivedSources.ld0407],
    confidence: "partial",
  }),
];
