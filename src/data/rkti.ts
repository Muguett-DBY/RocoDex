export const dimensions = [
  { key: "battle" as const, label: "战斗节奏", left: "速攻爆发", right: "持久消耗", emoji: "⚔️" },
  { key: "range" as const, label: "输出方式", left: "物攻近战", right: "魔攻远程", emoji: "🎯" },
  { key: "role" as const, label: "阵容角色", left: "输出核心", right: "辅助承伤", emoji: "🛡️" },
  { key: "train" as const, label: "培育追求", left: "完美培养", right: "自然成长", emoji: "📖" },
  { key: "adventure" as const, label: "冒险偏好", left: "探索收集", right: "副本挑战", emoji: "🗺️" },
  { key: "aesthetic" as const, label: "审美取向", left: "华丽异色", right: "朴实经典", emoji: "✨" },
];

export type DimensionKey = (typeof dimensions)[number]["key"];
export type DimensionScores = Record<DimensionKey, number>;

export interface RktiQuestion {
  id: number;
  text: string;
  dimension: DimensionKey;
  options: { text: string; scores: DimensionScores }[];
}

export const questions: RktiQuestion[] = [
  // ===== 战斗节奏：速攻爆发 vs 持久消耗 (1-4) =====
  {
    id: 1,
    text: "在 PVP 排位中，你最喜欢的对局节奏是——",
    dimension: "battle",
    options: [
      { text: "前三个回合压制对面核心，确立胜势", scores: { battle: 3, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "不急着发力，先用消耗和控制观察对手习惯", scores: { battle: -3, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "能快就快，但也不怕拖入后期的硬仗", scores: { battle: 1, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "只要对面比我急就行，我慢慢找机会", scores: { battle: -1, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 2,
    text: "面对一个高坦度的肉盾精灵（如雪巨人、瞌睡王），你更倾向于——",
    dimension: "battle",
    options: [
      { text: "换个克制属性的精灵，用高爆发技能快速破防", scores: { battle: 3, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "挂毒或灼烧，用持续伤害慢慢耗死它", scores: { battle: -3, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "用破甲技能削弱后集火，效率优先", scores: { battle: 1, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "控住它，先处理对面其他脆皮精灵", scores: { battle: -1, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 3,
    text: "关于技能能量（能耗）的管理，你的偏好是——",
    dimension: "battle",
    options: [
      { text: "低能耗技能连续施放，不给对手喘息机会", scores: { battle: 3, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "省能量攒大招，关键时刻一击定胜负", scores: { battle: -2, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "带个回能技能，保证持续稳定输出", scores: { battle: -1, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "配合偷能量技能，一边消耗对手一边给自己续航", scores: { battle: -3, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 4,
    text: "你对当前版本 META 阵容的态度是——",
    dimension: "battle",
    options: [
      { text: "火狗速攻、爆发增益这些快节奏阵容最对我胃口", scores: { battle: 3, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "冰控冻结、毒伤持续这些慢速控场更适合我", scores: { battle: -3, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "均衡反制流，啥都能打但啥都不极端", scores: { battle: -1, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "不看 META，我用自己的非主流阵容打上去", scores: { battle: 1, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
    ],
  },

  // ===== 输出方式：物攻近战 vs 魔攻远程 (5-8) =====
  {
    id: 5,
    text: "选择主力精灵技能时，你的优先级是——",
    dimension: "range",
    options: [
      { text: "高威力物攻技能，近身硬碰硬才是真的战斗", scores: { battle: 0, range: 3, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "魔攻技能，伤害高且大多有附加效果", scores: { battle: 0, range: -3, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "物理和魔法各带一个，打击面更广", scores: { battle: 0, range: 1, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "控制技能比伤害技能更重要，先手控制定胜负", scores: { battle: 0, range: -1, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 6,
    text: "你更愿意培养哪种定位的精灵作为主力？",
    dimension: "range",
    options: [
      { text: "武系、地系这类物理输出，拳拳到肉", scores: { battle: 0, range: 3, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "光系、幻系这类魔法输出，优雅但致命", scores: { battle: 0, range: -3, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "冰控、幽灵这类控制型精灵，控住就赢了", scores: { battle: 0, range: -1, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "辅助型精灵，给队友增益和续航", scores: { battle: 0, range: 2, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 7,
    text: "你的主力精灵需要配招。以下技能组合，你选——",
    dimension: "range",
    options: [
      { text: "猛烈撞击 + 撕咬 + 践踏 + 极限撕裂，纯物攻压制", scores: { battle: 0, range: 3, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "流星火雨 + 彗星 + 幽灵爆发 + 脉冲光线，魔攻爆发", scores: { battle: 0, range: -3, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "冰冻 + 眩晕 + 减速 + 先手控制，控得对面动不了", scores: { battle: 0, range: -1, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "防御 + 掩护 + 减伤 + 回血，活着才有输出", scores: { battle: 0, range: 2, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 8,
    text: "在面对属性克制的对战（比如你带火系对面是水系），你会——",
    dimension: "range",
    options: [
      { text: "硬打，靠物攻数值和技能威力碾压过去", scores: { battle: 0, range: 3, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "换精灵，用克制属性反击", scores: { battle: 0, range: -2, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "用状态技能拖回合，等队友突破后接管", scores: { battle: 0, range: -1, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "上火系魔攻技能也有戏，属性克制不绝对", scores: { battle: 0, range: -3, role: 0, train: 0, adventure: 0, aesthetic: 0 } },
    ],
  },

  // ===== 阵容角色：输出核心 vs 辅助承伤 (9-12) =====
  {
    id: 9,
    text: "在组队挑战中，你最喜欢的战斗位置是——",
    dimension: "role",
    options: [
      { text: "主力输出位，伤害榜上必须是我第一", scores: { battle: 0, range: 0, role: 3, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "控场位，控住关键目标让队友肆意输出", scores: { battle: 0, range: 0, role: 1, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "前排承伤位，用肉身给队友撑出空间", scores: { battle: 0, range: 0, role: -3, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "辅助位，加增益、回血、解控，做团队的基石", scores: { battle: 0, range: 0, role: -2, train: 0, adventure: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 10,
    text: "你觉得一场漂亮的PVP胜利，最大的功劳属于谁？",
    dimension: "role",
    options: [
      { text: "输出位，从头到尾压制对面核心的就是TA", scores: { battle: 0, range: 0, role: 3, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "前排承伤位，没有TA挡在前面，输出早就倒了", scores: { battle: 0, range: 0, role: -3, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "控场位，每次关键打断都让对面节奏崩盘", scores: { battle: 0, range: 0, role: 1, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "每个位置都重要，缺一不可", scores: { battle: 0, range: 0, role: -1, train: 0, adventure: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 11,
    text: "以下哪个阵容风格最吸引你？",
    dimension: "role",
    options: [
      { text: "星陨印记流：层层叠印记，引爆收割，爽快感拉满", scores: { battle: 0, range: 0, role: 3, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "黑猫白金爆发队：首发魔攻压制，半套技能带走对面", scores: { battle: 0, range: 0, role: 2, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "雪影受队：冰控冻结链，慢慢把对面整队冻成雕塑", scores: { battle: 0, range: 0, role: -3, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "均衡反制流：有坦有控有续航，什么局面都能应对", scores: { battle: 0, range: 0, role: -2, train: 0, adventure: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 12,
    text: "你的队伍里死了一只精灵。你怎么想？",
    dimension: "role",
    options: [
      { text: "没关系，它吸收了关键技能，后面的输出位已经准备好了", scores: { battle: 0, range: 0, role: -3, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "赶紧换上收割位的精灵，别让节奏断了", scores: { battle: 0, range: 0, role: 3, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "看看有没有联防反打的机会，借对面技能真空期反攻", scores: { battle: 0, range: 0, role: -1, train: 0, adventure: 0, aesthetic: 0 } },
      { text: "换上控场位稳住局面，不能让对面继续扩大优势", scores: { battle: 0, range: 0, role: 1, train: 0, adventure: 0, aesthetic: 0 } },
    ],
  },

  // ===== 培育追求：完美培养 vs 自然成长 (13-16) =====
  {
    id: 13,
    text: "你孵出了一只稀有精灵。看到它的性格是实干（无加成无削弱），你——",
    dimension: "train",
    options: [
      { text: "放仓库，重新孵一只直到出固执/胆小/保守/开朗", scores: { battle: 0, range: 0, role: 0, train: 3, adventure: 0, aesthetic: 0 } },
      { text: "能用，性格不是决定性因素，实战练起来才重要", scores: { battle: 0, range: 0, role: 0, train: -3, adventure: 0, aesthetic: 0 } },
      { text: "看看天分资质，天分好就留下来培养", scores: { battle: 0, range: 0, role: 0, train: -1, adventure: 0, aesthetic: 0 } },
      { text: "花点资源改性格，反正也不贵", scores: { battle: 0, range: 0, role: 0, train: 1, adventure: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 14,
    text: "关于精灵的天分(个体值)培养，你的态度是——",
    dimension: "train",
    options: [
      { text: "必须全满，速度、物攻/魔攻、生命一个都不能少", scores: { battle: 0, range: 0, role: 0, train: 3, adventure: 0, aesthetic: 0 } },
      { text: "差不多就行，实战经验比数值重要", scores: { battle: 0, range: 0, role: 0, train: -3, adventure: 0, aesthetic: 0 } },
      { text: "核心属性到位就好，其他随缘", scores: { battle: 0, range: 0, role: 0, train: -1, adventure: 0, aesthetic: 0 } },
      { text: "天分是给强迫症刷的，我更看重技能搭配", scores: { battle: 0, range: 0, role: 0, train: -2, adventure: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 15,
    text: "你的精灵即将进化。进化需要特定的矿石喂养。你——",
    dimension: "train",
    options: [
      { text: "直奔矿洞刷矿石，今天必须让它进化", scores: { battle: 0, range: 0, role: 0, train: 3, adventure: 0, aesthetic: 0 } },
      { text: "不急，随缘等自然升级也能进化，慢一点无所谓", scores: { battle: 0, range: 0, role: 0, train: -3, adventure: 0, aesthetic: 0 } },
      { text: "先查攻略看进化后厉害不，厉害就肝，不厉害就慢慢来", scores: { battle: 0, range: 0, role: 0, train: 1, adventure: 0, aesthetic: 0 } },
      { text: "矿石可以交易吗？先问问有没有人愿意换", scores: { battle: 0, range: 0, role: 0, train: -1, adventure: 0, aesthetic: 0 } },
    ],
  },
  {
    id: 16,
    text: "你的主力精灵在 PVP 中连败三局。你的第一反应是——",
    dimension: "train",
    options: [
      { text: "分析录像，找出技能搭配和属性选择的问题", scores: { battle: 0, range: 0, role: 0, train: 3, adventure: 0, aesthetic: 0 } },
      { text: "继续打，连败说明还不够熟，多练就熟了", scores: { battle: 0, range: 0, role: 0, train: -3, adventure: 0, aesthetic: 0 } },
      { text: "去培养一只新精灵，换个体系试试看", scores: { battle: 0, range: 0, role: 0, train: -1, adventure: 0, aesthetic: 0 } },
      { text: "去野外散散心，调整一下心态再回来", scores: { battle: 0, range: 0, role: 0, train: -2, adventure: 0, aesthetic: 0 } },
    ],
  },

  // ===== 冒险偏好：探索收集 vs 副本挑战 (17-20) =====
  {
    id: 17,
    text: "周末上线，你第一件想做的事是——",
    dimension: "adventure",
    options: [
      { text: "去新地图探险，把每个角落的精灵都摸一遍", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 3, aesthetic: 0 } },
      { text: "刷副本，把今天的体力用光先", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: -3, aesthetic: 0 } },
      { text: "打开图鉴看看还缺哪些精灵，去补图鉴", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 2, aesthetic: 0 } },
      { text: "上 PVP 排位，冲分要紧", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: -2, aesthetic: 0 } },
    ],
  },
  {
    id: 18,
    text: "在地图上，你最希望发现——",
    dimension: "adventure",
    options: [
      { text: "一个隐藏洞穴，里面有一只从未在图鉴上见过的精灵", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 3, aesthetic: 0 } },
      { text: "一个高难度副本入口，通关掉稀有素材", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: -3, aesthetic: 0 } },
      { text: "一片开满鲜花的草原，可以用来拍照打卡", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 1, aesthetic: 0 } },
      { text: "一个已经有人标好的矿点，省得自己找了", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: -1, aesthetic: 0 } },
    ],
  },
  {
    id: 19,
    text: "关于捕捉精灵，你的策略是——",
    dimension: "adventure",
    options: [
      { text: "每种精灵捉一只，凑齐图鉴就够了", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 3, aesthetic: 0 } },
      { text: "只捉强度高的，其他不浪费时间", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: -3, aesthetic: 0 } },
      { text: "喜欢的精灵多捉几只，挑最优个体", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 1, aesthetic: 0 } },
      { text: "路过就捉，不主动找，随缘", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: -1, aesthetic: 0 } },
    ],
  },
  {
    id: 20,
    text: "你来到传说中的地图区域——维苏威火山口。你会——",
    dimension: "adventure",
    options: [
      { text: "不急打怪，先把整个火山口走一遍看看风景", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 3, aesthetic: 0 } },
      { text: "直奔稀有精灵出没点，速战速决", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: -3, aesthetic: 0 } },
      { text: "看看有没有隐藏任务或剧情线索", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 2, aesthetic: 0 } },
      { text: "抓几只火系精灵比较一下属性，择优录取", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: -1, aesthetic: 0 } },
    ],
  },

  // ===== 审美取向：华丽异色 vs 朴实经典 (21-24) =====
  {
    id: 21,
    text: "你在野外发现了两只同种精灵:一只是普通毛色，另一只是罕见的异色品种。你——",
    dimension: "aesthetic",
    options: [
      { text: "异色的必须拿下！稀有就是正义", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 3 } },
      { text: "看数值，哪只好捉哪只", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: -3 } },
      { text: "两只都捉了，异色收藏，普通的用来战斗", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 1 } },
      { text: "异色只是稀有，不影响强度，不纠结", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: -2 } },
    ],
  },
  {
    id: 22,
    text: "鸭吉吉有「蓬松的样子」「急急急鸭」「燃了鸭」等多达六种形态。你——",
    dimension: "aesthetic",
    options: [
      { text: "六种全收集！每种形态都是艺术品", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 3 } },
      { text: "选一只实战最强的形态就行了", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: -3 } },
      { text: "收集两三个最喜欢的形态就够", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 1 } },
      { text: "形态多不如实力强，不在意这些", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: -2 } },
    ],
  },
  {
    id: 23,
    text: "晶石蜗进化时，可以根据矿石选择六种不同形态（西瓜碧玺/莲花刚玉/星彩榴石等）。你选——",
    dimension: "aesthetic",
    options: [
      { text: "选颜色最好看的，天天看着心情好", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 3 } },
      { text: "查攻略，看哪个形态种族值最优", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: -3 } },
      { text: "选个稀有度高的，谁都有的就太普通了", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 2 } },
      { text: "随便选，进化完了再对比", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: -1 } },
    ],
  },
  {
    id: 24,
    text: "如果让你设计一只新精灵，你希望它——",
    dimension: "aesthetic",
    options: [
      { text: "光芒万丈、宛如神话中的神兽", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 3 } },
      { text: "实战好用最重要，外观是次要的", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: -3 } },
      { text: "有独特的美学风格，让人过目不忘", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: 1 } },
      { text: "回归经典，用最简单的线条表现精灵的本质", scores: { battle: 0, range: 0, role: 0, train: 0, adventure: 0, aesthetic: -2 } },
    ],
  },
];

// ===== 结果类型映射 =====

export interface RktiResult {
  code: string;
  creatureId: string;
  typeName: string;
  typeDesc: string;
  personality: string[];
  battleAnalysis: string;
  teamRole: string;
  trainAdvice: string;
}

export function scoresToCode(scores: DimensionScores): string {
  return [
    scores.battle > 0 ? "1" : "0",
    scores.range > 0 ? "1" : "0",
    scores.role > 0 ? "1" : "0",
    scores.train > 0 ? "1" : "0",
    scores.adventure > 0 ? "1" : "0",
    scores.aesthetic > 0 ? "1" : "0",
  ].join("");
}

const typeNames: Record<string, string> = {
  "111111": "烈阳战神",
  "111110": "烈焰骑士",
  "111101": "疾风剑客",
  "111100": "雷影先锋",
  "111011": "光辉勇士",
  "111010": "炽炎斗将",
  "111001": "星辰猎手",
  "111000": "冰原战卒",
  "110111": "金翼诗人",
  "110110": "白虹侠客",
  "110101": "苍炎射手",
  "110100": "银鬃骑士",
  "110011": "霞光行者",
  "110010": "炎盾将军",
  "110001": "风暴行者",
  "110000": "碎岩斗士",
  "101111": "霜翼歌者",
  "101110": "水晶守卫",
  "101101": "苍星预言",
  "101100": "雷纹剑师",
  "101011": "光羽法师",
  "101010": "翡翠圣者",
  "101001": "星辰哲者",
  "101000": "冰川隐士",
  "100111": "幻紫诗人",
  "100110": "幽冥武师",
  "100101": "白金剑圣",
  "100100": "紫电禅师",
  "100011": "黑玉将军",
  "100010": "深渊重骑",
  "100001": "绝峰隐剑",
  "100000": "万仞铁壁",
  "011111": "花影倩魂",
  "011110": "春水医者",
  "011101": "暖风旅人",
  "011100": "藤蔓术士",
  "011011": "森罗语使",
  "011010": "青叶守卫",
  "011001": "苍翠圣僧",
  "011000": "林海行者",
  "010111": "碧空舞者",
  "010110": "翠浪先锋",
  "010101": "雪山贤者",
  "010100": "青松道人",
  "010011": "月影剑豪",
  "010010": "竹阴隐僧",
  "010001": "莲台圣骑",
  "010000": "枯石守钟",
  "001111": "月下诡术",
  "001110": "紫电术士",
  "001101": "幽灵学者",
  "001100": "黑云道士",
  "001011": "幻光仙灵",
  "001010": "紫晶先知",
  "001001": "天穹哲士",
  "001000": "暗影法师",
  "000111": "毒沼奇医",
  "000110": "腐木咒师",
  "000101": "冥灯引导",
  "000100": "黑雾行僧",
  "000011": "瘴林隐修",
  "000010": "幽谷导师",
  "000001": "孤坟守夜",
  "000000": "绝域镇魂",
};

const creatureMap: Record<string, string> = {
  "111111": "007", "111110": "048", "111101": "152", "111100": "158",
  "111011": "039", "111010": "157", "111001": "081", "111000": "236",
  "110111": "090", "110110": "115", "110101": "149", "110100": "107",
  "110011": "271", "110010": "078", "110001": "302", "110000": "029",
  "101111": "144", "101110": "254", "101101": "337", "101100": "331",
  "101011": "187", "101010": "043", "101001": "230", "101000": "122",
  "100111": "211", "100110": "290", "100101": "282", "100100": "245",
  "100011": "329", "100010": "131", "100001": "292", "100000": "136",
  "011111": "032", "011110": "326", "011101": "065", "011100": "043",
  "011011": "035", "011010": "026", "011001": "039", "011000": "095",
  "010111": "311", "010110": "271", "010101": "322", "010100": "276",
  "010011": "176", "010010": "178", "010001": "284", "010000": "110",
  "001111": "331", "001110": "245", "001101": "282", "001100": "262",
  "001011": "187", "001010": "337", "001001": "130", "001000": "122",
  "000111": "245", "000110": "292", "000101": "329", "000100": "215",
  "000011": "176", "000010": "074", "000001": "290", "000000": "282",
};

export function generateAnalysis(typeCode: string): RktiResult {
  const bs = typeCode.split("").map((b) => b === "1");
  const typeName = typeNames[typeCode] ?? "未知类型";
  const creatureId = creatureMap[typeCode] ?? "001";

  const personality: string[] = [];

  // 战斗节奏
  let battleAnalysis: string;
  if (bs[0]) {
    personality.push("你是一位崇尚速攻的训练师。在你的理解中，战斗就像一道闪电——快、准、狠。你倾向于用低能耗的技能持续施压，在对手还没来得及布阵时就已经奠定了胜局。你喜欢爆发增益流、火狗速攻等快节奏阵容，享受那种一个回合定乾坤的爽快感。");
    battleAnalysis = "推荐阵容：爆发增益流（翠顶夫人+独角兽+化蝶）、火狗速攻队（音速犬+恶魔狼+独角兽）。核心战术是第一回合抢速开增益，第二回合核心输出进场收割。注意防范高坦度承伤位和带净化的队伍，一旦速攻节奏被断，容错率会急剧下降。";
  } else {
    personality.push("你是一位沉得住气的战术家。你不会因为对面前三回合的压制而慌乱，因为你深知消耗战的魅力在于时间。你擅长用毒伤、冰控、减能等体系慢慢剥夺对手的行动空间，像一只耐心的猎手等待最佳的反击时机。");
    battleAnalysis = "推荐阵容：冰控冻结流（雪影娃娃+冰钻布鲁斯+圣代甜甜）、毒伤持续流（千棘盔+琉璃水母+厉毒修萝）。核心思路是建立持续的场控或 DOT 压力，不追求秒杀，而是让对手在无尽的冻结/中毒中慢性死亡。要注意防范高解控阵容和爆发型速攻队。";
  }

  // 输出方式
  let teamRole: string;
  if (bs[1]) {
    personality.push("你钟情于拳拳到肉的物理对战。武系、地系、虫系的铁血硬汉最对你胃口。你认为最强的精灵就应该站在最前面，用物理攻击把对手一拳一拳砸回去。你对技能的判断标准很简单——威力高不高？能打几段连击？需不需要先手？");
    teamRole = "物攻核心位。推荐培养：武系（画间沉铁兽）、地系（罗隐、石冠王蜥）、龙系（寂灭骨龙）。性格优先选择固执（+物攻）或开朗（+速度）。天分优先速度、物攻、生命。配招以高威力物攻技能为主，搭配破甲或强化技。";
  } else {
    personality.push("你偏爱飘逸灵动的远程战斗。光系的光辉、幻系的神秘、幽系的诡谲——这些不是花架子，是你制胜的法宝。你喜欢用魔攻技能在远处安全输出，或者用控制技能让对手永远碰不到你。你的战斗哲学是：优雅地取胜。");
    teamRole = "魔攻输出位或控场位。推荐培养：光系（迪莫、矿晶虫）、幻系（落陨星兔、小皮球）、幽系（夜枭、怖哭菇）。性格优先选择保守（+魔攻）或胆小（+速度）。配招以高威力魔攻技能为核心，配合一到两个控制或状态技能。";
  }

  // 阵容角色
  if (bs[2]) {
    personality.push("你就是队伍的矛。输出是你的名字，伤害榜第一是你的归宿。在你的队伍里，一切配置都围绕一个核心问题展开：怎么能让你打出更高的伤害？你不会把精力花在防守上——因为最好的防守就是先把对面打死。");
    if (teamRole.includes("物攻")) {
      teamRole += " 你适合担任队伍的物攻主C，天分满攻满速，性格固执或开朗，配招全部围绕最大化输出设计。";
    } else {
      teamRole += " 你适合担任队伍的魔攻主C，天分满魔攻满速，性格保守或胆小，技能池越广越好。";
    }
  } else {
    personality.push("你是队伍的盾。你深知一支只知进攻的队伍走不远——总要有人顶在前面吸收伤害，总要有人在关键时刻回血解控。你或许不是 M V P，但你是队伍能站到最后的前提。");
    teamRole = "承伤位或辅助位。推荐培养：雪巨人（冰系承伤）、瞌睡王（高耐久前排）、翠顶夫人（增益辅助）。性格选择大胆/沉着（+双防）或胆小/开朗（+速度先手辅助）。天分优先生命、双防。配招以防御技、回血、解控为主，输出技能带一两个补伤害就行。";
  }

  // 培育追求
  let trainAdvice: string;
  if (bs[3]) {
    personality.push("你对精灵的要求极高。性格必须正确、天分必须完美、配招必须最优。你不会满足于一只还能用的精灵——你要的是极品。你会花大量时间刷初始、研究攻略、对照数据，只为打造出最强的那一只。");
    trainAdvice = "建议优先培养性格为固执/开朗（物攻向）或保守/胆小（魔攻向）的精灵。天分优先速度和主攻属性，次选生命和双防。技能搭配要保证至少一个本系大招 + 一个强化/破甲技 + 一个应对技。多看高分段录像学习配招思路。";
  } else {
    personality.push("你相信与精灵之间的羁绊比冰冷的数据更重要。你不反对刷性格、优化配招，但你不会把游戏变成一场枯燥的数值计算。你喜欢带着精灵出去冒险，在真实的战斗中让它慢慢成长。你更看重的是体验的过程，而不是结果的完美。");
    trainAdvice = "性格和天分差不多就行，不必追求完美。重点放在实战中磨合技能搭配，找到自己最顺手的打法。进化路线上优先选择你喜欢的形态，哪怕它在强度榜上不是最顶级的。记住：没有最强的精灵，只有最适合你的精灵。";
  }

  // 冒险偏好
  if (bs[4]) {
    personality.push("你是一个探索型玩家。打开新地图时你会把每个角落走一遍，图鉴里的空白像是一根羽毛，不断搔着你收集的心。你喜欢在地图上发现隐藏的精灵蛋、找到别人漏掉的稀有刷新点，享受那种慢慢填满图鉴的成就感。");
  } else {
    personality.push("你是一个目标导向型玩家。你的时间很宝贵，每次上线都有明确的计划：刷副本、冲分、做日常。你不太在意地图上的风景，只在意离下一个目标还差多少。你不是不想探索——只是探索也得有回报才行。");
  }

  // 审美
  if (bs[5]) {
    personality.push("你无法抗拒稀有异色和多形态精灵的魅力。在你看来，精灵不只是战斗工具，它们是行走的艺术品。你会为了收集某只精灵的全部形态花上数周时间，也会因为一只异色精灵的毛色而兴奋半天。你不玩强度，你玩的是心动。");
  } else {
    personality.push("你对精灵的外观不怎么挑剔。你更看重的是它在战场上能不能打。异色稀有？算了，数值一样就行。多形态选择？选最优种族值那只。你喜欢的是经典、耐看的精灵，那些花里胡哨的多形态反而让你觉得太麻烦。");
  }

  return { code: typeCode, creatureId, typeName,
    typeDesc: `${bs[0]?"速攻":"持久"}·${bs[1]?"物攻":"魔攻"}·${bs[2]?"输出":"辅助"}·${bs[3]?"完美":"自然"}·${bs[4]?"探索":"副本"}·${bs[5]?"华丽":"朴实"}`,
    personality, battleAnalysis, teamRole, trainAdvice };
}
