import { CheckoutButton } from "./CheckoutButton";

export default function WalletTopUp() {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">Wallet Top Up</h2>
      <p className="mb-4 text-gray-600">Buy coins to use premium features.</p>
      <CheckoutButton priceId="price_wallet_topup" />
    </div>
  );
}
