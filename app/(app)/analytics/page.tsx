"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/components/session-provider";

interface AnalyticsData {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

export default function AnalyticsPage() {
  const { session } = useSession();
  const [data, setData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalExpenses: 0,
    profit: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    const fetchAnalytics = async () => {
      try {
        const [ordersRes, customersRes, expensesRes] = await Promise.all([
          fetch(`/api/orders?businessId=${session.business?.id}`),
          fetch(`/api/customers?businessId=${session.business?.id}`),
          fetch(`/api/expenses?businessId=${session.business?.id}`),
        ]);

        let totalRevenue = 0,
          totalOrders = 0,
          totalCustomers = 0,
          totalExpenses = 0;

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          totalRevenue = ordersData.data?.reduce(
            (sum: number, o: any) => sum + o.total,
            0
          ) || 0;
          totalOrders = ordersData.data?.length || 0;
        }

        if (customersRes.ok) {
          const customersData = await customersRes.json();
          totalCustomers = customersData.data?.length || 0;
        }

        if (expensesRes.ok) {
          const expensesData = await expensesRes.json();
          totalExpenses = expensesData.data?.reduce(
            (sum: number, e: any) => sum + e.amount,
            0
          ) || 0;
        }

        const profit = totalRevenue - totalExpenses;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setData({
          totalRevenue,
          totalExpenses,
          profit,
          totalOrders,
          totalCustomers,
          averageOrderValue,
        });
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [session]);

  if (loading) {
    return <div className="p-8 animate-pulse">Loading analytics...</div>;
  }

  const metrics = [
    { label: "Total Revenue", value: `$${data.totalRevenue.toFixed(2)}`, trend: "+12%" },
    { label: "Total Expenses", value: `$${data.totalExpenses.toFixed(2)}`, trend: "+5%" },
    { label: "Profit", value: `$${data.profit.toFixed(2)}`, trend: data.profit > 0 ? "+" : "-" },
    { label: "Orders", value: data.totalOrders, trend: "+8" },
    { label: "Customers", value: data.totalCustomers, trend: "+3" },
    { label: "Avg Order Value", value: `$${data.averageOrderValue.toFixed(2)}`, trend: "+2%" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="bg-bg-primary border border-border rounded-lg p-6 hover:border-primary/20 transition"
          >
            <p className="text-text-secondary text-sm font-medium">{metric.label}</p>
            <p className="text-3xl font-bold mt-3">{metric.value}</p>
            <p className="text-success text-sm mt-2">{metric.trend} vs last period</p>
          </div>
        ))}
      </div>

      {/* Profitability */}
      <div className="bg-bg-primary border border-border rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Profitability</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-text-secondary mb-1">Revenue</p>
            <div className="w-full bg-border rounded-full h-2 overflow-hidden">
              <div
                className="bg-success h-full"
                style={{
                  width: `${
                    data.totalExpenses > 0
                      ? (data.totalRevenue / (data.totalRevenue + data.totalExpenses)) * 100
                      : 100
                  }%`,
                }}
              />
            </div>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Expenses</p>
            <div className="w-full bg-border rounded-full h-2 overflow-hidden">
              <div
                className="bg-danger h-full"
                style={{
                  width: `${
                    data.totalRevenue > 0
                      ? (data.totalExpenses / (data.totalRevenue + data.totalExpenses)) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-text-secondary mb-1">Profit Margin</p>
            <p className="text-2xl font-bold text-success">
              {data.totalRevenue > 0
                ? (((data.totalRevenue - data.totalExpenses) / data.totalRevenue) * 100).toFixed(1)
                : 0}
              %
            </p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-bg-primary border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4">Key Insights</h2>
        <ul className="space-y-2">
          <li className="flex gap-3">
            <span className="text-primary">✓</span>
            <span className="text-sm">
              {data.totalCustomers > 0
                ? `${data.totalCustomers} total customers generating revenue`
                : "Add your first customer to track revenue"}
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary">✓</span>
            <span className="text-sm">
              {data.averageOrderValue > 0
                ? `Average order value: $${data.averageOrderValue.toFixed(2)}`
                : "Create your first order"}
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary">✓</span>
            <span className="text-sm">
              {data.profit > 0
                ? `Profit margin: ${(((data.totalRevenue - data.totalExpenses) / data.totalRevenue) * 100).toFixed(1)}%`
                : "Monitor expenses to improve profitability"}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
