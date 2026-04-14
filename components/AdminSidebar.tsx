"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Users", href: "/users" },
  { label: "Loan Applications", href: "/loan-applications" },
  { label: "Contacts", href: "/contacts" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-[var(--muted)] bg-white lg:block">
      <div className="flex h-20 items-center border-b border-[var(--muted)] px-6">
        <h1 className="text-xl font-bold text-[var(--primary)]">
          Web Admin
        </h1>
      </div>

      <nav className="px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[var(--primary)] text-white shadow-md"
                      : "text-slate-700 hover:bg-[var(--primary-light)]/20"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}