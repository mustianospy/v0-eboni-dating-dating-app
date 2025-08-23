
export function checkSubscriptionAccess(userSubscription: string, requiredFeature: 'gallery' | 'video_call'): boolean {
  const subscriptionHierarchy = {
    'FREE': 0,
    'STANDARD': 1,
    'PLUS': 2,
    'PRO': 3,
    'ULTRA': 4
  }

  const featureRequirements = {
    'gallery': 1, // Requires at least PLUS
    'video_call': 2 // Requires at least PRO
  }

  const userLevel = subscriptionHierarchy[userSubscription as keyof typeof subscriptionHierarchy] || 0
  const requiredLevel = featureRequirements[requiredFeature]

  return userLevel >= requiredLevel
}

export function getSubscriptionRestrictions(userSubscription: string) {
  return {
    canViewPrivateGallery: checkSubscriptionAccess(userSubscription, 'gallery'),
    canMakeVideoCalls: checkSubscriptionAccess(userSubscription, 'video_call'),
    canViewBasicProfile: true // Always allowed for logged in users
  }
}
