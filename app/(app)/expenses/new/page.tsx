"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/session-provider";

export default function NewExpensePage() {
  const router = useRouter();
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    category: "OTHER",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    isRecurring: false,
    frequency: "",
    notes: "",
  });

  const categories = [
    "RENT",
    "UTILITIES",
    "PAYROLL",
    "SUPPLIES",
    "EQUIPMENT",
    "MARKETING",
    "INSURANCE",
    "MAINTENANCE",
    "SHIPPING",
    "SOFTWARE",
    "OTHER",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: session?.business?.id,
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create expense");
        return;
      }

      router.push("/expenses");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Record Expense</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-danger/10 border border-danger/20 rounded p-4 text-danger text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description *
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Office supplies"
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm font-medium">Recurring expense?</span>
          </label>
        </div>

        {formData.isRecurring && (
          <div>
            <label className="block text-sm font-medium mb-2">Frequency</label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select frequency</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Recording..." : "Record Expense"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border border-border rounded-md hover:bg-bg-secondary transition py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
