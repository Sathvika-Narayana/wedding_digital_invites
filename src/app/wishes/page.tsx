"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

export default function WishesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified admin dashboard where RSVPs and Wishes are managed securely
    router.replace("/admin");
  }, [router]);

  return (
    <main className="min-h-screen py-16 px-4 flex items-center justify-center" style={{ background: "#0d0508" }}>
      <div className="text-center space-y-4 max-w-sm">
        <Shield className="w-12 h-12 text-[#e8d49a] animate-pulse mx-auto" />
        <h1 className="font-calligraphy text-3xl text-[#e8d49a]">Palace Register Secure Gate</h1>
        <p className="font-serif text-[#f5edd8]/60 text-xs italic">
          Redirecting to the secure host dashboard at /admin to view blessings and RSVPs...
        </p>
      </div>
    </main>
  );
}
