"use client";

import { useEffect, useMemo, useState } from "react";
import {
  deleteContact,
  getAllContacts,
  updateContactStatus,
} from "@/services/contactService";
import type { ContactMessage, ContactStatus } from "@/types/contact";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllContacts();
      setContacts(response.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch contacts";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return contacts;

    return contacts.filter((contact) => {
      return (
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.phone.toLowerCase().includes(query) ||
        (contact.subject || "").toLowerCase().includes(query) ||
        contact.message.toLowerCase().includes(query) ||
        contact.status.toLowerCase().includes(query)
      );
    });
  }, [contacts, search]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact message?"
    );
    if (!confirmed) return;

    try {
      setActionLoadingId(id);
      await deleteContact(id);
      setContacts((prev) => prev.filter((contact) => contact.id !== id));

      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete contact";
      alert(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStatusChange = async (id: string, status: ContactStatus) => {
    try {
      setActionLoadingId(id);
      const response = await updateContactStatus(id, status);

      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === id ? response.data : contact
        )
      );

      if (selectedMessage?.id === id) {
        setSelectedMessage(response.data);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update status";
      alert(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--muted)] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Contact Management
            </h3>
            <p className="text-sm text-slate-500">
              View, search, update status, and delete contact form submissions.
            </p>
          </div>

          <div className="text-sm font-medium text-slate-600">
            Total Contacts:{" "}
            <span className="text-[var(--primary)]">{contacts.length}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--muted)] bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search by name, email, phone, subject, message, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[var(--muted)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
        />
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[var(--muted)] bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Loading contact messages...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="rounded-2xl border border-[var(--muted)] bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          No contact messages found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--muted)] bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--primary-light)]/20 text-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">Subject</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Submitted At</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-t border-[var(--muted)] transition hover:bg-[var(--primary-light)]/10"
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {contact.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{contact.email}</td>
                  <td className="px-6 py-4 text-slate-600">{contact.phone}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {contact.subject || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        contact.status === "Read"
                          ? "bg-green-100 text-green-700"
                          : "bg-[var(--primary-light)]/30 text-[var(--primary-dark)]"
                      }`}
                    >
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatDate(contact.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedMessage(contact)}
                        className="rounded-lg border border-[var(--muted)] px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(
                            contact.id,
                            contact.status === "Unread" ? "Read" : "Unread"
                          )
                        }
                        disabled={actionLoadingId === contact.id}
                        className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoadingId === contact.id
                          ? "Updating..."
                          : contact.status === "Unread"
                          ? "Mark Read"
                          : "Mark Unread"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(contact.id)}
                        disabled={actionLoadingId === contact.id}
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionLoadingId === contact.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--muted)] px-6 py-4">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  Contact Message
                </h4>
                <p className="text-sm text-slate-500">
                  {selectedMessage.name} · {selectedMessage.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Phone
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {selectedMessage.phone}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Subject
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {selectedMessage.subject || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Status
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {selectedMessage.status}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Submitted At
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {formatDate(selectedMessage.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Message
                </p>
                <div className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}