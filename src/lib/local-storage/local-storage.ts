import { LocalStorageKey } from "./local-storage-key";

const isBrowser = typeof window !== "undefined";

export const LocalStorageHelper = {
  get<T = string>(key: LocalStorageKey, asJSON = false): T | string | null {
    if (!isBrowser) return null;
    try {
      const item = window.localStorage.getItem(key);

      if (!item) return null;

      return asJSON ? (JSON.parse(item) as T) : item;
    } catch (err) {
      console.error(`Error getting localStorage key "${key}":`, err);

      return null;
    }
  },

  set<T = string>(key: LocalStorageKey, value: T, asJSON = false): void {
    if (!isBrowser) return;
    try {
      const data = asJSON ? JSON.stringify(value) : (value as string);

      window.localStorage.setItem(key, data);
    } catch (err) {
      console.error(`Error setting localStorage key "${key}":`, err);
    }
  },

  remove(key: LocalStorageKey): void {
    if (!isBrowser) return;
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing localStorage key "${key}":`, err);
    }
  },

  clear(): void {
    if (!isBrowser) return;
    try {
      window.localStorage.clear();
    } catch (err) {
      console.error("Error clearing localStorage:", err);
    }
  }
};
