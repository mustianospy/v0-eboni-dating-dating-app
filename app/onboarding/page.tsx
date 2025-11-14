export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation';
import { authOptions } from "@/lib/auth";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 dark:from-violet-950 dark:via-pink-950 dark:to-orange-950">
      <OnboardingFlow />
    </div>
  );
}
