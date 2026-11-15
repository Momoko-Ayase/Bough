import { KeyRound, Lock, Sparkles, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { KeepsakePublic, TreeConfigPublic } from "../../shared/types";
import type { LocaleDictionary } from "../i18n/dictionaries";
import { OrnamentArtwork, TopperArtwork } from "./OrnamentArtwork";

interface KeepsakeReaderModalProps {
  keepsake: KeepsakePublic | null;
  topperOpen: boolean;
  config: TreeConfigPublic;
  isOwner: boolean;
  t: LocaleDictionary;
  onClose: () => void;
  onDeleteKeepsake: (id: string) => Promise<void>;
}

export function KeepsakeReaderModal({
  keepsake,
  topperOpen,
  config,
  isOwner,
  t,
  onClose,
  onDeleteKeepsake,
}: KeepsakeReaderModalProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const formattedDate = useMemo(() => {
    if (!keepsake) return "";
    try {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(keepsake.createdAt));
    } catch {
      return "";
    }
  }, [keepsake]);

  const formattedReveal = useMemo(() => {
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

  const isOpen = Boolean(keepsake) || topperOpen;

  async function handleConfirmDelete() {
    if (!keepsake) return;
    setDeleting(true);
    try {
      await onDeleteKeepsake(keepsake.id);
      setConfirmingDelete(false);
      onClose();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setConfirmingDelete(false);
              onClose();
            }}
            className="fixed inset-0 bg-[#050C0F]/75 backdrop-blur-sm"
          />

          {/* Case 1: Owner Crown Topper Welcome Note */}
          {topperOpen && !keepsake && (
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-[#D4AA5B]/45 bg-[#F6EFE2] p-6 text-[#231C16] shadow-[0_28px_70px_rgba(0,0,0,0.8)] sm:p-8"
            >
              {/* Decorative double-line stationery border */}
              <div className="pointer-events-none absolute inset-3 rounded-2xl border border-[#D6C5A7]" />

              <button
                type="button"
                onClick={onClose}
                aria-label={t.reader.close}
                className="absolute right-5 top-5 z-10 cursor-pointer rounded-full border border-[#CBB99A] bg-[#EFE5D2] p-1.5 text-[#5C4C3A] hover:bg-[#E4D6BD]"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0E2127] shadow-md">
                  <TopperArtwork id={config.topperId} className="h-16 w-16" />
                </div>

                <div className="mt-3 font-mono text-[11px] uppercase tracking-widest text-[#8C6D32]">
                  {t.composer.toppers[config.topperId]}
                </div>
                <h3 className="mt-1 font-display text-2xl font-semibold text-[#1D1610]">
                  {t.reader.ownerWelcomeHeading(config.ownerName)}
                </h3>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[#382E24]">
                  {config.welcomeNote}
                </p>

                <div className="mt-6 font-display text-lg italic text-[#755A2A]">
                  — {config.ownerName}
                </div>
              </div>
            </motion.div>
          )}

          {/* Case 2: Keepsake Ornament Card (Sealed Envelope OR Unfolded Letter) */}
          {keepsake && (
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 24, scale: 0.94, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className={`relative z-10 w-full max-w-md overflow-hidden rounded-3xl shadow-[0_28px_70px_rgba(0,0,0,0.8)] ${
                keepsake.isLockedForViewer
                  ? "border border-[#D4AA5B]/40 bg-[#12262E] text-[#F5EFE4]"
                  : "border border-[#D4AA5B]/50 bg-[#F7F0E3] text-[#231C16]"
              }`}
            >
              {keepsake.isLockedForViewer ? (
                /* Wax-Sealed Envelope View */
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AA5B]/25 bg-[#0A171C]">
                        <OrnamentArtwork
                          id={keepsake.ornamentId}
                          className="h-12 w-12"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-mono text-[#D4AA5B]">
                          {t.composer.ornaments[keepsake.ornamentId]}
                        </div>
                        <h3 className="font-display text-2xl font-semibold text-[#FAF3E3]">
                          {t.reader.fromHeading(keepsake.senderName)}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      aria-label={t.reader.close}
                      className="cursor-pointer rounded-full border border-white/15 bg-[#19333D] p-1.5 text-[#D8CFC0] hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Tactile envelope flap + crimson wax seal */}
                  <div className="relative mt-6 overflow-hidden rounded-2xl border border-[#D4C3A3]/30 bg-gradient-to-b from-[#1A3540] to-[#0E2027] p-6 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#6E141B] bg-gradient-to-br from-[#BD313B] to-[#7D161E] shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
                      <Lock className="h-6 w-6 text-[#F7DDA0]" />
                    </div>

                    <h4 className="mt-4 font-display text-xl font-semibold text-[#F7E6BF]">
                      {t.reader.sealedHeading}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-[#C4D0CD]">
                      {keepsake.lockReason === "scheduled"
                        ? t.reader.sealedScheduledBody(
                            formattedReveal || "reveal day"
                          )
                        : keepsake.lockReason === "guest_private"
                          ? t.reader.sealedGuestPrivateBody(config.ownerName)
                          : t.reader.sealedOwnerOnlyBody(config.ownerName)}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-[#8EA09C]">
                    <span>{formattedDate}</span>
                    <span>
                      #{keepsake.pageIndex + 1}-{keepsake.slotIndex + 1}
                    </span>
                  </div>
                </div>
              ) : (
                /* Unsealed Warm Cotton-Paper Letter View */
                <div className="relative p-6 sm:p-8">
                  <div className="pointer-events-none absolute inset-3 rounded-2xl border border-[#D8C7A8]" />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#D4C3A4] bg-[#10232A] shadow-sm">
                        <OrnamentArtwork
                          id={keepsake.ornamentId}
                          className="h-14 w-14"
                        />
                      </div>
                      <div>
                        <div className="font-mono text-[11px] uppercase tracking-wider text-[#8C6D32]">
                          {t.composer.ornaments[keepsake.ornamentId]}
                        </div>
                        <h3 className="font-display text-2xl font-semibold text-[#1D1610]">
                          {t.reader.fromHeading(keepsake.senderName)}
                        </h3>
                        <div className="font-mono text-[11px] text-[#7D6D58]">
                          {formattedDate}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmingDelete(false);
                        onClose();
                      }}
                      aria-label={t.reader.close}
                      className="cursor-pointer rounded-full border border-[#CBB99A] bg-[#EFE5D2] p-1.5 text-[#5C4C3A] hover:bg-[#E4D6BD]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Special unlock provenance badges */}
                  {keepsake.unlockedByReceipt && keepsake.lockReason !== null && (
                    <div className="relative mt-4 flex items-center gap-2 rounded-xl border border-[#D4AA5B]/60 bg-[#EFE4CE] px-3 py-2 text-xs text-[#5E4820]">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#9E7322]" />
                      <span>{t.reader.receiptUnlockedNote(config.ownerName)}</span>
                    </div>
                  )}

                  {isOwner &&
                    !keepsake.unlockedByReceipt &&
                    keepsake.lockReason !== null && (
                      <div className="relative mt-4 flex items-center gap-2 rounded-xl border border-[#B53740]/35 bg-[#F2DFE0] px-3 py-2 text-xs text-[#6E1D24]">
                        <KeyRound className="h-3.5 w-3.5 shrink-0" />
                        <span>{t.reader.ownerUnlockedNote}</span>
                      </div>
                    )}

                  {/* Handwritten-feel Cotton Stationery Body */}
                  <div className="relative mt-5 min-h-[110px] whitespace-pre-wrap border-t border-b border-[#DED0B6] py-4 text-[15px] leading-relaxed text-[#261E17]">
                    {keepsake.message}
                  </div>

                  <div className="relative mt-4 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#8A7963]">
                      Bough #{keepsake.pageIndex + 1} · Hook #
                      {keepsake.slotIndex + 1}
                    </span>

                    {isOwner && (
                      <div>
                        {!confirmingDelete ? (
                          <button
                            type="button"
                            onClick={() => setConfirmingDelete(true)}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-[#9E2A33] hover:bg-[#EBDDCE]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {t.reader.deleteKeepsake}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={deleting}
                            onClick={handleConfirmDelete}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#A1252E] px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-[#871D25]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {t.reader.confirmDelete}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
