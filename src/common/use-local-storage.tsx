import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useOnHydrate } from "./use-on-hydrate";

export function useLocalStorage<T>(
  key: string,
  init: T,
  overrideLocalStorage?: T
) {
  const [state, setState] = useState(init);
  const value = globalThis.localStorage?.getItem(key) ?? init;

  useOnHydrate(() => {
    if (overrideLocalStorage) {
      setState(overrideLocalStorage);
    } else {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      setState(parsed);
    }
  });

  useEffect(() => {
    if (state) {
      localStorage.setItem(key, JSON.stringify(state));
    } else {
      localStorage.removeItem(key);
    }
  }, [state]);

  return useMemo<[T, Dispatch<SetStateAction<T>>]>(
    () => [state, setState],
    [state]
  );
}
