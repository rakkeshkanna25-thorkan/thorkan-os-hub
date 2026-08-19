import { useCallback, useEffect, useRef, useState } from "react";

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    loaded.current = true;
  }, [key]);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/** Deterministic-start drifting telemetry value. */
export function useTelemetry(base: number, spread = 4, interval = 1800) {
  const [value, setValue] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => {
        const next = v + (Math.random() - 0.5) * spread;
        return Math.min(base + spread * 2, Math.max(base - spread * 2, next));
      });
    }, interval);
    return () => clearInterval(id);
  }, [base, spread, interval]);
  return value;
}

export function useSeries(length: number, base: number, spread: number, interval = 2000) {
  const [series, setSeries] = useState(() =>
    Array.from({ length }, (_, i) => ({ i, v: base + Math.sin(i / 2) * spread }))
  );
  useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1] ?? { i: 0, v: base };
        const next = Math.max(
          base - spread * 2,
          Math.min(base + spread * 2, last.v + (Math.random() - 0.5) * spread)
        );
        return [...prev.slice(1), { i: last.i + 1, v: next }];
      });
    }, interval);
    return () => clearInterval(id);
  }, [base, spread, interval]);
  return series;
}

export function useInterval(fn: () => void, ms: number | null) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    if (ms === null) return;
    const id = setInterval(() => ref.current(), ms);
    return () => clearInterval(id);
  }, [ms]);
}

export function useCopyTick() {
  const [tick, setTick] = useState(0);
  const bump = useCallback(() => setTick((t) => t + 1), []);
  return [tick, bump] as const;
}