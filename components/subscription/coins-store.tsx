"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Zap, Gift, Eye, Bolt as Boost } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

interface CoinsStoreProps {
  currentCoins: number;
}

const COIN_PACKAGES = [
  {
    id: "coins_10",
    coins: 10,
    price: 4.99,
    bonus: 0,
    popular: false,
  },
  {
    id: "coins_25",
    coins: 25,
    price: 9.99,
    bonus: 5,
    popular: true,
  },
  {
    id: "coins_50",
    coins: 50,
    price: 19.99,
    bonus: 15,
    popular: false,
  },
  {
    id: "coins_100",
    coins: 100,
    price: 34.99,
    bonus: 35,
    popular: false,
  },
];

const COIN_FEATURES = [
  {
    icon: Zap,
    name: "Super Like",
    cost: 1,
    description: "Stand out with a super like",
  },
  {
    icon: Boost,
    name: "Profile Boost",
    cost: 3,
    description: "Be seen by more people for 30 minutes",
  },
  {
    icon: Eye,
    name: "Private Gallery Unlock",
    cost: 5,
    description: "Unlock someone's private photos",
  },
  {
    icon: Gift,
    name: "Virtual Gift",
    cost: 2,
    description: "Send a special gift to someone",
  },
];

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function CoinsStore({ currentCoins }: CoinsStoreProps) {
  const handlePurchaseCoins = async (packageId: string) => {
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: packageId,
          type: "coins",
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Error purchasing coins:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Current Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="h-6 w-6 text-secondary" />
            <span>Your Coin Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-secondary">
            {currentCoins} coins
          </div>
          <p className="text-muted-foreground mt-1">
            Use coins to unlock premium features and stand out
          </p>
        </CardContent>
      </Card>

      {/* Coin Packages */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Buy Coins</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COIN_PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative ${pkg.popular ? "ring-2 ring-secondary" : ""}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-secondary text-secondary-foreground">
                    Best Value
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">
                  <Coins className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">
                  {pkg.coins}
                  {pkg.bonus > 0 && (
                    <span className="text-secondary"> +{pkg.bonus}</span>
                  )}{" "}
                  coins
                </CardTitle>
                <div className="text-2xl font-bold">
                  <span className="text-sm font-normal">$</span>
                  {pkg.price}
                </div>
                {pkg.bonus > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {pkg.bonus} bonus coins
                  </Badge>
                )}
              </CardHeader>

              <CardContent>
                <Button
                  className="w-full"
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={() => handlePurchaseCoins(pkg.id)}
                >
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* What You Can Do With Coins */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          What You Can Do With Coins
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {COIN_FEATURES.map((feature) => (
            <Card key={feature.name}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-secondary/10 p-3 rounded-full">
                    <feature.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{feature.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {feature.cost} coins
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
