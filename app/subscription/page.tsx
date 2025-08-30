export const dynamic = "force-dynamic"

import TierUpgrade from "@/components/wallet/tier-upgrade"

export default function SubscriptionPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Subscription</h1>
      <TierUpgrade />
    </div>
  )
}
