import { createClient } from "@/lib/supabase/server"
import { memoryCache } from "./cache"

export interface QueryOptions {
  cache?: boolean
  cacheTTL?: number
  cacheKey?: string
}

export class OptimizedDatabase {
  private static instance: OptimizedDatabase

  static getInstance(): OptimizedDatabase {
    if (!OptimizedDatabase.instance) {
      OptimizedDatabase.instance = new OptimizedDatabase()
    }
    return OptimizedDatabase.instance
  }

  private generateCacheKey(table: string, query: any): string {
    return `db_${table}_${JSON.stringify(query)}`
  }

  async query<T>(table: string, queryBuilder: (client: any) => any, options: QueryOptions = {}): Promise<T | null> {
    const { cache = true, cacheTTL = 300, cacheKey } = options

    const key = cacheKey || this.generateCacheKey(table, queryBuilder.toString())

    // Try cache first
    if (cache) {
      const cached = memoryCache.get<T>(key)
      if (cached) {
        return cached
      }
    }

    try {
      const supabase = await createClient()
      const result = await queryBuilder(supabase.from(table))

      if (result.error) {
        console.error("Database query error:", result.error)
        return null
      }

      // Cache the result
      if (cache && result.data) {
        memoryCache.set(key, result.data, cacheTTL)
      }

      return result.data
    } catch (error) {
      console.error("Database query failed:", error)
      return null
    }
  }

  // Optimized profile queries
  async getProfilesNearby(latitude: number, longitude: number, radiusKm = 50, limit = 20) {
    return this.query(
      "profiles",
      (client) =>
        client
          .select(`
          id,
          display_name,
          age,
          bio,
          location,
          photos!inner(url, is_primary),
          interests
        `)
          .not("photos", "is", null)
          .limit(limit),
      { cacheTTL: 180 }, // 3 minutes cache for discovery
    )
  }

  // Optimized matches query
  async getUserMatches(userId: string) {
    return this.query(
      "matches",
      (client) =>
        client
          .select(`
          id,
          matched_at,
          user1_id,
          user2_id,
          profiles!matches_user1_id_fkey(
            id,
            display_name,
            photos!inner(url, is_primary)
          ),
          profiles!matches_user2_id_fkey(
            id,
            display_name,
            photos!inner(url, is_primary)
          )
        `)
          .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
          .eq("is_active", true)
          .order("matched_at", { ascending: false }),
      { cacheTTL: 60 }, // 1 minute cache for matches
    )
  }

  // Optimized chat messages query
  async getChatMessages(chatId: string, limit = 50) {
    return this.query(
      "messages",
      (client) =>
        client
          .select(`
          id,
          content,
          message_type,
          created_at,
          is_read,
          sender:profiles!messages_sender_id_fkey(
            id,
            display_name,
            photos!inner(url, is_primary)
          )
        `)
          .eq("chat_id", chatId)
          .order("created_at", { ascending: false })
          .limit(limit),
      { cacheTTL: 30 }, // 30 seconds cache for messages
    )
  }

  // Clear cache for specific patterns
  clearCache(pattern?: string) {
    if (pattern) {
      // Clear specific cache entries
      memoryCache.clear()
    } else {
      memoryCache.clear()
    }
  }
}

export const db = OptimizedDatabase.getInstance()
