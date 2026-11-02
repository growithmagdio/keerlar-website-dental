"use client";

import { useEffect, useState } from "react";

// Replaces the original timeanddate.com clock iframe: live Eagle River time plus open/closed status.
function nowInAnchorage() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Anchorage",
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const h24 = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Anchorage", hour: "numeric", hour12: false }).format(new Date()),
  );
  const min = Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Anchorage", minute: "numeric" }).format(new Date()));
  return { weekday: get("weekday"), time: `${get("hour")}:${get("minute")} ${get("dayPeriod")}`, minutes: (h24 % 24) * 60 + min };
}

export function LocalClock() {
  const [state, setState] = useState<ReturnType<typeof nowInAnchorage> | null>(null);
  useEffect(() => {
    const tick = () => setState(nowInAnchorage());
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, []);
  const weekday = state?.weekday ?? "";
  const open = !!state && !["Saturday", "Sunday"].includes(weekday) && state.minutes >= 8 * 60 && state.minutes < 16 * 60 + 20;
  return (
    <div className="flex items-center gap-4" aria-live="polite">
      <span className={`relative flex h-3 w-3 ${state ? "" : "opacity-0"}`}>
        {open ? <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" /> : null}
        <span className={`relative h-3 w-3 rounded-full ${open ? "bg-emerald-500" : "bg-slate/40"}`} />
      </span>
      <p className="text-sm text-slate">
        <span className="font-semibold text-ink">{state ? state.time : "…"}</span> in Eagle River{state ? ` · ${weekday}` : ""}
        <br />
        {state ? (open ? "Open now until 4:20 PM" : "Closed now. Call for 24hr emergency services") : "Checking office hours"}
      </p>
    </div>
  );
}
