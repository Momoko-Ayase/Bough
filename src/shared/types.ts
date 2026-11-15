export type VisibilityMode = "public" | "owner_only" | "scheduled";

export type RevealTarget = "public" | "owner_only";

export type OrnamentMaterial = "glass" | "brass" | "wood_felt" | "hearth_paper";

export type OrnamentId =
  // Blown Glass (7)
  | "crimson-bauble"
  | "cobalt-starburst"
  | "emerald-icicle"
  | "frosted-finial"
  | "rose-reflector"
  | "amethyst-prism"
  | "forest-snowglobe"
  // Brass & Enamel (7)
  | "celestial-sunburst"
  | "brass-bell"
  | "cloisonne-bird"
  | "winter-lantern"
  | "astrolabe-ring"
  | "pocket-watch"
  | "enamel-robin"
  // Wood & Felt (7)
  | "dala-horse"
  | "felt-mitten"
  | "spiced-orange"
  | "sugar-pinecone"
  | "nutcracker-guard"
  | "knit-stocking"
  | "holly-acorn"
  // Hearth & Paper (7)
  | "gingerbread-cottage"
  | "origami-crane"
  | "wax-letter"
  | "peppermint-cane"
  | "moravian-star"
  | "carousel-chime"
  | "yule-log";

export type TopperId =
  | "north-star"
  | "velvet-bow"
  | "crescent-moon"
  | "candle-crown"
  | "bethlehem-star"
  | "glass-finial-spire";

export type LocaleCode = "en" | "zh-CN" | "zh-TW" | "ja" | "ko";

export interface TreeConfigPublic {
  ownerName: string;
  treeTitle: string;
  welcomeNote: string;
  topperId: TopperId;
  visibilityMode: VisibilityMode;
  revealAt: string | null;
  allowGuestPrivate: boolean;
  hideSenderNamesWhenLocked: boolean;
  snowfallEnabled: boolean;
  turnstileSiteKey: string;
  turnstileConfigured: boolean;
  turnstileEnvLocked: boolean;
  authInitialized: boolean;
  envPasswordConfigured: boolean;
  rateLimitMaxPerWindow: number;
  updatedAt: number;
}

export interface KeepsakePublic {
  id: string;
  ornamentId: OrnamentId;
  senderName: string;
  message: string | null;
  isPrivate: boolean;
  isLockedForViewer: boolean;
  unlockedByReceipt: boolean;
  lockReason: "owner_only" | "scheduled" | "guest_private" | null;
  slotIndex: number;
  pageIndex: number;
  createdAt: number;
}

export interface TreeStateResponse {
  config: TreeConfigPublic;
  isOwner: boolean;
  keepsakes: KeepsakePublic[];
  totalCount: number;
  pageCount: number;
}

export interface CreateKeepsakeInput {
  ornamentId: OrnamentId;
  senderName: string;
  message: string;
  isPrivate?: boolean;
  pageIndex?: number;
  slotIndex?: number;
  turnstileToken: string;
}

export interface CreateKeepsakeResponse {
  keepsake: KeepsakePublic;
  receiptToken: string;
}

export interface UpdateConfigInput {
  ownerName?: string;
  treeTitle?: string;
  welcomeNote?: string;
  topperId?: TopperId;
  visibilityMode?: VisibilityMode;
  revealAt?: string | null;
  allowGuestPrivate?: boolean;
  hideSenderNamesWhenLocked?: boolean;
  snowfallEnabled?: boolean;
  turnstileSiteKey?: string;
  turnstileSecretKey?: string;
  rateLimitMaxPerWindow?: number;
  newPassword?: string;
}
