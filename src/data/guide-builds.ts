import { creatures } from "@/data/creatures";
import { pvpTeams } from "@/data/pvp-teams";
import type { Creature, CreatureAttribute } from "@/types/creature";
import type { PvpTeam, PvpTeamMember, SourceTier } from "@/types/pvp-team";
import type { GuideCreatureBuild, GuideListField, GuideSource, GuideSourceBasis, GuideTextField, GuideTier } from "@/types/guide";

const UNRATED: GuideTier = "未评级";
const BWIKI_LIST_SOURCE = "https://wiki.biligame.com/rocom/%E7%B2%BE%E7%81%B5%E5%9B%BE%E9%89%B4";
const PLACEHOLDER_IMAGE = "/images/creatures/placeholder.svg";

const unknownText = (field: string): GuideTextField => ({
  value: "待复核",
  sourceBasis: "unknown",
  reason: `${field}缺少可靠公开培养资料，暂不推断。`,
});

const unknownList = (field: string): GuideListField => ({
  values: ["待复核"],
  sourceBasis: "unknown",
  reason: `${field}缺少可靠公开培养资料，暂不推断。`,
});

const fieldFromText = (value: string, sourceBasis: GuideSourceBasis, reason: string): GuideTextField => ({
  value,
  sourceBasis,
  reason,
});

const fieldFromList = (values: string[], sourceBasis: GuideSourceBasis, reason: string): GuideListField => ({
  values: values.length > 0 ? values : ["待复核"],
  sourceBasis,
  reason,
});

const sourceTierKind = (tier: SourceTier): GuideSource["kind"] => {
  if (tier === "official") return "guide";
  if (tier === "community" || tier === "needs-review") return "community";
  return "guide";
};

const pvpTierFromStrength = (strength: PvpTeam["strength"]): GuideTier => {
  if (strength === "T0") return "S";
  if (strength === "T1") return "A";
  return "B";
};

const rankValue: Record<GuideTier, number> = {
  S: 5,
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  未评级: 0,
};

const betterTier = (current: GuideTier, candidate: GuideTier) =>
  rankValue[candidate] > rankValue[current] ? candidate : current;

const imageFilePageUrl = (name: string) =>
  `https://wiki.biligame.com/rocom/${encodeURIComponent(`文件:页面 宠物 立绘 ${name} 1.png`)}`;

const toGuideSources = (team: PvpTeam): GuideSource[] =>
  team.sources.map((source) => ({
    title: source.title,
    url: source.url,
    kind: sourceTierKind(source.tier),
    publisher: source.publisher,
    publishedAt: source.publishedAt,
    note: source.note,
  }));

const creatureSources = (creature: Creature): GuideSource[] =>
  creature.sources.map((source) => ({
    title: source.title,
    url: source.url,
    kind: "bwiki",
    note: source.note,
  }));

const roleTokens = (role: string) => {
  const roles = new Set<string>([role]);
  if (role.includes("控场") || role.includes("冻结") || role.includes("控制")) roles.add("控场");
  if (role.includes("辅助") || role.includes("支援") || role.includes("续航")) roles.add("辅助");
  if (role.includes("承伤") || role.includes("前排") || role.includes("耐久")) roles.add("承伤");
  if (role.includes("爆发") || role.includes("收割") || role.includes("输出") || role.includes("压制")) roles.add("输出");
  if (role.includes("减能")) roles.add("减能");
  if (role.includes("挂毒") || role.includes("毒")) roles.add("毒伤");
  if (role.includes("拦截") || role.includes("破甲")) roles.add("破甲");
  return Array.from(roles);
};

const pvpAttributeOverrides = {
  冰钻布鲁斯: ["冰", "水"],
  怖哭菇: ["幽", "草"],
  翠顶夫人: ["草"],
  嘟嘟锅: ["毒"],
  独角兽: ["光"],
  恶魔狼: ["恶"],
  坟场搏击手: ["武"],
  古卷执政官: ["光"],
  黑猫巫师: ["普通"],
  红绒十字: ["普通"],
  画间沉铁兽: ["武"],
  疾光千兽: ["光"],
  寂灭骨龙: ["龙", "幽"],
  尖嘴狐仙: ["火", "冰"],
  瞌睡王: ["普通"],
  厉毒修萝: ["毒"],
  琉璃水母: ["水", "毒"],
  罗隐: ["恶", "地"],
  落陨星兔: ["萌"],
  梦悠悠: ["幽"],
  迷迷箱怪: ["幽", "萌"],
  泥吼牙: ["地"],
  帕帕斯卡: ["草"],
  千棘盔: ["水", "毒"],
  声波缇塔: ["萌"],
  圣代甜甜: ["冰"],
  圣羽翼王: ["翼", "光"],
  嗜波螺: ["水"],
  首领白金独角兽: ["光"],
  兽花蕾: ["草"],
  帅帅魔偶: ["幽"],
  小皮球: ["萌"],
  薪燃虫: ["火", "草"],
  雪巨人: ["冰"],
  雪影娃娃: ["冰", "萌"],
  夜枭: ["幽", "翼"],
  秩序鱿墨: ["幽", "萌"],
} satisfies Record<string, CreatureAttribute[]>;

const fallbackAttributes = (name: string): CreatureAttribute[] =>
  pvpAttributeOverrides[name as keyof typeof pvpAttributeOverrides] ?? ["普通"];

const buildFromCreature = (creature: Creature): GuideCreatureBuild => {
  const primaryForm = creature.forms[0];

  return {
    id: `creature-${creature.id}`,
    dexId: creature.id,
    name: creature.name,
    formName: primaryForm?.name === creature.name ? undefined : primaryForm?.name,
    image: primaryForm?.image ?? PLACEHOLDER_IMAGE,
    imageSourceUrl: primaryForm?.imageSourceUrl ?? imageFilePageUrl(creature.name),
    imageReviewStatus: primaryForm?.imageReviewStatus ?? "needs-review",
    attributes: creature.attributes,
    pveTier: UNRATED,
    pvpTier: UNRATED,
    roles: ["待复核"],
    scenes: ["PVE待复核", "PVP待复核"],
    nature: unknownText("性格"),
    talent: unknownList("天分"),
    moves: unknownList("配招"),
    buildNotes: ["当前仅确认图鉴基础资料；培养攻略等待可靠来源。"],
    recommendedTeams: [],
    counters: [],
    risks: [],
    sources: creatureSources(creature),
    confidence: "unknown",
    updatedAt: creature.updatedAt,
    reviewNotes: ["待复核：缺少可靠培养资料，暂不评级。"],
    analysisNote: "",
  };
};

const findCreatureByName = (name: string): Creature | undefined =>
  creatures.find((c) => c.name === name || (name === "薪燃虫" && c.name === "燃薪虫"));

const buildFromPvpMember = (member: PvpTeamMember, team: PvpTeam): GuideCreatureBuild => {
  const matchedCreature = findCreatureByName(member.name);

  return {
  id: matchedCreature ? `creature-${matchedCreature.id}` : `pvp-${member.name}`,
  dexId: matchedCreature ? matchedCreature.id : "待复核",
  name: member.name,
  image: member.image,
  imageSourceUrl: member.imageSourceUrl,
  imageReviewStatus: member.imageReviewStatus,
  attributes: fallbackAttributes(member.name),
  pveTier: UNRATED,
  pvpTier: pvpTierFromStrength(team.strength),
  roles: roleTokens(member.role),
  scenes: ["PVP", team.archetype, team.name],
  nature: fieldFromText(member.nature.value, member.nature.sourceBasis, member.nature.reason),
  talent: fieldFromList(member.talent.priority, member.talent.sourceBasis, member.talent.reason),
  moves: fieldFromList(
    member.moves.map((move) => move.name),
    member.moves.some((move) => move.sourceBasis === "source-derived") ? "source-derived" : "analysis-derived",
    "配招整理自现有 PVP 阵容页；未逐条核验为来源原文时按本站分析标记。",
  ),
  buildNotes: [member.note ?? team.summary],
  recommendedTeams: [team.name],
  counters: team.counters,
  risks: team.risks,
  sources: toGuideSources(team),
  confidence: team.lineupCompleteness === "complete" && team.sourceTier !== "needs-review" ? "partial" : "analysis",
  updatedAt: team.metaDate,
  reviewNotes: team.sourceConflict ? [`待复核：${team.sourceConflict}`] : [],
  analysisNote: "本站分析：性格、天分与部分配招来自阵容定位推导，不等同于来源原文。",
};
};

const mergeBuild = (target: GuideCreatureBuild, incoming: GuideCreatureBuild): GuideCreatureBuild => {
  const sourceUrls = new Set(target.sources.map((source) => source.url));
  const sources = [
    ...target.sources,
    ...incoming.sources.filter((source) => {
      if (sourceUrls.has(source.url)) return false;
      sourceUrls.add(source.url);
      return true;
    }),
  ];

  const pvpTier = betterTier(target.pvpTier, incoming.pvpTier);
  const hasPvpBuild = incoming.pvpTier !== UNRATED;

  return {
    ...target,
    image: hasPvpBuild ? incoming.image : target.image,
    imageSourceUrl: hasPvpBuild ? incoming.imageSourceUrl : target.imageSourceUrl,
    attributes: Array.from(new Set([...target.attributes, ...incoming.attributes])),
    pvpTier,
    roles: Array.from(new Set([...(hasPvpBuild ? [] : target.roles), ...incoming.roles])).filter((role) => role !== "待复核" || !hasPvpBuild),
    scenes: Array.from(new Set([...target.scenes, ...incoming.scenes])),
    nature: hasPvpBuild ? incoming.nature : target.nature,
    talent: hasPvpBuild ? incoming.talent : target.talent,
    moves: hasPvpBuild ? incoming.moves : target.moves,
    buildNotes: Array.from(new Set([...target.buildNotes, ...incoming.buildNotes])),
    recommendedTeams: Array.from(new Set([...target.recommendedTeams, ...incoming.recommendedTeams])),
    counters: Array.from(new Set([...target.counters, ...incoming.counters])),
    risks: Array.from(new Set([...target.risks, ...incoming.risks])),
    sources,
    confidence: hasPvpBuild ? incoming.confidence : target.confidence,
    updatedAt: incoming.updatedAt > target.updatedAt ? incoming.updatedAt : target.updatedAt,
    reviewNotes: Array.from(new Set([...target.reviewNotes.filter((note) => !hasPvpBuild || !note.includes("缺少可靠培养资料")), ...incoming.reviewNotes])),
    analysisNote: hasPvpBuild ? incoming.analysisNote : target.analysisNote,
  };
};

const guideBuildMap = new Map<string, GuideCreatureBuild>();

creatures.forEach((creature) => {
  guideBuildMap.set(creature.name, buildFromCreature(creature));
});

pvpTeams.forEach((team) => {
  team.members.forEach((member) => {
    const incoming = buildFromPvpMember(member, team);
    const current = guideBuildMap.get(member.name);
    guideBuildMap.set(member.name, current ? mergeBuild(current, incoming) : incoming);
  });
});

export const guideBuilds: GuideCreatureBuild[] = Array.from(guideBuildMap.values()).sort((a, b) => {
  const dexCompare = a.dexId.localeCompare(b.dexId, "zh-Hans-CN", { numeric: true });
  if (dexCompare !== 0) return dexCompare;
  return a.name.localeCompare(b.name, "zh-Hans-CN");
});

export const guideSourceUrls = {
  bwikiList: BWIKI_LIST_SOURCE,
  pvpMeta: "/pvp-teams",
};
