/**
 * ═══════════════════════════════════════════════════════════════
 *  LUMIFLOW DESIGN SYSTEM
 *  Reusable UI components ready for FlutterFlow conversion
 *
 *  Components:
 *   - LumiButton          (7 variants, 3 sizes, loading state)
 *   - LumiIconButton      (icon-only button)
 *   - LumiCard            (3 elevation variants, glass variant)
 *   - LumiGlassCard       (glassmorphism card)
 *   - LumiInput           (with icon, error, helper text)
 *   - LumiTextarea        (autogrow, character count)
 *   - LumiSelect          (dropdown select)
 *   - LumiBadge           (8 color variants)
 *   - LumiSwitch          (gradient toggle)
 *   - LumiProgress        (gradient progress bar)
 *   - LumiAvatar          (sizes, status indicator)
 *   - LumiSkeleton        (loading placeholder)
 *   - LumiModal           (glassmorphism modal)
 *   - LumiNavItem         (sidebar navigation item)
 *   - LumiTabBar          (tab navigation)
 *   - LumiTag             (removable tag/chip)
 *   - LumiAlert           (4 severity variants)
 *   - LumiTooltip         (hover tooltip wrapper)
 *   - LumiDivider         (section divider)
 *   - LumiEmptyState      (empty placeholder)
 *   - LumiStat            (stat card with icon)
 *   - LumiGradientText    (gradient text wrapper)
 *   - LumiSpinner         (loading spinner)
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState, useRef, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronDown, Check, Loader2, Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

/* ────────────────────────── UTILITIES ────────────────────────── */

function cx(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ────────────────────────── LumiButton ────────────────────────── */

type LumiButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "gradient" | "destructive" | "link";
type LumiButtonSize = "sm" | "md" | "lg";

interface LumiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: LumiButtonVariant;
  size?: LumiButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const buttonBase = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#7B61FF]/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

const buttonVariants: Record<LumiButtonVariant, string> = {
  primary: "bg-[#7B61FF] text-white hover:bg-[#6B4FEF] active:bg-[#5C42D9] shadow-sm hover:shadow-md hover:shadow-purple-500/20",
  secondary: "bg-secondary text-secondary-foreground hover:bg-accent active:bg-muted",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-muted/50 active:bg-muted",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted/30 hover:border-[#7B61FF]/30 active:bg-muted/50",
  gradient: "bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white hover:shadow-lg hover:shadow-purple-500/30 active:shadow-md active:shadow-purple-500/20",
  destructive: "bg-[#ef4444] text-white hover:bg-[#dc2626] active:bg-[#b91c1c] shadow-sm",
  link: "text-[#7B61FF] underline-offset-4 hover:underline p-0 h-auto",
};

const buttonSizes: Record<LumiButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-lg",
  md: "h-9 px-4 text-[13px]",
  lg: "h-11 px-6 text-sm",
};

export function LumiButton({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: LumiButtonProps) {
  return (
    <button
      className={cx(
        buttonBase,
        buttonVariants[variant],
        variant !== "link" && buttonSizes[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
}

/* ────────────────────────── LumiIconButton ────────────────────────── */

interface LumiIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "outline" | "filled";
  size?: LumiButtonSize;
  badge?: number;
}

export function LumiIconButton({
  variant = "ghost",
  size = "md",
  badge,
  className,
  children,
  ...props
}: LumiIconButtonProps) {
  const sizeMap = { sm: "w-7 h-7", md: "w-9 h-9", lg: "w-11 h-11" };
  const iconSizeMap = { sm: "[&_svg]:w-3.5 [&_svg]:h-3.5", md: "[&_svg]:w-4 [&_svg]:h-4", lg: "[&_svg]:w-5 [&_svg]:h-5" };
  const variantMap = {
    ghost: "text-muted-foreground hover:text-foreground hover:bg-muted/50 active:bg-muted",
    outline: "border border-border text-muted-foreground hover:text-foreground hover:border-[#7B61FF]/30 hover:bg-muted/20",
    filled: "bg-[#7B61FF]/10 text-[#7B61FF] hover:bg-[#7B61FF]/20 active:bg-[#7B61FF]/30",
  };

  return (
    <button
      className={cx(
        "relative inline-flex items-center justify-center rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#7B61FF]/40",
        sizeMap[size],
        iconSizeMap[size],
        variantMap[variant],
        className,
      )}
      {...props}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ef4444] text-white text-[9px] font-bold flex items-center justify-center">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}

/* ────────────────────────── LumiCard ────────────────────────── */

type LumiCardElevation = "flat" | "raised" | "floating";

interface LumiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: LumiCardElevation;
  hoverable?: boolean;
  padded?: boolean;
  gradient?: boolean;
}

const cardElevations: Record<LumiCardElevation, string> = {
  flat: "border border-border",
  raised: "border border-border shadow-sm",
  floating: "border border-border shadow-lg shadow-black/5 dark:shadow-black/20",
};

export function LumiCard({
  elevation = "flat",
  hoverable = false,
  padded = true,
  gradient = false,
  className,
  children,
  ...props
}: LumiCardProps) {
  return (
    <div
      className={cx(
        "bg-card rounded-2xl transition-all duration-200 overflow-hidden",
        cardElevations[elevation],
        hoverable && "hover:shadow-md hover:shadow-purple-500/5 hover:border-[#7B61FF]/20 cursor-pointer",
        padded && "p-5",
        gradient && "relative",
        className,
      )}
      {...props}
    >
      {gradient && <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/[0.03] to-[#B14EFF]/[0.03] pointer-events-none" />}
      <div className={gradient ? "relative z-10" : undefined}>{children}</div>
    </div>
  );
}

/* ────────────────────────── LumiGlassCard ────────────────────────── */

interface LumiGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export function LumiGlassCard({ padded = true, className, children, ...props }: LumiGlassCardProps) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-white/10 dark:border-white/5 backdrop-blur-xl bg-white/60 dark:bg-white/5 shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden",
        padded && "p-5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ────────────────────────── LumiInput ────────────────────────── */

interface LumiInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const LumiInput = forwardRef<HTMLInputElement, LumiInputProps>(
  ({ label, error, helper, icon, iconRight, className, id, ...props }, ref) => {
    const inputId = id || `lumi-input-${Math.random().toString(36).slice(2, 7)}`;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:w-4 [&_svg]:h-4">{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={cx(
              "w-full h-10 rounded-xl border bg-input-background text-sm transition-all duration-200 outline-none",
              "placeholder:text-muted-foreground/60",
              "focus:border-[#7B61FF]/40 focus:ring-2 focus:ring-[#7B61FF]/15 focus:bg-background",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error
                ? "border-[#ef4444]/50 focus:border-[#ef4444] focus:ring-[#ef4444]/15"
                : "border-border",
              icon ? "pl-10" : "pl-3.5",
              iconRight ? "pr-10" : "pr-3.5",
              className,
            )}
            {...props}
          />
          {iconRight && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:w-4 [&_svg]:h-4">{iconRight}</span>}
        </div>
        {error && <p className="text-[11px] text-[#ef4444] font-medium">{error}</p>}
        {helper && !error && <p className="text-[11px] text-muted-foreground">{helper}</p>}
      </div>
    );
  }
);
LumiInput.displayName = "LumiInput";

/* ────────────────────────── LumiTextarea ────────────────────────── */

interface LumiTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  maxChars?: number;
}

export const LumiTextarea = forwardRef<HTMLTextAreaElement, LumiTextareaProps>(
  ({ label, error, helper, maxChars, className, value, id, ...props }, ref) => {
    const charCount = typeof value === "string" ? value.length : 0;
    const inputId = id || `lumi-textarea-${Math.random().toString(36).slice(2, 7)}`;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-foreground">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          value={value}
          className={cx(
            "w-full min-h-[80px] rounded-xl border bg-input-background text-sm p-3.5 transition-all duration-200 outline-none resize-none",
            "placeholder:text-muted-foreground/60",
            "focus:border-[#7B61FF]/40 focus:ring-2 focus:ring-[#7B61FF]/15 focus:bg-background",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error ? "border-[#ef4444]/50" : "border-border",
            className,
          )}
          {...props}
        />
        <div className="flex items-center justify-between">
          <div>
            {error && <p className="text-[11px] text-[#ef4444] font-medium">{error}</p>}
            {helper && !error && <p className="text-[11px] text-muted-foreground">{helper}</p>}
          </div>
          {maxChars && (
            <p className={cx("text-[10px]", charCount > maxChars ? "text-[#ef4444]" : "text-muted-foreground")}>
              {charCount}/{maxChars}
            </p>
          )}
        </div>
      </div>
    );
  }
);
LumiTextarea.displayName = "LumiTextarea";

/* ────────────────────────── LumiSelect ────────────────────────── */

interface LumiSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface LumiSelectProps {
  label?: string;
  options: LumiSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export function LumiSelect({ label, options, value, onChange, placeholder = "Selecionar...", error }: LumiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="space-y-1.5" ref={ref}>
      {label && <label className="block text-xs font-medium text-foreground">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cx(
            "w-full h-10 rounded-xl border bg-input-background text-sm px-3.5 flex items-center justify-between transition-all duration-200 outline-none",
            "hover:border-[#7B61FF]/30",
            open ? "border-[#7B61FF]/40 ring-2 ring-[#7B61FF]/15" : error ? "border-[#ef4444]/50" : "border-border",
          )}
        >
          <span className={cx("truncate", !selected && "text-muted-foreground/60")}>
            {selected ? (
              <span className="flex items-center gap-2">
                {selected.icon}{selected.label}
              </span>
            ) : placeholder}
          </span>
          <ChevronDown className={cx("w-4 h-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 top-full mt-1 w-full bg-card border border-border rounded-xl shadow-lg shadow-black/10 dark:shadow-black/30 overflow-hidden"
            >
              {options.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange?.(opt.value); setOpen(false); }}
                  className={cx(
                    "w-full flex items-center gap-2 px-3.5 py-2.5 text-sm transition-colors",
                    "hover:bg-[#7B61FF]/5",
                    opt.value === value && "bg-[#7B61FF]/8 text-[#7B61FF] font-medium",
                  )}
                >
                  {opt.icon}
                  <span className="flex-1 text-left truncate">{opt.label}</span>
                  {opt.value === value && <Check className="w-4 h-4 text-[#7B61FF]" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="text-[11px] text-[#ef4444] font-medium">{error}</p>}
    </div>
  );
}

/* ────────────────────────── LumiBadge ────────────────────────── */

type LumiBadgeColor = "purple" | "blue" | "green" | "amber" | "red" | "pink" | "slate" | "gradient";

interface LumiBadgeProps {
  color?: LumiBadgeColor;
  children: React.ReactNode;
  icon?: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const badgeColors: Record<LumiBadgeColor, string> = {
  purple: "bg-[#7B61FF]/10 text-[#7B61FF] dark:bg-[#7B61FF]/15",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  red: "bg-red-500/10 text-red-600 dark:text-red-400",
  pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  slate: "bg-muted text-muted-foreground",
  gradient: "bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white",
};

export function LumiBadge({ color = "purple", children, icon, dot, className }: LumiBadgeProps) {
  return (
    <span className={cx(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap",
      badgeColors[color],
      className,
    )}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {icon && <span className="[&_svg]:w-3 [&_svg]:h-3">{icon}</span>}
      {children}
    </span>
  );
}

/* ────────────────────────── LumiSwitch ────────────────────────── */

interface LumiSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

export function LumiSwitch({ checked, onChange, label, description, disabled, size = "md" }: LumiSwitchProps) {
  const sizeMap = {
    sm: { track: "w-7 h-4", thumb: "w-3 h-3", translate: "translate-x-3" },
    md: { track: "w-9 h-5", thumb: "w-4 h-4", translate: "translate-x-4" },
  };
  const s = sizeMap[size];

  return (
    <label className={cx("flex items-center gap-3 cursor-pointer", disabled && "opacity-50 cursor-not-allowed")}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={cx(
          "relative inline-flex items-center rounded-full transition-colors duration-200 flex-shrink-0",
          s.track,
          checked ? "bg-gradient-to-r from-[#7B61FF] to-[#B14EFF]" : "bg-muted dark:bg-muted",
        )}
      >
        <span className={cx(
          "inline-block rounded-full bg-white shadow-sm transition-transform duration-200",
          s.thumb,
          checked ? s.translate : "translate-x-0.5",
        )} />
      </button>
      {(label || description) && (
        <div>
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
        </div>
      )}
    </label>
  );
}

/* ────────────────────────── LumiProgress ────────────────────────── */

interface LumiProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  gradient?: boolean;
  showLabel?: boolean;
  className?: string;
  animated?: boolean;
}

export function LumiProgress({
  value,
  max = 100,
  size = "md",
  color,
  gradient = true,
  showLabel = false,
  className,
  animated = true,
}: LumiProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const sizeMap = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

  return (
    <div className={cx("flex items-center gap-2", className)}>
      <div className={cx("flex-1 rounded-full bg-muted/40 overflow-hidden", sizeMap[size])}>
        {animated ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cx(
              "h-full rounded-full",
              gradient && !color && "bg-gradient-to-r from-[#7B61FF] to-[#B14EFF]",
            )}
            style={color ? { backgroundColor: color } : undefined}
          />
        ) : (
          <div
            className={cx(
              "h-full rounded-full transition-all duration-500",
              gradient && !color && "bg-gradient-to-r from-[#7B61FF] to-[#B14EFF]",
            )}
            style={{ width: `${percent}%`, ...(color ? { backgroundColor: color } : {}) }}
          />
        )}
      </div>
      {showLabel && (
        <span className="text-[11px] font-semibold text-muted-foreground min-w-[32px] text-right">
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
}

/* ────────────────────────── LumiAvatar ────────────────────────── */

type LumiAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface LumiAvatarProps {
  src?: string;
  name: string;
  size?: LumiAvatarSize;
  status?: "online" | "offline" | "busy" | "away";
  className?: string;
}

const avatarSizes: Record<LumiAvatarSize, { container: string; text: string; status: string }> = {
  xs: { container: "w-6 h-6", text: "text-[9px]", status: "w-1.5 h-1.5 border" },
  sm: { container: "w-8 h-8", text: "text-[10px]", status: "w-2 h-2 border" },
  md: { container: "w-10 h-10", text: "text-xs", status: "w-2.5 h-2.5 border-2" },
  lg: { container: "w-12 h-12", text: "text-sm", status: "w-3 h-3 border-2" },
  xl: { container: "w-16 h-16", text: "text-base", status: "w-3.5 h-3.5 border-2" },
};

const statusColors = { online: "bg-emerald-500", offline: "bg-slate-400", busy: "bg-red-500", away: "bg-amber-500" };

export function LumiAvatar({ src, name, size = "md", status, className }: LumiAvatarProps) {
  const s = avatarSizes[size];
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className={cx("relative inline-flex flex-shrink-0", className)}>
      {src ? (
        <img src={src} alt={name} className={cx(s.container, "rounded-full object-cover")} />
      ) : (
        <div className={cx(
          s.container,
          "rounded-full bg-gradient-to-br from-[#7B61FF] to-[#B14EFF] flex items-center justify-center",
        )}>
          <span className={cx(s.text, "font-semibold text-white")}>{initials}</span>
        </div>
      )}
      {status && (
        <span className={cx(
          s.status,
          "absolute bottom-0 right-0 rounded-full border-background",
          statusColors[status],
        )} />
      )}
    </div>
  );
}

/* ────────────────────────── LumiSkeleton ────────────────────────── */

interface LumiSkeletonProps {
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function LumiSkeleton({ variant = "text", width, height, className }: LumiSkeletonProps) {
  const variantStyles = {
    text: "h-4 rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-xl",
    card: "rounded-2xl h-32",
  };

  return (
    <div
      className={cx("bg-muted/60 animate-pulse", variantStyles[variant], className)}
      style={{ width, height }}
    />
  );
}

/* ────────────────────────── LumiModal ────────────────────────── */

interface LumiModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const modalSizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
};

export function LumiModal({ isOpen, onClose, title, description, size = "md", children, footer }: LumiModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cx(
              "relative w-full bg-card border border-border rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden",
              modalSizes[size],
            )}
          >
            {/* Header */}
            {(title || description) && (
              <div className="flex items-start justify-between p-5 pb-0">
                <div>
                  {title && <h2 className="text-lg font-semibold">{title}</h2>}
                  {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {/* Body */}
            <div className="p-5 overflow-y-auto max-h-[70vh]">{children}</div>
            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-muted/20">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ────────────────────────── LumiNavItem ────────────────────────── */

interface LumiNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  collapsed?: boolean;
  onClick?: () => void;
}

export function LumiNavItem({ icon, label, active, badge, collapsed, onClick }: LumiNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "w-full flex items-center gap-3 rounded-xl transition-all duration-200 group relative",
        collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
        active
          ? "bg-[#7B61FF]/10 text-[#7B61FF]"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
      )}
    >
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-[#7B61FF] to-[#B14EFF]"
        />
      )}
      <span className={cx("[&_svg]:w-[18px] [&_svg]:h-[18px] flex-shrink-0", active && "text-[#7B61FF]")}>
        {icon}
      </span>
      {!collapsed && (
        <>
          <span className="text-[13px] font-medium truncate flex-1 text-left">{label}</span>
          {badge !== undefined && badge > 0 && (
            <span className="bg-[#7B61FF] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );
}

/* ────────────────────────── LumiTabBar ────────────────────────── */

interface LumiTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface LumiTabBarProps {
  tabs: LumiTab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "pill" | "underline";
}

export function LumiTabBar({ tabs, activeTab, onChange, variant = "pill" }: LumiTabBarProps) {
  if (variant === "underline") {
    return (
      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cx(
                "relative flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium transition-colors whitespace-nowrap",
                isActive ? "text-[#7B61FF]" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.icon && <span className="[&_svg]:w-3.5 [&_svg]:h-3.5">{tab.icon}</span>}
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-[#7B61FF] to-[#B14EFF]"
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-muted/30 rounded-xl p-1 overflow-x-auto">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cx(
              "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all duration-200",
              isActive
                ? "bg-card shadow-sm text-[#7B61FF]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.icon && <span className="[&_svg]:w-3.5 [&_svg]:h-3.5">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ────────────────────────── LumiTag ────────────────────────── */

interface LumiTagProps {
  children: React.ReactNode;
  onRemove?: () => void;
  color?: LumiBadgeColor;
}

export function LumiTag({ children, onRemove, color = "purple" }: LumiTagProps) {
  return (
    <span className={cx(
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium",
      badgeColors[color],
    )}>
      {children}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 hover:opacity-70 transition-opacity">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

/* ────────────────────────── LumiAlert ────────────────────────── */

type LumiAlertSeverity = "info" | "success" | "warning" | "error";

interface LumiAlertProps {
  severity: LumiAlertSeverity;
  title: string;
  description?: string;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
  className?: string;
}

const alertConfig: Record<LumiAlertSeverity, { icon: typeof Info; bg: string; border: string; color: string }> = {
  info: { icon: Info, bg: "bg-blue-50 dark:bg-blue-950/15", border: "border-blue-200 dark:border-blue-900/30", color: "text-blue-600 dark:text-blue-400" },
  success: { icon: CheckCircle2, bg: "bg-emerald-50 dark:bg-emerald-950/15", border: "border-emerald-200 dark:border-emerald-900/30", color: "text-emerald-600 dark:text-emerald-400" },
  warning: { icon: AlertTriangle, bg: "bg-amber-50 dark:bg-amber-950/15", border: "border-amber-200 dark:border-amber-900/30", color: "text-amber-600 dark:text-amber-400" },
  error: { icon: XCircle, bg: "bg-red-50 dark:bg-red-950/15", border: "border-red-200 dark:border-red-900/30", color: "text-red-600 dark:text-red-400" },
};

export function LumiAlert({ severity, title, description, onDismiss, action, className }: LumiAlertProps) {
  const cfg = alertConfig[severity];
  const Icon = cfg.icon;

  return (
    <div className={cx("flex items-start gap-3 p-4 rounded-xl border", cfg.bg, cfg.border, className)}>
      <Icon className={cx("w-5 h-5 flex-shrink-0 mt-0.5", cfg.color)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="text-[12px] text-muted-foreground mt-0.5">{description}</p>}
        {action && (
          <button onClick={action.onClick} className={cx("text-[12px] font-medium mt-1.5 hover:underline", cfg.color)}>
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}

/* ────────────────────────── LumiDivider ────────────────────────── */

interface LumiDividerProps {
  label?: string;
  className?: string;
}

export function LumiDivider({ label, className }: LumiDividerProps) {
  if (label) {
    return (
      <div className={cx("flex items-center gap-3", className)}>
        <div className="flex-1 h-px bg-border" />
        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    );
  }
  return <div className={cx("h-px bg-border", className)} />;
}

/* ────────────────────────── LumiEmptyState ────────────────────────── */

interface LumiEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function LumiEmptyState({ icon, title, description, action }: LumiEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4 [&_svg]:w-7 [&_svg]:h-7 text-muted-foreground">
        {icon}
      </div>
      <h3 className="text-sm font-semibold mb-1">{title}</h3>
      {description && <p className="text-[12px] text-muted-foreground max-w-xs">{description}</p>}
      {action && (
        <LumiButton variant="primary" size="sm" className="mt-4" onClick={action.onClick}>
          {action.label}
        </LumiButton>
      )}
    </div>
  );
}

/* ────────────────────────── LumiStat ────────────────────────── */

interface LumiStatProps {
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  icon: React.ReactNode;
  gradient: string;
  onClick?: () => void;
}

export function LumiStat({ label, value, change, changePositive, icon, gradient, onClick }: LumiStatProps) {
  return (
    <LumiCard elevation="flat" hoverable={!!onClick} padded className={cx(onClick && "cursor-pointer")} onClick={onClick}>
      <div className={cx("w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 [&_svg]:w-4.5 [&_svg]:h-4.5 text-white", gradient)}>
        {icon}
      </div>
      <p className="text-xl font-bold tracking-tight">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
      {change && (
        <p className={cx(
          "text-[11px] font-medium mt-1",
          changePositive === undefined ? "text-muted-foreground" : changePositive ? "text-emerald-500" : "text-red-500",
        )}>
          {change}
        </p>
      )}
    </LumiCard>
  );
}

/* ────────────────────────── LumiGradientText ────────────────────────── */

interface LumiGradientTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}

export function LumiGradientText({ children, className, as: Tag = "span" }: LumiGradientTextProps) {
  return (
    <Tag className={cx("bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] bg-clip-text text-transparent", className)}>
      {children}
    </Tag>
  );
}

/* ────────────────────────── LumiSpinner ────────────────────────── */

interface LumiSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LumiSpinner({ size = "md", className }: LumiSpinnerProps) {
  const sizeMap = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  return (
    <svg className={cx("animate-spin", sizeMap[size], className)} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="url(#spinnerGrad)" strokeWidth="3" strokeLinecap="round" />
      <defs>
        <linearGradient id="spinnerGrad" x1="12" y1="2" x2="22" y2="12">
          <stop stopColor="#7B61FF" />
          <stop offset="1" stopColor="#B14EFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
