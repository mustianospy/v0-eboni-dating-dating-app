"use client";

import { useState } from "react";
import { Coins, Zap, Gift, Eye, Bolt } from "lucide-react";

const coinPackages = [
  { coins: 100, price: 1.99, bonus: 0, popular: false },
  { coins: 500, price: 7.99, bonus: 50, popular: false },
  { coins: 1000, price: 12.99, bonus: 200, popular: true },
  { coins: 2500, price: 24.99, bonus: 750, popular: false },
];

export function CoinsStore() {
  const [selectedPackage, setSelectedPackage] = useState(2);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <Coins className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-900">Buy Coins</h2>
        <p className="text-gray-600">Get more coins to unlock premium features</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {coinPackages.map((pkg, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedPackage === index
                ? "border-pink-500 ring-2 ring-pink-500"
                : "border-gray-200 hover:border-pink-300"
            } ${pkg.popular ? "bg-pink-50" : ""}`}
            onClick={() => setSelectedPackage(index)}
          >
            {pkg.popular && (
              <div className="bg-pink-500 text-white text-xs font-medium px-2 py-1 rounded-full mb-2 inline-block">
                Best Value
              </div>
            )}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Coins className="h-6 w-6 text-yellow-500 mr-1" />
                <span className="text-2xl font-bold text-gray-900">
                  {pkg.coins + pkg.bonus}
                </span>
              </div>
              {pkg.bonus > 0 && (
                <p className="text-green-600 text-sm mb-1">
                  +{pkg.bonus} bonus coins!
                </p>
              )}
              <p className="text-gray-900 font-semibold">${pkg.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-pink-600 transition-colors">
          Buy Now with Paystack
        </button>
      </div>
    </div>
  );
}
