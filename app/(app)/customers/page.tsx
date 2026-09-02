"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/session-provider";
import Link from "next/link";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const { session, loading } = useSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!session) {
      router.push("/login");
      return;
    }

    // Fetch customers
    const fetchCustomers = async () => {
      try {
        const res = await fetch(
          `/api/customers?businessId=${session.business?.id || ""}`
        );

        if (res.ok) {
          const data = await res.json();
          setCustomers(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchCustomers();
  }, [session, loading, router]);

  if (loading || dataLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-border rounded w-1/4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-border rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-text-secondary mt-2">
            {customers.length} customer{customers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => router.push("/customers/new")}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          Add Customer
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="bg-bg-primary border border-border rounded-lg p-12 text-center">
          <p className="text-text-secondary mb-4">No customers yet</p>
          <button
            onClick={() => router.push("/customers/new")}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
          >
            Add Your First Customer
          </button>
        </div>
      ) : (
        <div className="bg-bg-primary border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-border hover:bg-bg-secondary transition"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {customer.firstName} {customer.lastName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {customer.phone || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => router.push(`/customers/${customer.id}`)}
                      className="text-primary hover:underline text-sm"
                    >
                      View
                    </button>
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
