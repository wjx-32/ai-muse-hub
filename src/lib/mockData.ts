export type ModelVersion = {
  name: string;
  tags: string[];
  recommended?: boolean;
};

export type ModelCategory = {
  id: string;
  name: string;
  emoji: string;
  match?: (tag: string) => boolean;
};

export const MODEL_CATEGORIES: ModelCategory[] = [
  { id: "all", name: "全部", emoji: "🗂" },
  { id: "recommend", name: "推荐", emoji: "🔥" },
  { id: "reasoning", name: "推理模型", emoji: "🧠" },
  { id: "domestic", name: "国内模型", emoji: "🇨🇳" },
  { id: "oversea", name: "海外模型", emoji: "🌐" },
  { id: "multimodal", name: "多模态", emoji: "🖼" },
  { id: "long", name: "长文本", emoji: "📄" },
  { id: "flagship", name: "旗舰模型", emoji: "👑" },
];

export type ModelSeries = {
  id: string;
  name: string;
  vendor: string;
  color: string;
  versions: ModelVersion[];
  description: string;
  domestic: boolean;
};

export const SERIES: ModelSeries[] = [
  { id: "deepseek", name: "DeepSeek", vendor: "深度求索", color: "#4D6BFE", domestic: true, description: "强推理与代码能力", versions: [
    { name: "DeepSeek-V3.2", tags: ["通用模型", "国内模型"] },
    { name: "DeepSeek-V3.1", tags: ["通用模型", "国内模型"] },
    { name: "DeepSeek-R1", tags: ["推理模型", "国内模型"] },
  ]},
  { id: "kimi", name: "Kimi", vendor: "月之暗面", color: "#1F1F1F", domestic: true, description: "长文本与联网搜索", versions: [
    { name: "Kimi K2", tags: ["长文本", "国内模型"] },
    { name: "Kimi K1.5", tags: ["推理模型", "国内模型"] },
    { name: "Kimi 探索版", tags: ["联网搜索", "国内模型"] },
  ]},
  { id: "claude", name: "Claude", vendor: "Anthropic", color: "#D97757", domestic: false, description: "高质量写作与分析", versions: [
    { name: "Claude Sonnet 4.5", tags: ["通用模型", "海外模型"] },
    { name: "Claude Opus 4", tags: ["旗舰模型", "海外模型"] },
    { name: "Claude Haiku 4", tags: ["轻量快速", "海外模型"] },
  ]},
  { id: "gemini", name: "Gemini", vendor: "Google", color: "#1A73E8", domestic: false, description: "多模态全能模型", versions: [
    { name: "Gemini 3 Pro", tags: ["多模态", "海外模型"] },
    { name: "Gemini 2.5 Pro", tags: ["多模态", "海外模型"] },
    { name: "Gemini 2.5 Flash", tags: ["轻量快速", "海外模型"] },
  ]},
  { id: "zhipu", name: "智谱", vendor: "智谱 AI", color: "#3859FF", domestic: true, description: "中文场景表现优秀", versions: [
    { name: "GLM-4.6", tags: ["通用模型", "国内模型"] },
    { name: "GLM-4-Plus", tags: ["通用模型", "国内模型"] },
    { name: "GLM-Zero", tags: ["推理模型", "国内模型"] },
  ]},
  { id: "qwen", name: "Qwen", vendor: "通义千问", color: "#615CED", domestic: true, description: "开源旗舰大模型", versions: [
    { name: "Qwen3-Max", tags: ["旗舰模型", "国内模型"] },
    { name: "Qwen3-235B", tags: ["开源模型", "国内模型"] },
    { name: "QwQ-32B", tags: ["推理模型", "开源模型"] },
  ]},
  { id: "doubao", name: "豆包", vendor: "字节跳动", color: "#0066FF", domestic: true, description: "速度快、性价比高", versions: [
    { name: "豆包 1.6 Pro", tags: ["通用模型", "国内模型"] },
    { name: "豆包 1.5 Pro", tags: ["通用模型", "国内模型"] },
    { name: "豆包 Lite", tags: ["轻量快速", "国内模型"] },
  ]},
  { id: "openai", name: "OpenAI", vendor: "OpenAI", color: "#10A37F", domestic: false, description: "通用能力业界标杆", versions: [
    { name: "GPT-5.2", tags: ["旗舰模型", "海外模型"] },
    { name: "GPT-5", tags: ["通用模型", "海外模型"] },
    { name: "GPT-4o", tags: ["多模态", "海外模型"] },
  ]},
  { id: "grok", name: "Grok", vendor: "xAI", color: "#000000", domestic: false, description: "实时信息与幽默风格", versions: [
    { name: "Grok 4", tags: ["联网搜索", "海外模型"] },
    { name: "Grok 3", tags: ["通用模型", "海外模型"] },
    { name: "Grok 2", tags: ["通用模型", "海外模型"] },
  ]},
];

export const SAMPLE_REPLIES: Record<string, string[]> = {
  deepseek: [
    "从工程化角度看,这个问题可以拆为三步:1) 数据清洗 2) 特征构造 3) 模型评估。建议先用 baseline 跑通流程,再做调优。",
    "推理过程:首先注意题目隐含条件...经过逐步演算,得出答案为 42。",
  ],
  kimi: [
    "我帮你联网检索了最新资料。综合来看,目前主流方案有以下几种,各有取舍...",
    "根据上传的长文档,要点如下:① 背景 ② 核心论点 ③ 结论。建议你重点关注第二章。",
  ],
  claude: [
    "这是一个值得深入探讨的问题。让我从几个维度展开分析,首先是历史脉络,其次是当下语境,最后是未来可能性...",
    "我理解你的诉求。从清晰度、严谨度和可读性三方面建议如下重写版本...",
  ],
  gemini: [
    "结合你提供的图文信息,我的分析是:整体构图遵循三分法,主体突出,但背景略显杂乱,可考虑虚化处理。",
    "可以用一张表格来对比这几种方案 — 维度、成本、延迟、可扩展性,一目了然。",
  ],
  zhipu: [
    "好的,我用中文场景给你解释。这个概念在国内常被翻译为「检索增强生成」,在企业知识库中应用广泛。",
    "依据《...》这部经典,我们可以这样理解题主提出的问题。",
  ],
  qwen: [
    "作为开源模型,我建议你可以在本地部署 7B 量化版本进行测试,显存需求约 8GB。",
    "代码示例如下,已经过 lint 检查:\n```python\ndef solve(x):\n    return x * 2\n```",
  ],
  doubao: [
    "来啦!简单几句给你说清楚:核心原理就是把大问题切成小问题,逐个击破,效率拉满。",
    "推荐三个实用 tips:省时、省心、省力,亲测有效~",
  ],
  openai: [
    "Great question. Let me break this down into three layers: foundation, application, and edge cases. Here's a structured walkthrough...",
    "I'll provide a comprehensive answer covering the technical, practical, and strategic considerations.",
  ],
  grok: [
    "Based on the latest chatter on X, the consensus seems to be... but let's not take that at face value 😏",
    "Hot take: 大多数人都搞错了重点。真正的关键不在 A,而在 B。原因如下...",
  ],
};

export type DrawImage = {
  id: string;
  url: string;
  model: string;
  ratio: string;
  resolution: string;
  prompt: string;
};

export type DrawRecord = {
  id: string;
  prompt: string;
  createdAt: string;
  images: DrawImage[];
};

const PIC = (seed: string, w = 512, h = 512) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const DRAW_RECORDS: DrawRecord[] = [
  {
    id: "r1",
    prompt: "赛博朋克风格的东京街头,霓虹灯下的雨夜,电影感",
    createdAt: "2 小时前",
    images: [
      { id: "i1", url: PIC("cyber1"), model: "Nano Banana Pro", ratio: "1:1", resolution: "1024×1024", prompt: "赛博朋克风格的东京街头,霓虹灯下的雨夜,电影感" },
      { id: "i2", url: PIC("cyber2"), model: "Nano Banana Pro", ratio: "1:1", resolution: "1024×1024", prompt: "赛博朋克风格的东京街头,霓虹灯下的雨夜,电影感" },
      { id: "i3", url: PIC("cyber3"), model: "Stable Diffusion XL", ratio: "1:1", resolution: "1024×1024", prompt: "赛博朋克风格的东京街头,霓虹灯下的雨夜,电影感" },
      { id: "i4", url: PIC("cyber4"), model: "Stable Diffusion XL", ratio: "1:1", resolution: "1024×1024", prompt: "赛博朋克风格的东京街头,霓虹灯下的雨夜,电影感" },
    ],
  },
  {
    id: "r2",
    prompt: "极简北欧风格客厅,木质家具,阳光透过纱帘",
    createdAt: "昨天",
    images: [
      { id: "i5", url: PIC("nordic1", 768, 512), model: "Midjourney v7", ratio: "3:2", resolution: "1536×1024", prompt: "极简北欧风格客厅,木质家具,阳光透过纱帘" },
      { id: "i6", url: PIC("nordic2", 768, 512), model: "Midjourney v7", ratio: "3:2", resolution: "1536×1024", prompt: "极简北欧风格客厅,木质家具,阳光透过纱帘" },
      { id: "i7", url: PIC("nordic3", 768, 512), model: "Flux 1.1 Pro", ratio: "3:2", resolution: "1536×1024", prompt: "极简北欧风格客厅,木质家具,阳光透过纱帘" },
    ],
  },
  {
    id: "r3",
    prompt: "水墨风格的山水画,远山近水,孤舟一叶",
    createdAt: "3 天前",
    images: [
      { id: "i8", url: PIC("ink1", 512, 768), model: "通义万相 2.5", ratio: "2:3", resolution: "1024×1536", prompt: "水墨风格的山水画,远山近水,孤舟一叶" },
      { id: "i9", url: PIC("ink2", 512, 768), model: "通义万相 2.5", ratio: "2:3", resolution: "1024×1536", prompt: "水墨风格的山水画,远山近水,孤舟一叶" },
    ],
  },
];

export const DRAW_MODELS = [
  { id: "nano-pro", name: "Nano Banana Pro", vendor: "Google", color: "#1A73E8", letter: "N" },
  { id: "nano", name: "Nano Banana", vendor: "Google", color: "#FBBC04", letter: "N" },
  { id: "sdxl", name: "Stable Diffusion XL", vendor: "Stability AI", color: "#7C3AED", letter: "S" },
  { id: "flux", name: "Flux 1.1 Pro", vendor: "Black Forest Labs", color: "#0F172A", letter: "F" },
  { id: "mj", name: "Midjourney v7", vendor: "Midjourney", color: "#5865F2", letter: "M" },
  { id: "wanxiang", name: "通义万相 2.5", vendor: "阿里云", color: "#FF6A00", letter: "万" },
  { id: "doubao-img", name: "豆包·绘图 3.0", vendor: "字节跳动", color: "#0066FF", letter: "豆" },
  { id: "kolors", name: "可图 Kolors", vendor: "快手", color: "#FF5C00", letter: "K" },
];

export const RATIOS = ["1:1", "3:2", "2:3", "16:9", "9:16", "4:3"];
export const RESOLUTIONS = ["512×512", "1024×1024", "1536×1024", "2048×2048"];

export const CHAT_HISTORY = [
  { id: "c1", title: "React 性能优化方案对比", time: "刚刚" },
  { id: "c2", title: "帮我润色一封求职信", time: "今天" },
  { id: "c3", title: "解释 Transformer 注意力机制", time: "昨天" },
  { id: "c4", title: "Python 数据清洗脚本", time: "3 天前" },
  { id: "c5", title: "周末徒步路线规划", time: "上周" },
];
