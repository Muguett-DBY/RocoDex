import type { Creature } from "@/types/creature";

// ===== 6 维度定义 =====

export const dimensions = [
  { key: "battle" as const, label: "战斗倾向", left: "速战快攻", right: "持久消耗", emoji: "⚔️" },
  { key: "range" as const, label: "战斗距离", left: "近身猛攻", right: "远程智取", emoji: "🎯" },
  { key: "explore" as const, label: "冒险态度", left: "开拓探索", right: "守护安逸", emoji: "🗺️" },
  { key: "social" as const, label: "社交倾向", left: "独行猛兽", right: "团队协作", emoji: "🤝" },
  { key: "raise" as const, label: "培育理念", left: "天赋觉醒", right: "刻苦训练", emoji: "📖" },
  { key: "aesthetic" as const, label: "审美取向", left: "华丽闪耀", right: "自然朴实", emoji: "✨" },
];

export type DimensionKey = (typeof dimensions)[number]["key"];
export type DimensionScores = Record<DimensionKey, number>;

// ===== 24 题 =====

export interface RktiQuestion {
  id: number;
  text: string;
  dimension: DimensionKey;
  options: {
    text: string;
    scores: DimensionScores;
  }[];
}

export const questions: RktiQuestion[] = [
  // ---------- 战斗倾向 (1-4) ----------
  {
    id: 1,
    text: "在野外探索时，一只野生精灵突然从草丛里跳了出来。你低头看了看腰间唯一的精灵球，心里想的是——",
    dimension: "battle",
    options: [
      { text: "属性克制在手，一个技能就能解决它。", scores: { battle: 2, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "先试探一下它的实力，摸清技能再出手。", scores: { battle: -1, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "直接开战，速战速决不拖沓。", scores: { battle: 1, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "不急，绕到它背后看看有没有更好的出手角度。", scores: { battle: -2, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 2,
    text: "在PVP对战中，你最喜欢的战斗节奏是什么样的？",
    dimension: "battle",
    options: [
      { text: "前三个回合定胜负，一波带走对面核心。", scores: { battle: 2, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "喜欢中速节奏，攻守兼备稳扎稳打。", scores: { battle: -1, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "开局抢速，压制对手先手权。", scores: { battle: 1, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "慢慢磨，用消耗和控制把对手拖入我的节奏。", scores: { battle: -2, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 3,
    text: "你的主力精灵刚刚学会了一个高能耗大招。你会如何使用它？",
    dimension: "battle",
    options: [
      { text: "作为终结技，省着能量到关键时刻一击定胜负。", scores: { battle: 2, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "看情况，能早用就早用，打出压制效果更重要。", scores: { battle: -1, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "搭配回能技能，争取多用几次。", scores: { battle: 1, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "慢慢攒能量，等对手露出破绽再全开。", scores: { battle: -2, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 4,
    text: "你的队伍面对一个高坦度的肉盾精灵，你怎么处理？",
    dimension: "battle",
    options: [
      { text: "换克制属性的精灵，用高爆发技能快速破防。", scores: { battle: 2, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "慢慢挂毒或灼烧，用持续伤害耗死它。", scores: { battle: -2, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "用破甲技能削弱后再集火输出。", scores: { battle: 1, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "控住它，先处理对面其他精灵。", scores: { battle: -1, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
    ],
  },

  // ---------- 战斗距离 (5-8) ----------
  {
    id: 5,
    text: "你的精灵正准备释放技能。你内心希望它站在——",
    dimension: "range",
    options: [
      { text: "最前排，直面对手，拳拳到肉才叫战斗。", scores: { battle: 0, range: 3, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "中排，可进可退，灵活应变。", scores: { battle: 0, range: -1, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "后排，用远程技能安全输出。", scores: { battle: 0, range: -3, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "哪里能打出最高伤害就站哪里。", scores: { battle: 0, range: 1, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 6,
    text: "你选择主力精灵技能时，更看重什么？",
    dimension: "range",
    options: [
      { text: "物理攻击技能，朴实但威力可靠。", scores: { battle: 0, range: 3, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "魔攻技能，华丽且伤害不俗。", scores: { battle: 0, range: -3, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "控制和状态技能，不靠伤害也能赢。", scores: { battle: 0, range: -2, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "防御和回复技能，站得住才有输出。", scores: { battle: 0, range: 2, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 7,
    text: "在观赏一场PVP比赛时，最能让你热血沸腾的画面是——",
    dimension: "range",
    options: [
      { text: "精灵贴身肉搏，拳拳到肉的近战交锋。", scores: { battle: 0, range: 3, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "远程技能对轰，场面上火花四溅。", scores: { battle: 0, range: -3, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "控制技能精准打断对方节奏，以智取胜。", scores: { battle: 0, range: -1, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "防御技能完美应对，化险为夷的反制。", scores: { battle: 0, range: 1, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 8,
    text: "组队副本中，队长让你自由选择自己的战斗位置。你选——",
    dimension: "range",
    options: [
      { text: "冲锋位，顶在最前面吸收伤害。", scores: { battle: 0, range: 3, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "输出位，在安全距离倾泻伤害。", scores: { battle: 0, range: -3, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "控制位，先手控住关键目标。", scores: { battle: 0, range: -1, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
      { text: "辅助位，给同伴加增益、回血解控。", scores: { battle: 0, range: 1, explore: 0, social: 0, raise: 0, aesthetic: 0 } },
    ],
  },

  // ---------- 冒险态度 (9-12) ----------
  {
    id: 9,
    text: "你拿到了一张新的地图，上面标记了十几个未知区域。你的计划是——",
    dimension: "explore",
    options: [
      { text: "全部走一遍，不放过任何一个角落。", scores: { battle: 0, range: 0, explore: 3, social: 0, raise: 0, aesthetic: 0 } },
      { text: "先标记资源点，规划最效率的路线。", scores: { battle: 0, range: 0, explore: -1, social: 0, raise: 0, aesthetic: 0 } },
      { text: "直奔传说中可能出现稀有精灵的区域。", scores: { battle: 0, range: 0, explore: 1, social: 0, raise: 0, aesthetic: 0 } },
      { text: "在自己熟悉的区域先练级，有把握再探索新地图。", scores: { battle: 0, range: 0, explore: -3, social: 0, raise: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 10,
    text: "来到一处传闻有稀有精灵出没的秘境，但入口写着「危险」。你——",
    dimension: "explore",
    options: [
      { text: "立刻进去，机会难得。", scores: { battle: 0, range: 0, explore: 3, social: 0, raise: 0, aesthetic: 0 } },
      { text: "去补给一下，带好道具再进。", scores: { battle: 0, range: 0, explore: -1, social: 0, raise: 0, aesthetic: 0 } },
      { text: "在入口附近蹲守，看有没有人从里面出来。", scores: { battle: 0, range: 0, explore: 1, social: 0, raise: 0, aesthetic: 0 } },
      { text: "记住位置，等以后等级高了再来。", scores: { battle: 0, range: 0, explore: -3, social: 0, raise: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 11,
    text: "关于游戏中的活动任务，你的态度是——",
    dimension: "explore",
    options: [
      { text: "出新活动第一时间完成，不落下任何奖励。", scores: { battle: 0, range: 0, explore: 3, social: 0, raise: 0, aesthetic: 0 } },
      { text: "只做奖励好的活动，时间有限要精打细算。", scores: { battle: 0, range: 0, explore: -1, social: 0, raise: 0, aesthetic: 0 } },
      { text: "遇到什么做什么，随缘但不纠结。", scores: { battle: 0, range: 0, explore: 1, social: 0, raise: 0, aesthetic: 0 } },
      { text: "活动是给肝帝的，我只玩自己喜欢的。", scores: { battle: 0, range: 0, explore: -3, social: 0, raise: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 12,
    text: "你背包里的地图碎片显示着一个隐藏洞穴的位置。你决定——",
    dimension: "explore",
    options: [
      { text: "马上出发，说不定里面有传说中的精灵蛋。", scores: { battle: 0, range: 0, explore: 3, social: 0, raise: 0, aesthetic: 0 } },
      { text: "先查攻略，看好洞里有啥再决定。", scores: { battle: 0, range: 0, explore: -2, social: 0, raise: 0, aesthetic: 0 } },
      { text: "喊上两个好友一起去，有照应更安全。", scores: { battle: 0, range: 0, explore: 1, social: 0, raise: 0, aesthetic: 0 } },
      { text: "放包里攒着，等集齐更多线索再说。", scores: { battle: 0, range: 0, explore: -3, social: 0, raise: 0, aesthetic: 0 } },
    ],
  },

  // ---------- 社交倾向 (13-16) ----------
  {
    id: 13,
    text: "周末下午，你打开游戏。你最想做的事是——",
    dimension: "social",
    options: [
      { text: "一个人去野外刷稀有精灵，享受独处的乐趣。", scores: { battle: 0, range: 0, explore: 0, social: 3, raise: 0, aesthetic: 0 } },
      { text: "和朋友组队打副本，一边语音一边配合。", scores: { battle: 0, range: 0, explore: 0, social: -3, raise: 0, aesthetic: 0 } },
      { text: "去PVP匹配，靠自己的实力上分。", scores: { battle: 0, range: 0, explore: 0, social: 2, raise: 0, aesthetic: 0 } },
      { text: "在公会频道聊天吹水，帮新手回答问题。", scores: { battle: 0, range: 0, explore: 0, social: -2, raise: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 14,
    text: "关于PVP阵容，你更倾向于——",
    dimension: "social",
    options: [
      { text: "自己研究搭配，不跟风抄别人的阵容。", scores: { battle: 0, range: 0, explore: 0, social: 3, raise: 0, aesthetic: 0 } },
      { text: "参考攻略和排行榜，学习高手的思路。", scores: { battle: 0, range: 0, explore: 0, social: -1, raise: 0, aesthetic: 0 } },
      { text: "和好友一起讨论，互相测试阵容搭配。", scores: { battle: 0, range: 0, explore: 0, social: -3, raise: 0, aesthetic: 0 } },
      { text: "借鉴核心思路，但一定会加入自己的理解。", scores: { battle: 0, range: 0, explore: 0, social: 1, raise: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 15,
    text: "公会战报名开始了，你的反应是——",
    dimension: "social",
    options: [
      { text: "我不参加，一个人上分就够了。", scores: { battle: 0, range: 0, explore: 0, social: 3, raise: 0, aesthetic: 0 } },
      { text: "第一时间报名，和大家并肩作战。", scores: { battle: 0, range: 0, explore: 0, social: -3, raise: 0, aesthetic: 0 } },
      { text: "看公会缺不缺人，缺就补上。", scores: { battle: 0, range: 0, explore: 0, social: -2, raise: 0, aesthetic: 0 } },
      { text: "报名但自己打自己的，不跟团队节奏。", scores: { battle: 0, range: 0, explore: 0, social: 2, raise: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 16,
    text: "有人在大世界频道问了一个简单的新手问题，已经过了五分钟没人回复。你——",
    dimension: "social",
    options: [
      { text: "不关我的事，继续做自己的任务。", scores: { battle: 0, range: 0, explore: 0, social: 3, raise: 0, aesthetic: 0 } },
      { text: "回复他一个详细的攻略链接。", scores: { battle: 0, range: 0, explore: 0, social: -3, raise: 0, aesthetic: 0 } },
      { text: "简单回答一下，毕竟谁都是新手过来的。", scores: { battle: 0, range: 0, explore: 0, social: -2, raise: 0, aesthetic: 0 } },
      { text: "私聊他，问他要不要进我公会。", scores: { battle: 0, range: 0, explore: 0, social: -1, raise: 0, aesthetic: 0 } },
    ],
  },

  // ---------- 培育理念 (17-20) ----------
  {
    id: 17,
    text: "你获得了一颗稀有的精灵蛋。孵出来的精灵性格是「坦率」（无加成无削弱）。你——",
    dimension: "raise",
    options: [
      { text: "能用就行，性格加成不是决定性因素。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 3, aesthetic: 0 } },
      { text: "重新孵化一颗，刷到合适的性格为止。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: -3, aesthetic: 0 } },
      { text: "用性格薄荷改一下，花点资源无所谓。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: -1, aesthetic: 0 } },
      { text: "看看它的天分如何，天分好就留。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 1, aesthetic: 0 } },
    ],
  },
  {
    id: 18,
    text: "你最喜欢哪种培养精灵的方式？",
    dimension: "raise",
    options: [
      { text: "带着精灵满世界冒险，在战斗中自然成长。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 3, aesthetic: 0 } },
      { text: "喂特定的果实和道具，精确控制数值。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: -3, aesthetic: 0 } },
      { text: "找攻略，按照最优方案一步步培养。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: -2, aesthetic: 0 } },
      { text: "看精灵本身的潜力，不强求完美。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 1, aesthetic: 0 } },
    ],
  },
  {
    id: 19,
    text: "你的精灵即将进化。关于进化方式，你更希望——",
    dimension: "raise",
    options: [
      { text: "到等级自然进化，水到渠成。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 3, aesthetic: 0 } },
      { text: "喂食特殊道具进化，获得特定的形态。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: -3, aesthetic: 0 } },
      { text: "有多种进化路径可选，做出自己的选择。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: -1, aesthetic: 0 } },
      { text: "只要能进化就行，形态不重要。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 2, aesthetic: 0 } },
    ],
  },
  {
    id: 20,
    text: "你的主力精灵在PVP中遇到瓶颈了。你怎么应对？",
    dimension: "raise",
    options: [
      { text: "继续用，相信它能在实战中突破自己。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 3, aesthetic: 0 } },
      { text: "分析复盘，调整技能搭配和战术思路。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: -2, aesthetic: 0 } },
      { text: "换一只精灵重新培养，这只先放仓库。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: -3, aesthetic: 0 } },
      { text: "大量练习，堆场次提升熟练度。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: -1, aesthetic: 0 } },
    ],
  },

  // ---------- 审美取向 (21-24) ----------
  {
    id: 21,
    text: "游戏商城上架了一套限定时装。你的做法是——",
    dimension: "aesthetic",
    options: [
      { text: "好看就买，外观也是实力的一部分。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 3 } },
      { text: "看看属性加成，有用才买。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 0, aesthetic: -3 } },
      { text: "攒钻等更喜欢的，不跟风买。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 1 } },
      { text: "我不买时装，钻石留给更有用的东西。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 0, aesthetic: -2 } },
    ],
  },
  {
    id: 22,
    text: "你在野外发现了两只同种精灵:一只毛色鲜亮,一只普通但看起来更结实。你选——",
    dimension: "aesthetic",
    options: [
      { text: "毛色鲜亮那只，看着就赏心悦目。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 3 } },
      { text: "结实那只，战斗中用起来更踏实。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 0, aesthetic: -3 } },
      { text: "两只都收了，一只观赏一只战斗。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 1 } },
      { text: "先看数值再决定，外表无所谓。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 0, aesthetic: -2 } },
    ],
  },
  {
    id: 23,
    text: "你给自己的精灵队伍起名字。你更喜欢——",
    dimension: "aesthetic",
    options: [
      { text: "诗意的名字，比如星辰低语、暗夜玫瑰。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 3 } },
      { text: "简单好记就行，别太花哨。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 0, aesthetic: -3 } },
      { text: "有点中二的才帅，比如灭世烈焰、深渊之影。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 2 } },
      { text: "不取名，就用精灵的原名。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 0, aesthetic: -1 } },
    ],
  },
  {
    id: 24,
    text: "洛克王国的精灵设计师请你为新精灵提供灵感。你建议设计一只——",
    dimension: "aesthetic",
    options: [
      { text: "光芒万丈、宛如神话中的圣兽。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 3 } },
      { text: "实用第一，百搭型的，什么队伍都能进。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 0, aesthetic: -3 } },
      { text: "神秘优雅，有独特的美学风格。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 0, aesthetic: 1 } },
      { text: "朴实无华，越简单越经典。", scores: { battle: 0, range: 0, explore: 0, social: 0, raise: 0, aesthetic: -2 } },
    ],
  },
];

// ===== 64 结果类型映射 =====

// 每位的结果由6个维度的正负号决定
// 正(>0) = 偏向 "左"端, 负(<=0) = 偏向 "右"端
// 用6位二进制表示: 0=右, 1=左
// 顺序: battle, range, explore, social, raise, aesthetic

export interface RktiResult {
  code: string;          // 6位二进制,如 "101010"
  creatureId: string;    // 对应精灵编号
  typeName: string;      // 类型名称
  typeDesc: string;      // 类型一句话描述
  personality: string[]; // 性格分析
  battleStyle: string;   // 战斗风格
  teamRole: string;      // 队伍角色
  raiseAdvice: string;   // 培育建议
}

// 将分数转换为二进制位
export function scoresToCode(scores: DimensionScores): string {
  return [
    scores.battle > 0 ? "1" : "0",
    scores.range > 0 ? "1" : "0",
    scores.explore > 0 ? "1" : "0",
    scores.social > 0 ? "1" : "0",
    scores.raise > 0 ? "1" : "0",
    scores.aesthetic > 0 ? "1" : "0",
  ].join("");
}

// 64 种类型名称
const typeNames: Record<string, string> = {
  "111111": "烈阳战神",
  "111110": "烈焰骑士",
  "111101": "星光游侠",
  "111100": "疾风剑客",
  "111011": "光翼使者",
  "111010": "雷影先锋",
  "111001": "炎龙勇士",
  "111000": "风暴猎手",
  "110111": "辉光领唱",
  "110110": "铁壁将军",
  "110101": "晨星导师",
  "110100": "守护之盾",
  "110011": "自然守望",
  "110010": "山林卫士",
  "110001": "大地之拳",
  "110000": "岩甲守卫",
  "101111": "幻影舞者",
  "101110": "暗影刺客",
  "101101": "星辰预言",
  "101100": "虚空行者",
  "101011": "银翼诗人",
  "101010": "霜风游侠",
  "101001": "龙焰斗士",
  "101000": "冰原战将",
  "100111": "幽光法师",
  "100110": "暗夜骑士",
  "100101": "幻月祭司",
  "100100": "幽冥哨兵",
  "100011": "暮光猎手",
  "100010": "深渊守护",
  "100001": "死寂重装",
  "100000": "万仞壁垒",
  "011111": "花影精灵",
  "011110": "春水歌者",
  "011101": "暖风使者",
  "011100": "绿野游侠",
  "011011": "森罗语者",
  "011010": "磐石守卫",
  "011001": "生命吟唱",
  "011000": "大地之母",
  "010111": "雪国旅人",
  "010110": "霜雪之盾",
  "010101": "冰川智者",
  "010100": "寒冰骑士",
  "010011": "森林隐士",
  "010010": "山岳守钟",
  "010001": "深根守望",
  "010000": "冻土居士",
  "001111": "月影奇术",
  "001110": "紫电法师",
  "001101": "梦境旅人",
  "001100": "星辰学者",
  "001011": "幻光仙灵",
  "001010": "水晶先知",
  "001001": "天穹哲人",
  "001000": "虚无默示",
  "000111": "深渊术士",
  "000110": "剧毒暗医",
  "000101": "暗月信徒",
  "000100": "黑雾行者",
  "000011": "毒沼隐士",
  "000010": "幽谷导师",
  "000001": "死寂孤影",
  "000000": "绝域领主",
};

// 精灵映射: code -> creatureId
const creatureMap: Record<string, string> = {
  "111111": "007", "111110": "048", "111101": "152", "111100": "158",
  "111011": "090", "111010": "149", "111001": "158", "111000": "081",
  "110111": "152", "110110": "115", "110101": "090", "110100": "107",
  "110011": "043", "110010": "029", "110001": "302", "110000": "078",
  "101111": "331", "101110": "282", "101101": "337", "101100": "230",
  "101011": "090", "101010": "149", "101001": "337", "101000": "236",
  "100111": "211", "100110": "130", "100101": "230", "100100": "122",
  "100011": "329", "100010": "290", "100001": "282", "100000": "282",
  "011111": "043", "011110": "043", "011101": "271", "011100": "326",
  "011011": "039", "011010": "026", "011001": "032", "011000": "026",
  "010111": "144", "010110": "136", "010101": "236", "010100": "254",
  "010011": "035", "010010": "029", "010001": "035", "010000": "095",
  "001111": "211", "001110": "245", "001101": "230", "001100": "262",
  "001011": "187", "001010": "144", "001001": "337", "001000": "230",
  "000111": "329", "000110": "292", "000101": "130", "000100": "122",
  "000011": "245", "000010": "074", "000001": "282", "000000": "290",
};

// 分析生成函数
export function generateAnalysis(typeCode: string): RktiResult {
  const bits = typeCode.split("").map((b) => b === "1");
  const typeName = typeNames[typeCode] ?? "未知类型";
  const creatureId = creatureMap[typeCode] ?? "001";

  const personality: string[] = [];

  if (bits[0]) {
    personality.push("你是一个雷厉风行的训练师，相信速度决定一切。在你眼中，战斗不是马拉松，而是百米冲刺。你享受那种开场就以压倒性优势碾压对手的快感，每一回合都追求最直接、最高效的输出。");
    personality.push("面对挑战时，你不会犹豫太久。你的直觉往往准确，而你也信任自己的第一判断。这种特质让你在PVP对战中能快速抓住对手的失误，一击致命。");
  } else {
    personality.push("你是一个深思熟虑的训练师，信奉持久战的哲学。你理解真正的力量不在于一击毙命，而在于持续不断的压迫感。你享受慢慢蚕食对手节奏的过程，像一只耐心的猎手。");
    personality.push("在战斗中，你不会轻易被情绪左右。即使局势不利，你也能冷静分析，找到翻盘的契机。这种沉着让你在消耗战和防守反击中如鱼得水。");
  }

  if (bits[1]) {
    personality.push("你偏爱近距离的对抗，喜欢拳拳到肉的战斗体验。对你来说，精灵之间的近身格斗才是战斗的本质——不是躲在远处放技能，而是用力量直接碾压对手。");
  } else {
    personality.push("你更倾向于远程的策略性战斗。在你看来，战斗就像下棋，保持距离才能看清全局。你擅长用远程技能和状态控制来掌握战场节奏。");
  }

  if (bits[2]) {
    personality.push("你有一颗永不满足的探索之心。未知的地图、未见的精灵、未触达的秘境——这一切都让你兴奋不已。你愿意踏上最偏远的角落，只为发现别人未曾见过的风景。");
  } else {
    personality.push("你是一位追求安稳的训练师。你不排斥冒险，但你更愿意在自己熟悉的环境中稳步成长。你相信真正的强者不是到处乱撞的人，而是在自己的主场做到最好的人。");
  }

  if (bits[3]) {
    personality.push("你享受独自冒险的自由。一个人的旅程让你可以按照自己的节奏前进，不需要迁就任何人。在战斗中，你也更倾向于靠自己的实力说话，而不是依赖团队的配合。");
  } else {
    personality.push("你是一个天生的团队玩家。与他人并肩作战让你感到充实和快乐。你乐于分享攻略、帮助新手、参与公会活动，在集体中找到自己的归属感。");
  }

  if (bits[4]) {
    personality.push("你相信精灵的天赋最为重要。一只精灵的潜力从出生就已注定，训练师的职责是发现并释放它。你不会强迫精灵变成你想要的样子，而是顺应它的天性。");
  } else {
    personality.push("你是一个信奉努力的训练师。你相信没有天生的强者，只有不断打磨才能成就传奇。你会花大量时间研究最优的培养路线，只为让你的精灵发挥出最大潜力。");
  }

  const battleStyle = bits[0]
    ? "你适合速攻型阵容，推荐搭配爆发增益流或火狗速攻队。你的战术核心是第一回合抢速，用先手权压制对方节奏，在前3-5回合建立决定性优势。"
    : "你适合消耗型或控制型阵容，推荐搭配冰控流、毒伤流或减能队。你的战术核心是生存与控制，通过持续的场控和消耗最终拖垮对手。";

  const teamRole = bits[1]
    ? (bits[3] ? "队伍中的前排承伤位或物理输出位。你适合选择武系、地系、虫系等高耐久或高物攻的精灵。" : "队伍中的物攻核心。你适合选择火系、龙系、翼系等能打出高额物理伤害的精灵。")
    : (bits[3] ? "队伍中的远程输出或控场位。你适合选择光系、幻系、幽系等擅长范围影响和状态控制的精灵。" : "队伍中的辅助位或魔攻输出位。你适合选择水系、冰系、萌系等有团队增益能力的精灵。");

  const raiseAdvice = bits[4]
    ? "培育建议：优先选择天赋条件优秀的精灵个体，性格选择上以激进型为主（固执/开朗/保守/胆小）。战斗训练注重实战经验的积累，不需要追求完美的天分配置。"
    : "培育建议：花时间研读攻略，针对性培养精灵的天分数值。性格选择根据精灵定位精确匹配，技能搭配可以多看高分段录像学习。";

  return {
    code: typeCode,
    creatureId,
    typeName,
    typeDesc: `${bits[0] ? "速战" : "持久"}·${bits[1] ? "近身" : "远程"}·${bits[2] ? "开拓" : "守护"}·${bits[3] ? "独行" : "协作"}·${bits[4] ? "天赋" : "努力"}·${bits[5] ? "华丽" : "自然"}`,
    personality,
    battleStyle,
    teamRole,
    raiseAdvice,
  };
}
