export type UserTier = "STANDARD" | "PREMIUM_SILVER" | "PREMIUM_GOLD"

export interface UserPermissions {
  canSendMessages: boolean
  canMakeVideoCalls: boolean
  canMakeVoiceCalls: boolean
  canSendGifts: boolean
  canBoostProfile: boolean
  canUnlockPrivateGalleries: boolean
  canAccessTravelMode: boolean
  canSeeWhoLikedYou: boolean
  canUseAdvancedFilters: boolean
  maxPhotos: number
  maxPrivatePhotos: number
  dailyLikes: number
  dailySuperLikes: number
}

export function getUserPermissions(tier: UserTier, hasEverPaid: boolean): UserPermissions {
  // Base permissions - require payment for core features
  const basePermissions: UserPermissions = {
    canSendMessages: hasEverPaid,
    canMakeVideoCalls: hasEverPaid,
    canMakeVoiceCalls: hasEverPaid,
    canSendGifts: false,
    canBoostProfile: false,
    canUnlockPrivateGalleries: false,
    canAccessTravelMode: false,
    canSeeWhoLikedYou: false,
    canUseAdvancedFilters: false,
    maxPhotos: 3,
    maxPrivatePhotos: 0,
    dailyLikes: 10,
    dailySuperLikes: 0,
  }

  switch (tier) {
    case "PREMIUM_SILVER":
      return {
        ...basePermissions,
        canSendGifts: true,
        canBoostProfile: true,
        canAccessTravelMode: true,
        canUseAdvancedFilters: true,
        maxPhotos: 8,
        maxPrivatePhotos: 3,
        dailyLikes: 50,
        dailySuperLikes: 3,
      }

    case "PREMIUM_GOLD":
      return {
        ...basePermissions,
        canSendGifts: true,
        canBoostProfile: true,
        canUnlockPrivateGalleries: true, // Auto-unlock all private galleries
        canAccessTravelMode: true,
        canSeeWhoLikedYou: true,
        canUseAdvancedFilters: true,
        maxPhotos: 15,
        maxPrivatePhotos: 8,
        dailyLikes: -1, // Unlimited
        dailySuperLikes: 10,
      }

    default: // STANDARD
      return basePermissions
  }
}

export function checkPermission(permission: keyof UserPermissions, tier: UserTier, hasEverPaid: boolean): boolean {
  const permissions = getUserPermissions(tier, hasEverPaid)
  return Boolean(permissions[permission])
}
