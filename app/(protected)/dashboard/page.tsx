"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllUsers } from "@/services/userService";
import { getAllContacts } from "@/services/contactService";
import { getAllLoanApplications } from "@/services/loanApplicationService";
import type { User } from "@/types/user";
import type { ContactMessage } from "@/types/contact";
import type { LoanApplication } from "@/types/loanApplication";

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersRes, contactsRes, applicationsRes] = await Promise.all([
        getAllUsers(),
        getAllContacts(),
        getAllLoanApplications(),
      ]);

      setUsers(usersRes.users || []);
      setContacts(contactsRes.data || []);
      setApplications(applicationsRes.applications || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch dashboard data";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const summaryCards = useMemo(() => {
    const pendingApplications = applications.filter(
      (app) => app.status === "Pending"
    ).length;

    const approvedApplications = applications.filter(
      (app) => app.status === "Approved"
    ).length;

    const rejectedApplications = applications.filter(
      (app) => app.status === "Rejected"
    ).length;

    return [
      { title: "Total Users", value: users.length },
      { title: "Total Applications", value: applications.length },
      { title: "Pending Applications", value: pendingApplications },
      { title: "Approved Applications", value: approvedApplications },
      { title: "Rejected Applications", value: rejectedApplications },
      { title: "Contact Submissions", value: contacts.length },
    ];
  }, [users, applications, contacts]);

  const recentUsers = useMemo(() => users.slice(0, 5), [users]);
  const recentApplications = useMemo(
    () => applications.slice(0, 5),
    [applications]
  );
  const recentContacts = useMemo(() => contacts.slice(0, 5), [contacts]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "-";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const statusBadgeClass = (status: string) => {
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-[var(--primary-light)]/30 text-[var(--primary-dark)]";
  };

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="rounded-2xl border border-[var(--muted)] bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Loading dashboard data...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {summaryCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-[var(--muted)] bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <p className="text-sm text-slate-500">{card.title}</p>
                <h3 className="mt-3 text-3xl font-bold text-[var(--primary)]">
                  {card.value}
                </h3>
              </div>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-[var(--muted)] bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Users
                </h3>
                <p className="text-sm text-slate-500">
                  Latest registered users
                </p>
              </div>

              {recentUsers.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--muted)] bg-slate-50 p-8 text-center text-sm text-slate-500">
                  No user data available
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--primary-light)]/20 text-slate-700">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Name</th>
                        <th className="px-4 py-3 font-semibold">Email</th>
                        <th className="px-4 py-3 font-semibold">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-t border-[var(--muted)]"
                        >
                          <td className="px-4 py-3 text-slate-800">
                            {user.name || "-"}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {user.email || "-"}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {formatDate(user.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[var(--muted)] bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Applications
                </h3>
                <p className="text-sm text-slate-500">
                  Latest submitted loan applications
                </p>
              </div>

              {recentApplications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--muted)] bg-slate-50 p-8 text-center text-sm text-slate-500">
                  No application data available
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--primary-light)]/20 text-slate-700">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Applicant</th>
                        <th className="px-4 py-3 font-semibold">Loan Type</th>
                        <th className="px-4 py-3 font-semibold">Amount</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplications.map((application) => (
                        <tr
                          key={application.id}
                          className="border-t border-[var(--muted)]"
                        >
                          <td className="px-4 py-3 text-slate-800">
                            {application.fullName || "-"}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {application.loanType || "-"}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {formatCurrency(application.loanAmount)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(
                                application.status
                              )}`}
                            >
                              {application.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--muted)] bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Recent Contact Submissions
              </h3>
              <p className="text-sm text-slate-500">
                Latest contact messages received
              </p>
            </div>

            {recentContacts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--muted)] bg-slate-50 p-8 text-center text-sm text-slate-500">
                No contact data available
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[var(--primary-light)]/20 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold">Subject</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentContacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="border-t border-[var(--muted)]"
                      >
                        <td className="px-4 py-3 text-slate-800">
                          {contact.name || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {contact.email || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {contact.subject || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {contact.status || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {formatDate(contact.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}