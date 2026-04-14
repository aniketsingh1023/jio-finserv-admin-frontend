import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}