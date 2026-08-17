import { useEffect, useState } from "react";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function diff(target: number): TimeLeft {
  const ms = Math.max(target - Date.now(), 0);
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
    done: ms <= 0,
  };
}

const IDLE: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, done: false };

// Server and first client paint must match, so we hold a static placeholder
// until after mount and only then start ticking real (clock-dependent) values.
export function useCountdown(targetIso: string): TimeLeft {
  const [left, setLeft] = useState<TimeLeft>(IDLE);

  useEffect(() => {
    const target = new Date(targetIso).getTime();
    setLeft(diff(target));
    const id = setInterval(() => setLeft(diff(target)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return left;
}
