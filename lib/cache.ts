interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>()

  set<T>(key: string, data: T, ttlSeconds = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean expired items
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

export const memoryCache = new MemoryCache()

// Browser storage cache
export class BrowserCache {
  private prefix: string

  constructor(prefix = "ebonidating_") {
    this.prefix = prefix
  }

  set<T>(key: string, data: T, ttlSeconds = 3600): void {
    if (typeof window === "undefined") return

    const item = {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    }

    try {
      localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(item))
    } catch (error) {
      console.warn("Failed to save to localStorage:", error)
    }
  }

  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null

    try {
      const item = localStorage.getItem(`${this.prefix}${key}`)
      if (!item) return null

      const parsed = JSON.parse(item)

      if (Date.now() - parsed.timestamp > parsed.ttl) {
        this.delete(key)
        return null
      }

      return parsed.data
    } catch (error) {
      console.warn("Failed to read from localStorage:", error)
      return null
    }
  }

  delete(key: string): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(`${this.prefix}${key}`)
  }

  clear(): void {
    if (typeof window === "undefined") return

    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key)
      }
    })
  }
}

export const browserCache = new BrowserCache()

// Auto cleanup every 5 minutes
if (typeof window !== "undefined") {
  setInterval(
    () => {
      memoryCache.cleanup()
    },
    5 * 60 * 1000,
  )
}
