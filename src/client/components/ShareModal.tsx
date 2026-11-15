import { Check, Copy, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import type { TreeConfigPublic } from "../../shared/types";
import type { LocaleDictionary } from "../i18n/dictionaries";
import { TopperArtwork } from "./OrnamentArtwork";

interface ShareModalProps {
  open: boolean;
  config: TreeConfigPublic;
  t: LocaleDictionary;
  onClose: () => void;
}

export function ShareModal({ open, config, t, onClose }: ShareModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined" ? window.location.origin : "https://bough.workers.dev";

  useEffect(() => {
    if (!open) return;
    QRCode.toDataURL(shareUrl, {
      width: 220,
      margin: 1,
      color: {
        dark: "#1B1510",
        light: "#F6EFE2",
      },
    })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [open, shareUrl]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050C0F]/75 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="relative z-10 w-full max-w-sm rounded-3xl border border-[#D4AA5B]/40 bg-[#0F2128] p-6 text-center text-[#F5EFE4] shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 cursor-pointer rounded-full border border-white/15 bg-[#162E37] p-1.5 text-[#D2C9B8] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AA5B]/30 bg-[#091519]">
              <TopperArtwork id={config.topperId} className="h-11 w-11" />
            </div>

            <h3 className="mt-3 font-display text-2xl font-semibold text-[#FAF3E3]">
              {t.share.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[#B0BEB9]">
              {t.share.subtitle(config.ownerName)}
            </p>

            {/* Cream heirloom QR invitation card */}
            <div className="mx-auto mt-5 inline-flex flex-col items-center rounded-2xl border border-[#D4C3A3] bg-[#F6EFE2] p-4 text-[#1E1712] shadow-lg">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="h-44 w-44 rounded-lg"
                />
              ) : (
                <div className="h-44 w-44 animate-pulse rounded-lg bg-[#E6DBC8]" />
              )}
              <span className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#6E5C46]">
                {t.share.scanQr}
              </span>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/12 bg-[#091519] p-1.5 pl-3">
              <span className="flex-1 truncate text-left font-mono text-xs text-[#C6D2CE]">
                {shareUrl}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#D4AA5B] px-3 py-2 text-xs font-semibold text-[#0A171C] hover:brightness-105"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    {t.share.copied}
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    {t.share.copyLink}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
