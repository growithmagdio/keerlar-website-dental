"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

/** Draggable comparison slider (pointer, touch and keyboard via a native range input). */
export function BeforeAfter({
  before,
  after,
  beforeLabel,
  afterLabel,
  width,
  height,
  alt,
}: {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  width: number;
  height: number;
  alt: string;
}) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromEvent = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <div
      ref={box}
      className="relative w-full select-none overflow-hidden rounded-[28px] bg-white shadow-[0_40px_80px_-40px_rgba(10,42,66,0.35)] ring-1 ring-line"
      style={{ aspectRatio: `${width} / ${height}`, touchAction: "pan-y" }}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        fromEvent(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && fromEvent(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Image src={after} alt={`${alt}: ${afterLabel}`} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-contain" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={`${alt}: ${beforeLabel}`} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-contain bg-white" />
      </div>
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-ink ring-1 ring-line">{beforeLabel}</span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">{afterLabel}</span>
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -translate-x-1/2 border-l-2 border-white shadow-[0_0_0_1px_rgba(22,132,199,0.25)]" />
        <div className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand shadow-lg ring-1 ring-line">
          <MoveHorizontal className="h-5 w-5" aria-hidden />
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Compare: ${beforeLabel} and ${afterLabel}`}
        className="absolute inset-x-0 bottom-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
