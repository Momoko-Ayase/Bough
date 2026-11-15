import {
  ChevronLeft,
  ChevronRight,
  Globe,
  KeyRound,
  Lock,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SLOTS_PER_PAGE } from "../shared/catalog";
import type {
  CreateKeepsakeInput,
  CreateKeepsakeResponse,
  KeepsakePublic,
  LocaleCode,
  TreeStateResponse,
  UpdateConfigInput,
} from "../shared/types";
import { EvergreenStage } from "./components/EvergreenStage";
import { KeepsakeReaderModal } from "./components/KeepsakeReaderModal";
import { SnowfallBackdrop } from "./components/SnowfallBackdrop";

const KeepsakeComposer = lazy(() =>
  import("./components/KeepsakeComposer").then((m) => ({
    default: m.KeepsakeComposer,
  }))
);
const OwnerStudioDrawer = lazy(() =>
  import("./components/OwnerStudioDrawer").then((m) => ({
    default: m.OwnerStudioDrawer,
  }))
);
const ShareModal = lazy(() =>
  import("./components/ShareModal").then((m) => ({ default: m.ShareModal }))
);
import {
  detectInitialLocale,
  DICTIONARIES,
  persistLocale,
  SUPPORTED_LOCALES,
} from "./i18n/dictionaries";
import { loadReceiptTokens, saveReceiptToken } from "./lib/receipts";
import { playHangCelebrationChime, playMusicBoxNote } from "./lib/sound";

export function App() {
  const [locale, setLocale] = useState<LocaleCode>(() => detectInitialLocale());
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const [treeState, setTreeState] = useState<TreeStateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [pickingBranch, setPickingBranch] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);

  const [activeKeepsake, setActiveKeepsake] = useState<KeepsakePublic | null>(
    null
  );
  const [topperReaderOpen, setTopperReaderOpen] = useState(false);
  const [ownerDrawerOpen, setOwnerDrawerOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const [newlyHungId, setNewlyHungId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = DICTIONARIES[locale];

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3600);
  }, []);

  const fetchTree = useCallback(async () => {
    try {
      const receipts = loadReceiptTokens();
      const res = await fetch("/api/tree", {
        headers:
          receipts.length > 0
            ? { "X-Bough-Receipts": receipts.join(",") }
            : undefined,
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as TreeStateResponse;
      setTreeState(data);
      document.title = `${data.config.treeTitle} — Bough`;
      setLoadError(null);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Could not load tree."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const keepsakesOnPage = useMemo(() => {
    if (!treeState) return [];
    return treeState.keepsakes.filter((k) => k.pageIndex === pageIndex);
  }, [treeState, pageIndex]);

  // Compute default first open slot on current page
  const findOpenSlotOnPage = useCallback(
    (targetPage: number): number | null => {
      if (!treeState) return 0;
      const occupied = new Set(
        treeState.keepsakes
          .filter((k) => k.pageIndex === targetPage)
          .map((k) => k.slotIndex)
      );
      for (let i = 0; i < SLOTS_PER_PAGE; i++) {
        if (!occupied.has(i)) return i;
      }
      return null;
    },
    [treeState]
  );

  function handleOpenComposer(explicitSlot?: number) {
    const slot =
      typeof explicitSlot === "number"
        ? explicitSlot
        : selectedSlot ?? findOpenSlotOnPage(pageIndex);
    setSelectedSlot(slot);
    setPickingBranch(false);
    setComposerOpen(true);
    playMusicBoxNote(soundEnabled, 2);
  }

  function handlePickBranchFromStage(slotIdx: number) {
    setSelectedSlot(slotIdx);
    playMusicBoxNote(soundEnabled, slotIdx);
    if (pickingBranch) {
      setPickingBranch(false);
      setComposerOpen(true);
    } else {
      setComposerOpen(true);
    }
  }

  async function handleHangKeepsake(input: CreateKeepsakeInput) {
    const res = await fetch("/api/keepsakes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Could not hang keepsake.");
    }

    const created = data as CreateKeepsakeResponse;
    saveReceiptToken(created.receiptToken);
    setComposerOpen(false);
    setPageIndex(created.keepsake.pageIndex);
    setSelectedSlot(null);
    setNewlyHungId(created.keepsake.id);
    playHangCelebrationChime(soundEnabled);
    showToast(t.composer.hungToast);
    await fetchTree();
    setTimeout(() => setNewlyHungId(null), 3500);
  }

  async function handleSetupFirstBoot(payload: {
    password: string;
    ownerName: string;
    treeTitle: string;
  }) {
    const res = await fetch("/api/owner/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Setup failed.");
    await fetchTree();
    showToast(t.owner.savedToast);
  }

  async function handleOwnerLogin(password: string) {
    const res = await fetch("/api/owner/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Sign-in failed.");
    await fetchTree();
  }

  async function handleOwnerLogout() {
    await fetch("/api/owner/logout", { method: "POST" });
    await fetchTree();
    setOwnerDrawerOpen(false);
  }

  async function handleSaveConfig(input: UpdateConfigInput) {
    const res = await fetch("/api/owner/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Could not save settings.");
    await fetchTree();
    showToast(t.owner.savedToast);
  }

  async function handleDeleteKeepsake(id: string) {
    const res = await fetch(`/api/owner/keepsakes/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchTree();
    }
  }

  async function handleExportArchive(format: "json" | "md") {
    const res = await fetch("/api/owner/export");
    if (!res.ok) return;
    const archive = await res.json();
    const slug = (treeState?.config.treeTitle || "bough")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (format === "json") {
      const blob = new Blob([JSON.stringify(archive, null, 2)], {
        type: "application/json",
      });
      triggerDownload(blob, `${slug || "bough"}-keepsakes.json`);
    } else {
      const lines: string[] = [
        `# ${archive.tree.treeTitle}`,
        ``,
        `> Exported ${archive.exportedAt} · ${archive.keepsakes.length} keepsakes`,
        ``,
        `---`,
        ``,
      ];
      for (const k of archive.keepsakes) {
        lines.push(`### From ${k.senderName}`);
        lines.push(
          `- **Ornament**: \`${k.ornamentId}\` (Canopy ${k.pageIndex + 1}, Hook #${k.slotIndex + 1})`
        );
        lines.push(`- **Hung at**: ${k.createdAt}`);
        if (k.isPrivate) lines.push(`- **Sealed**: Private to owner`);
        lines.push(``);
        lines.push(k.message);
        lines.push(``);
        lines.push(`---`);
        lines.push(``);
      }
      const blob = new Blob([lines.join("\n")], {
        type: "text/markdown;charset=utf-8",
      });
      triggerDownload(blob, `${slug || "bough"}-keepsake-book.md`);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0A171C] text-[#E5C170]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AA5B]/30 border-t-[#E5C170]" />
          <span className="font-display text-lg tracking-wide text-[#EFE6D4]">
            Bough
          </span>
        </div>
      </div>
    );
  }

  if (loadError || !treeState) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#0A171C] p-6 text-center text-[#F5EFE4]">
        <h1 className="font-display text-3xl text-[#FAF3E3]">
          Could not reach this Bough
        </h1>
        <p className="max-w-sm text-xs text-[#A5B4B0]">{loadError}</p>
        <button
          type="button"
          onClick={fetchTree}
          className="cursor-pointer rounded-xl bg-[#D4AA5B] px-5 py-2.5 text-xs font-semibold text-[#0A171C]"
        >
          Try again
        </button>
      </div>
    );
  }

  const { config, isOwner, totalCount, pageCount } = treeState;

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-x-hidden bg-gradient-to-b from-[#081317] via-[#0C1D23] to-[#0A171C] text-[#F5EFE4]">
      <SnowfallBackdrop enabled={config.snowfallEnabled} />

      {/* Top Navigation & Craft Utility Bar */}
      <header className="relative z-30 mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-6">
        {/* Left: Keepsake tally & privacy mode pill */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AA5B]/35 bg-[#10232A]/85 px-3 py-1 font-mono text-xs text-[#F3DFB3] backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[#E5C170]" />
            {t.header.keepsakeCount(totalCount)}
          </span>

          <span className="hidden items-center gap-1.5 rounded-full border border-white/12 bg-[#0E2026]/80 px-3 py-1 text-xs text-[#C4D0CD] backdrop-blur-md sm:inline-flex">
            {config.visibilityMode !== "public" && (
              <Lock className="h-3 w-3 text-[#D4AA5B]" />
            )}
            {t.header.visibilityBadge[config.visibilityMode]}
          </span>
        </div>

        {/* Right: Sound, Language Switcher, Share, Owner Key */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playMusicBoxNote(true, 4);
            }}
            title={soundEnabled ? t.header.soundOn : t.header.soundOff}
            aria-label={soundEnabled ? t.header.soundOn : t.header.soundOff}
            className={`cursor-pointer rounded-full border p-2 transition-colors backdrop-blur-md ${
              soundEnabled
                ? "border-[#E5C170]/60 bg-[#18333D] text-[#F5DFA8]"
                : "border-white/12 bg-[#0E2026]/80 text-[#9FB0AC] hover:text-[#F5EFE4]"
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>

          {/* i18n Locale Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLocaleMenuOpen((v) => !v)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/12 bg-[#0E2026]/80 px-2.5 py-1.5 text-xs font-medium text-[#D8CEBE] backdrop-blur-md hover:border-[#D4AA5B]/45 hover:text-white"
            >
              <Globe className="h-3.5 w-3.5 text-[#D4AA5B]" />
              <span className="font-mono">{t.meta.shortLabel}</span>
            </button>

            <AnimatePresence>
              {localeMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  className="absolute right-0 mt-2 w-40 overflow-hidden rounded-2xl border border-[#D4AA5B]/35 bg-[#0F2229] p-1 shadow-2xl"
                >
                  {SUPPORTED_LOCALES.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setLocale(code);
                        persistLocale(code);
                        setLocaleMenuOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                        locale === code
                          ? "bg-[#1A3742] font-semibold text-[#F7E3B5]"
                          : "text-[#C8D3D0] hover:bg-white/5"
                      }`}
                    >
                      <span>{DICTIONARIES[code].meta.label}</span>
                      <span className="font-mono text-[10px] opacity-70">
                        {DICTIONARIES[code].meta.shortLabel}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/12 bg-[#0E2026]/80 px-3 py-1.5 text-xs font-medium text-[#EFE6D4] backdrop-blur-md hover:border-[#D4AA5B]/45"
          >
            <Share2 className="h-3.5 w-3.5 text-[#D4AA5B]" />
            <span className="hidden sm:inline">{t.header.share}</span>
          </button>

          <button
            type="button"
            onClick={() => setOwnerDrawerOpen(true)}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-md transition-colors ${
              isOwner
                ? "border-[#E5C170]/70 bg-[#1B3942] text-[#FFF3CE]"
                : !config.authInitialized
                  ? "border-[#D4AA5B]/55 bg-[#18313A] text-[#F5DFA8]"
                  : "border-white/12 bg-[#0E2026]/80 text-[#C6D2CE] hover:border-[#D4AA5B]/45 hover:text-white"
            }`}
          >
            <KeyRound className="h-3.5 w-3.5 text-[#E5C170]" />
            <span>
              {isOwner
                ? t.header.ownerActive
                : !config.authInitialized
                  ? t.header.claimTree
                  : t.header.owner}
            </span>
          </button>
        </div>
      </header>

      {/* Main Centered Storybook Tree Stage */}
      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-3 pt-3 pb-4 sm:px-6">
        {/* Title Lockup */}
        <div className="mb-1 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[#FAF3E3] drop-shadow-sm sm:text-5xl">
            {config.treeTitle}
          </h1>
          <button
            type="button"
            onClick={() => setTopperReaderOpen(true)}
            className="mt-1 inline-flex cursor-pointer items-center gap-1.5 text-xs text-[#C6B99E] transition-colors hover:text-[#F5DFA8]"
          >
            <span>{t.stage.tapTopperHint(config.ownerName)}</span>
          </button>
        </div>

        {/* Guided Branch-Hook Picking Banner */}
        <AnimatePresence>
          {pickingBranch && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-2 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-[#E5C170]/60 bg-[#142D36]/95 px-4 py-2.5 text-center shadow-xl backdrop-blur-md"
            >
              <div className="text-left">
                <div className="text-xs font-semibold text-[#FFF2CE]">
                  {t.stage.pickBranchBanner}
                </div>
                <div className="text-[11px] text-[#B8C7C3]">
                  {t.stage.pickBranchSub}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPickingBranch(false);
                  setComposerOpen(true);
                }}
                className="cursor-pointer rounded-xl border border-white/15 bg-[#0C1C22] px-3 py-1.5 text-xs font-medium text-[#E5DEC9] hover:text-white"
              >
                {t.stage.cancelBranchPick}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Illustrated Evergreen Tree + Hanging Keepsakes */}
        <EvergreenStage
          topperId={config.topperId}
          ownerName={config.ownerName}
          keepsakesOnPage={keepsakesOnPage}
          pageIndex={pageIndex}
          pickingBranch={pickingBranch}
          selectedSlot={selectedSlot}
          newlyHungId={newlyHungId}
          t={t}
          onSelectTopper={() => {
            playMusicBoxNote(soundEnabled, 5);
            setTopperReaderOpen(true);
          }}
          onSelectKeepsake={(k) => {
            playMusicBoxNote(soundEnabled, k.slotIndex);
            setActiveKeepsake(k);
          }}
          onPickBranchSlot={handlePickBranchFromStage}
        />

        {totalCount === 0 && !pickingBranch && (
          <p className="-mt-2 text-center text-xs text-[#A9B8B4]">
            {t.stage.emptyTreeHint}
          </p>
        )}
      </main>

      {/* Bottom Floating Dock: Canopy Paginator + Primary "Hang a Keepsake" CTA */}
      <footer className="sticky bottom-0 z-30 mx-auto flex w-full max-w-xl flex-col items-center gap-2.5 px-4 pb-5 pt-2 sm:pb-7">
        <div className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#D4AA5B]/35 bg-[#0D1E24]/90 p-2 shadow-[0_16px_42px_rgba(0,0,0,0.65)] backdrop-blur-md">
          {/* Canopy Page Switcher */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              aria-label={t.stage.prevBough}
              className="cursor-pointer rounded-xl p-2 text-[#D8CEBE] transition-colors hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[92px] text-center font-mono text-xs text-[#E5DEC9]">
              {t.stage.boughPage(pageIndex + 1, pageCount)}
            </span>
            <button
              type="button"
              disabled={pageIndex + 1 >= pageCount}
              onClick={() =>
                setPageIndex((p) => Math.min(pageCount - 1, p + 1))
              }
              aria-label={t.stage.nextBough}
              className="cursor-pointer rounded-xl p-2 text-[#D8CEBE] transition-colors hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Primary Hang Keepsake CTA */}
          <button
            type="button"
            onClick={() => handleOpenComposer()}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#E8C77B] to-[#C89A44] px-5 py-2.5 text-sm font-semibold text-[#0A171C] shadow-[0_6px_20px_rgba(212,170,91,0.35)] transition-transform hover:brightness-105 active:scale-[0.99]"
          >
            <Sparkles className="h-4 w-4" />
            <span>{t.stage.hangCta}</span>
          </button>
        </div>
      </footer>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#E5C170]/60 bg-[#132B34]/95 px-4 py-2 text-xs font-medium text-[#FFF3CE] shadow-2xl backdrop-blur-md"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals & Drawers */}
      <KeepsakeReaderModal
        keepsake={activeKeepsake}
        topperOpen={topperReaderOpen}
        config={config}
        isOwner={isOwner}
        t={t}
        onClose={() => {
          setActiveKeepsake(null);
          setTopperReaderOpen(false);
        }}
        onDeleteKeepsake={handleDeleteKeepsake}
      />

      <Suspense fallback={null}>
        {composerOpen && (
          <KeepsakeComposer
            open={composerOpen}
            config={config}
            pageIndex={pageIndex}
            selectedSlot={selectedSlot}
            t={t}
            onClose={() => setComposerOpen(false)}
            onRequestPickOnTree={() => {
              setComposerOpen(false);
              setPickingBranch(true);
            }}
            onPreviewSound={(idx) => playMusicBoxNote(soundEnabled, idx)}
            onSubmit={handleHangKeepsake}
          />
        )}

        {ownerDrawerOpen && (
          <OwnerStudioDrawer
            open={ownerDrawerOpen}
            config={config}
            isOwner={isOwner}
            t={t}
            onClose={() => setOwnerDrawerOpen(false)}
            onSetupFirstBoot={handleSetupFirstBoot}
            onLogin={handleOwnerLogin}
            onLogout={handleOwnerLogout}
            onSaveConfig={handleSaveConfig}
            onExportArchive={handleExportArchive}
          />
        )}

        {shareOpen && (
          <ShareModal
            open={shareOpen}
            config={config}
            t={t}
            onClose={() => setShareOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
