"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/session-provider";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  customer: { firstName: string; lastName: string; email: string };
  total: number;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const { session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (!session) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `/api/orders?businessId=${session.business?.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setOrders(data.data || []);
          setTotalRevenue(
            data.data?.reduce((sum: number, o: Order) => sum + o.total, 0) ||
              0
          );
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  const statusColors: Record<string, string> = {
    PENDING: "bg-warning/10 text-warning",
    CONFIRMED: "bg-info/10 text-info",
    SHIPPED: "bg-primary/10 text-primary",
    DELIVERED: "bg-success/10 text-success",
    CANCELLED: "bg-danger/10 text-danger",
  };

  if (loading) {
    return <div className="p-8 animate-pulse">Loading orders...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-text-secondary mt-2">
            Revenue: ${totalRevenue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <button
          onClick={() => router.push("/orders/new")}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          New Order
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-bg-primary border border-border rounded-lg p-12 text-center">
          <p className="text-text-secondary mb-4">No orders yet</p>
          <button
            onClick={() => router.push("/orders/new")}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
          >
            Create First Order
          </button>
        </div>
      ) : (
        <div className="bg-bg-primary border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border hover:bg-bg-secondary transition"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {order.customer.firstName} {order.customer.lastName}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.status] || statusColors["PENDING"]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">
                    ${order.total.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
