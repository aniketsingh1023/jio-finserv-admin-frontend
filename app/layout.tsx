import type { Metadata } from "next";
import "./globals.css";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

export const metadata: Metadata = {
  title: "Web Admin Panel",
  description: "Admin panel for managing users, loan applications, and contacts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">
        <div className="min-h-screen lg:flex">
          <AdminSidebar />

          <div className="flex min-h-screen flex-1 flex-col lg:ml-72">
            <AdminHeader />
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}