import { Lock, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { BRANCH_HOOKS } from "../../shared/catalog";
import type { KeepsakePublic, TopperId } from "../../shared/types";
import type { LocaleDictionary } from "../i18n/dictionaries";
import { OrnamentArtwork, TopperArtwork } from "./OrnamentArtwork";

interface EvergreenStageProps {
  topperId: TopperId;
  ownerName: string;
  keepsakesOnPage: KeepsakePublic[];
  pageIndex: number;
  pickingBranch: boolean;
  selectedSlot: number | null;
  newlyHungId: string | null;
  t: LocaleDictionary;
  onSelectTopper: () => void;
  onSelectKeepsake: (keepsake: KeepsakePublic) => void;
  onPickBranchSlot: (slotIndex: number) => void;
}

const FAIRY_BULBS = [
  { cx: 294, cy: 184, r: 3.1, delay: "0s" },
  { cx: 344, cy: 204, r: 2.8, delay: "1.1s" },
  { cx: 256, cy: 266, r: 3.4, delay: "0.4s" },
  { cx: 320, cy: 286, r: 3.0, delay: "1.7s" },
  { cx: 378, cy: 274, r: 3.2, delay: "0.8s" },
  { cx: 214, cy: 368, r: 3.4, delay: "2.1s" },
  { cx: 286, cy: 392, r: 3.1, delay: "0.6s" },
  { cx: 358, cy: 388, r: 3.5, delay: "1.4s" },
  { cx: 422, cy: 370, r: 3.2, delay: "2.5s" },
  { cx: 174, cy: 484, r: 3.5, delay: "0.9s" },
  { cx: 248, cy: 508, r: 3.2, delay: "1.9s" },
  { cx: 328, cy: 514, r: 3.6, delay: "0.3s" },
  { cx: 402, cy: 504, r: 3.3, delay: "2.2s" },
  { cx: 466, cy: 480, r: 3.4, delay: "1.2s" },
  { cx: 208, cy: 582, r: 3.6, delay: "1.6s" },
  { cx: 320, cy: 596, r: 3.4, delay: "0.5s" },
  { cx: 432, cy: 580, r: 3.6, delay: "2.6s" },
];

const HOLLY_CLUSTERS = [
  { x: 280, y: 218 },
  { x: 356, y: 236 },
  { x: 236, y: 324 },
  { x: 398, y: 332 },
  { x: 298, y: 448 },
  { x: 196, y: 444 },
  { x: 438, y: 442 },
  { x: 266, y: 558 },
  { x: 382, y: 556 },
];

const NEEDLE_FRONDS = [
  // Subtle interior botanical pine-needle strokes across the canopy
  "M320 135 L302 162 M320 135 L338 162 M320 148 L320 172",
  "M288 198 L268 224 M288 198 L296 226 M352 198 L344 226 M352 198 L372 224",
  "M254 282 L228 312 M254 282 L264 314 M320 294 L304 326 M320 294 L336 326 M386 282 L376 314 M386 282 L412 312",
  "M218 386 L188 420 M218 386 L232 422 M288 402 L270 438 M352 402 L370 438 M422 386 L408 422 M422 386 L452 420",
  "M176 498 L142 536 M176 498 L194 538 M252 518 L232 558 M320 524 L302 564 M320 524 L338 564 M388 518 L408 558 M464 498 L446 538 M464 498 L498 536",
];

export function EvergreenStage({
  topperId,
  ownerName,
  keepsakesOnPage,
  pickingBranch,
  selectedSlot,
  newlyHungId,
  t,
  onSelectTopper,
  onSelectKeepsake,
  onPickBranchSlot,
}: EvergreenStageProps) {
  const slotMap = new Map<number, KeepsakePublic>();
  for (const k of keepsakesOnPage) {
    slotMap.set(k.slotIndex, k);
  }

  return (
    <div className="relative mx-auto w-full max-w-[590px] select-none aspect-[640/780]">
      {/* Multi-layered candle & starlight radial aura */}
      <div
        className="pointer-events-none absolute inset-x-[6%] top-[5%] bottom-[9%] rounded-full opacity-75 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(229,193,112,0.24) 0%, rgba(32,87,71,0.32) 45%, rgba(10,23,28,0) 76%)",
        }}
      />

      {/* Botanical Noble Fir Illustration + Heirloom Base & Wrapped Parcels */}
      <svg
        viewBox="0 0 640 780"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full drop-shadow-[0_26px_44px_rgba(3,9,12,0.8)]"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="hearth-floor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AA5B" stopOpacity="0.24" />
            <stop offset="55%" stopColor="#173831" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0A171C" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="skirt-linen" x1="170" y1="680" x2="470" y2="742" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DFD2BC" />
            <stop offset="50%" stopColor="#F4EBDC" />
            <stop offset="100%" stopColor="#C4B396" />
          </linearGradient>
          <linearGradient id="drum-crimson" x1="255" y1="628" x2="385" y2="714" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9E242E" />
            <stop offset="52%" stopColor="#75151E" />
            <stop offset="100%" stopColor="#4A0A10" />
          </linearGradient>
          <linearGradient id="trunk-bark" x1="296" y1="590" x2="344" y2="656" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#613D24" />
            <stop offset="55%" stopColor="#402514" />
            <stop offset="100%" stopColor="#241308" />
          </linearGradient>

          {/* 5 Botanical Evergreen Foliage Gradients */}
          <linearGradient id="bough-shadow" x1="320" y1="110" x2="320" y2="635" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0E2922" />
            <stop offset="100%" stopColor="#071713" />
          </linearGradient>
          <linearGradient id="bough-tier-5" x1="320" y1="420" x2="320" y2="628" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1B473B" />
            <stop offset="65%" stopColor="#14382E" />
            <stop offset="100%" stopColor="#0D261F" />
          </linearGradient>
          <linearGradient id="bough-tier-4" x1="320" y1="320" x2="320" y2="538" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#225748" />
            <stop offset="68%" stopColor="#184236" />
            <stop offset="100%" stopColor="#102E25" />
          </linearGradient>
          <linearGradient id="bough-tier-3" x1="320" y1="225" x2="320" y2="432" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#296654" />
            <stop offset="70%" stopColor="#1D4E40" />
            <stop offset="100%" stopColor="#14382E" />
          </linearGradient>
          <linearGradient id="bough-tier-2" x1="320" y1="150" x2="320" y2="332" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#317561" />
            <stop offset="72%" stopColor="#235949" />
            <stop offset="100%" stopColor="#194236" />
          </linearGradient>
          <linearGradient id="bough-tier-1" x1="320" y1="92" x2="320" y2="238" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B8770" />
            <stop offset="100%" stopColor="#245C4B" />
          </linearGradient>

          <radialGradient id="warm-bulb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBE0" stopOpacity="1" />
            <stop offset="42%" stopColor="#F5C469" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F5C469" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Distant winter constellation stars */}
        <g opacity="0.55">
          <path d="M98 122L100 127L105 129L100 131L98 136L96 131L91 129L96 127Z" fill="#F5DFA8" />
          <path d="M546 152L547.8 156.2L552 158L547.8 159.8L546 164L544.2 159.8L540 158L544.2 156.2Z" fill="#F5DFA8" />
          <circle cx="136" cy="238" r="1.4" fill="#F5EFE4" />
          <circle cx="512" cy="264" r="1.5" fill="#F5EFE4" />
          <circle cx="82" cy="368" r="1.3" fill="#E5C170" />
          <circle cx="558" cy="390" r="1.4" fill="#E5C170" />
          <circle cx="114" cy="492" r="1.2" fill="#F5EFE4" />
          <circle cx="534" cy="512" r="1.2" fill="#F5EFE4" />
        </g>

        {/* Ground glow + Embroidered Cream Linen Tree Skirt */}
        <ellipse cx="320" cy="716" rx="255" ry="44" fill="url(#hearth-floor)" />
        <ellipse
          cx="320"
          cy="714"
          rx="168"
          ry="26"
          fill="url(#skirt-linen)"
          stroke="#B8A483"
          strokeWidth="1.5"
        />
        <ellipse
          cx="320"
          cy="714"
          rx="154"
          ry="21"
          stroke="#A62B35"
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.7"
        />
        <ellipse cx="320" cy="706" rx="88" ry="12" fill="#0A171C" opacity="0.35" />

        {/* Heirloom Brass-Banded Drum Planter & Trunk */}
        <path d="M298 592 H342 L346 646 H294 Z" fill="url(#trunk-bark)" />
        {/* Bark grain lines */}
        <path d="M310 600 V642 M322 598 V644 M332 602 V640" stroke="#291509" strokeWidth="1.3" opacity="0.7" />
        {/* Planter drum */}
        <path
          d="M262 642 C292 634, 348 634, 378 642 L368 706 C340 715, 300 715, 272 706 Z"
          fill="url(#drum-crimson)"
          stroke="#42090E"
          strokeWidth="1.4"
        />
        {/* Brass hoops & diagonal drum lacing */}
        <path d="M262 645 C292 652, 348 652, 378 645" stroke="#E5C170" strokeWidth="3.2" fill="none" />
        <path d="M271 701 C300 709, 340 709, 369 701" stroke="#E5C170" strokeWidth="3.2" fill="none" />
        <path
          d="M270 648 L295 704 L320 650 L345 704 L370 648"
          stroke="#D4AA5B"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Wrapped Keepsake Gift Parcels Nestled Under the Boughs */}
        {/* Left parcel: Deep spruce box with gold satin bow */}
        <g transform="translate(198, 668)">
          <rect x="0" y="10" width="52" height="36" rx="3" fill="#1B4D3E" stroke="#0E2E25" strokeWidth="1.2" />
          <rect x="-2" y="6" width="56" height="8" rx="2" fill="#23614F" stroke="#0E2E25" strokeWidth="1.1" />
          <rect x="22" y="6" width="8" height="40" fill="#E5C170" />
          <path d="M26 6 C18 -3, 10 1, 15 6 C18 8, 23 7, 26 6 C29 7, 34 8, 37 6 C42 1, 34 -3, 26 6 Z" fill="#F2D288" stroke="#8C6318" strokeWidth="0.9" />
        </g>

        {/* Right parcel: Warm parchment parcel with crimson ribbon + round hatbox */}
        <g transform="translate(388, 672)">
          <rect x="0" y="8" width="56" height="34" rx="3" fill="#EFE4CE" stroke="#B8A382" strokeWidth="1.2" />
          <rect x="24" y="8" width="8" height="34" fill="#B02632" />
          <rect x="0" y="21" width="56" height="6" fill="#B02632" />
          <path d="M28 8 C20 -1, 13 3, 18 8 C21 10, 25 9, 28 8 C31 9, 35 10, 38 8 C43 3, 36 -1, 28 8 Z" fill="#C9323E" stroke="#6E1119" strokeWidth="0.9" />
        </g>
        <g transform="translate(362, 690)">
          <ellipse cx="20" cy="22" rx="18" ry="6" fill="#8C6232" />
          <rect x="2" y="8" width="36" height="14" fill="#C99B49" stroke="#6E4E17" strokeWidth="1" />
          <ellipse cx="20" cy="8" rx="19" ry="5.5" fill="#E5BE6E" stroke="#6E4E17" strokeWidth="1" />
        </g>

        {/* Deep Interior Evergreen Core Silhouette (creates dense depth between tiers) */}
        <path
          d="M320 98
             L412 246 L378 244
             L468 378 L424 374
             L518 508 L468 502
             L562 606 C445 648, 195 648, 78 606
             L172 502 L122 508
             L216 374 L172 378
             L262 244 L228 246 Z"
          fill="url(#bough-shadow)"
        />

        {/* ==================== TIER 5: GRAND SWEEPING BASE BOUGHS ==================== */}
        <path
          d="M320 412
             C392 482, 478 544, 560 598
             C534 616, 502 620, 478 606
             C464 628, 430 634, 406 618
             C390 638, 356 642, 336 624
             C326 640, 314 640, 304 624
             C284 642, 250 638, 234 618
             C210 634, 176 628, 162 606
             C138 620, 106 616, 80 598
             C162 544, 248 482, 320 412 Z"
          fill="url(#bough-tier-5)"
          stroke="#275E4E"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Ambient shadow cast by Tier 4 onto Tier 5 */}
        <path
          d="M140 518 C220 558, 420 558, 500 518 C448 482, 380 442, 320 412 C260 442, 192 482, 140 518 Z"
          fill="#071713"
          opacity="0.46"
        />

        {/* ==================== TIER 4: LOWER-MID BOUGHS ==================== */}
        <path
          d="M320 314
             C382 384, 454 446, 522 502
             C496 520, 466 522, 444 508
             C430 530, 398 536, 376 520
             C360 538, 336 540, 320 524
             C304 540, 280 538, 264 520
             C242 536, 210 530, 196 508
             C174 522, 144 520, 118 502
             C186 446, 258 384, 320 314 Z"
          fill="url(#bough-tier-4)"
          stroke="#31735F"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Shadow cast by Tier 3 */}
        <path
          d="M178 416 C244 450, 396 450, 462 416 C416 380, 366 344, 320 314 C274 344, 224 380, 178 416 Z"
          fill="#081C17"
          opacity="0.42"
        />

        {/* ==================== TIER 3: HEART CANOPY BOUGHS ==================== */}
        <path
          d="M320 222
             C372 288, 428 346, 480 398
             C456 414, 430 416, 410 402
             C396 422, 368 426, 348 412
             C334 428, 306 428, 292 412
             C272 426, 244 422, 230 402
             C210 416, 184 414, 160 398
             C212 346, 268 288, 320 222 Z"
          fill="url(#bough-tier-3)"
          stroke="#3B8770"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Shadow cast by Tier 2 */}
        <path
          d="M216 314 C268 342, 372 342, 424 314 C386 280, 352 250, 320 222 C288 250, 254 280, 216 314 Z"
          fill="#0B241D"
          opacity="0.38"
        />

        {/* ==================== TIER 2: UPPER CANOPY BOUGHS ==================== */}
        <path
          d="M320 148
             C358 206, 400 256, 438 302
             C416 316, 394 316, 376 305
             C362 322, 338 326, 320 312
             C302 326, 278 322, 264 305
             C246 316, 224 316, 202 302
             C240 256, 282 206, 320 148 Z"
          fill="url(#bough-tier-2)"
          stroke="#469B81"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* ==================== TIER 1: NOBLE CROWN SPIRE ==================== */}
        <path
          d="M320 88
             C346 140, 374 180, 398 216
             C380 228, 362 228, 346 218
             C334 234, 306 234, 294 218
             C278 228, 260 228, 242 216
             C266 180, 294 140, 320 88 Z"
          fill="url(#bough-tier-1)"
          stroke="#56AD92"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* Botanical Interior Pine-Needle Fronds */}
        <g stroke="#4BA388" strokeWidth="1.15" strokeLinecap="round" opacity="0.38">
          {NEEDLE_FRONDS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {/* Soft Fresh Snow Cushions Resting Naturally on Outer Bough Tips */}
        <g stroke="#E9F2F0" strokeLinecap="round" fill="none" opacity="0.58">
          <path d="M245 216 Q268 226 291 218 M349 218 Q372 226 395 216" strokeWidth="3.2" />
          <path d="M205 302 Q234 314 261 305 M379 305 Q406 314 435 302" strokeWidth="3.4" />
          <path d="M164 398 Q196 413 227 402 M413 402 Q444 413 476 398" strokeWidth="3.6" />
          <path d="M122 502 Q158 519 193 508 M447 508 Q482 519 518 502" strokeWidth="3.8" />
          <path d="M84 598 Q122 616 159 606 M481 606 Q518 616 556 598" strokeWidth="4" />
        </g>

        {/* Draped Bordeaux Velvet Ribbon Swags */}
        <g stroke="#9E2430" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.82">
          <path d="M254 206 Q320 246 386 206" />
          <path d="M206 296 Q320 356 434 296" />
          <path d="M164 394 Q242 442 320 412 Q398 442 476 394" />
          <path d="M122 498 Q220 558 320 520 Q420 558 518 498" />
        </g>

        {/* Spun-Brass Pearl Garlands & Fairy Light Cord */}
        <g stroke="#E5C170" fill="none" opacity="0.78">
          <path d="M262 190 Q320 226 378 190" strokeWidth="1.3" strokeDasharray="2 5.5" />
          <path d="M220 274 Q320 332 420 274" strokeWidth="1.4" strokeDasharray="2.2 6" />
          <path d="M178 372 Q320 448 462 372" strokeWidth="1.5" strokeDasharray="2.4 6.5" />
          <path d="M138 482 Q320 572 502 482" strokeWidth="1.6" strokeDasharray="2.6 7" />
          <path d="M98 582 Q320 672 542 582" strokeWidth="1.6" strokeDasharray="2.8 7" />
        </g>

        {/* Tiny Botanical Crimson Holly Berry Clusters */}
        {HOLLY_CLUSTERS.map((c, idx) => (
          <g key={idx}>
            <circle cx={c.x - 2.4} cy={c.y + 1.5} r="2.2" fill="#BD2834" />
            <circle cx={c.x + 2.4} cy={c.y + 1.8} r="2.0" fill="#9E1E28" />
            <circle cx={c.x} cy={c.y - 1.6} r="2.3" fill="#D93644" />
          </g>
        ))}

        {/* Twinkling Warm Incandescent Fairy Lights */}
        {FAIRY_BULBS.map((bulb, i) => (
          <g
            key={i}
            className="bough-fairy-bulb"
            style={{ animationDelay: bulb.delay }}
          >
            <circle cx={bulb.cx} cy={bulb.cy} r={bulb.r * 4.5} fill="url(#warm-bulb)" />
            <circle cx={bulb.cx} cy={bulb.cy} r={bulb.r} fill="#FFFBE6" />
          </g>
        ))}
      </svg>

      {/* Interactive Crown Tree Topper (Owner's Welcome Note) */}
      <motion.button
        type="button"
        onClick={onSelectTopper}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.96 }}
        title={t.stage.tapTopperHint(ownerName)}
        aria-label={t.stage.tapTopperHint(ownerName)}
        className="group absolute left-1/2 top-[10.8%] z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5C170]"
      >
        <TopperArtwork
          id={topperId}
          className="h-20 w-20 sm:h-24 sm:w-24 drop-shadow-[0_6px_20px_rgba(232,198,122,0.5)] transition-transform duration-300"
        />
        <span className="pointer-events-none absolute left-1/2 -bottom-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#D4AA5B]/45 bg-[#0D1E24]/92 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-[#F3DFB3] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          {ownerName}
        </span>
      </motion.button>

      {/* 14 Curated Evergreen Branch Hooks */}
      {BRANCH_HOOKS.map((hook) => {
        const keepsake = slotMap.get(hook.slotIndex);

        if (keepsake) {
          const isNewlyHung = keepsake.id === newlyHungId;
          return (
            <div
              key={`ornament-${keepsake.id}`}
              style={{
                left: `${hook.x}%`,
                top: `${hook.y}%`,
              }}
              className="absolute z-20 -translate-x-1/2 -translate-y-[8%]"
            >
              {/* Brass S-hook pin gleaming on the pine needle */}
              <div className="mx-auto h-1.5 w-1.5 rounded-full bg-[#F2D288] shadow-[0_0_6px_rgba(242,210,136,0.85)]" />

              <motion.button
                type="button"
                initial={
                  isNewlyHung
                    ? { scale: 0.3, rotate: -16, opacity: 0 }
                    : { scale: 0.92, opacity: 0 }
                }
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 16,
                }}
                whileHover={{ scale: 1.09, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectKeepsake(keepsake)}
                className="group relative flex cursor-pointer flex-col items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E5C170]"
              >
                {isNewlyHung && (
                  <span className="pointer-events-none absolute -inset-2 animate-ping rounded-full bg-[#E5C170]/30" />
                )}

                <div
                  style={{
                    transformOrigin: "50% 4px",
                    animationDuration: `${hook.swayDuration}s`,
                    animationDelay: `${hook.swayDelay}s`,
                  }}
                  className="bough-pendulum"
                >
                  <OrnamentArtwork
                    id={keepsake.ornamentId}
                    className="h-13 w-13 sm:h-[62px] sm:w-[62px] drop-shadow-[0_10px_14px_rgba(4,10,13,0.72)]"
                  />
                </div>

                {/* Crisp sender ribbon tag */}
                <span className="-mt-1 inline-flex max-w-[96px] items-center gap-1 truncate rounded-full border border-[#D4AA5B]/40 bg-[#0F2229]/95 px-2.5 py-0.5 text-[11px] font-medium text-[#F7F1E6] shadow-[0_3px_10px_rgba(0,0,0,0.55)] backdrop-blur-xs transition-colors group-hover:border-[#E5C170]/85 group-hover:bg-[#17333D]">
                  {keepsake.isLockedForViewer && (
                    <Lock className="h-2.5 w-2.5 shrink-0 text-[#E5C170]" />
                  )}
                  {keepsake.unlockedByReceipt && (
                    <Sparkles className="h-2.5 w-2.5 shrink-0 text-[#E5C170]" />
                  )}
                  <span className="truncate">
                    {t.stage.fromLabel(keepsake.senderName)}
                  </span>
                </span>
              </motion.button>
            </div>
          );
        }

        const isSelected = selectedSlot === hook.slotIndex;
        if (!pickingBranch) {
          return (
            <button
              key={`empty-subtle-${hook.slotIndex}`}
              type="button"
              onClick={() => onPickBranchSlot(hook.slotIndex)}
              style={{ left: `${hook.x}%`, top: `${hook.y}%` }}
              title={`#${hook.slotIndex + 1}`}
              aria-label={`Branch hook ${hook.slotIndex + 1}`}
              className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer p-2.5 opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
            >
              <span className="block h-2 w-2 rounded-full border border-[#E5C170]/75 bg-[#D4AA5B]/25 transition-transform duration-200 group-hover:scale-150 group-hover:bg-[#E5C170]/70" />
            </button>
          );
        }

        return (
          <motion.button
            key={`pick-hook-${hook.slotIndex}`}
            type="button"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.18 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onPickBranchSlot(hook.slotIndex)}
            style={{ left: `${hook.x}%`, top: `${hook.y}%` }}
            className={`absolute z-30 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border text-[11px] font-mono font-medium shadow-lg transition-colors ${
              isSelected
                ? "border-[#FFF3CE] bg-[#D4AA5B] text-[#0A171C] ring-4 ring-[#D4AA5B]/35"
                : "border-[#E5C170]/80 bg-[#0D2229]/90 text-[#F5DFA8] hover:bg-[#D4AA5B] hover:text-[#0A171C]"
            }`}
          >
            {hook.slotIndex + 1}
          </motion.button>
        );
      })}
    </div>
  );
}
