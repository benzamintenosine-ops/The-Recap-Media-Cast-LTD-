/**
 * Safe LocalStorage & SessionStorage utilities with automatic QuotaExceededError protection,
 * memory fallback, and cache management.
 */

const memoryCache = new Map<string, string>();

export function safeLocalStorageSet(key: string, value: any): boolean {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    memoryCache.set(key, stringValue);
    return true;
  } catch (err: any) {
    console.warn(`[Storage] localStorage write failed for key "${key}", attempting cache prune:`, err);
    try {
      // If quota exceeded, clean up non-essential cached keys
      const keysToClean = ['recap_news_cache', 'recap_notifications', 'recap_search_history'];
      for (const k of keysToClean) {
        if (k !== key) {
          localStorage.removeItem(k);
        }
      }
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      return true;
    } catch {
      // Final fallback: persist in memory so the app never throws runtime exceptions
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      memoryCache.set(key, stringValue);
      return false;
    }
  }
}

export function safeLocalStorageGet<T = any>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      try {
        return JSON.parse(raw);
      } catch {
        return raw as unknown as T;
      }
    }
    const memRaw = memoryCache.get(key);
    if (memRaw !== undefined) {
      try {
        return JSON.parse(memRaw);
      } catch {
        return memRaw as unknown as T;
      }
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export function safeLocalStorageRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {}
  memoryCache.delete(key);
}
