"use client";

import { useState } from "react";
import { Heart, Crown, Star, Zap, Check, Coins } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Basic",
    price: 0,
    features: ["Limited matches", "Basic filters", "5 likes per day"],
    icon: Heart,
  },
  {
    name: "Premium",
    price: 9.99,
    features: ["Unlimited matches", "Advanced filters", "Priority likes", "See who liked you"],
    icon: Crown,
    popular: true,
  },
  {
    name: "VIP",
    price: 19.99,
    features: ["All Premium features", "Profile highlighting", "Direct messaging", "Exclusive events"],
    icon: Star,
  },
];

export function SubscriptionContent() {
  const [selectedTier, setSelectedTier] = useState("Premium");

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade Your Experience
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Choose the plan that works best for you and start connecting with amazing people.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white rounded-lg shadow-lg p-6 ${
                tier.popular ? "ring-2 ring-pink-500 transform scale-105" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <tier.icon className="h-8 w-8 text-pink-500" />
                {tier.popular && (
                  <span className="bg-pink-100 text-pink-800 text-sm font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {tier.name}
              </h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                ${tier.price}
                <span className="text-sm text-gray-600">/month</span>
              </p>

              <ul className="space-y-2 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedTier(tier.name)}
                className={`w-full py-3 px-4 rounded-lg font-medium ${
                  tier.popular
                    ? "bg-pink-500 text-white hover:bg-pink-600"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {tier.price === 0 ? "Continue Free" : "Get Started"}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Need help choosing?{" "}
            <Link href="/support" className="text-pink-500 hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
