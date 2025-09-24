"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface UserPermissions {
  canSendMessages: boolean
  canVideoCall: boolean
  canSuperLike: boolean
  canUnlockGallery: boolean
  canUseTravelMode: boolean
  subscriptionTier: "free" | "premium" | "vip"
  coinsBalance: number
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<UserPermissions>({
    canSendMessages: false,
    canVideoCall: false,
    canSuperLike: false,
    canUnlockGallery: false,
    canUseTravelMode: false,
    subscriptionTier: "free",
    coinsBalance: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPermissions() {
      const supabase = createClient()

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setLoading(false)
          return
        }

        // Fetch user profile with subscription info
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_tier, coins, subscription_expires_at")
          .eq("id", user.id)
          .single()

        if (profile) {
          const tier = profile.subscription_tier || "free"
          const isSubscriptionActive = profile.subscription_expires_at
            ? new Date(profile.subscription_expires_at) > new Date()
            : false

          setPermissions({
            canSendMessages: tier !== "free" || isSubscriptionActive,
            canVideoCall: tier === "premium" || tier === "vip",
            canSuperLike: tier !== "free" || profile.coins >= 1,
            canUnlockGallery: tier !== "free" || profile.coins >= 2,
            canUseTravelMode: tier === "vip",
            subscriptionTier: tier as "free" | "premium" | "vip",
            coinsBalance: profile.coins || 0,
          })
        }
      } catch (error) {
        console.error("Error fetching permissions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions()
  }, [])

  return { permissions, loading }
}
