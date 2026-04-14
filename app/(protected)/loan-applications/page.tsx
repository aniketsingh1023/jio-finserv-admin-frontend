"use client";

import { useEffect, useMemo, useState } from "react";
import {
  deleteLoanApplication,
  getAllLoanApplications,
  updateLoanApplicationStatus,
} from "@/services/loanApplicationService";
import type {
  LoanApplication,
  LoanApplicationStatus,
} from "@/types/loanApplication";

export default function LoanApplicationsPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<LoanApplication | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllLoanApplications();
      setApplications(res.applications);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch applications";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return applications;

    return applications.filter((application) => {
      return (
        application.fullName?.toLowerCase().includes(q) ||
        application.email?.toLowerCase().includes(q) ||
        application.phone?.toLowerCase().includes(q) ||
        application.loanType?.toLowerCase().includes(q) ||
        application.status?.toLowerCase().includes(q) ||
        application.city?.toLowerCase().includes(q) ||
        application.pincode?.toLowerCase().includes(q) ||
        (application.referenceId || "").toLowerCase().includes(q)
      );
    });
  }, [applications, search]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmed) return;

    try {
      setActionLoadingId(id);
      await deleteLoanApplication(id);
      setApplications((prev) => prev.filter((item) => item.id !== id));

      if (selectedApplication?.id === id) {
        setSelectedApplication(null);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete application";
      alert(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStatusChange = async (
    id: string,
    status: LoanApplicationStatus
  ) => {
    try {
      setActionLoadingId(id);
      const res = await updateLoanApplicationStatus(id, status);

      setApplications((prev) =>
        prev.map((item) => (item.id === id ? res.application : item))
      );

      if (selectedApplication?.id === id) {
        setSelectedApplication(res.application);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update status";
      alert(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "-";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const statusBadgeClass = (status: LoanApplicationStatus) => {
    if (status === "Approved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-[var(--primary-light)]/30 text-[var(--primary-dark)]";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--muted)] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Loan Applications
            </h3>
            <p className="text-sm text-slate-500">
              Review, update status, and manage submitted loan applications.
            </p>
          </div>

          <div className="text-sm font-medium text-slate-600">
            Total Applications:{" "}
            <span className="text-[var(--primary)]">
              {applications.length}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--muted)] bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search by applicant, email, phone, loan type, status, city, pincode, or reference..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[var(--muted)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
        />
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[var(--muted)] bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Loading loan applications...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="rounded-2xl border border-[var(--muted)] bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          No loan applications found.
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-2xl border border-[var(--muted)] bg-white shadow-sm">
          <div className="min-w-[1500px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--primary-light)]/20 text-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Applicant</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold">Loan Type</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">City</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Reference ID</th>
                  <th className="px-6 py-4 font-semibold">Submitted At</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((application) => (
                  <tr
                    key={application.id}
                    className="border-t border-[var(--muted)] transition hover:bg-[var(--primary-light)]/10"
                  >
                    <td className="sticky left-0 bg-white px-6 py-4 font-medium text-slate-800">
                      {application.fullName || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {application.email || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {application.phone || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {application.loanType || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatCurrency(application.loanAmount)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {application.city || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {application.referenceId || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(application.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedApplication(application)}
                          className="rounded-lg border border-[var(--muted)] px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(application.id, "Approved")
                          }
                          disabled={actionLoadingId === application.id}
                          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(application.id, "Rejected")
                          }
                          disabled={actionLoadingId === application.id}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Reject
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(application.id, "Pending")
                          }
                          disabled={actionLoadingId === application.id}
                          className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Pending
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(application.id)}
                          disabled={actionLoadingId === application.id}
                          className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {actionLoadingId === application.id
                            ? "Processing..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--muted)] px-6 py-4">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  Application Details
                </h4>
                <p className="text-sm text-slate-500">
                  {selectedApplication.fullName} · {selectedApplication.loanType}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
              <DetailItem label="Full Name" value={selectedApplication.fullName} />
              <DetailItem label="Email" value={selectedApplication.email} />
              <DetailItem label="Phone" value={selectedApplication.phone} />
              <DetailItem label="Date of Birth" value={formatDate(selectedApplication.dob)} />
              <DetailItem label="Gender" value={selectedApplication.gender} />
              <DetailItem label="Address" value={selectedApplication.address} />
              <DetailItem label="City" value={selectedApplication.city} />
              <DetailItem label="Pincode" value={selectedApplication.pincode} />
              <DetailItem label="Loan Type" value={selectedApplication.loanType} />
              <DetailItem
                label="Loan Amount"
                value={formatCurrency(selectedApplication.loanAmount)}
              />
              <DetailItem
                label="Company Name"
                value={selectedApplication.companyName}
              />
              <DetailItem
                label="Monthly Income"
                value={formatCurrency(selectedApplication.monthlyIncome)}
              />
              <DetailItem
                label="Existing EMI"
                value={formatCurrency(selectedApplication.existingEmi)}
              />
              <DetailItem
                label="Primary Bank"
                value={selectedApplication.primaryBank}
              />
              <DetailItem
                label="CIBIL Score"
                value={selectedApplication.cibilScore}
              />
              <DetailItem
                label="Aadhar Number"
                value={selectedApplication.aadharNumber}
              />
              <DetailItem
                label="PAN Number"
                value={selectedApplication.panNumber}
              />
              <DetailItem
                label="Nominee Name"
                value={selectedApplication.nomineeName}
              />
              <DetailItem
                label="Nominee Relation"
                value={selectedApplication.nomineeRelation}
              />
              <DetailItem
                label="Payment Method"
                value={selectedApplication.paymentMethod}
              />
              <DetailItem
                label="Card Number"
                value={selectedApplication.cardNumber}
              />
              <DetailItem
                label="Expiry Date"
                value={selectedApplication.expiryDate}
              />
              <DetailItem label="CVV" value={selectedApplication.cvv} />
              <DetailItem label="Status" value={selectedApplication.status} />
              <DetailItem
                label="Reference ID"
                value={selectedApplication.referenceId}
              />
              <DetailItem
                label="Submitted At"
                value={formatDate(selectedApplication.createdAt)}
              />
            </div>

            <div className="border-t border-[var(--muted)] px-6 py-5">
              <h5 className="mb-3 text-sm font-semibold text-slate-900">
                Uploaded Documents
              </h5>

              <div className="grid gap-3 md:grid-cols-2">
                <DocumentLink
                  label="Bank Statement PDF"
                  url={selectedApplication.bankStatementPdf}
                />
                <DocumentLink
                  label="Aadhar PDF"
                  url={selectedApplication.aadharPdf}
                />
                <DocumentLink
                  label="PAN PDF"
                  url={selectedApplication.panCardPdf}
                />
                <DocumentLink
                  label="Aadhar Front Image"
                  url={selectedApplication.aadharFrontImage}
                />
                <DocumentLink
                  label="Aadhar Back Image"
                  url={selectedApplication.aadharBackImage}
                />
                <DocumentLink
                  label="PAN Card Image"
                  url={selectedApplication.panCardImage}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm text-slate-700">{value || "-"}</p>
    </div>
  );
}

function DocumentLink({
  label,
  url,
}: {
  label: string;
  url: string | null;
}) {
  return (
    <div className="rounded-xl border border-[var(--muted)] p-4">
      <p className="text-sm font-medium text-slate-800">{label}</p>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm font-medium text-[var(--primary)] hover:underline"
        >
          Open document
        </a>
      ) : (
        <p className="mt-2 text-sm text-slate-500">Not available</p>
      )}
    </div>
  );
}