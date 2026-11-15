import type { OrnamentId, OrnamentMaterial, TopperId } from "./types";

export interface OrnamentMeta {
  id: OrnamentId;
  material: OrnamentMaterial;
  accentHex: string;
}

export interface TopperMeta {
  id: TopperId;
  accentHex: string;
}

export interface BranchHook {
  slotIndex: number;
  /** X percentage (0..100) relative to the 640x780 tree stage SVG */
  x: number;
  /** Y percentage (0..100) relative to the 640x780 tree stage SVG */
  y: number;
  tier: 1 | 2 | 3 | 4;
  swayDuration: number;
  swayDelay: number;
}

export const SLOTS_PER_PAGE = 14;

/**
 * 14 curated branch hooks nested naturally beneath pine bough tips across 4 tiers
 */
export const BRANCH_HOOKS: BranchHook[] = [
  // Tier 1 (Upper crown)
  { slotIndex: 0, x: 42.5, y: 26.8, tier: 1, swayDuration: 4.8, swayDelay: 0.1 },
  { slotIndex: 1, x: 57.5, y: 27.4, tier: 1, swayDuration: 5.2, swayDelay: 0.9 },

  // Tier 2 (Upper-mid boughs)
  { slotIndex: 2, x: 34.5, y: 39.2, tier: 2, swayDuration: 5.5, swayDelay: 0.4 },
  { slotIndex: 3, x: 50.0, y: 40.8, tier: 2, swayDuration: 4.9, swayDelay: 1.3 },
  { slotIndex: 4, x: 65.5, y: 39.5, tier: 2, swayDuration: 5.6, swayDelay: 0.7 },

  // Tier 3 (Lower-mid boughs)
  { slotIndex: 5, x: 27.5, y: 53.2, tier: 3, swayDuration: 5.8, swayDelay: 1.1 },
  { slotIndex: 6, x: 42.2, y: 55.4, tier: 3, swayDuration: 5.1, swayDelay: 0.2 },
  { slotIndex: 7, x: 57.8, y: 55.0, tier: 3, swayDuration: 5.4, swayDelay: 1.6 },
  { slotIndex: 8, x: 72.5, y: 53.0, tier: 3, swayDuration: 6.0, swayDelay: 0.5 },

  // Tier 4 (Sweeping base boughs)
  { slotIndex: 9, x: 21.8, y: 67.8, tier: 4, swayDuration: 6.2, swayDelay: 0.8 },
  { slotIndex: 10, x: 35.8, y: 70.2, tier: 4, swayDuration: 5.3, swayDelay: 1.5 },
  { slotIndex: 11, x: 50.0, y: 71.2, tier: 4, swayDuration: 5.7, swayDelay: 0.3 },
  { slotIndex: 12, x: 64.2, y: 70.0, tier: 4, swayDuration: 5.0, swayDelay: 1.2 },
  { slotIndex: 13, x: 78.2, y: 67.6, tier: 4, swayDuration: 6.1, swayDelay: 0.6 },
];

export const ORNAMENT_CATALOG: OrnamentMeta[] = [
  // Blown Glass (7)
  { id: "crimson-bauble", material: "glass", accentHex: "#B8323B" },
  { id: "cobalt-starburst", material: "glass", accentHex: "#2E5B9E" },
  { id: "emerald-icicle", material: "glass", accentHex: "#2E856E" },
  { id: "frosted-finial", material: "glass", accentHex: "#DFD7C8" },
  { id: "rose-reflector", material: "glass", accentHex: "#D9798E" },
  { id: "amethyst-prism", material: "glass", accentHex: "#7A4996" },
  { id: "forest-snowglobe", material: "glass", accentHex: "#5AA8B8" },

  // Gilded Brass & Enamel (7)
  { id: "celestial-sunburst", material: "brass", accentHex: "#D4AA5B" },
  { id: "brass-bell", material: "brass", accentHex: "#DEB868" },
  { id: "cloisonne-bird", material: "brass", accentHex: "#3C7A89" },
  { id: "winter-lantern", material: "brass", accentHex: "#E8A84C" },
  { id: "astrolabe-ring", material: "brass", accentHex: "#D9B468" },
  { id: "pocket-watch", material: "brass", accentHex: "#CEA252" },
  { id: "enamel-robin", material: "brass", accentHex: "#C74338" },

  // Nordic Wood & Felt (7)
  { id: "dala-horse", material: "wood_felt", accentHex: "#C44536" },
  { id: "felt-mitten", material: "wood_felt", accentHex: "#9E3B42" },
  { id: "spiced-orange", material: "wood_felt", accentHex: "#D97925" },
  { id: "sugar-pinecone", material: "wood_felt", accentHex: "#8C6239" },
  { id: "nutcracker-guard", material: "wood_felt", accentHex: "#B5333A" },
  { id: "knit-stocking", material: "wood_felt", accentHex: "#A8323B" },
  { id: "holly-acorn", material: "wood_felt", accentHex: "#8F6238" },

  // Hearth & Paper (7)
  { id: "gingerbread-cottage", material: "hearth_paper", accentHex: "#B56E3B" },
  { id: "origami-crane", material: "hearth_paper", accentHex: "#E8DFCA" },
  { id: "wax-letter", material: "hearth_paper", accentHex: "#A12B32" },
  { id: "peppermint-cane", material: "hearth_paper", accentHex: "#C83E46" },
  { id: "moravian-star", material: "hearth_paper", accentHex: "#F0E2C4" },
  { id: "carousel-chime", material: "hearth_paper", accentHex: "#C94A52" },
  { id: "yule-log", material: "hearth_paper", accentHex: "#7A4928" },
];

export const TOPPER_CATALOG: TopperMeta[] = [
  { id: "north-star", accentHex: "#E5C170" },
  { id: "bethlehem-star", accentHex: "#F5DC98" },
  { id: "velvet-bow", accentHex: "#9E2832" },
  { id: "crescent-moon", accentHex: "#DFC07C" },
  { id: "candle-crown", accentHex: "#F2B857" },
  { id: "glass-finial-spire", accentHex: "#D95B66" },
];

export const VALID_ORNAMENT_IDS = new Set<string>(
  ORNAMENT_CATALOG.map((o) => o.id)
);

export const VALID_TOPPER_IDS = new Set<string>(
  TOPPER_CATALOG.map((t) => t.id)
);

export const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";
export const TURNSTILE_TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";
