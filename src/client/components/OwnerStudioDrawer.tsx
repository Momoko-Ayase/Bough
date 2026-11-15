import {
  Download,
  KeyRound,
  LogOut,
  ShieldCheck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { TOPPER_CATALOG } from "../../shared/catalog";
import type {
  TopperId,
  TreeConfigPublic,
  UpdateConfigInput,
  VisibilityMode,
} from "../../shared/types";
import type { LocaleDictionary } from "../i18n/dictionaries";
import { TopperArtwork } from "./OrnamentArtwork";

interface OwnerStudioDrawerProps {
  open: boolean;
  config: TreeConfigPublic;
  isOwner: boolean;
  t: LocaleDictionary;
  onClose: () => void;
  onSetupFirstBoot: (payload: {
    password: string;
    ownerName: string;
    treeTitle: string;
  }) => Promise<void>;
  onLogin: (password: string) => Promise<void>;
  onLogout: () => Promise<void>;
  onSaveConfig: (input: UpdateConfigInput) => Promise<void>;
  onExportArchive: (format: "json" | "md") => Promise<void>;
}

function isoToLocalDatetimeInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function OwnerStudioDrawer({
  open,
  config,
  isOwner,
  t,
  onClose,
  onSetupFirstBoot,
  onLogin,
  onLogout,
  onSaveConfig,
  onExportArchive,
}: OwnerStudioDrawerProps) {
  // Auth state
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Config form state
  const [ownerName, setOwnerName] = useState(config.ownerName);
  const [treeTitle, setTreeTitle] = useState(config.treeTitle);
  const [welcomeNote, setWelcomeNote] = useState(config.welcomeNote);
  const [topperId, setTopperId] = useState<TopperId>(config.topperId);
  const [visibilityMode, setVisibilityMode] = useState<VisibilityMode>(
    config.visibilityMode
  );
  const [revealLocal, setRevealLocal] = useState(
    isoToLocalDatetimeInput(config.revealAt)
  );
  const [allowGuestPrivate, setAllowGuestPrivate] = useState(
    config.allowGuestPrivate
  );
  const [hideSenderNames, setHideSenderNames] = useState(
    config.hideSenderNamesWhenLocked
  );
  const [snowfallEnabled, setSnowfallEnabled] = useState(
    config.snowfallEnabled
  );
  const [rateLimitMax, setRateLimitMax] = useState(
    config.rateLimitMaxPerWindow
  );
  const [turnstileSiteKey, setTurnstileSiteKey] = useState(
    config.turnstileSiteKey === "1x00000000000000000000AA"
      ? ""
      : config.turnstileSiteKey
  );
  const [turnstileSecretKey, setTurnstileSecretKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setOwnerName(config.ownerName);
    setTreeTitle(config.treeTitle);
    setWelcomeNote(config.welcomeNote);
    setTopperId(config.topperId);
    setVisibilityMode(config.visibilityMode);
    setRevealLocal(isoToLocalDatetimeInput(config.revealAt));
    setAllowGuestPrivate(config.allowGuestPrivate);
    setHideSenderNames(config.hideSenderNamesWhenLocked);
    setSnowfallEnabled(config.snowfallEnabled);
    setRateLimitMax(config.rateLimitMaxPerWindow);
    setTurnstileSiteKey(
      config.turnstileSiteKey === "1x00000000000000000000AA"
        ? ""
        : config.turnstileSiteKey
    );
  }, [config]);

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setAuthBusy(true);
    try {
      if (!config.authInitialized) {
        await onSetupFirstBoot({
          password,
          ownerName,
          treeTitle,
        });
      } else {
        await onLogin(password);
      }
      setPassword("");
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleConfigSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSaving(true);
    try {
      const payload: UpdateConfigInput = {
        ownerName,
        treeTitle,
        welcomeNote,
        topperId,
        visibilityMode,
        revealAt:
          visibilityMode === "scheduled" && revealLocal
            ? new Date(revealLocal).toISOString()
            : null,
        allowGuestPrivate,
        hideSenderNamesWhenLocked: hideSenderNames,
        snowfallEnabled,
        rateLimitMaxPerWindow: rateLimitMax,
      };
      if (!config.turnstileEnvLocked) {
        payload.turnstileSiteKey = turnstileSiteKey.trim();
        if (turnstileSecretKey.trim()) {
          payload.turnstileSecretKey = turnstileSecretKey.trim();
        }
      }
      await onSaveConfig(payload);
      setTurnstileSecretKey("");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050C0F]/70 backdrop-blur-xs"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[#D4AA5B]/30 bg-[#0D1E24] text-[#F5EFE4] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#D4AA5B]/20 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <KeyRound className="h-4 w-4 text-[#E5C170]" />
                <h2 className="font-display text-2xl font-semibold text-[#FAF3E3]">
                  {!isOwner
                    ? !config.authInitialized
                      ? t.owner.claimTitle
                      : t.owner.loginTitle
                    : t.owner.drawerTitle}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="cursor-pointer rounded-full border border-white/15 bg-[#152D35] p-1.5 text-[#D2C9B8] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!isOwner ? (
              /* First-Boot Claim OR Owner Login */
              <form
                onSubmit={handleAuthSubmit}
                className="flex flex-1 flex-col justify-between overflow-y-auto p-6"
              >
                <div className="space-y-4">
                  <p className="text-xs leading-relaxed text-[#B6C4C0]">
                    {!config.authInitialized
                      ? t.owner.claimSubtitle
                      : t.owner.loginSubtitle}
                  </p>

                  {!config.authInitialized && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-[#D8CEBE]">
                          {t.owner.ownerNameLabel}
                        </label>
                        <input
                          type="text"
                          maxLength={40}
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#091519] px-3.5 py-2.5 text-sm text-[#F5EFE4] focus:border-[#E5C170] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#D8CEBE]">
                          {t.owner.treeTitleLabel}
                        </label>
                        <input
                          type="text"
                          maxLength={80}
                          value={treeTitle}
                          onChange={(e) => setTreeTitle(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#091519] px-3.5 py-2.5 text-sm text-[#F5EFE4] focus:border-[#E5C170] focus:outline-none"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[#D8CEBE]">
                      {t.owner.passwordLabel}
                    </label>
                    <input
                      type="password"
                      required
                      minLength={config.authInitialized ? 1 : 6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.owner.passwordPlaceholder}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#091519] px-3.5 py-2.5 text-sm text-[#F5EFE4] focus:border-[#E5C170] focus:outline-none"
                    />
                  </div>

                  {authError && (
                    <div className="rounded-xl border border-[#C84B53]/50 bg-[#3B171C]/80 px-3.5 py-2.5 text-xs text-[#FFD7DA]">
                      {authError}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={authBusy}
                  className="mt-6 w-full cursor-pointer rounded-xl bg-gradient-to-b from-[#E5C170] to-[#C89B46] py-3 text-sm font-semibold text-[#0A171C] shadow-lg hover:brightness-105 disabled:opacity-50"
                >
                  {!config.authInitialized
                    ? t.owner.claimButton
                    : t.owner.signInButton}
                </button>
              </form>
            ) : (
              /* Authenticated Owner Studio Controls */
              <form
                onSubmit={handleConfigSave}
                className="flex-1 space-y-6 overflow-y-auto p-6"
              >
                {/* Identity & Crown Topper */}
                <section className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#C8BEB0]">
                        {t.owner.ownerNameLabel}
                      </label>
                      <input
                        type="text"
                        maxLength={40}
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-white/12 bg-[#081317] px-3 py-2 text-sm text-[#F5EFE4] focus:border-[#E5C170] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#C8BEB0]">
                        {t.owner.rateLimitLabel}
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={rateLimitMax}
                        onChange={(e) =>
                          setRateLimitMax(Number(e.target.value))
                        }
                        className="mt-1 w-full rounded-xl border border-white/12 bg-[#081317] px-3 py-2 font-mono text-sm text-[#F5EFE4] focus:border-[#E5C170] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#C8BEB0]">
                      {t.owner.treeTitleLabel}
                    </label>
                    <input
                      type="text"
                      maxLength={80}
                      value={treeTitle}
                      onChange={(e) => setTreeTitle(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/12 bg-[#081317] px-3 py-2 text-sm text-[#F5EFE4] focus:border-[#E5C170] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#C8BEB0]">
                      {t.owner.welcomeNoteLabel}
                    </label>
                    <textarea
                      rows={3}
                      maxLength={320}
                      value={welcomeNote}
                      onChange={(e) => setWelcomeNote(e.target.value)}
                      className="mt-1 w-full resize-none rounded-xl border border-white/12 bg-[#081317] px-3 py-2 text-xs leading-relaxed text-[#F5EFE4] focus:border-[#E5C170] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#C8BEB0]">
                      {t.owner.topperLabel}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {TOPPER_CATALOG.map((item) => {
                        const active = item.id === topperId;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setTopperId(item.id)}
                            title={t.composer.toppers[item.id]}
                            className={`flex cursor-pointer flex-col items-center rounded-xl border p-2 transition-all ${
                              active
                                ? "border-[#E5C170] bg-[#18343E]"
                                : "border-white/10 bg-[#0A171C] hover:border-[#D4AA5B]/40"
                            }`}
                          >
                            <TopperArtwork
                              id={item.id}
                              className="h-10 w-10"
                            />
                            <span className="mt-1 line-clamp-1 text-[10px] text-[#E5DEC9]">
                              {t.composer.toppers[item.id]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* Comment Visibility Mode (Core Requirement #2) */}
                <section className="space-y-2.5 border-t border-white/10 pt-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#E5C170]">
                    {t.owner.visibilityLabel}
                  </label>

                  {(
                    ["public", "owner_only", "scheduled"] as VisibilityMode[]
                  ).map((mode) => {
                    const active = visibilityMode === mode;
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setVisibilityMode(mode)}
                        className={`w-full cursor-pointer rounded-xl border p-3 text-left transition-all ${
                          active
                            ? "border-[#E5C170] bg-[#17323B]"
                            : "border-white/10 bg-[#091519] hover:border-white/25"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#FAF3E3]">
                            {t.header.visibilityBadge[mode]}
                          </span>
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              active ? "bg-[#E5C170]" : "bg-white/20"
                            }`}
                          />
                        </div>
                        <p className="mt-1 text-[11px] text-[#A9B8B4]">
                          {t.owner.visibilityDesc[mode]}
                        </p>
                      </button>
                    );
                  })}

                  {visibilityMode === "scheduled" && (
                    <div className="pt-1">
                      <label className="block text-xs font-medium text-[#C8BEB0]">
                        {t.owner.revealDateLabel}
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={revealLocal}
                        onChange={(e) => setRevealLocal(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-white/15 bg-[#081317] px-3 py-2 font-mono text-xs text-[#F5EFE4] focus:border-[#E5C170] focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/8 bg-[#091519] px-3 py-2.5 text-xs">
                      <span>{t.owner.allowGuestPrivateLabel}</span>
                      <input
                        type="checkbox"
                        checked={allowGuestPrivate}
                        onChange={(e) =>
                          setAllowGuestPrivate(e.target.checked)
                        }
                        className="h-4 w-4 accent-[#D4AA5B]"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/8 bg-[#091519] px-3 py-2.5 text-xs">
                      <span>{t.owner.hideSenderNamesLabel}</span>
                      <input
                        type="checkbox"
                        checked={hideSenderNames}
                        onChange={(e) => setHideSenderNames(e.target.checked)}
                        className="h-4 w-4 accent-[#D4AA5B]"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/8 bg-[#091519] px-3 py-2.5 text-xs">
                      <span>{t.owner.snowfallLabel}</span>
                      <input
                        type="checkbox"
                        checked={snowfallEnabled}
                        onChange={(e) => setSnowfallEnabled(e.target.checked)}
                        className="h-4 w-4 accent-[#D4AA5B]"
                      />
                    </label>
                  </div>
                </section>

                {/* Cloudflare Turnstile Configuration */}
                <section className="space-y-2.5 border-t border-white/10 pt-5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#E5C170]">
                    <ShieldCheck className="h-4 w-4" />
                    <span>{t.owner.turnstileHeading}</span>
                  </div>

                  {config.turnstileEnvLocked ? (
                    <div className="rounded-xl border border-[#2E856E]/40 bg-[#123029] p-3 text-xs text-[#BCE6DA]">
                      {t.owner.turnstileEnvActive}
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-xs text-[#C8BEB0]">
                          {t.owner.turnstileSiteKeyLabel}
                        </label>
                        <input
                          type="text"
                          value={turnstileSiteKey}
                          onChange={(e) => setTurnstileSiteKey(e.target.value)}
                          placeholder="0x4AAAAAAA..."
                          className="mt-1 w-full rounded-xl border border-white/12 bg-[#081317] px-3 py-2 font-mono text-xs text-[#F5EFE4] focus:border-[#E5C170] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#C8BEB0]">
                          {t.owner.turnstileSecretKeyLabel}
                        </label>
                        <input
                          type="password"
                          value={turnstileSecretKey}
                          onChange={(e) =>
                            setTurnstileSecretKey(e.target.value)
                          }
                          placeholder={t.owner.turnstileSecretPlaceholder}
                          className="mt-1 w-full rounded-xl border border-white/12 bg-[#081317] px-3 py-2 font-mono text-xs text-[#F5EFE4] focus:border-[#E5C170] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </section>

                {saveError && (
                  <div className="rounded-xl border border-[#C84B53]/50 bg-[#3B171C]/80 p-3 text-xs text-[#FFD7DA]">
                    {saveError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full cursor-pointer rounded-xl bg-gradient-to-b from-[#E5C170] to-[#C89B46] py-3 text-sm font-semibold text-[#0A171C] shadow-md hover:brightness-105 disabled:opacity-50"
                >
                  {saving ? t.owner.savingChanges : t.owner.saveChanges}
                </button>

                {/* Keepsake Archive Export */}
                <section className="space-y-2.5 border-t border-white/10 pt-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#E5C170]">
                    {t.owner.archiveHeading}
                  </div>
                  <p className="text-xs text-[#A5B4B0]">
                    {t.owner.archiveDesc}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onExportArchive("json")}
                      className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#D4AA5B]/35 bg-[#132931] px-3 py-2 text-xs font-medium text-[#F3DFB3] hover:bg-[#193540]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {t.owner.exportJson}
                    </button>
                    <button
                      type="button"
                      onClick={() => onExportArchive("md")}
                      className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#D4AA5B]/35 bg-[#132931] px-3 py-2 text-xs font-medium text-[#F3DFB3] hover:bg-[#193540]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {t.owner.exportMarkdown}
                    </button>
                  </div>
                </section>

                <div className="border-t border-white/10 pt-4 pb-6">
                  <button
                    type="button"
                    onClick={onLogout}
                    className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-[#B89F9F] hover:text-[#F5C6C9]"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {t.owner.signOutButton}
                  </button>
                </div>
              </form>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
