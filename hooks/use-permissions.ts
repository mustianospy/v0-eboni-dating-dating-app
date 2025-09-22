"use client"

import { useEffect, useState } from "react"
import { getUserPermissions, type UserPermissions, type UserTier } from "@/lib/permissions"

interface UsePermissionsProps {
  tier: UserTier
  hasEverPaid: boolean
}

export function usePermissions({ tier, hasEverPaid }: UsePermissionsProps) {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)

  useEffect(() => {
    setPermissions(getUserPermissions(tier, hasEverPaid))
  }, [tier, hasEverPaid])

  return permissions
}
