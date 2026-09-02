"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Customers", href: "/customers", icon: "👥" },
  { label: "Products", href: "/products", icon: "📦" },
  { label: "Orders", href: "/orders", icon: "🛒" },
  { label: "Invoices", href: "/invoices", icon: "📄" },
  { label: "Expenses", href: "/expenses", icon: "💰" },
  { label: "Tasks", href: "/tasks", icon: "✓" },
  { label: "Campaigns", href: "/campaigns", icon: "📢" },
  { label: "Analytics", href: "/analytics", icon: "📈" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } bg-bg-primary border-r border-border transition-all duration-300 flex flex-col h-screen sticky top-0`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between hover:bg-bg-secondary p-2 rounded"
        >
          <span className={`font-bold text-primary ${open ? "text-xl" : "text-lg"}`}>
            {open ? "PULSE" : "P"}
          </span>
          <span className="text-text-secondary">{open ? "−" : "+"}</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
              pathname.startsWith(item.href)
                ? "bg-primary/10 text-primary font-medium"
                : "text-text-secondary hover:bg-bg-secondary"
            }`}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            {open && <span className="truncate">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-2">
        <button className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-bg-secondary rounded transition">
          {open ? "⚙ Settings" : "⚙"}
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10 rounded transition">
          {open ? "🚪 Logout" : "🚪"}
        </button>
      </div>
    </aside>
  );
}
