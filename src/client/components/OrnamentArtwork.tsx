import { useId } from "react";
import type { OrnamentId, TopperId } from "../../shared/types";

interface OrnamentArtworkProps {
  id: OrnamentId;
  className?: string;
}

/**
 * 28 museum-grade bespoke keepsake ornaments across 4 tactile material families:
 * Blown Glass (7), Brass & Enamel (7), Wood & Felt (7), and Hearth & Paper (7).
 * Uses `useId()` for SVG gradient/filter IDs so multiple instances on screen never clash.
 */
export function OrnamentArtwork({
  id,
  className = "w-12 h-12",
}: OrnamentArtworkProps) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 64 74"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-brass`} x1="24" y1="4" x2="40" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF3CE" />
          <stop offset="48%" stopColor="#D8AD59" />
          <stop offset="100%" stopColor="#7C5616" />
        </linearGradient>
      </defs>

      {/* Shared heirloom brass suspension ring & pearl rivet */}
      <circle
        cx="32"
        cy="6.2"
        r="3.8"
        stroke={`url(#${uid}-brass)`}
        strokeWidth="1.8"
        fill="none"
      />
      <circle cx="30.8" cy="4.2" r="1" fill="#FFF8E2" />

      {renderOrnamentBody(id, uid)}
    </svg>
  );
}

function BrassCrownCap({ uid, y = 10 }: { uid: string; y?: number }) {
  return (
    <g>
      <rect
        x="26"
        y={y}
        width="12"
        height="5.4"
        rx="1.6"
        fill={`url(#${uid}-brass)`}
        stroke="#6B4810"
        strokeWidth="0.9"
      />
      <line x1="28.5" y1={y + 0.8} x2="28.5" y2={y + 4.6} stroke="#9E7124" strokeWidth="0.7" />
      <line x1="32" y1={y + 0.8} x2="32" y2={y + 4.6} stroke="#FFF2CA" strokeWidth="0.8" />
      <line x1="35.5" y1={y + 0.8} x2="35.5" y2={y + 4.6} stroke="#9E7124" strokeWidth="0.7" />
      <path
        d={`M25.8 ${y + 5.2} Q28.9 ${y + 7.4} 32 ${y + 5.2} Q35.1 ${y + 7.4} 38.2 ${y + 5.2}`}
        stroke="#FFF0C4"
        strokeWidth="0.95"
        fill="#B88B38"
      />
    </g>
  );
}

function GlassSpecularArc() {
  return (
    <g pointerEvents="none">
      <path
        d="M17.2 28 C19.2 21.5, 24.2 18.5, 29 18.2"
        stroke="#FFFFFF"
        strokeWidth="2.8"
        strokeLinecap="round"
        opacity="0.75"
      />
      <circle cx="16.2" cy="33" r="1.5" fill="#FFFFFF" opacity="0.68" />
      <path
        d="M45 52 C41.5 57.5, 36.5 60, 31 60.5"
        stroke="#FFE8C2"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.35"
      />
    </g>
  );
}

function renderOrnamentBody(id: OrnamentId, uid: string) {
  switch (id) {
    /* ==================== 1. BLOWN GLASS (7) ==================== */
    case "crimson-bauble":
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-g`} cx="35%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#FF858D" />
              <stop offset="36%" stopColor="#C92A37" />
              <stop offset="78%" stopColor="#751019" />
              <stop offset="100%" stopColor="#3E060B" />
            </radialGradient>
          </defs>
          <BrassCrownCap uid={uid} y={10.8} />
          <circle cx="32" cy="40" r="24" fill={`url(#${uid}-g)`} stroke="#540C13" strokeWidth="1.1" />
          {/* Hand-painted gold leaf garlands & pearls */}
          <path d="M8.5 37 C18 32, 46 32, 55.5 37" stroke="#F2D388" strokeWidth="1.2" opacity="0.9" />
          <path d="M8.5 43.5 C18 48.5, 46 48.5, 55.5 43.5" stroke="#F2D388" strokeWidth="1.2" opacity="0.9" />
          <path d="M9.5 40.2 Q15 35 20.5 40.2 T32 40.2 T43.5 40.2 T54.5 40.2" stroke="#FFF3CE" strokeWidth="1" fill="none" opacity="0.85" />
          <path d="M32 28L34 36L42 38L34 40L32 48L30 40L22 38L30 36L32 28Z" fill="#FFF0BE" />
          <circle cx="19" cy="40.2" r="1.4" fill="#FFF8E3" />
          <circle cx="45" cy="40.2" r="1.4" fill="#FFF8E3" />
          <GlassSpecularArc />
        </g>
      );

    case "cobalt-starburst":
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-g`} cx="34%" cy="26%" r="70%">
              <stop offset="0%" stopColor="#7FB7FF" />
              <stop offset="44%" stopColor="#225096" />
              <stop offset="85%" stopColor="#0E244D" />
              <stop offset="100%" stopColor="#07132B" />
            </radialGradient>
          </defs>
          <BrassCrownCap uid={uid} y={10.8} />
          <circle cx="32" cy="40" r="24" fill={`url(#${uid}-g)`} stroke="#143269" strokeWidth="1.1" />
          {/* Engraved celestial meridian & star map */}
          <ellipse cx="32" cy="40" rx="23.5" ry="9" stroke="#C2DCFF" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.5" />
          <ellipse cx="32" cy="40" rx="10" ry="23.5" stroke="#C2DCFF" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.45" />
          <path d="M32 23L34.6 36.4L48 39L34.6 41.6L32 55L29.4 41.6L16 39L29.4 36.4L32 23Z" fill="#F9E5B4" />
          <path d="M32 29L33.5 37.5L42 39L33.5 40.5L32 49L30.5 40.5L22 39L30.5 37.5L32 29Z" fill="#FFFFFF" opacity="0.85" transform="rotate(45 32 39)" />
          <circle cx="20" cy="29" r="1.3" fill="#FFF9E6" />
          <circle cx="45" cy="30" r="1.5" fill="#FFF9E6" />
          <circle cx="21" cy="50" r="1.2" fill="#FFF9E6" />
          <circle cx="43" cy="50" r="1.3" fill="#FFF9E6" />
          <GlassSpecularArc />
        </g>
      );

    case "emerald-icicle":
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-g`} x1="18" y1="14" x2="46" y2="68" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8CF0D2" />
              <stop offset="38%" stopColor="#1F8A6E" />
              <stop offset="82%" stopColor="#0E4A3A" />
              <stop offset="100%" stopColor="#06261D" />
            </linearGradient>
          </defs>
          <BrassCrownCap uid={uid} y={10.2} />
          <path
            d="M32 15.5 C43.5 22, 47 33, 41.5 47 C37.5 56, 34.2 63, 32 70 C29.8 63, 26.5 56, 22.5 47 C17 33, 20.5 22, 32 15.5 Z"
            fill={`url(#${uid}-g)`}
            stroke="#145946"
            strokeWidth="1.1"
          />
          {/* Cut-crystal vertical facets & gold chevron */}
          <path d="M32 16 V69" stroke="#DCFFF3" strokeWidth="0.9" opacity="0.55" />
          <path d="M26 20 C23 32, 25 46, 32 68" stroke="#A8F0DA" strokeWidth="0.8" opacity="0.45" fill="none" />
          <path d="M38 20 C41 32, 39 46, 32 68" stroke="#083025" strokeWidth="0.8" opacity="0.5" fill="none" />
          <path d="M21.5 34 L32 43 L42.5 34" stroke="#F0CF82" strokeWidth="1.4" fill="none" />
          <path d="M23.5 43 L32 51 L40.5 43" stroke="#F0CF82" strokeWidth="1.1" fill="none" opacity="0.85" />
          <circle cx="32" cy="35" r="2" fill="#FFF5D4" />
          <path d="M24 24 C22.5 30, 23.5 37, 26 44" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.72" />
        </g>
      );

    case "frosted-finial":
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-g`} cx="36%" cy="32%" r="68%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="52%" stopColor="#E6DCCB" />
              <stop offset="88%" stopColor="#B0A089" />
              <stop offset="100%" stopColor="#7D6F5B" />
            </radialGradient>
          </defs>
          <BrassCrownCap uid={uid} y={9.8} />
          <ellipse cx="32" cy="20.5" rx="8.5" ry="5.2" fill={`url(#${uid}-g)`} stroke="#9E8F78" strokeWidth="1" />
          <rect x="27" y="24.5" width="10" height="3" rx="1.2" fill="#D4AA5B" />
          <path
            d="M32 27 C47 29, 50 41, 39.5 50 C35.5 53.5, 33.8 61, 32 70 C30.2 61, 28.5 53.5, 24.5 50 C14 41, 17 29, 32 27 Z"
            fill={`url(#${uid}-g)`}
            stroke="#9C8D76"
            strokeWidth="1.1"
          />
          <path d="M19.5 39 H44.5" stroke="#C99E48" strokeWidth="1.6" />
          <path d="M21 36 Q26.5 33 32 36 Q37.5 33 43 36" stroke="#D4AA5B" strokeWidth="1" fill="none" />
          <circle cx="25.5" cy="39" r="1.8" fill="#A8242F" />
          <circle cx="32" cy="39" r="2.3" fill="#A8242F" />
          <circle cx="38.5" cy="39" r="1.8" fill="#A8242F" />
          <path d="M22.5 32 C24.8 29.5, 28 29, 30.5 29" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      );

    case "rose-reflector":
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-outer`} cx="34%" cy="28%" r="70%">
              <stop offset="0%" stopColor="#FFD4DF" />
              <stop offset="48%" stopColor="#D46A84" />
              <stop offset="90%" stopColor="#7D2941" />
              <stop offset="100%" stopColor="#4F1426" />
            </radialGradient>
            <radialGradient id={`${uid}-cavity`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFDF7" />
              <stop offset="40%" stopColor="#F5D798" />
              <stop offset="78%" stopColor="#A63A56" />
              <stop offset="100%" stopColor="#4A1222" />
            </radialGradient>
          </defs>
          <BrassCrownCap uid={uid} y={10.8} />
          <circle cx="32" cy="40" r="24" fill={`url(#${uid}-outer)`} stroke="#5E1A2E" strokeWidth="1.1" />
          {/* Vintage mid-century indented mercury-glass reflector cavity */}
          <circle cx="32" cy="40" r="14.5" fill={`url(#${uid}-cavity)`} stroke="#F7E2B5" strokeWidth="1.3" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="32"
              y1="26"
              x2="32"
              y2="35"
              stroke="#FFF8E6"
              strokeWidth="1.3"
              transform={`rotate(${i * 30} 32 40)`}
            />
          ))}
          <circle cx="32" cy="40" r="4.2" fill="#B82943" stroke="#FFF4D4" strokeWidth="1.1" />
          <circle cx="32" cy="40" r="1.5" fill="#FFFDF7" />
          <GlassSpecularArc />
        </g>
      );

    case "amethyst-prism":
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-p1`} x1="16" y1="16" x2="48" y2="66" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D6B0FF" />
              <stop offset="48%" stopColor="#7C43A6" />
              <stop offset="100%" stopColor="#35154F" />
            </linearGradient>
          </defs>
          <BrassCrownCap uid={uid} y={10.5} />
          {/* Cut-gemstone diamond prism */}
          <polygon
            points="32,16 49,36 32,68 15,36"
            fill={`url(#${uid}-p1)`}
            stroke="#461E66"
            strokeWidth="1.1"
          />
          <polygon points="32,16 32,36 15,36" fill="#E6CCFF" opacity="0.35" />
          <polygon points="32,36 49,36 32,68" fill="#240B38" opacity="0.35" />
          <polygon
            points="32,23 42,36 32,57 22,36"
            stroke="#F5D996"
            strokeWidth="1.1"
            fill="none"
          />
          <line x1="15" y1="36" x2="49" y2="36" stroke="#F7E5B8" strokeWidth="1" opacity="0.75" />
          <circle cx="32" cy="36" r="2.4" fill="#FFF5D9" />
        </g>
      );

    case "forest-snowglobe":
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-dome`} cx="38%" cy="30%" r="68%">
              <stop offset="0%" stopColor="#E3FAFF" stopOpacity="0.92" />
              <stop offset="52%" stopColor="#488EA3" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#123947" stopOpacity="0.95" />
            </radialGradient>
          </defs>
          <BrassCrownCap uid={uid} y={10.5} />
          {/* Glass globe */}
          <circle cx="32" cy="38" r="21.5" fill={`url(#${uid}-dome)`} stroke="#8ED1E0" strokeWidth="1.2" />
          {/* Snowbank inside globe */}
          <path d="M13.5 48 Q32 43 50.5 48 C47 55.5, 40 59, 32 59 C24 59, 17 55.5, 13.5 48 Z" fill="#F5F2EA" />
          {/* Miniature pine tree inside snowglobe */}
          <polygon points="32,23 40,34 36,34 42,42 37.5,42 43,49 21,49 26.5,42 22,42 28,34 24,34" fill="#1D5E4A" stroke="#0F3B2E" strokeWidth="0.8" />
          <circle cx="32" cy="22.5" r="1.8" fill="#F7D884" />
          {/* Floating snow specks */}
          <circle cx="22" cy="31" r="1.1" fill="#FFFFFF" />
          <circle cx="42" cy="29" r="1.2" fill="#FFFFFF" />
          <circle cx="20" cy="40" r="1" fill="#FFFFFF" />
          <circle cx="44" cy="39" r="1.1" fill="#FFFFFF" />
          {/* Turned walnut & brass pedestal base */}
          <path d="M18 55 H46 L49 63 C49 64.5, 15 64.5, 15 63 Z" fill="#6E4427" stroke="#3D2210" strokeWidth="1.1" />
          <rect x="24" y="57.8" width="16" height="3" rx="1" fill="#E5C170" />
          <path d="M18 27 C20.5 22, 25 19.5, 29.5 19.2" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
        </g>
      );

    /* ==================== 2. BRASS & ENAMEL (7) ==================== */
    case "celestial-sunburst":
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-sun`} cx="38%" cy="34%" r="65%">
              <stop offset="0%" stopColor="#FFF5CE" />
              <stop offset="55%" stopColor="#DEB157" />
              <stop offset="100%" stopColor="#875C16" />
            </radialGradient>
          </defs>
          {Array.from({ length: 16 }).map((_, idx) => {
            const angle = idx * 22.5;
            const long = idx % 2 === 0;
            return (
              <path
                key={idx}
                d={
                  long
                    ? "M32 11.5 L34.3 25.5 L29.7 25.5 Z"
                    : "M32 16.5 L33.5 26 L30.5 26 Z"
                }
                fill={long ? "#ECC674" : "#BD8F39"}
                transform={`rotate(${angle} 32 40)`}
              />
            );
          })}
          <circle cx="32" cy="40" r="14.5" fill={`url(#${uid}-sun)`} stroke="#6E490E" strokeWidth="1.2" />
          <circle cx="32" cy="40" r="10.8" stroke="#FFF2C6" strokeWidth="0.85" strokeDasharray="1.8 1.6" />
          <path d="M27.5 38 Q29.2 36.2 31 38 M33 38 Q34.8 36.2 36.5 38" stroke="#5E3D0B" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M32 37.5 V41.2" stroke="#5E3D0B" strokeWidth="1" strokeLinecap="round" />
          <path d="M29.2 43.5 Q32 45.6 34.8 43.5" stroke="#5E3D0B" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      );

    case "brass-bell":
      return (
        <g>
          <defs>
            <linearGradient id={`${uid}-bell`} x1="16" y1="20" x2="48" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF0BD" />
              <stop offset="45%" stopColor="#D9AA50" />
              <stop offset="100%" stopColor="#825915" />
            </linearGradient>
          </defs>
          {/* Velvet crimson bow & tails */}
          <path d="M29 19 L21 32 M35 19 L43 32" stroke="#8C1A24" strokeWidth="3.2" strokeLinecap="round" />
          <path
            d="M32 16.5 C23 9.5, 13.5 14, 18.5 22.5 C21.5 26, 28 21.5, 32 18.5 C36 21.5, 42.5 26, 45.5 22.5 C50.5 14, 41 9.5, 32 16.5 Z"
            fill="#B52632"
            stroke="#F0CE82"
            strokeWidth="1"
          />
          {/* Turned brass bell */}
          <path
            d="M20.5 32 C20.5 22, 43.5 22, 43.5 32 L49 52.5 C50.5 56, 48 58.5, 43.5 58.5 H20.5 C16 58.5, 13.5 56, 15 52.5 Z"
            fill={`url(#${uid}-bell)`}
            stroke="#6E4A10"
            strokeWidth="1.2"
          />
          <path d="M19 48.5 H45" stroke="#8C621B" strokeWidth="1" />
          <path d="M16.5 53 H47.5" stroke="#FFF4CE" strokeWidth="1.4" opacity="0.85" />
          <circle cx="32" cy="61" r="4.8" fill="#BD8C34" stroke="#66440D" strokeWidth="1.1" />
          <circle cx="30.6" cy="59.8" r="1.4" fill="#FFF5D4" />
          <path d="M24.2 29.5 L21 48" stroke="#FFF9E3" strokeWidth="2.4" strokeLinecap="round" opacity="0.72" />
        </g>
      );

    case "cloisonne-bird":
      return (
        <g>
          <line x1="32" y1="10" x2="32" y2="25" stroke="#D4AA5B" strokeWidth="1.4" />
          <path
            d="M13 41 C17 28, 31 24, 41.5 29.5 C46 31.5, 50 29, 54.5 23.5 L50 35.5 C53 44, 44.5 54.5, 31 54.5 C20.5 54.5, 14.5 48.5, 13 41 Z"
            fill="#246675"
            stroke="#ECC878"
            strokeWidth="1.5"
          />
          {/* Cloisonné gold wire feather cells */}
          <path d="M23 36 C31 32.5, 40 36, 43 45 C35 48.5, 25.5 46, 23 36 Z" fill="#AD2E37" stroke="#F5D68E" strokeWidth="1.3" />
          <path d="M26.5 39.5 Q32.5 38 38.5 42.5 M28 43 Q33 42.5 37 45" stroke="#F7E3AF" strokeWidth="1" fill="none" />
          <path d="M13 40 L7.8 42.5 L14 44.2 Z" fill="#ECC878" />
          <circle cx="19.2" cy="37" r="2" fill="#FFF7DE" />
          <circle cx="19.2" cy="37" r="1" fill="#0E1D22" />
          {/* Brass holly tassel */}
          <line x1="32" y1="54.5" x2="32" y2="61" stroke="#D4AA5B" strokeWidth="1.2" />
          <circle cx="32" cy="63" r="2.5" fill="#A82631" stroke="#ECC878" strokeWidth="0.9" />
        </g>
      );

    case "winter-lantern":
      return (
        <g>
          <defs>
            <radialGradient id={`${uid}-lg`} cx="50%" cy="54%" r="54%">
              <stop offset="0%" stopColor="#FFFBE2" />
              <stop offset="45%" stopColor="#F7BE59" />
              <stop offset="100%" stopColor="#BF6319" stopOpacity="0.4" />
            </radialGradient>
          </defs>
          <rect x="26.5" y="11" width="11" height="5.5" rx="1.6" fill="#A87D32" stroke="#593E11" strokeWidth="1" />
          <path d="M16.5 24.5 L32 15.5 L47.5 24.5 Z" fill="#CFA14A" stroke="#664714" strokeWidth="1.2" />
          <path d="M20.5 24.5 H43.5 L40.8 54.5 H23.2 Z" fill={`url(#${uid}-lg)`} stroke="#855E1C" strokeWidth="1.4" />
          {/* Wax pillar candle & flame */}
          <rect x="29.2" y="42.5" width="5.6" height="11" rx="1" fill="#FAF2E3" />
          <path d="M32 30.5 C34.8 35, 35.2 38.8, 32 41.5 C28.8 38.8, 29.2 35, 32 30.5 Z" fill="#FFFCE6" />
          {/* Crossed brass lattice */}
          <line x1="32" y1="24.5" x2="32" y2="54.5" stroke="#755116" strokeWidth="1.2" />
          <line x1="21.5" y1="39" x2="42.5" y2="39" stroke="#755116" strokeWidth="1" />
          <path d="M18 54.5 H46 L48 60 H16 Z" fill="#BD8E38" stroke="#664714" strokeWidth="1.2" />
        </g>
      );

    case "astrolabe-ring":
      return (
        <g>
          <BrassCrownCap uid={uid} y={10.5} />
          {/* Concentric engraved brass celestial rings */}
          <circle cx="32" cy="40.5" r="22.5" stroke={`url(#${uid}-brass)`} strokeWidth="2.8" fill="#0E2229" fillOpacity="0.55" />
          <circle cx="32" cy="40.5" r="19.5" stroke="#FFF0C2" strokeWidth="0.7" strokeDasharray="2 3" />
          <ellipse cx="32" cy="40.5" rx="21" ry="8.5" stroke="#E5BE6E" strokeWidth="1.5" transform="rotate(-24 32 40.5)" />
          <ellipse cx="32" cy="40.5" rx="21" ry="8.5" stroke="#C99B44" strokeWidth="1.5" transform="rotate(28 32 40.5)" />
          {/* North star & planetary cabochons */}
          <path d="M32 29L34 38.5L43.5 40.5L34 42.5L32 52L30 42.5L20.5 40.5L30 38.5L32 29Z" fill="#FFF2C6" />
          <circle cx="32" cy="40.5" r="3" fill="#2A659E" stroke="#FFF2C6" strokeWidth="1" />
          <circle cx="15" cy="32" r="2" fill="#B52B36" stroke="#F5D78E" strokeWidth="0.8" />
          <circle cx="49" cy="49" r="2" fill="#288068" stroke="#F5D78E" strokeWidth="0.8" />
        </g>
      );

    case "pocket-watch":
      return (
        <g>
          {/* Watch bow & winding crown */}
          <rect x="28.5" y="11" width="7" height="5" rx="1.5" fill="#D4AA5B" stroke="#6E4B12" strokeWidth="1" />
          <circle cx="32" cy="40.5" r="22.5" fill={`url(#${uid}-brass)`} stroke="#6E4B12" strokeWidth="1.3" />
          <circle cx="32" cy="40.5" r="18.2" fill="#FAF2E1" stroke="#8F6722" strokeWidth="1.1" />
          <circle cx="32" cy="40.5" r="15.2" stroke="#CBB896" strokeWidth="0.7" strokeDasharray="1 2.95" />
          {/* Cardinal clock ticks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="32"
              y1={deg % 90 === 0 ? "23.5" : "24.8"}
              x2="32"
              y2="26.8"
              stroke="#3B2B18"
              strokeWidth={deg % 90 === 0 ? "1.5" : "0.9"}
              transform={`rotate(${deg} 32 40.5)`}
            />
          ))}
          {/* Midnight Eve hands (11:55) */}
          <line x1="32" y1="40.5" x2="29" y2="30" stroke="#7A1C24" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="32" y1="40.5" x2="35.5" y2="27" stroke="#24190E" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="32" cy="40.5" r="2.2" fill="#B88930" stroke="#24190E" strokeWidth="0.8" />
          <path d="M21 30 C23.5 26, 27 24, 30 24" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
        </g>
      );

    case "enamel-robin":
      return (
        <g>
          <line x1="32" y1="10" x2="32" y2="23" stroke="#D4AA5B" strokeWidth="1.4" />
          {/* Brass perch twig with holly leaf */}
          <path d="M12 54 Q32 58 52 52" stroke="#8C6223" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <circle cx="46" cy="53" r="2.2" fill="#B82934" />
          <circle cx="49.5" cy="51.5" r="1.9" fill="#B82934" />
          {/* Plump European Robin in cloisonné enamel */}
          <path
            d="M18 39 C18 26, 33 22, 42 30 C46 33.5, 50 38, 54 36 L47 45 C44 52, 34 55, 25 53 C19.5 51.5, 18 45, 18 39 Z"
            fill="#6E5239"
            stroke="#ECC878"
            strokeWidth="1.4"
          />
          {/* Iconic vermilion-red breast */}
          <path
            d="M18.5 37 C23 35, 29 38, 29.5 45 C29.8 50, 25.5 52.8, 21.5 50.5 C18.5 48.5, 17.8 42, 18.5 37 Z"
            fill="#D43D2C"
            stroke="#F5D78E"
            strokeWidth="1.1"
          />
          {/* Cream belly */}
          <path d="M25 52.5 C31 54.5, 39 52.5, 42 47 C36 47, 30 48, 25 52.5 Z" fill="#F2EAD9" />
          <path d="M18 34.5 L13 36.2 L18.2 38 Z" fill="#ECC878" />
          <circle cx="23" cy="33.5" r="1.9" fill="#FFF8E3" />
          <circle cx="23" cy="33.5" r="1" fill="#141414" />
        </g>
      );

    /* ==================== 3. WOOD & FELT (7) ==================== */
    case "dala-horse":
      return (
        <g>
          <line x1="32" y1="10" x2="32" y2="27" stroke="#D4AA5B" strokeWidth="1.4" />
          <path
            d="M19.5 19.5 L23.8 15 L26 21.5 C29 24.5, 31 27.5, 35.5 27.5 H44.5 C48.5 27.5, 50.5 30.5, 49.5 36 L47.5 57.5 H41.5 L39.8 44 H27.8 L26 57.5 H20 L21.8 36 C17.5 33, 16.5 26.5, 19.5 19.5 Z"
            fill="#C93B33"
            stroke="#731914"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Traditional Swedish Kurbits floral saddle & harness */}
          <path d="M28.5 27.5 H39.5 V36.5 C39.5 39.5, 28.5 39.5, 28.5 36.5 Z" fill="#1F5947" stroke="#FAF0DA" strokeWidth="1.1" />
          <circle cx="34" cy="32.5" r="2.3" fill="#F2C86B" />
          <path d="M21.5 24.5 Q25 27 25.2 33 M20 35.5 L28.5 32.5" stroke="#FAF0DA" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M40 32.5 Q45 33 48 36" stroke="#FAF0DA" strokeWidth="1.2" fill="none" />
          <circle cx="22" cy="21" r="1.1" fill="#FFF8EB" />
          <path d="M20.8 51.5 H25.8 M41.8 51.5 H47" stroke="#FAF0DA" strokeWidth="1.5" />
        </g>
      );

    case "felt-mitten":
      return (
        <g>
          <line x1="32" y1="10" x2="32" y2="16.5" stroke="#D4AA5B" strokeWidth="1.4" />
          {/* Plush sherpa wool cuff */}
          <rect x="19.5" y="16.5" width="25" height="9" rx="4.5" fill="#F5EDE0" stroke="#B8A88E" strokeWidth="1.1" />
          <path d="M23 21 H41" stroke="#DFD2BC" strokeWidth="1.4" strokeDasharray="2 3" strokeLinecap="round" />
          {/* Boiled wool crimson mitten */}
          <path
            d="M21 25.5 H43 V46 C43 54.5, 37.8 60, 31.5 60 C25.2 60, 21 54.5, 21 46 V41.5 L14.8 36.8 C12.5 35, 14.2 30.8, 17.5 32 L21 34.5 Z"
            fill="#A32E38"
            stroke="#61161D"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M23.8 29 V46 C23.8 52.2, 27.2 56.8, 31.5 56.8 C35.8 56.8, 39.8 52.2, 39.8 46 V29"
            stroke="#F5E9D3"
            strokeWidth="1"
            strokeDasharray="2.5 2.5"
          />
          <path d="M32 35 V48 M25.5 41.5 H38.5 M27.5 37 L36.5 46 M36.5 37 L27.5 46" stroke="#FAF0DD" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="32" cy="41.5" r="1.8" fill="#E5C170" />
        </g>
      );

    case "spiced-orange":
      return (
        <g>
          <line x1="32" y1="10" x2="32" y2="20" stroke="#C8A365" strokeWidth="1.5" />
          {/* Tied cinnamon quill & pine needles */}
          <path d="M23 21.5 L14 16 M23 21.5 L13.5 21.5 M41 20.5 L50 15.5 M41 20.5 L50.5 21" stroke="#286B56" strokeWidth="2" strokeLinecap="round" />
          <rect x="20" y="17.5" width="24" height="5.5" rx="2.7" transform="rotate(-11 32 20)" fill="#7D4622" stroke="#47240E" strokeWidth="1.1" />
          {/* Translucent amber orange wheel */}
          <circle cx="32" cy="42" r="19.5" fill="#DF781E" stroke="#8F410A" strokeWidth="1.4" />
          <circle cx="32" cy="42" r="16" fill="#F59B35" stroke="#FDE4BD" strokeWidth="1.3" />
          {Array.from({ length: 10 }).map((_, idx) => (
            <line
              key={idx}
              x1="32"
              y1="26"
              x2="32"
              y2="58"
              stroke="#FDE4BD"
              strokeWidth="1.1"
              transform={`rotate(${idx * 18} 32 42)`}
            />
          ))}
          <circle cx="32" cy="42" r="3.2" fill="#FFF3DB" />
          {/* Star anise / clove studs */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <circle
              key={deg}
              cx="32"
              cy="32"
              r="1.4"
              fill="#47210D"
              transform={`rotate(${deg} 32 42)`}
            />
          ))}
        </g>
      );

    case "sugar-pinecone":
      return (
        <g>
          <BrassCrownCap uid={uid} y={10.8} />
          <path d="M22 17 L15 14 M42 17 L49 14" stroke="#2A6E58" strokeWidth="2" strokeLinecap="round" />
          {[
            { y: 21.5, w: 17, scales: 3 },
            { y: 30, w: 25, scales: 4 },
            { y: 39, w: 29, scales: 5 },
            { y: 48, w: 23, scales: 4 },
            { y: 56.5, w: 14, scales: 3 },
          ].map((tier, tIdx) => {
            const startX = 32 - tier.w / 2;
            const step = tier.w / tier.scales;
            return (
              <g key={tIdx}>
                {Array.from({ length: tier.scales }).map((_, sIdx) => {
                  const cx = startX + step * (sIdx + 0.5);
                  return (
                    <g key={sIdx}>
                      <ellipse
                        cx={cx}
                        cy={tier.y}
                        rx={step * 0.65}
                        ry="6.4"
                        fill={tIdx % 2 === 0 ? "#82542E" : "#6B4220"}
                        stroke="#3F240E"
                        strokeWidth="0.95"
                      />
                      <path
                        d={`M${cx - step * 0.44} ${tier.y + 2.8} Q${cx} ${tier.y + 5.7} ${cx + step * 0.44} ${tier.y + 2.8}`}
                        stroke="#FAF4E8"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>
      );

    case "nutcracker-guard":
      return (
        <g>
          <line x1="32" y1="10" x2="32" y2="15" stroke="#D4AA5B" strokeWidth="1.4" />
          {/* Tall black & gold Hussar shako hat */}
          <rect x="22.5" y="15" width="19" height="13" rx="2.5" fill="#182229" stroke="#D4AA5B" strokeWidth="1.1" />
          <path d="M23 24.5 Q32 28 41 24.5" stroke="#E5C170" strokeWidth="1.3" fill="none" />
          <circle cx="32" cy="19.5" r="2.2" fill="#E5C170" />
          {/* Wooden face & white wool moustache/beard */}
          <rect x="24" y="28" width="16" height="10" fill="#ECC79E" stroke="#8C6239" strokeWidth="0.9" />
          <circle cx="28.5" cy="32" r="1.1" fill="#1A1A1A" />
          <circle cx="35.5" cy="32" r="1.1" fill="#1A1A1A" />
          <circle cx="26.8" cy="34.2" r="1.4" fill="#E06C6C" opacity="0.65" />
          <circle cx="37.2" cy="34.2" r="1.4" fill="#E06C6C" opacity="0.65" />
          <path d="M26 36 Q32 34 38 36" stroke="#FAF4E8" strokeWidth="2.2" strokeLinecap="round" />
          {/* Crimson tunic with gold frogging & belt */}
          <rect x="21" y="38" width="22" height="18" rx="2" fill="#B52B35" stroke="#6E141B" strokeWidth="1.1" />
          <circle cx="21" cy="40" r="3" fill="#E5C170" />
          <circle cx="43" cy="40" r="3" fill="#E5C170" />
          <line x1="27" y1="42" x2="37" y2="42" stroke="#F5D78E" strokeWidth="1.3" />
          <line x1="27" y1="46" x2="37" y2="46" stroke="#F5D78E" strokeWidth="1.3" />
          <rect x="21" y="50" width="22" height="3.2" fill="#182229" />
          <rect x="29.5" y="49.5" width="5" height="4.2" stroke="#E5C170" strokeWidth="1.1" fill="none" />
          {/* Boots */}
          <rect x="24" y="56" width="6.5" height="8" rx="1.5" fill="#182229" />
          <rect x="33.5" y="56" width="6.5" height="8" rx="1.5" fill="#182229" />
        </g>
      );

    case "knit-stocking":
      return (
        <g>
          <line x1="32" y1="10" x2="32" y2="17" stroke="#D4AA5B" strokeWidth="1.4" />
          {/* Ribbed cream cuff */}
          <rect x="22" y="17" width="21" height="8.5" rx="3" fill="#F5EDE0" stroke="#BDAD94" strokeWidth="1.1" />
          <path d="M25.5 18.5 V24 M29.5 18.5 V24 M33.5 18.5 V24 M37.5 18.5 V24 M40.5 18.5 V24" stroke="#D4C4AB" strokeWidth="1" />
          {/* Knitted Fair-Isle stocking body */}
          <path
            d="M23.5 25.5 H41.5 V47 C41.5 52, 39 56, 34 57.5 L22 61 C16.5 62.5, 13 58.5, 14.5 53.5 C15.8 49.5, 19.5 48, 23.5 46.5 Z"
            fill="#AD2B36"
            stroke="#69151C"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Evergreen heel & toe patches */}
          <path d="M35 45 C39 45, 41.5 48, 41.5 51.5 C39 55, 36.5 56.5, 34 57 C33 52, 33.5 47, 35 45 Z" fill="#215E4B" />
          <path d="M21 50.5 L25 60 L21.5 61 C16.5 62.2, 13.2 58.2, 14.8 53.5 C15.8 51, 18.2 50, 21 50.5 Z" fill="#215E4B" />
          {/* Fair-Isle knit zig-zag band */}
          <path d="M24 33 L27 30 L30 33 L33 30 L36 33 L39 30 L41 32" stroke="#FAF1DF" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          <path d="M24 39 H41" stroke="#E5C170" strokeWidth="1.2" strokeDasharray="2 2" />
        </g>
      );

    case "holly-acorn":
      return (
        <g>
          <BrassCrownCap uid={uid} y={10.5} />
          {/* Spiky variegated holly leaves */}
          <path
            d="M32 23 C24 16, 12 19, 13 28 C17 28, 19 31, 17 35 C23 34, 27 32, 32 26 Z"
            fill="#1E664F"
            stroke="#0F3D2E"
            strokeWidth="1.1"
          />
          <path
            d="M32 23 C40 16, 52 19, 51 28 C47 28, 45 31, 47 35 C41 34, 37 32, 32 26 Z"
            fill="#26785E"
            stroke="#0F3D2E"
            strokeWidth="1.1"
          />
          {/* Turned oak acorn nut */}
          <path
            d="M21 36 H43 C44 50, 38.5 59, 32 63 C25.5 59, 20 50, 21 36 Z"
            fill="#9E6534"
            stroke="#593516"
            strokeWidth="1.2"
          />
          <path d="M25.5 41 C25 48, 27 54, 30 58" stroke="#D9A36C" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" fill="none" />
          {/* Cross-hatched acorn cupule cap */}
          <path
            d="M18.5 34 C18.5 26.5, 45.5 26.5, 45.5 34 C45.5 37.5, 42 39, 32 39 C22 39, 18.5 37.5, 18.5 34 Z"
            fill="#5C381B"
            stroke="#361E0B"
            strokeWidth="1.1"
          />
          <path d="M22 31 L27 37 M28 29.5 L34 37.5 M35 29.5 L40.5 37 M41 31 L36 37.5 M34 29.5 L28 37.5" stroke="#8C5B32" strokeWidth="0.9" />
          {/* Glossy crimson holly berries */}
          <circle cx="29" cy="25" r="3.1" fill="#C42733" stroke="#6E1018" strokeWidth="0.9" />
          <circle cx="35" cy="25.5" r="2.9" fill="#B5212C" stroke="#6E1018" strokeWidth="0.9" />
          <circle cx="32" cy="21.8" r="3" fill="#D9323E" stroke="#6E1018" strokeWidth="0.9" />
        </g>
      );

    /* ==================== 4. HEARTH & PAPER (7) ==================== */
    case "gingerbread-cottage":
      return (
        <g>
          <line x1="32" y1="10" x2="32" y2="16.5" stroke="#D4AA5B" strokeWidth="1.4" />
          {/* Chimney */}
          <rect x="38" y="18" width="5.5" height="9" rx="1" fill="#8C4B23" stroke="#592C10" strokeWidth="1" />
          {/* Cottage walls */}
          <path
            d="M17 33.5 L32 17.5 L47 33.5 V57.5 H17 Z"
            fill="#AD6432"
            stroke="#633516"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Piped royal icing roof eaves & scallops */}
          <path d="M13 35 L32 16 L51 35" stroke="#FFFBF2" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17.5 34.5 Q21 38.5 24.5 34.5 Q28 38.5 32 34.5 Q36 38.5 39.5 34.5 Q43 38.5 46.5 34.5" stroke="#FFFBF2" strokeWidth="1.9" fill="none" />
          {/* Glowing attic heart/circle window & arched door */}
          <circle cx="32" cy="28.5" r="3.5" fill="#FFE28A" stroke="#FFFBF2" strokeWidth="1.3" />
          <path d="M27.2 57.5 V44.5 C27.2 41, 36.8 41, 36.8 44.5 V57.5 Z" fill="#783B17" stroke="#FFFBF2" strokeWidth="1.5" />
          <circle cx="34.5" cy="50.5" r="1" fill="#F5D78E" />
          {/* Gumdrop candies */}
          <circle cx="22" cy="46" r="2" fill="#C93640" stroke="#FFFBF2" strokeWidth="0.8" />
          <circle cx="22" cy="52" r="2" fill="#2A8066" stroke="#FFFBF2" strokeWidth="0.8" />
          <circle cx="42" cy="46" r="2" fill="#2A8066" stroke="#FFFBF2" strokeWidth="0.8" />
          <circle cx="42" cy="52" r="2" fill="#C93640" stroke="#FFFBF2" strokeWidth="0.8" />
        </g>
      );

    case "origami-crane":
      return (
        <g>
          <line x1="32" y1="10" x2="32" y2="29" stroke="#D4AA5B" strokeWidth="1.3" />
          <polygon points="32,29 9.5,21 24.5,40.5" fill="#EFE5D2" stroke="#B8A586" strokeWidth="1.1" />
          <polygon points="32,29 54.5,20 39.5,40.5" fill="#FAF4E8" stroke="#C4B293" strokeWidth="1.1" />
          <polygon points="24.5,40.5 39.5,40.5 32,49" fill="#DFD1B8" stroke="#B09D7E" strokeWidth="1.1" />
          <polygon points="24.5,40.5 15,53 19.5,36" fill="#F5ECE0" stroke="#B8A586" strokeWidth="1.1" />
          <polygon points="15,53 9.8,51 15.8,48.5" fill="#C83640" />
          <polygon points="39.5,40.5 50,55 43.5,36" fill="#E8DCC6" stroke="#B8A586" strokeWidth="1.1" />
          {/* Chiyogami gold-leaf pattern */}
          <path d="M12 22.2 L32 30.2 L52 21.2" stroke="#D4AA5B" strokeWidth="1.4" />
          <circle cx="42" cy="29" r="1.5" fill="#D4AA5B" />
          <circle cx="38" cy="33" r="1" fill="#C83640" />
          {/* Silk tassel */}
          <line x1="32" y1="49" x2="32" y2="62" stroke="#C83640" strokeWidth="1.5" />
          <circle cx="32" cy="53" r="1.8" fill="#E5C170" />
        </g>
      );

    case "wax-letter":
      return (
        <g>
          <line x1="32" y1="10" x2="32" y2="23.5" stroke="#D4AA5B" strokeWidth="1.4" />
          <g transform="rotate(-5 32 40)">
            <rect x="13" y="24" width="38" height="27" rx="2.8" fill="#F7EFE0" stroke="#BEA988" strokeWidth="1.2" />
            {/* Air-mail / festive corner stamp */}
            <rect x="42" y="27" width="5.5" height="6.5" fill="#256350" stroke="#CBB898" strokeWidth="0.7" />
            <path d="M13.5 50.5 L27.5 37.5 M50.5 50.5 L36.5 37.5" stroke="#D8C7AA" strokeWidth="1.1" />
            <path d="M13.5 24.5 L32 40 L50.5 24.5" fill="#EDE0C7" stroke="#BEA988" strokeWidth="1.2" strokeLinejoin="round" />
            {/* Embossed crimson sealing wax */}
            <circle cx="32" cy="39.5" r="6.2" fill="#A8222C" stroke="#691017" strokeWidth="1.1" />
            <circle cx="32" cy="39.5" r="4.3" stroke="#E5C170" strokeWidth="0.8" opacity="0.85" />
            <path d="M32 36.8L33 38.8L35 39.5L33 40.2L32 42.2L31 40.2L29 39.5L31 38.8L32 36.8Z" fill="#F7DC97" />
          </g>
        </g>
      );

    case "peppermint-cane":
      return (
        <g>
          <line x1="32" y1="10" x2="32" y2="19.5" stroke="#D4AA5B" strokeWidth="1.3" />
          <path
            d="M22.5 31.5 V26 C22.5 18.2, 39.5 18.2, 39.5 27.5 V59.5"
            stroke="#FAF4EA"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M22.5 31.5 V26 C22.5 18.2, 39.5 18.2, 39.5 27.5 V59.5"
            stroke="#C92E38"
            strokeWidth="9"
            strokeLinecap="butt"
            strokeDasharray="5.5 6.5"
            fill="none"
          />
          {/* Gloss highlight along candy cane */}
          <path
            d="M20.5 29 V25.5 C20.5 16.5, 41.5 16.5, 41.5 27.5 V57"
            stroke="#FFFFFF"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
            opacity="0.55"
          />
          {/* Evergreen satin bow & holly */}
          <path
            d="M38.5 36 C30.5 30.5, 25 36, 30.5 41.5 C33.5 43.5, 36.5 39, 38.5 37 C40.5 39, 44 43.5, 47 41.5 C52.5 36, 46.5 30.5, 38.5 36 Z"
            fill="#1F614D"
            stroke="#ECC878"
            strokeWidth="1.1"
          />
          <circle cx="38.8" cy="37" r="2.5" fill="#ECC878" />
        </g>
      );

    case "moravian-star":
      return (
        <g>
          <line x1="32" y1="10" x2="32" y2="17" stroke="#D4AA5B" strokeWidth="1.3" />
          {/* 3D folded cream & gold parchment Moravian 8-point star */}
          {[0, 90, 180, 270].map((deg) => (
            <g key={`p-${deg}`} transform={`rotate(${deg} 32 41)`}>
              <polygon points="32,15 37.5,35.5 32,41" fill="#FAF3E3" stroke="#CBB896" strokeWidth="0.9" />
              <polygon points="32,15 26.5,35.5 32,41" fill="#E6D6B8" stroke="#BFA984" strokeWidth="0.9" />
            </g>
          ))}
          {[45, 135, 225, 315].map((deg) => (
            <g key={`s-${deg}`} transform={`rotate(${deg} 32 41)`}>
              <polygon points="32,20 36.2,36.8 32,41" fill="#F2DFB6" stroke="#C9AE7A" strokeWidth="0.85" />
              <polygon points="32,20 27.8,36.8 32,41" fill="#D9BF8C" stroke="#B89B65" strokeWidth="0.85" />
            </g>
          ))}
          <circle cx="32" cy="41" r="4.5" fill="#FFF8E6" stroke="#D4AA5B" strokeWidth="1" />
        </g>
      );

    case "carousel-chime":
      return (
        <g>
          <BrassCrownCap uid={uid} y={10.5} />
          {/* Striped circus/music-box pavilion canopy */}
          <polygon points="32,16 49,29 15,29" fill="#FAF2E1" stroke="#8C6420" strokeWidth="1" />
          <polygon points="32,16 39,29 25,29" fill="#B82B36" />
          <path d="M15 29 Q19.2 32.5 23.5 29 Q27.8 32.5 32 29 Q36.2 32.5 40.5 29 Q44.8 32.5 49 29" fill="#E5C170" stroke="#8C6420" strokeWidth="0.9" />
          {/* Brass center pole & side poles */}
          <line x1="32" y1="29" x2="32" y2="54" stroke="#E5C170" strokeWidth="1.8" />
          <line x1="21" y1="30" x2="21" y2="54" stroke="#C99B44" strokeWidth="1" />
          <line x1="43" y1="30" x2="43" y2="54" stroke="#C99B44" strokeWidth="1" />
          {/* Miniature white prancing carousel horse */}
          <path
            d="M24 38 L27 34 L29 38 H38 C40.5 38, 41.5 40.5, 40 43 L38.5 49 H35.5 L35 44 H28.5 L27.5 49 H24.5 L25.5 43 C23.5 41.5, 23 39.5, 24 38 Z"
            fill="#FFFBF2"
            stroke="#B8A586"
            strokeWidth="0.95"
          />
          <rect x="30" y="38" width="5.5" height="4" rx="1" fill="#246652" />
          {/* Gilded music-box drum base */}
          <rect x="16" y="54" width="32" height="7" rx="2" fill="#B52B36" stroke="#E5C170" strokeWidth="1.2" />
          <path d="M18 57.5 H46" stroke="#F5D78E" strokeWidth="1" strokeDasharray="3 2" />
        </g>
      );

    case "yule-log":
      return (
        <g>
          {/* Red satin ribbon hanger */}
          <path d="M32 10.5 L24 31 M32 10.5 L40 31" stroke="#B82B36" strokeWidth="1.5" />
          {/* Chocolate bark Bûche de Noël cylinder */}
          <path
            d="M14 34 C14 29.5, 18 27, 22 27 H44 C49 27, 52 31, 52 38 C52 45, 49 49, 44 49 H22 C18 49, 14 45.5, 14 34 Z"
            fill="#5E361B"
            stroke="#3B1F0C"
            strokeWidth="1.2"
          />
          {/* Bark ridges */}
          <path d="M27 32 H45 M30 37 H48 M26 43 H44" stroke="#3B1F0C" strokeWidth="1.3" strokeLinecap="round" />
          {/* Whipped cream dusted snow top */}
          <path
            d="M21 27 H44 C47 27, 48.5 29, 47 31.5 C44 33, 41 30.5, 38 32 C35 33.5, 32 30.5, 29 32 C26 33, 23 30, 21 27 Z"
            fill="#FFFBF2"
          />
          {/* Sponge cake spiral swirl face */}
          <ellipse cx="20" cy="38" rx="6.8" ry="10.8" fill="#E8C99B" stroke="#4A2811" strokeWidth="1.2" />
          <path
            d="M20 38 C20 35.5, 22.2 35.5, 22.2 38 C22.2 41.5, 17.5 41.5, 17.5 37.5 C17.5 32.5, 23.8 32.5, 23.8 38.5 C23.8 44, 16.5 44.5, 16.2 39"
            stroke="#69391A"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Holly & crimson berries garnish */}
          <path d="M33 26 L28 21 L34 22 Z M35 26 L41 21 L36 22 Z" fill="#216952" />
          <circle cx="34" cy="25.5" r="2.1" fill="#C92B36" />
          <circle cx="36.8" cy="26.5" r="1.8" fill="#B5222C" />
        </g>
      );
  }
}

export function TopperArtwork({
  id,
  className = "w-20 h-20",
}: {
  id: TopperId;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE9AD" stopOpacity="0.6" />
          <stop offset="58%" stopColor="#D4AA5B" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#D4AA5B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-gold`} x1="20" y1="12" x2="76" y2="84" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF5D4" />
          <stop offset="48%" stopColor="#E3BA68" />
          <stop offset="100%" stopColor="#8F651A" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="48" r="45" fill={`url(#${uid}-halo)`} />

      {id === "north-star" && (
        <g>
          <path
            d="M48 19L52.2 43.8L77 48L52.2 52.2L48 77L43.8 52.2L19 48L43.8 43.8L48 19Z"
            fill="#C99A40"
            transform="rotate(45 48 48)"
          />
          <path
            d="M48 7L53.8 42.2L89 48L53.8 53.8L48 89L42.2 53.8L7 48L42.2 42.2L48 7Z"
            fill={`url(#${uid}-gold)`}
            stroke="#8C6219"
            strokeWidth="1.2"
          />
          {/* Beveled star ridge lines */}
          <line x1="48" y1="8" x2="48" y2="88" stroke="#FFF9E6" strokeWidth="0.9" opacity="0.7" />
          <line x1="8" y1="48" x2="88" y2="48" stroke="#FFF9E6" strokeWidth="0.9" opacity="0.7" />
          <circle cx="48" cy="48" r="8.5" fill="#FFF8E0" stroke="#A67A28" strokeWidth="1.2" />
          <circle cx="48" cy="48" r="3.2" fill="#D4AA5B" />
        </g>
      )}

      {id === "bethlehem-star" && (
        <g>
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={i}
              x1="48"
              y1="14"
              x2="48"
              y2="82"
              stroke="#F5D78E"
              strokeWidth={i % 2 === 0 ? "1.6" : "0.9"}
              opacity={i % 2 === 0 ? "0.9" : "0.55"}
              transform={`rotate(${i * 11.25} 48 48)`}
            />
          ))}
          <polygon points="48,6 54,40 86,48 54,56 48,92 42,56 10,48 42,40" fill={`url(#${uid}-gold)`} stroke="#8C6318" strokeWidth="1.1" />
          <polygon points="48,22 52,44 74,48 52,52 48,74 44,52 22,48 44,44" fill="#FFF9E6" />
          <circle cx="48" cy="48" r="4.5" fill="#E5B95C" />
        </g>
      )}

      {id === "velvet-bow" && (
        <g>
          <path
            d="M44 50 L26 86 L37 81 L46 56 M52 50 L70 86 L59 81 L50 56"
            fill="#871B25"
            stroke="#E5C170"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M48 46 C32 22, 10 30, 17 49 C21 61, 38 56, 48 48 C58 56, 75 61, 79 49 C86 30, 64 22, 48 46 Z"
            fill="#B52835"
            stroke="#F0CF82"
            strokeWidth="1.5"
          />
          <path d="M25 41 Q34 45 43 46 M71 41 Q62 45 53 46" stroke="#7A131C" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="41.5" y="39.5" width="13" height="15" rx="4.5" fill="#941D28" stroke="#F5D78E" strokeWidth="1.5" />
        </g>
      )}

      {id === "crescent-moon" && (
        <g>
          <path
            d="M59 16 C37 18, 22 35, 24 56 C26 74, 43 86, 63 80 C47 77, 38 63, 39 47 C40 32, 49 22, 59 16 Z"
            fill={`url(#${uid}-gold)`}
            stroke="#8C6318"
            strokeWidth="1.3"
          />
          <line x1="60" y1="24" x2="60" y2="39" stroke="#E5C170" strokeWidth="1" />
          <path
            d="M60 36L62.5 43.5L70 46L62.5 48.5L60 56L57.5 48.5L50 46L57.5 43.5L60 36Z"
            fill="#FFF8DF"
          />
        </g>
      )}

      {id === "candle-crown" && (
        <g>
          <ellipse cx="48" cy="61" rx="27" ry="10.5" fill="#1F5947" stroke="#E5C170" strokeWidth="2.2" />
          {[29, 48, 67].map((cx, i) => (
            <g key={cx}>
              <rect
                x={cx - 3.8}
                y={i === 1 ? 29 : 34}
                width="7.6"
                height="25"
                rx="2"
                fill="#FAF3E3"
                stroke="#C9BA9D"
                strokeWidth="1"
              />
              <path
                d={`M${cx} ${i === 1 ? 15 : 20} C${cx + 4.5} ${i === 1 ? 22 : 27}, ${cx + 4.5} ${i === 1 ? 26.5 : 31.5}, ${cx} ${i === 1 ? 28.5 : 33.5} C${cx - 4.5} ${i === 1 ? 26.5 : 31.5}, ${cx - 4.5} ${i === 1 ? 22 : 27}, ${cx} ${i === 1 ? 15 : 20} Z`}
                fill="#FFE694"
              />
            </g>
          ))}
          <circle cx="38" cy="64" r="2.8" fill="#C42B36" />
          <circle cx="48" cy="66" r="3.1" fill="#C42B36" />
          <circle cx="58" cy="64" r="2.8" fill="#C42B36" />
        </g>
      )}

      {id === "glass-finial-spire" && (
        <g>
          <path d="M48 8 L52 30 H44 Z" fill={`url(#${uid}-gold)`} stroke="#8C6318" strokeWidth="1" />
          <circle cx="48" cy="36" r="7" fill="#C92E3A" stroke="#F2D288" strokeWidth="1.2" />
          <circle cx="48" cy="54" r="13" fill="#B52430" stroke="#F2D288" strokeWidth="1.4" />
          <path d="M35.5 54 H60.5" stroke="#FFF3CE" strokeWidth="1.4" />
          <path d="M42 70 H54 L56 84 H40 Z" fill={`url(#${uid}-gold)`} stroke="#8C6318" strokeWidth="1.1" />
          <path d="M40 48 C42 44, 45 43, 48 43" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
        </g>
      )}
    </svg>
  );
}
