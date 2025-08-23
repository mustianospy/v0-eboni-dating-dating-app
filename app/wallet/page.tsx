import { Suspense } from "react"
import { WalletContent } from "@/components/wallet/wallet-content"

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Suspense fallback={<div>Loading wallet...</div>}>
        <WalletContent />
      </Suspense>
    </div>
  )
}
