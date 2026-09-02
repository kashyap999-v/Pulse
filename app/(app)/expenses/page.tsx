"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/session-provider";

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  isRecurring: boolean;
  createdAt: string;
}

export default function ExpensesPage() {
  const router = useRouter();
  const { session } = useSession();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    if (!session) return;

    const fetchExpenses = async () => {
      try {
        const res = await fetch(
          `/api/expenses?businessId=${session.business?.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setExpenses(data.data || []);
          setTotalExpenses(
            data.data?.reduce((sum: number, e: Expense) => sum + e.amount, 0) ||
              0
          );
        }
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [session]);

  const categoryColors: Record<string, string> = {
    RENT: "bg-primary/10 text-primary",
    UTILITIES: "bg-warning/10 text-warning",
    PAYROLL: "bg-danger/10 text-danger",
    SUPPLIES: "bg-success/10 text-success",
    OTHER: "bg-neutral/10 text-neutral",
  };

  if (loading) {
    return <div className="p-8 animate-pulse">Loading expenses...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-text-secondary mt-2">
            Total: ${totalExpenses.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <button
          onClick={() => router.push("/expenses/new")}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          Record Expense
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="bg-bg-primary border border-border rounded-lg p-12 text-center">
          <p className="text-text-secondary mb-4">No expenses recorded yet</p>
          <button
            onClick={() => router.push("/expenses/new")}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
          >
            Record First Expense
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-bg-primary border border-border rounded-lg p-4 flex justify-between items-center hover:border-primary/20 transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      categoryColors[expense.category] ||
                      categoryColors["OTHER"]
                    }`}
                  >
                    {expense.category}
                  </span>
                  <p className="font-medium">{expense.description}</p>
                  {expense.isRecurring && (
                    <span className="text-xs bg-info/20 text-info px-2 py-1 rounded">
                      Recurring
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
              <p className="font-bold text-lg">
                ${expense.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
