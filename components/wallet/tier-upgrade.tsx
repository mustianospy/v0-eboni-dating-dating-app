import { CheckoutButton } from "./CheckoutButton"

export default function TierUpgrade() {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">Upgrade Membership</h2>
      <p className="mb-4 text-gray-600">Unlock premium features.</p>
      <CheckoutButton priceId="price_tier_upgrade" />
    </div>
  )
}
