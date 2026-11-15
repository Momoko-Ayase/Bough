import type {
  LocaleCode,
  OrnamentId,
  OrnamentMaterial,
  TopperId,
  VisibilityMode,
} from "../../shared/types";

export interface LocaleDictionary {
  meta: {
    label: string;
    shortLabel: string;
  };
  header: {
    keepsakeCount: (count: number) => string;
    share: string;
    owner: string;
    ownerActive: string;
    claimTree: string;
    soundOn: string;
    soundOff: string;
    visibilityBadge: Record<VisibilityMode, string>;
  };
  stage: {
    tapTopperHint: (owner: string) => string;
    hangCta: string;
    pickBranchBanner: string;
    pickBranchSub: string;
    cancelBranchPick: string;
    surpriseSlot: string;
    boughPage: (current: number, total: number) => string;
    prevBough: string;
    nextBough: string;
    emptyTreeHint: string;
    fromLabel: (sender: string) => string;
    yoursBadge: string;
    privateTag: string;
  };
  composer: {
    title: string;
    stepOrnament: string;
    stepLetter: string;
    materials: Record<OrnamentMaterial, string>;
    ornaments: Record<OrnamentId, string>;
    toppers: Record<TopperId, string>;
    selectedHook: (page: number, slot: number) => string;
    chooseOnTree: string;
    senderLabel: string;
    senderPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: (owner: string) => string;
    privateToggleLabel: (owner: string) => string;
    privateToggleHint: string;
    ownerOnlyNotice: (owner: string) => string;
    scheduledNotice: (dateStr: string) => string;
    securityLabel: string;
    turnstileUnconfigured: string;
    hangButton: string;
    hangingButton: string;
    nextWriteNote: string;
    backToOrnaments: string;
    hungToast: string;
  };
  reader: {
    fromHeading: (sender: string) => string;
    ownerWelcomeHeading: (owner: string) => string;
    sealedHeading: string;
    sealedOwnerOnlyBody: (owner: string) => string;
    sealedGuestPrivateBody: (owner: string) => string;
    sealedScheduledBody: (dateStr: string) => string;
    receiptUnlockedNote: (owner: string) => string;
    ownerUnlockedNote: string;
    deleteKeepsake: string;
    confirmDelete: string;
    close: string;
  };
  owner: {
    claimTitle: string;
    claimSubtitle: string;
    loginTitle: string;
    loginSubtitle: string;
    drawerTitle: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    claimButton: string;
    signInButton: string;
    signOutButton: string;
    ownerNameLabel: string;
    treeTitleLabel: string;
    welcomeNoteLabel: string;
    topperLabel: string;
    visibilityLabel: string;
    visibilityDesc: Record<VisibilityMode, string>;
    revealDateLabel: string;
    allowGuestPrivateLabel: string;
    hideSenderNamesLabel: string;
    snowfallLabel: string;
    rateLimitLabel: string;
    turnstileHeading: string;
    turnstileEnvActive: string;
    turnstileSiteKeyLabel: string;
    turnstileSecretKeyLabel: string;
    turnstileSecretPlaceholder: string;
    saveChanges: string;
    savingChanges: string;
    savedToast: string;
    archiveHeading: string;
    archiveDesc: string;
    exportJson: string;
    exportMarkdown: string;
  };
  share: {
    title: string;
    subtitle: (owner: string) => string;
    copyLink: string;
    copied: string;
    scanQr: string;
  };
}

export const DICTIONARIES: Record<LocaleCode, LocaleDictionary> = {
  en: {
    meta: { label: "English", shortLabel: "EN" },
    header: {
      keepsakeCount: (n) => (n === 1 ? "1 keepsake" : `${n} keepsakes`),
      share: "Invite friends",
      owner: "Owner key",
      ownerActive: "Tree studio",
      claimTree: "Claim tree",
      soundOn: "Chimes on",
      soundOff: "Chimes muted",
      visibilityBadge: {
        public: "Open letters",
        owner_only: "Sealed for owner",
        scheduled: "Time-capsule",
      },
    },
    stage: {
      tapTopperHint: (owner) => `Read ${owner}'s welcome note`,
      hangCta: "Hang a keepsake",
      pickBranchBanner: "Tap a glowing brass hook on the tree",
      pickBranchSub: "Pick the exact bough where your ornament will hang.",
      cancelBranchPick: "Keep current spot",
      surpriseSlot: "Auto-pick bough",
      boughPage: (c, t) => `Canopy ${c} of ${t}`,
      prevBough: "Previous canopy",
      nextBough: "Next canopy",
      emptyTreeHint: "The pine boughs are quiet. Hang the first keepsake.",
      fromLabel: (s) => s,
      yoursBadge: "Yours",
      privateTag: "Sealed",
    },
    composer: {
      title: "Hang a Keepsake",
      stepOrnament: "1. Choose craft",
      stepLetter: "2. Write letter",
      materials: {
        glass: "Blown Glass",
        brass: "Brass & Enamel",
        wood_felt: "Wood & Felt",
        hearth_paper: "Hearth & Paper",
      },
      ornaments: {
        "crimson-bauble": "Crimson Glass Bauble",
        "cobalt-starburst": "Cobalt Starlight Sphere",
        "emerald-icicle": "Emerald Glass Drop",
        "frosted-finial": "Frosted Pearl Finial",
        "rose-reflector": "Rose Mercury Reflector",
        "amethyst-prism": "Amethyst Facet Prism",
        "forest-snowglobe": "Miniature Fir Snowglobe",
        "celestial-sunburst": "Gilded Sunburst",
        "brass-bell": "Sleigh Ribbon Bell",
        "cloisonne-bird": "Cloisonné Winter Wren",
        "winter-lantern": "Candlelight Brass Lantern",
        "astrolabe-ring": "Celestial Astrolabe",
        "pocket-watch": "Heirloom Chime Watch",
        "enamel-robin": "Cloisonné Redbreast",
        "dala-horse": "Carved Dala Horse",
        "felt-mitten": "Embroidered Wool Mitten",
        "spiced-orange": "Clove & Dried Orange",
        "sugar-pinecone": "Frosted Forest Cone",
        "nutcracker-guard": "Painted Nutcracker",
        "knit-stocking": "Fair-Isle Wool Stocking",
        "holly-acorn": "Oak Acorn & Holly",
        "gingerbread-cottage": "Iced Gingerbread Chalet",
        "origami-crane": "Gilded Washi Crane",
        "wax-letter": "Wax-Sealed Tiny Post",
        "peppermint-cane": "Ribbon Peppermint Cane",
        "moravian-star": "Moravian Paper Star",
        "carousel-chime": "Gilded Carousel Pavilion",
        "yule-log": "Bûche de Noël Roll",
      },
      toppers: {
        "north-star": "Gilded North Star",
        "bethlehem-star": "Bethlehem Starburst",
        "velvet-bow": "Bordeaux Velvet Ribbon",
        "crescent-moon": "Brass Crescent Moon",
        "candle-crown": "Nordic Lucia Crown",
        "glass-finial-spire": "Blown-Glass Finial Spire",
      },
      selectedHook: (p, s) => `Canopy ${p}, Hook #${s}`,
      chooseOnTree: "Pick spot on tree",
      senderLabel: "Signed by",
      senderPlaceholder: "Your name or nickname",
      messageLabel: "Your winter note",
      messagePlaceholder: (owner) =>
        `Write a warm wish, favorite memory from this year, or quiet note for ${owner}…`,
      privateToggleLabel: (owner) => `Seal privately for ${owner} only`,
      privateToggleHint:
        "Everyone sees your ornament on the bough, while only the owner can break the wax seal.",
      ownerOnlyNotice: (owner) =>
        `This tree seals all notes for ${owner}. Visitors see your ornament, never your letter.`,
      scheduledNotice: (d) =>
        `Notes stay wax-sealed until ${d}, when the capsule unlocks.`,
      securityLabel: "Guest check",
      turnstileUnconfigured:
        "Turnstile verification is not configured yet. Sign in with Owner Key to add keys.",
      hangButton: "Hang on the bough",
      hangingButton: "Tying brass hook…",
      nextWriteNote: "Write your letter",
      backToOrnaments: "Change ornament",
      hungToast: "Your keepsake is swaying on the bough.",
    },
    reader: {
      fromHeading: (s) => `From ${s}`,
      ownerWelcomeHeading: (owner) => `A welcome note from ${owner}`,
      sealedHeading: "Wax-Sealed Keepsake",
      sealedOwnerOnlyBody: (owner) =>
        `This letter is tucked safely under ${owner}'s wax seal. Only ${owner} can read its contents.`,
      sealedGuestPrivateBody: (owner) =>
        `The sender sealed this letter privately for ${owner}.`,
      sealedScheduledBody: (d) =>
        `This winter capsule remains sealed until ${d}.`,
      receiptUnlockedNote: (owner) =>
        `Visible to you (on this device) and ${owner}.`,
      ownerUnlockedNote: "Opened with your Owner Key.",
      deleteKeepsake: "Remove ornament",
      confirmDelete: "Confirm remove",
      close: "Close",
    },
    owner: {
      claimTitle: "Claim Your Bough",
      claimSubtitle:
        "Set an owner password to customize your tree, control letter privacy, and read sealed keepsakes.",
      loginTitle: "Unlock Tree Studio",
      loginSubtitle:
        "Enter your owner password to read sealed keepsakes and adjust tree settings.",
      drawerTitle: "Tree Studio",
      passwordLabel: "Owner password",
      passwordPlaceholder: "At least 6 characters",
      claimButton: "Claim & open studio",
      signInButton: "Unlock studio",
      signOutButton: "Lock studio",
      ownerNameLabel: "Your name",
      treeTitleLabel: "Tree headline",
      welcomeNoteLabel: "Crown welcome note (shown when tapping tree topper)",
      topperLabel: "Crown topper",
      visibilityLabel: "Letter visibility",
      visibilityDesc: {
        public: "Visitors can open ornaments and read public notes.",
        owner_only: "Visitors see ornaments & names; only you can read notes.",
        scheduled: "Notes stay wax-sealed until your chosen reveal moment.",
      },
      revealDateLabel: "Capsule unlock time (local)",
      allowGuestPrivateLabel: "Let guests mark individual notes private",
      hideSenderNamesLabel: "Mask sender names on sealed ornaments",
      snowfallLabel: "Gentle ambient snowfall",
      rateLimitLabel: "Max keepsakes per guest IP (10 min)",
      turnstileHeading: "Cloudflare Turnstile",
      turnstileEnvActive:
        "Locked by Worker environment secrets (TURNSTILE_SITE_KEY / SECRET_KEY).",
      turnstileSiteKeyLabel: "Turnstile Site Key",
      turnstileSecretKeyLabel: "Turnstile Secret Key",
      turnstileSecretPlaceholder: "Leave blank to keep existing secret",
      saveChanges: "Save tree settings",
      savingChanges: "Saving…",
      savedToast: "Tree settings saved.",
      archiveHeading: "End-of-Season Keepsake Archive",
      archiveDesc:
        "Download every ornament and unsealed letter for safekeeping.",
      exportJson: "Download JSON",
      exportMarkdown: "Download Keepsake Book (.md)",
    },
    share: {
      title: "Share Your Bough",
      subtitle: (owner) =>
        `Send your link or QR card so friends can hang an ornament on ${owner}'s tree.`,
      copyLink: "Copy tree link",
      copied: "Link copied",
      scanQr: "Scan with phone camera",
    },
  },

  "zh-CN": {
    meta: { label: "简体中文", shortLabel: "简" },
    header: {
      keepsakeCount: (n) => `${n} 枚挂饰`,
      share: "邀请好友",
      owner: "树主钥匙",
      ownerActive: "树屋管理",
      claimTree: "认领此树",
      soundOn: "八音盒已开",
      soundOff: "静音",
      visibilityBadge: {
        public: "公开信笺",
        owner_only: "仅树主可读",
        scheduled: "时光胶囊",
      },
    },
    stage: {
      tapTopperHint: (owner) => `点击树顶星阅读 ${owner} 的寄语`,
      hangCta: "挂上心意挂饰",
      pickBranchBanner: "轻点树枝上闪烁的黄铜挂钩",
      pickBranchSub: "挑选你想悬挂这枚礼物的松枝位置。",
      cancelBranchPick: "保留当前位置",
      surpriseSlot: "随机挑选松枝",
      boughPage: (c, t) => `第 ${c} / ${t} 层树冠`,
      prevBough: "上一棵树冠",
      nextBough: "下一棵树冠",
      emptyTreeHint: "冬夜松枝静谧，来挂上第一枚心意挂饰吧。",
      fromLabel: (s) => s,
      yoursBadge: "我的",
      privateTag: "火漆封缄",
    },
    composer: {
      title: "挂上一枚冬日挂饰",
      stepOrnament: "1. 挑选挂饰",
      stepLetter: "2. 写下信笺",
      materials: {
        glass: "吹制玻璃",
        brass: "黄铜珐琅",
        wood_felt: "木艺毛毡",
        hearth_paper: "暖炉纸艺",
      },
      ornaments: {
        "crimson-bauble": "绯红吹制玻璃球",
        "cobalt-starburst": "钴蓝星芒玻璃球",
        "emerald-icicle": "祖母绿冰柱坠",
        "frosted-finial": "霜白珍珠尖顶坠",
        "rose-reflector": "玫瑰水银反光球",
        "amethyst-prism": "紫晶切面棱柱坠",
        "forest-snowglobe": "微缩松林水晶球",
        "celestial-sunburst": "鎏金太阳徽章",
        "brass-bell": "丝带黄铜铃铛",
        "cloisonne-bird": "景泰蓝冬鹪鹩",
        "winter-lantern": "暖烛黄铜提灯",
        "astrolabe-ring": "星盘浑天仪环",
        "pocket-watch": "复古报时怀表",
        "enamel-robin": "珐琅知更鸟",
        "dala-horse": "北欧彩绘木马",
        "felt-mitten": "刺绣羊毛连指手套",
        "spiced-orange": "丁香风干甜橙",
        "sugar-pinecone": "覆雪森林松果",
        "nutcracker-guard": "胡桃夹子木偶",
        "knit-stocking": "费尔岛编织圣诞袜",
        "holly-acorn": "冬青浆果橡果束",
        "gingerbread-cottage": "糖霜姜饼木屋",
        "origami-crane": "金箔和纸千纸鹤",
        "wax-letter": "火漆迷你信封",
        "peppermint-cane": "丝带薄荷拐杖糖",
        "moravian-star": "摩拉维亚立体纸星",
        "carousel-chime": "八音盒旋转木马亭",
        "yule-log": "树根年轮蛋糕",
      },
      toppers: {
        "north-star": "鎏金北极星",
        "bethlehem-star": "伯利恒璀璨星芒",
        "velvet-bow": "波尔多丝绒蝴蝶结",
        "crescent-moon": "黄铜新月冠",
        "candle-crown": "北欧烛光花冠",
        "glass-finial-spire": "绯红琉璃尖顶塔",
      },
      selectedHook: (p, s) => `树冠 ${p} · ${s} 号枝头`,
      chooseOnTree: "在树上自选位置",
      senderLabel: "落款署名",
      senderPlaceholder: "你的名字或昵称",
      messageLabel: "冬日寄语",
      messagePlaceholder: (owner) =>
        `写下一句冬日祝福、今年的珍贵回忆，或悄悄对 ${owner} 说的话…`,
      privateToggleLabel: (owner) => `盖上火漆，仅 ${owner} 可拆阅`,
      privateToggleHint: "大家都能看到枝头的挂饰，但只有树主能拆开信封内容。",
      ownerOnlyNotice: (owner) =>
        `此树已开启私密模式，所有留言均自动为 ${owner} 火漆封缄。`,
      scheduledNotice: (d) => `信笺将以火漆封存，于 ${d} 准时开启。`,
      securityLabel: "访客安全验证",
      turnstileUnconfigured: "尚未配置 Turnstile 验证，请树主登录后填写密钥。",
      hangButton: "挂上松枝",
      hangingButton: "正在系上铜钩…",
      nextWriteNote: "下一步：写信笺",
      backToOrnaments: "重选挂饰",
      hungToast: "你的挂饰已轻轻悬在松枝上了。",
    },
    reader: {
      fromHeading: (s) => `来自 ${s}`,
      ownerWelcomeHeading: (owner) => `${owner} 的树顶欢迎信`,
      sealedHeading: "火漆封缄的信笺",
      sealedOwnerOnlyBody: (owner) =>
        `这封信已由火漆封存，仅树主 ${owner} 本人可以拆阅。`,
      sealedGuestPrivateBody: (owner) =>
        `寄信人选择了私密投递，仅 ${owner} 可拆阅此信。`,
      sealedScheduledBody: (d) => `这枚冬日时光胶囊将于 ${d} 解封。`,
      receiptUnlockedNote: (owner) => `仅你（当前设备）与 ${owner} 可见。`,
      ownerUnlockedNote: "已使用树主钥匙拆阅。",
      deleteKeepsake: "摘除此挂饰",
      confirmDelete: "确认摘除",
      close: "收起",
    },
    owner: {
      claimTitle: "认领你的专属松枝树",
      claimSubtitle: "设置树主密码，随时调整留言公开权限、树顶装饰并拆阅私密来信。",
      loginTitle: "解锁树屋控制台",
      loginSubtitle: "输入树主密码以拆阅全部火漆来信并管理松枝设置。",
      drawerTitle: "树屋控制台",
      passwordLabel: "树主密码",
      passwordPlaceholder: "至少 6 位字符",
      claimButton: "认领并进入控制台",
      signInButton: "解锁进入",
      signOutButton: "锁定退出",
      ownerNameLabel: "树主称呼",
      treeTitleLabel: "树屋标题",
      welcomeNoteLabel: "树顶星欢迎语（点击树顶装饰时展示）",
      topperLabel: "树顶冠饰",
      visibilityLabel: "信笺可见权限",
      visibilityDesc: {
        public: "访客可点击挂饰阅读未设为私密的留言。",
        owner_only: "访客可见挂饰与署名，留言内容仅树主本人可读。",
        scheduled: "到达指定时间前全员火漆封存，到期自动解封。",
      },
      revealDateLabel: "胶囊解封时间",
      allowGuestPrivateLabel: "公开模式下允许访客单独勾选「仅树主可见」",
      hideSenderNamesLabel: "封缄状态下同时隐藏寄信人署名",
      snowfallLabel: "开启冬夜飘雪氛围",
      rateLimitLabel: "单 IP 每 10 分钟最多投递数",
      turnstileHeading: "Cloudflare Turnstile 验证码",
      turnstileEnvActive: "已通过 Worker 环境变量锁定配置。",
      turnstileSiteKeyLabel: "Turnstile Site Key (站点公钥)",
      turnstileSecretKeyLabel: "Turnstile Secret Key (服务端密钥)",
      turnstileSecretPlaceholder: "留空则保持原密钥不变",
      saveChanges: "保存设置",
      savingChanges: "保存中…",
      savedToast: "树屋设置已保存。",
      archiveHeading: "岁末纪念册导出",
      archiveDesc: "一键导出整棵树上的全部挂饰与信笺永久珍藏。",
      exportJson: "导出 JSON",
      exportMarkdown: "导出纪念信集 (.md)",
    },
    share: {
      title: "分享你的冬日松枝",
      subtitle: (owner) => `发送链接或二维码卡片，邀请好友来装饰 ${owner} 的树。`,
      copyLink: "复制专属链接",
      copied: "链接已复制",
      scanQr: "手机扫码直达",
    },
  },

  "zh-TW": {
    meta: { label: "繁體中文", shortLabel: "繁" },
    header: {
      keepsakeCount: (n) => `${n} 枚掛飾`,
      share: "邀請好友",
      owner: "樹主鑰匙",
      ownerActive: "樹屋設定",
      claimTree: "認領此樹",
      soundOn: "音樂盒開啟",
      soundOff: "靜音",
      visibilityBadge: {
        public: "公開信箋",
        owner_only: "僅樹主可讀",
        scheduled: "時光膠囊",
      },
    },
    stage: {
      tapTopperHint: (owner) => `點擊樹頂閱讀 ${owner} 的歡迎信`,
      hangCta: "掛上心意掛飾",
      pickBranchBanner: "輕點樹枝上閃爍的黃銅掛鉤",
      pickBranchSub: "挑選你想懸掛這枚心意的松枝位置。",
      cancelBranchPick: "保留目前位置",
      surpriseSlot: "隨機挑選枝頭",
      boughPage: (c, t) => `第 ${c} / ${t} 層樹冠`,
      prevBough: "上一層樹冠",
      nextBough: "下一層樹冠",
      emptyTreeHint: "冬夜松枝靜謐，來掛上第一枚祝福掛飾吧。",
      fromLabel: (s) => s,
      yoursBadge: "你的",
      privateTag: "火漆封緘",
    },
    composer: {
      title: "掛上一枚冬日掛飾",
      stepOrnament: "1. 挑選工藝掛飾",
      stepLetter: "2. 寫下信箋",
      materials: {
        glass: "吹製玻璃",
        brass: "黃銅琺瑯",
        wood_felt: "木藝毛氈",
        hearth_paper: "暖爐紙藝",
      },
      ornaments: {
        "crimson-bauble": "緋紅吹製玻璃球",
        "cobalt-starburst": "鈷藍星芒玻璃球",
        "emerald-icicle": "祖母綠冰柱墜",
        "frosted-finial": "霜白珍珠尖頂墜",
        "rose-reflector": "玫瑰水銀反光球",
        "amethyst-prism": "紫晶切面稜柱墜",
        "forest-snowglobe": "微縮松林水晶球",
        "celestial-sunburst": "鎏金太陽徽章",
        "brass-bell": "絲帶黃銅鈴鐺",
        "cloisonne-bird": "景泰藍冬鷦鷯",
        "winter-lantern": "暖燭黃銅提燈",
        "astrolabe-ring": "星盤渾天儀環",
        "pocket-watch": "復古報時懷錶",
        "enamel-robin": "琺瑯知更鳥",
        "dala-horse": "北歐彩繪木馬",
        "felt-mitten": "刺繡羊毛連指手套",
        "spiced-orange": "丁香風乾甜橙",
        "sugar-pinecone": "覆雪森林松果",
        "nutcracker-guard": "胡桃鉗士兵木偶",
        "knit-stocking": "費爾島編織長襪",
        "holly-acorn": "冬青漿果橡果束",
        "gingerbread-cottage": "糖霜薑餅木屋",
        "origami-crane": "金箔和紙千紙鶴",
        "wax-letter": "火漆迷你信封",
        "peppermint-cane": "絲帶薄荷拐杖糖",
        "moravian-star": "摩拉維亞立體紙星",
        "carousel-chime": "音樂盒旋轉木馬亭",
        "yule-log": "樹幹年輪蛋糕",
      },
      toppers: {
        "north-star": "鎏金北極星",
        "bethlehem-star": "伯利恆璀璨星芒",
        "velvet-bow": "波爾多絲絨蝴蝶結",
        "crescent-moon": "黃銅新月冠",
        "candle-crown": "北歐燭光花冠",
        "glass-finial-spire": "緋紅琉璃尖頂塔",
      },
      selectedHook: (p, s) => `樹冠 ${p} · ${s} 號枝頭`,
      chooseOnTree: "在樹上挑選位置",
      senderLabel: "署名",
      senderPlaceholder: "你的名字或暱稱",
      messageLabel: "冬日信箋",
      messagePlaceholder: (owner) =>
        `寫下一句溫暖祝福、今年的回憶，或悄悄對 ${owner} 說的話…`,
      privateToggleLabel: (owner) => `蓋上火漆，僅限 ${owner} 拆閱`,
      privateToggleHint: "大家都能看見枝頭的掛飾，但只有樹主能拆開信封。",
      ownerOnlyNotice: (owner) =>
        `此樹已設為私密信箱，所有留言皆為 ${owner} 火漆封存。`,
      scheduledNotice: (d) => `信箋將以火漆封存，於 ${d} 解封。`,
      securityLabel: "訪客驗證",
      turnstileUnconfigured: "尚未設定 Turnstile 驗證，請樹主登入後填寫金鑰。",
      hangButton: "掛上松枝",
      hangingButton: "正在繫上銅鉤…",
      nextWriteNote: "下一步：寫信箋",
      backToOrnaments: "更換掛飾",
      hungToast: "你的掛飾已輕輕掛上松枝。",
    },
    reader: {
      fromHeading: (s) => `來自 ${s}`,
      ownerWelcomeHeading: (owner) => `${owner} 的樹頂歡迎信`,
      sealedHeading: "火漆封緘的信箋",
      sealedOwnerOnlyBody: (owner) =>
        `這封信已由火漆妥善封存，僅限樹主 ${owner} 拆閱。`,
      sealedGuestPrivateBody: (owner) =>
        `寄信人將此信設為私密投遞，僅 ${owner} 可拆閱。`,
      sealedScheduledBody: (d) => `這枚冬日時光膠囊將於 ${d} 解封。`,
      receiptUnlockedNote: (owner) => `僅你（此裝置）與 ${owner} 可見。`,
      ownerUnlockedNote: "已透過樹主鑰匙拆閱。",
      deleteKeepsake: "摘除此掛飾",
      confirmDelete: "確認摘除",
      close: "關閉",
    },
    owner: {
      claimTitle: "認領你的專屬松枝樹",
      claimSubtitle: "設定樹主密碼以管理留言隱私權限、自訂樹頂裝飾並閱讀私密來信。",
      loginTitle: "解鎖樹屋控制台",
      loginSubtitle: "輸入樹主密碼以閱讀全部火漆來信並調整設定。",
      drawerTitle: "樹屋控制台",
      passwordLabel: "樹主密碼",
      passwordPlaceholder: "至少 6 個字元",
      claimButton: "認領並開啟控制台",
      signInButton: "解鎖進入",
      signOutButton: "鎖定登出",
      ownerNameLabel: "樹主稱呼",
      treeTitleLabel: "樹屋標題",
      welcomeNoteLabel: "樹頂歡迎語（點擊樹頂裝飾時顯示）",
      topperLabel: "樹頂冠飾",
      visibilityLabel: "信箋公開權限",
      visibilityDesc: {
        public: "訪客可點開掛飾閱讀未設私密的留言。",
        owner_only: "訪客可見掛飾與署名，信件內文僅樹主可讀。",
        scheduled: "到達解封時刻前全員火漆封存。",
      },
      revealDateLabel: "膠囊解封時間",
      allowGuestPrivateLabel: "公開模式下允許訪客單獨勾選私密信",
      hideSenderNamesLabel: "封緘狀態下同時隱藏署名",
      snowfallLabel: "開啟冬夜飄雪效果",
      rateLimitLabel: "單一 IP 每 10 分鐘投遞上限",
      turnstileHeading: "Cloudflare Turnstile 驗證",
      turnstileEnvActive: "已由 Worker 環境變數鎖定。",
      turnstileSiteKeyLabel: "Turnstile Site Key",
      turnstileSecretKeyLabel: "Turnstile Secret Key",
      turnstileSecretPlaceholder: "留空則維持原金鑰",
      saveChanges: "儲存設定",
      savingChanges: "儲存中…",
      savedToast: "設定已儲存。",
      archiveHeading: "歲末紀念冊匯出",
      archiveDesc: "下載整棵樹的全部掛飾與信箋永久珍藏。",
      exportJson: "下載 JSON",
      exportMarkdown: "下載紀念信集 (.md)",
    },
    share: {
      title: "分享你的冬日松枝",
      subtitle: (owner) => `分享連結或 QR 圖卡，邀請朋友為 ${owner} 掛上祝福。`,
      copyLink: "複製連結",
      copied: "已複製連結",
      scanQr: "手機相機掃描",
    },
  },

  ja: {
    meta: { label: "日本語", shortLabel: "JA" },
    header: {
      keepsakeCount: (n) => `${n} 個のオーナメント`,
      share: "シェア",
      owner: "オーナー鍵",
      ownerActive: "ツリー管理",
      claimTree: "ツリー登録",
      soundOn: "オルゴール ON",
      soundOff: "ミュート",
      visibilityBadge: {
        public: "公開レター",
        owner_only: "オーナー限定公開",
        scheduled: "タイムカプセル",
      },
    },
    stage: {
      tapTopperHint: (owner) => `${owner} からのメッセージを読む`,
      hangCta: "オーナメントを飾る",
      pickBranchBanner: "光っている真鍮のフックをタップしてください",
      pickBranchSub: "オーナメントを掛けたい枝を自由に選べます。",
      cancelBranchPick: "元の場所にする",
      surpriseSlot: "おまかせ配置",
      boughPage: (c, t) => `ツリー ${c} / ${t}`,
      prevBough: "前の枝ページ",
      nextBough: "次の枝ページ",
      emptyTreeHint: "静かな冬の針葉樹に、最初のオーナメントを飾りましょう。",
      fromLabel: (s) => s,
      yoursBadge: "あなた",
      privateTag: "封蝋",
    },
    composer: {
      title: "オーナメントとお手紙を飾る",
      stepOrnament: "1. 飾りを選ぶ",
      stepLetter: "2. お手紙を書く",
      materials: {
        glass: "吹きガラス",
        brass: "真鍮・七宝",
        wood_felt: "木彫・フェルト",
        hearth_paper: "紙細工・お菓子",
      },
      ornaments: {
        "crimson-bauble": "深紅のガラスボール",
        "cobalt-starburst": "蒼星のガラス玉",
        "emerald-icicle": "翠色のつらら雫",
        "frosted-finial": "霜パールのフィニアル",
        "rose-reflector": "薔薇色のリフレクター玉",
        "amethyst-prism": "紫水晶のプリズム雫",
        "forest-snowglobe": "小さな森のスノードーム",
        "celestial-sunburst": "金色の太陽オーナメント",
        "brass-bell": "リボンの真鍮ベル",
        "cloisonne-bird": "七宝焼きのミソサザイ",
        "winter-lantern": "灯りの真鍮ランタン",
        "astrolabe-ring": "天球儀アストロラーベ",
        "pocket-watch": "懐中時計のチャイム",
        "enamel-robin": "七宝のヨーロッパコマドリ",
        "dala-horse": "北欧のダーラナホース",
        "felt-mitten": "刺繍入りウールミトン",
        "spiced-orange": "クローブとドライオレンジ",
        "sugar-pinecone": "粉雪の松ぼっくり",
        "nutcracker-guard": "くるみ割り人形",
        "knit-stocking": "フェアアイル編みソックス",
        "holly-acorn": "柊とどんぐりの実",
        "gingerbread-cottage": "アイシングのお菓子の家",
        "origami-crane": "金箔和紙の折り鶴",
        "wax-letter": "封蝋ミニレター",
        "peppermint-cane": "ペパーミントキャンディ",
        "moravian-star": "モラヴィアの立体星",
        "carousel-chime": "回転木馬のパビリオン",
        "yule-log": "ブッシュ・ド・ノエル",
      },
      toppers: {
        "north-star": "北極星の金飾り",
        "bethlehem-star": "ベツレヘムの八芒星",
        "velvet-bow": "ボルドーのベルベットリボン",
        "crescent-moon": "真鍮の三日月",
        "candle-crown": "北欧キャンドルクラウン",
        "glass-finial-spire": "吹きガラスの尖塔飾り",
      },
      selectedHook: (p, s) => `ページ ${p}・枝フック #${s}`,
      chooseOnTree: "枝の場所を選ぶ",
      senderLabel: "お名前",
      senderPlaceholder: "ニックネームや名前",
      messageLabel: "冬のメッセージ",
      messagePlaceholder: (owner) =>
        `${owner} さんへのメッセージや今年の思い出をどうぞ…`,
      privateToggleLabel: (owner) => `${owner} さんだけが読める封蝋レターにする`,
      privateToggleHint:
        "枝のオーナメントは全員に見えますが、手紙の本文はオーナーだけが開けます。",
      ownerOnlyNotice: (owner) =>
        `このツリーのお手紙はすべて ${owner} さん専用に封蝋されます。`,
      scheduledNotice: (d) => `お手紙は ${d} まで封蝋されたまま届きます。`,
      securityLabel: "認証チェック",
      turnstileUnconfigured:
        "Turnstile が未設定です。オーナー設定からキーを登録してください。",
      hangButton: "枝に飾る",
      hangingButton: "飾り付け中…",
      nextWriteNote: "お手紙を書く",
      backToOrnaments: "飾りを選び直す",
      hungToast: "オーナメントを枝に飾りました。",
    },
    reader: {
      fromHeading: (s) => `${s} より`,
      ownerWelcomeHeading: (owner) => `${owner} からのご挨拶`,
      sealedHeading: "封蝋されたお手紙",
      sealedOwnerOnlyBody: (owner) =>
        `このお手紙は封蝋で閉じられており、${owner} さんだけが読むことができます。`,
      sealedGuestPrivateBody: (owner) =>
        `送り主により ${owner} さん宛ての非公開レターとして封蝋されています。`,
      sealedScheduledBody: (d) =>
        `このタイムカプセルは ${d} に開封されます。`,
      receiptUnlockedNote: (owner) =>
        `あなた（この端末）と ${owner} さんだけが表示できます。`,
      ownerUnlockedNote: "オーナー鍵で開封中。",
      deleteKeepsake: "この飾りを外す",
      confirmDelete: "本当に外す",
      close: "閉じる",
    },
    owner: {
      claimTitle: "あなたのツリーを初期設定",
      claimSubtitle:
        "オーナーパスワードを設定すると、公開範囲の変更や非公開レターの閲覧ができます。",
      loginTitle: "ツリー管理を開く",
      loginSubtitle: "オーナーパスワードを入力してください。",
      drawerTitle: "ツリー管理スタジオ",
      passwordLabel: "オーナーパスワード",
      passwordPlaceholder: "6文字以上",
      claimButton: "設定して開く",
      signInButton: "ロック解除",
      signOutButton: "ログアウト",
      ownerNameLabel: "オーナー名",
      treeTitleLabel: "ツリーのタイトル",
      welcomeNoteLabel: "トップ飾りのメッセージ",
      topperLabel: "ツリートッパー",
      visibilityLabel: "手紙の公開設定",
      visibilityDesc: {
        public: "誰でも公開されたお手紙を読めます。",
        owner_only: "飾りと名前は公開し、本文はオーナーだけが読めます。",
        scheduled: "指定日時になるまで全員に封蝋されます。",
      },
      revealDateLabel: "開封日時",
      allowGuestPrivateLabel: "公開モードでも個別の非公開チェックを許可する",
      hideSenderNamesLabel: "封蝋中は送り主の名前も伏せる",
      snowfallLabel: "雪のエフェクトを表示",
      rateLimitLabel: "10分あたりの投稿上限 (IP単位)",
      turnstileHeading: "Cloudflare Turnstile 設定",
      turnstileEnvActive: "環境変数で設定済みです。",
      turnstileSiteKeyLabel: "Turnstile Site Key",
      turnstileSecretKeyLabel: "Turnstile Secret Key",
      turnstileSecretPlaceholder: "空欄なら現在のキーを維持",
      saveChanges: "設定を保存",
      savingChanges: "保存中…",
      savedToast: "設定を保存しました。",
      archiveHeading: "思い出アーカイブ出力",
      archiveDesc: "すべてのお手紙を手元に保存できます。",
      exportJson: "JSON 保存",
      exportMarkdown: "手紙ブック保存 (.md)",
    },
    share: {
      title: "ツリーをシェア",
      subtitle: (owner) =>
        `リンクやQRコードをシェアして、${owner} のツリーに飾りを贈ってもらいましょう。`,
      copyLink: "リンクをコピー",
      copied: "コピーしました",
      scanQr: "スマホで読み取る",
    },
  },

  ko: {
    meta: { label: "한국어", shortLabel: "KO" },
    header: {
      keepsakeCount: (n) => `오너먼트 ${n}개`,
      share: "공유하기",
      owner: "주인 열쇠",
      ownerActive: "트리 설정",
      claimTree: "트리 등록",
      soundOn: "오르골 켜짐",
      soundOff: "음소거",
      visibilityBadge: {
        public: "공개 편지",
        owner_only: "주인만 열람",
        scheduled: "타임캡슐",
      },
    },
    stage: {
      tapTopperHint: (owner) => `${owner}님의 환영 인사 읽기`,
      hangCta: "오너먼트 달기",
      pickBranchBanner: "반짝이는 황동 고리를 탭하세요",
      pickBranchSub: "오너먼트를 걸고 싶은 나뭇가지를 직접 골라보세요.",
      cancelBranchPick: "현재 위치 유지",
      surpriseSlot: "자동 위치 선택",
      boughPage: (c, t) => `트리 ${c} / ${t}`,
      prevBough: "이전 트리",
      nextBough: "다음 트리",
      emptyTreeHint: "고요한 겨울 전나무 가지에 첫 오너먼트를 달아보세요.",
      fromLabel: (s) => s,
      yoursBadge: "내 편지",
      privateTag: "실링 봉인",
    },
    composer: {
      title: "오너먼트와 겨울 편지 남기기",
      stepOrnament: "1. 오너먼트 고르기",
      stepLetter: "2. 편지 쓰기",
      materials: {
        glass: "유리 공예",
        brass: "황동 & 에나멜",
        wood_felt: "우드 & 펠트",
        hearth_paper: "종이 & 베이킹",
      },
      ornaments: {
        "crimson-bauble": "크림슨 유리 볼",
        "cobalt-starburst": "코발트 별빛 구체",
        "emerald-icicle": "에메랄드 고드름 방울",
        "frosted-finial": "서리 진주 피니얼",
        "rose-reflector": "로즈 머큐리 리플렉터",
        "amethyst-prism": "자수정 프리즘 방울",
        "forest-snowglobe": "작은 숲 스노우볼",
        "celestial-sunburst": "금빛 태양 장식",
        "brass-bell": "리본 황동 종",
        "cloisonne-bird": "칠보 겨울 굴뚝새",
        "winter-lantern": "촛불 황동 랜턴",
        "astrolabe-ring": "천구의 아스트롤라베",
        "pocket-watch": "앤티크 회중시계",
        "enamel-robin": "에나멜 유럽울새",
        "dala-horse": "북유럽 달라호스",
        "felt-mitten": "자수 양모 벙어리장갑",
        "spiced-orange": "정향 드라이 오렌지",
        "sugar-pinecone": "눈 덮인 솔방울",
        "nutcracker-guard": "호두까기 병정 인형",
        "knit-stocking": "페어아일 니트 양말",
        "holly-acorn": "호랑가시나무와 도토리",
        "gingerbread-cottage": "아이싱 진저브레드 오두막",
        "origami-crane": "금박 종이학",
        "wax-letter": "실링 왁스 미니 편지",
        "peppermint-cane": "페퍼민트 지팡이 사탕",
        "moravian-star": "모라비안 입체 종이별",
        "carousel-chime": "오르골 회전목마",
        "yule-log": "부쉬 드 노엘 케이크",
      },
      toppers: {
        "north-star": "금빛 북극성",
        "bethlehem-star": "베들레헴 팔각별",
        "velvet-bow": "보르도 벨벳 리본",
        "crescent-moon": "황동 초승달",
        "candle-crown": "북유럽 촛불 왕관",
        "glass-finial-spire": "유리 피니얼 첨탑",
      },
      selectedHook: (p, s) => `트리 ${p} · #${s}번 가지`,
      chooseOnTree: "트리에서 위치 고르기",
      senderLabel: "보내는 사람",
      senderPlaceholder: "이름 또는 닉네임",
      messageLabel: "겨울 편지",
      messagePlaceholder: (owner) =>
        `${owner}님에게 전하고 싶은 따뜻한 인사와 올해의 추억을 적어보세요…`,
      privateToggleLabel: (owner) => `${owner}님만 읽을 수 있도록 봉인하기`,
      privateToggleHint:
        "오너먼트는 모두에게 보이지만 편지 내용은 트리 주인만 열어볼 수 있습니다.",
      ownerOnlyNotice: (owner) =>
        `이 트리의 모든 편지는 ${owner}님만 볼 수 있도록 자동 봉인됩니다.`,
      scheduledNotice: (d) => `편지는 ${d}까지 실링 왁스로 봉인됩니다.`,
      securityLabel: "방문자 확인",
      turnstileUnconfigured:
        "Turnstile 키가 아직 설정되지 않았습니다. 주인 설정에서 입력해주세요.",
      hangButton: "나뭇가지에 걸기",
      hangingButton: "오너먼트 거는 중…",
      nextWriteNote: "편지 작성하기",
      backToOrnaments: "오너먼트 다시 고르기",
      hungToast: "오너먼트가 나뭇가지에 걸렸습니다.",
    },
    reader: {
      fromHeading: (s) => `${s}님의 편지`,
      ownerWelcomeHeading: (owner) => `${owner}님의 환영 메모`,
      sealedHeading: "실링 왁스로 봉인된 편지",
      sealedOwnerOnlyBody: (owner) =>
        `이 편지는 안전하게 봉인되어 트리 주인 ${owner}님만 읽을 수 있습니다.`,
      sealedGuestPrivateBody: (owner) =>
        `작성자가 ${owner}님에게만 공개하도록 봉인한 편지입니다.`,
      sealedScheduledBody: (d) => `이 타임캡슐 편지는 ${d}에 열립니다.`,
      receiptUnlockedNote: (owner) =>
        `작성한 본인(현재 기기)과 ${owner}님에게만 보입니다.`,
      ownerUnlockedNote: "주인 열쇠로 열람 중입니다.",
      deleteKeepsake: "오너먼트 삭제",
      confirmDelete: "삭제 확인",
      close: "닫기",
    },
    owner: {
      claimTitle: "나만의 트리 등록하기",
      claimSubtitle:
        "비밀번호를 설정하면 편지 공개 여부와 트리 장식을 언제든 관리할 수 있습니다.",
      loginTitle: "트리 스튜디오 열기",
      loginSubtitle: "주인 비밀번호를 입력해 봉인된 편지를 확인하세요.",
      drawerTitle: "트리 스튜디오",
      passwordLabel: "주인 비밀번호",
      passwordPlaceholder: "6자 이상 입력",
      claimButton: "등록 후 열기",
      signInButton: "잠금 해제",
      signOutButton: "로그아웃",
      ownerNameLabel: "주인 이름",
      treeTitleLabel: "트리 제목",
      welcomeNoteLabel: "트리 꼭대기 환영 인사",
      topperLabel: "트리 토퍼 장식",
      visibilityLabel: "편지 공개 방식",
      visibilityDesc: {
        public: "방문자 누구나 공개 편지를 열어볼 수 있습니다.",
        owner_only: "오너먼트와 이름은 보이지만 내용은 주인만 읽습니다.",
        scheduled: "지정한 날짜가 될 때까지 모든 편지를 봉인합니다.",
      },
      revealDateLabel: "캡슐 공개 일시",
      allowGuestPrivateLabel: "공개 모드에서도 개별 비밀 편지 허용",
      hideSenderNamesLabel: "봉인된 편지의 작성자 이름도 가리기",
      snowfallLabel: "눈 내리는 배경 효과",
      rateLimitLabel: "10분당 최대 작성 횟수 (IP 기준)",
      turnstileHeading: "Cloudflare Turnstile 보안",
      turnstileEnvActive: "Worker 환경 변수로 고정되어 있습니다.",
      turnstileSiteKeyLabel: "Turnstile Site Key",
      turnstileSecretKeyLabel: "Turnstile Secret Key",
      turnstileSecretPlaceholder: "비워두면 기존 시크릿 유지",
      saveChanges: "설정 저장",
      savingChanges: "저장 중…",
      savedToast: "설정이 저장되었습니다.",
      archiveHeading: "추억 보관함 내보내기",
      archiveDesc: "트리에 달린 모든 편지를 파일로 소장하세요.",
      exportJson: "JSON 다운로드",
      exportMarkdown: "편지집 다운로드 (.md)",
    },
    share: {
      title: "트리 공유하기",
      subtitle: (owner) =>
        `링크나 QR 카드를 공유해 친구들이 ${owner}님의 트리를 꾸미도록 초대하세요.`,
      copyLink: "링크 복사",
      copied: "복사 완료",
      scanQr: "카메라로 QR 스캔",
    },
  },
};

export const SUPPORTED_LOCALES: LocaleCode[] = [
  "en",
  "zh-CN",
  "zh-TW",
  "ja",
  "ko",
];

const LOCALE_STORAGE_KEY = "bough_locale";

export function detectInitialLocale(): LocaleCode {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as LocaleCode | null;
    if (saved && SUPPORTED_LOCALES.includes(saved)) {
      return saved;
    }
  } catch {
    // ignore storage errors
  }

  if (typeof navigator !== "undefined") {
    const langs = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];
    for (const raw of langs) {
      const lower = (raw || "").toLowerCase();
      if (
        lower.startsWith("zh-tw") ||
        lower.startsWith("zh-hk") ||
        lower.includes("hant")
      ) {
        return "zh-TW";
      }
      if (lower.startsWith("zh")) return "zh-CN";
      if (lower.startsWith("ja")) return "ja";
      if (lower.startsWith("ko")) return "ko";
      if (lower.startsWith("en")) return "en";
    }
  }
  return "en";
}

export function persistLocale(locale: LocaleCode) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}
