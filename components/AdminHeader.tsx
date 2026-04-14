"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Overview of platform activity",
  },
  "/users": {
    title: "Users",
    subtitle: "Manage registered users",
  },
  "/loan-applications": {
    title: "Loan Applications",
    subtitle: "Manage loan requests",
  },
  "/contacts": {
    title: "Contacts",
    subtitle: "Contact form submissions",
  },
};

export default function AdminHeader() {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? {
    title: "Admin",
    subtitle: "",
  };

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--muted)] bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{page.title}</h2>
          <p className="text-sm text-slate-500">{page.subtitle}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white font-semibold">
          A
        </div>
      </div>
    </header>
  );
}