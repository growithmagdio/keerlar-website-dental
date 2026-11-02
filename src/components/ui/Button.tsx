"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "light";
  external?: boolean;
  icon?: ReactNode;
  className?: string;
  ariaLabel?: string;
};

const styles: Record<NonNullable<Props["variant"]>, string> = {
  primary:
    "bg-[linear-gradient(135deg,#2a9be0_0%,#1684c7_45%,#0f6aa6_100%)] text-white shadow-[0_18px_36px_-16px_rgba(22,132,199,0.85),inset_0_1px_0_rgba(255,255,255,0.35)] hover:shadow-[0_22px_44px_-16px_rgba(22,132,199,0.95),inset_0_1px_0_rgba(255,255,255,0.45)]",
  secondary:
    "bg-white/85 text-brand-ink shadow-[0_14px_30px_-22px_rgba(10,42,66,0.5),inset_0_0_0_1px_rgba(214,232,244,1)] backdrop-blur hover:bg-white hover:shadow-[0_18px_34px_-20px_rgba(10,42,66,0.5),inset_0_0_0_1px_rgba(22,132,199,0.4)]",
  ghost: "text-brand-ink hover:text-brand",
  light: "bg-white text-brand-ink hover:bg-ice",
};

const MotionLink = motion.create(Link);

/** Premium pill button with a subtle magnetic lift. Works for internal, external and tel: links. */
export function Button({ href, children, variant = "primary", external, icon, className = "", ariaLabel }: Props) {
  const cls = `group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[0.95rem] font-semibold tracking-[-0.01em] transition-[box-shadow,background-color] duration-300 ${styles[variant]} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {icon ? (
        <span className={`-mr-2 flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0.5 ${variant === "primary" ? "bg-white/15" : "bg-ice text-brand"}`}>
          {icon}
        </span>
      ) : null}
    </>
  );
  const anim = { whileHover: { y: -2 }, whileTap: { scale: 0.97 }, transition: { type: "spring" as const, stiffness: 400, damping: 26 } };
  const isRaw = external || href.startsWith("tel:") || href.startsWith("mailto:");
  if (isRaw) {
    return (
      <motion.a
        href={href}
        className={cls}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...anim}
      >
        {inner}
      </motion.a>
    );
  }
  return (
    <MotionLink href={href} className={cls} aria-label={ariaLabel} {...anim}>
      {inner}
    </MotionLink>
  );
}
