import { useEffect, useLayoutEffect } from "react";

export function useOnHydrate(callback: () => any, beforePaint = true) {
  // To reduce flicker, we use `useLayoutEffect` so that we return value
  // before React has painted to the browser.
  // React currently throws a warning when using useLayoutEffect on the server so
  // we use useEffect on the server (no-op) and useLayoutEffect in the browser.
  const isServer = typeof window === "undefined";
  const useEffectFn = beforePaint && !isServer ? useLayoutEffect : useEffect;

  useEffectFn(() => {
    callback();
  }, []);
}
