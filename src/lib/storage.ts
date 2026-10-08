export type Mode = "light" | "dark";

export const storage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, val: string): void {
    try {
      window.localStorage.setItem(key, val);
    } catch {
      /* private mode or blocked storage, ignore */
    }
  },
};
