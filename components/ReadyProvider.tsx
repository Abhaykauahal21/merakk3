"use client";

import { createContext, useContext, useState } from "react";

type ReadyCtx = { ready: boolean; setReady: (v: boolean) => void };

const Ctx = createContext<ReadyCtx>({ ready: false, setReady: () => {} });

/** Tracks whether the intro loader has finished, so hero animations start after it. */
export function ReadyProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  return <Ctx.Provider value={{ ready, setReady }}>{children}</Ctx.Provider>;
}

export const useReady = () => useContext(Ctx);
