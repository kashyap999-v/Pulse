"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BUSINESS_TYPES = [
  { value: "retail", label: "Retail" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "services", label: "Services" },
  { value: "restaurant", label: "Restaurant" },
  { value: "saas", label: "SaaS" },
  { value: "other", label: "Other" },
];

const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "INR", label: "INR - Indian Rupee" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("retail");
  const [currency, setCurrency] = useState("USD");
  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (step === 1) {
      if (!businessName.trim()) {
        setError("Business name is required");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      setError("");
      setLoading(true);

      try {
        const res = await fetch("/api/auth/create-business", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: businessName,
            type: businessType,
            currency,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to create business");
          return;
        }

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (err) {
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
      <div className="w-full max-w-md">
        <div className="bg-bg-primary rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-2">Welcome to PULSE</h1>
          <p className="text-text-secondary text-sm mb-8">
            Step {step} of 2 — Let's set up your workspace
          </p>

          {/* Progress bar */}
          <div className="h-1 bg-border rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded p-3 text-danger text-sm mb-6">
              {error}
            </div>
          )}

          {/* Step 1: Business Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g., Coffee Shop Co."
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2: Business Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Type
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-bg-secondary transition"
              >
                Back
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded-md transition disabled:opacity-50"
            >
              {step === 2 ? (loading ? "Setting up..." : "Get Started") : "Continue"}
            </button>
          </div>

          <p className="text-center text-xs text-text-secondary mt-6">
            You can change these settings later
          </p>
        </div>
      </div>
    </div>
  );
}
