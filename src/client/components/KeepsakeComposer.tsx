import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Check, Crosshair, Lock, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { ORNAMENT_CATALOG } from "../../shared/catalog";
import type {
  CreateKeepsakeInput,
  OrnamentId,
  OrnamentMaterial,
  TreeConfigPublic,
} from "../../shared/types";
import type { LocaleDictionary } from "../i18n/dictionaries";
import { OrnamentArtwork } from "./OrnamentArtwork";

interface KeepsakeComposerProps {
  open: boolean;
  config: TreeConfigPublic;
  pageIndex: number;
  selectedSlot: number | null;
  t: LocaleDictionary;
  onClose: () => void;
  onRequestPickOnTree: () => void;
  onPreviewSound: (index: number) => void;
  onSubmit: (payload: CreateKeepsakeInput) => Promise<void>;
}

const MATERIALS: OrnamentMaterial[] = [
  "glass",
  "brass",
  "wood_felt",
  "hearth_paper",
];

export function KeepsakeComposer({
  open,
  config,
  pageIndex,
  selectedSlot,
  t,
  onClose,
  onRequestPickOnTree,
  onPreviewSound,
  onSubmit,
}: KeepsakeComposerProps) {
  const [activeMaterial, setActiveMaterial] =
    useState<OrnamentMaterial>("glass");
  const [ornamentId, setOrnamentId] = useState<OrnamentId>("crimson-bauble");
  const [mobileStep, setMobileStep] = useState<"craft" | "letter">("craft");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const filteredOrnaments = useMemo(
    () => ORNAMENT_CATALOG.filter((o) => o.material === activeMaterial),
    [activeMaterial]
  );

  const formattedRevealDate = useMemo(() => {
    if (!config.revealAt) return "";
    try {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(config.revealAt));
    } catch {
      return config.revealAt;
    }
  }, [config.revealAt]);

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!senderName.trim()) {
      setErrorMsg(t.composer.senderPlaceholder);
      return;
    }
    if (!message.trim()) {
      setErrorMsg(t.composer.messagePlaceholder(config.ownerName));
      return;
    }
    if (!turnstileToken) {
      setErrorMsg("Please complete the guest verification check below.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ornamentId,
        senderName: senderName.trim(),
        message: message.trim(),
        isPrivate:
          config.visibilityMode === "public" && config.allowGuestPrivate
            ? isPrivate
            : false,
        pageIndex,
        slotIndex: selectedSlot ?? undefined,
        turnstileToken,
      });
      setMessage("");
      setIsPrivate(false);
      setMobileStep("craft");
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Could not hang ornament."
      );
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050C0F]/75 backdrop-blur-sm"
          />

          {/* Fixed height on mobile (`h-[84dvh]`) prevents any float window height mismatch when toggling steps */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.composer.title}
            initial={{ opacity: 0, y: 36, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative z-10 flex h-[84dvh] max-h-[760px] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-[#D4AA5B]/35 bg-[#0F2026] text-[#F5EFE4] shadow-[0_24px_70px_rgba(0,0,0,0.78)] sm:h-[640px] sm:rounded-3xl"
          >
            {/* Brass top header bar */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#D4AA5B]/20 px-5 py-3.5 sm:px-7 sm:py-4">
              <div>
                <h2 className="font-display text-xl font-semibold tracking-tight text-[#FAF3E3] sm:text-2xl">
                  {t.composer.title}
                </h2>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-[#C6B99E]">
                  <span className="font-mono text-[#E5C170]">
                    {selectedSlot !== null
                      ? t.composer.selectedHook(pageIndex + 1, selectedSlot + 1)
                      : t.stage.surpriseSlot}
                  </span>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={onRequestPickOnTree}
                    className="inline-flex cursor-pointer items-center gap-1 text-[#E5C170] underline decoration-[#D4AA5B]/50 underline-offset-3 hover:text-[#FFF3CE]"
                  >
                    <Crosshair className="h-3.5 w-3.5" />
                    {t.composer.chooseOnTree}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="cursor-pointer rounded-full border border-[#D4AA5B]/25 bg-[#152B33] p-2 text-[#D8CEBE] transition-colors hover:border-[#E5C170]/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile step switcher — fixed height pill bar */}
            <div className="flex shrink-0 gap-1.5 border-b border-[#D4AA5B]/15 bg-[#0B181D] px-5 py-2 sm:hidden">
              <button
                type="button"
                onClick={() => setMobileStep("craft")}
                className={`flex-1 cursor-pointer rounded-xl py-2 text-xs font-semibold transition-colors ${
                  mobileStep === "craft"
                    ? "bg-[#1A353F] text-[#F7E3B5] shadow-xs"
                    : "text-[#9CA8A4]"
                }`}
              >
                {t.composer.stepOrnament}
              </button>
              <button
                type="button"
                onClick={() => setMobileStep("letter")}
                className={`flex-1 cursor-pointer rounded-xl py-2 text-xs font-semibold transition-colors ${
                  mobileStep === "letter"
                    ? "bg-[#1A353F] text-[#F7E3B5] shadow-xs"
                    : "text-[#9CA8A4]"
                }`}
              >
                {t.composer.stepLetter}
              </button>
            </div>

            {/* Main body: outer dialog has fixed height (`h-[84dvh]`), so `hidden sm:flex` switches mobile steps instantaneously on the same frame with zero ghosting AND zero dialog height change */}
            <form
              onSubmit={handleFormSubmit}
              className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-[1.12fr_1.08fr]"
            >
              {/* Left pane: 28-Keepsake Velvet Tray */}
              <div
                className={`min-h-0 flex-col justify-between bg-[#0B181D]/95 sm:flex sm:border-r sm:border-[#D4AA5B]/15 ${
                  mobileStep === "letter" ? "hidden" : "flex"
                }`}
              >
                <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                  {/* Selected ornament showcase banner */}
                  <div className="mb-3.5 flex items-center gap-3.5 rounded-2xl border border-[#D4AA5B]/28 bg-gradient-to-br from-[#152D36] to-[#0D1E24] p-3">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#D4AA5B]/25 bg-[#091418] shadow-inner">
                      <OrnamentArtwork id={ornamentId} className="h-14 w-14" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[11px] uppercase tracking-wider text-[#E5C170]">
                        {
                          t.composer.materials[
                            ORNAMENT_CATALOG.find((o) => o.id === ornamentId)
                              ?.material ?? "glass"
                          ]
                        }
                      </div>
                      <div className="mt-0.5 truncate font-display text-lg font-semibold text-[#FAF3E3] sm:text-xl">
                        {t.composer.ornaments[ornamentId]}
                      </div>
                    </div>
                  </div>

                  {/* 4 Material Collection Tabs (7 ornaments each = 28 total) */}
                  <div className="mb-3 grid grid-cols-2 gap-1.5">
                    {MATERIALS.map((mat) => (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => setActiveMaterial(mat)}
                        className={`cursor-pointer rounded-xl border px-2.5 py-2 text-xs font-medium transition-colors ${
                          activeMaterial === mat
                            ? "border-[#E5C170]/75 bg-[#1B3942] text-[#FFF3CE] shadow-xs"
                            : "border-white/8 bg-[#102228] text-[#B0BEB9] hover:border-[#D4AA5B]/35 hover:text-[#F5EFE4]"
                        }`}
                      >
                        {t.composer.materials[mat]}
                      </button>
                    ))}
                  </div>

                  {/* 7 Ornaments Grid per Material Family */}
                  <div className="grid grid-cols-3 gap-2">
                    {filteredOrnaments.map((item, idx) => {
                      const selected = item.id === ornamentId;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setOrnamentId(item.id);
                            onPreviewSound(idx);
                          }}
                          className={`group relative flex cursor-pointer flex-col items-center rounded-2xl border p-2.5 text-center transition-colors ${
                            selected
                              ? "border-[#E5C170] bg-[#18333C] shadow-[0_0_0_1px_rgba(229,193,112,0.5)]"
                              : "border-white/10 bg-[#102127]/75 hover:border-[#D4AA5B]/45 hover:bg-[#152B33]"
                          }`}
                        >
                          {selected && (
                            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AA5B] text-[#0A171C]">
                              <Check className="h-2.5 w-2.5 stroke-[2.8]" />
                            </span>
                          )}
                          <OrnamentArtwork
                            id={item.id}
                            className="h-12 w-12 transition-transform duration-200 group-hover:scale-108 sm:h-13 sm:w-13"
                          />
                          <span className="mt-1.5 line-clamp-2 min-h-[28px] text-[11px] leading-tight font-medium text-[#EFE6D5]">
                            {t.composer.ornaments[item.id]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pinned mobile footer bar on Step 1 */}
                <div className="shrink-0 border-t border-white/10 bg-[#0D1D23] p-4 sm:hidden">
                  <button
                    type="button"
                    onClick={() => setMobileStep("letter")}
                    className="w-full cursor-pointer rounded-xl bg-gradient-to-b from-[#E5C170] to-[#C89B46] py-3 text-sm font-semibold text-[#0A171C] shadow-md"
                  >
                    {t.composer.nextWriteNote} →
                  </button>
                </div>
              </div>

              {/* Right pane: Cotton-Paper Letter Sheet + Turnstile */}
              <div
                className={`min-h-0 flex-col justify-between bg-[#0F2026] sm:flex ${
                  mobileStep === "craft" ? "hidden" : "flex"
                }`}
              >
                <div className="min-h-0 flex-1 space-y-3.5 overflow-y-auto p-4 sm:p-6">
                  {config.visibilityMode === "owner_only" && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-[#D4AA5B]/30 bg-[#162D35] px-3.5 py-2.5 text-xs text-[#E8DBC0]">
                      <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E5C170]" />
                      <span>{t.composer.ownerOnlyNotice(config.ownerName)}</span>
                    </div>
                  )}

                  {config.visibilityMode === "scheduled" && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-[#D4AA5B]/30 bg-[#162D35] px-3.5 py-2.5 text-xs text-[#E8DBC0]">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E5C170]" />
                      <span>
                        {t.composer.scheduledNotice(
                          formattedRevealDate || "reveal day"
                        )}
                      </span>
                    </div>
                  )}

                  {/* Cream stationery card */}
                  <div className="rounded-2xl border border-[#D4C3A3] bg-[#F6EFE2] p-4 text-[#231C16] shadow-inner">
                    <div>
                      <label
                        htmlFor="bough-sender"
                        className="block text-[11px] font-semibold uppercase tracking-wider text-[#6E5D49]"
                      >
                        {t.composer.senderLabel}
                      </label>
                      <input
                        id="bough-sender"
                        type="text"
                        maxLength={32}
                        required
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder={t.composer.senderPlaceholder}
                        className="mt-1 w-full border-b border-[#CBB99B] bg-transparent pb-1.5 text-sm font-medium text-[#1F1812] placeholder:text-[#9C8B74] focus:border-[#8C2D35] focus:outline-none"
                      />
                    </div>

                    <div className="mt-3.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="bough-message"
                          className="block text-[11px] font-semibold uppercase tracking-wider text-[#6E5D49]"
                        >
                          {t.composer.messageLabel}
                        </label>
                        <span className="font-mono text-[11px] text-[#8A7963]">
                          {message.length}/600
                        </span>
                      </div>
                      <textarea
                        id="bough-message"
                        rows={4}
                        maxLength={600}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t.composer.messagePlaceholder(
                          config.ownerName
                        )}
                        className="mt-1.5 w-full resize-none bg-transparent text-sm leading-relaxed text-[#231C16] placeholder:text-[#9C8B74] focus:outline-none"
                      />
                    </div>
                  </div>

                  {config.visibilityMode === "public" &&
                    config.allowGuestPrivate && (
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-[#132830] p-3 transition-colors hover:border-[#D4AA5B]/40">
                        <input
                          type="checkbox"
                          checked={isPrivate}
                          onChange={(e) => setIsPrivate(e.target.checked)}
                          className="mt-0.5 h-4 w-4 accent-[#D4AA5B]"
                        />
                        <span className="text-xs">
                          <span className="block font-medium text-[#F5EFE4]">
                            {t.composer.privateToggleLabel(config.ownerName)}
                          </span>
                          <span className="mt-0.5 block text-[#A5B4B0]">
                            {t.composer.privateToggleHint}
                          </span>
                        </span>
                      </label>
                    )}

                  {/* Cloudflare Turnstile Widget */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#9FB0AC]">
                        {t.composer.securityLabel}
                      </span>
                      {config.turnstileSiteKey ===
                        "1x00000000000000000000AA" && (
                        <span className="rounded-md border border-[#D4AA5B]/30 bg-[#152D35] px-1.5 py-0.5 font-mono text-[10px] text-[#E5C170]">
                          Local Demo Key
                        </span>
                      )}
                    </div>
                    {config.turnstileConfigured && config.turnstileSiteKey ? (
                      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0A171C] p-2">
                        <Turnstile
                          ref={turnstileRef}
                          siteKey={config.turnstileSiteKey}
                          onSuccess={(token) => {
                            setTurnstileToken(token);
                            setErrorMsg(null);
                          }}
                          onExpire={() => {
                            setTurnstileToken(null);
                            turnstileRef.current?.reset();
                          }}
                          onError={() => {
                            setTurnstileToken(null);
                          }}
                          options={{
                            theme: "dark",
                            size: "flexible",
                          }}
                        />
                      </div>
                    ) : (
                      <div className="rounded-xl border border-[#C84B53]/50 bg-[#36161B]/60 p-3 text-xs text-[#F5C6C9]">
                        {t.composer.turnstileUnconfigured}
                      </div>
                    )}
                  </div>

                  {errorMsg && (
                    <div className="rounded-xl border border-[#C84B53]/50 bg-[#3B171C]/80 px-3.5 py-2.5 text-xs text-[#FFD7DA]">
                      {errorMsg}
                    </div>
                  )}
                </div>

                {/* Pinned footer bar for Step 2 / Desktop */}
                <div className="flex shrink-0 items-center gap-2.5 border-t border-white/10 bg-[#0D1D23] p-4 sm:px-6">
                  <button
                    type="button"
                    onClick={() => setMobileStep("craft")}
                    className="cursor-pointer rounded-xl border border-white/15 px-3.5 py-3 text-xs font-medium text-[#D5CFC2] sm:hidden"
                  >
                    ← {t.composer.backToOrnaments}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !config.turnstileConfigured}
                    className="flex-1 cursor-pointer rounded-xl bg-gradient-to-b from-[#E5C170] to-[#C89B46] px-5 py-3 text-sm font-semibold text-[#0A171C] shadow-[0_8px_24px_rgba(212,170,91,0.3)] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting
                      ? t.composer.hangingButton
                      : t.composer.hangButton}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
