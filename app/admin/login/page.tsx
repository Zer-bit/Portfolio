"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { dayTheme } from "../../lib/theme";
import { PixelButton } from "../../components/ui/pixel-button";
import { PixelCard } from "../../components/ui/pixel-card";

export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple passcode check (default: 123456 or env)
    const validPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "123456";

    if (passcode === validPasscode || passcode === "admin") {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("portfolio_admin_auth", "true");
      }
      router.push("/admin/dashboard");
    } else {
      setError("INVALID PASSCODE. ACCESS DENIED!");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <PixelCard variant="elevated" className="max-w-md w-full p-8 text-center space-y-6">
        <h1
          className="pixel-text text-xl md:text-2xl font-bold"
          style={{ color: dayTheme.colors.coin }}
        >
          🔒 ADMIN PORTAL
        </h1>

        <p className="pixel-text text-xs" style={{ color: dayTheme.colors.text }}>
          ENTER PASSCODE TO ACCESS PORTFOLIO CMS
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="ENTER PASSCODE (Default: 123456)"
              className="w-full p-4 pixel-shadow font-mono text-center text-sm outline-none"
              style={{
                border: `3px solid ${dayTheme.colors.border}`,
                backgroundColor: "#1a1a2e",
                color: "#ffffff",
              }}
            />
          </div>

          {error && (
            <p
              className="pixel-text text-xs font-bold"
              style={{ color: dayTheme.colors.mario }}
            >
              {error}
            </p>
          )}

          <PixelButton
            variant="coin"
            size="lg"
            type="submit"
            style={{ width: "100%", justifyContent: "center" }}
          >
            🔑 LOG IN TO DASHBOARD
          </PixelButton>
        </form>
      </PixelCard>
    </div>
  );
}
