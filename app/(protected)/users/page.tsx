"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteUser, getAllUsers } from "@/services/userService";
import type { User } from "@/types/user";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllUsers();
      setUsers(res.users);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return users;

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        (user.phone || "").toLowerCase().includes(q) ||
        (user.gender || "").toLowerCase().includes(q) ||
        (user.address || "").toLowerCase().includes(q) ||
        (user.city || "").toLowerCase().includes(q) ||
        (user.pincode || "").toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      setActionLoadingId(id);
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete user";
      alert(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-[var(--muted)] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              User Management
            </h3>
            <p className="text-sm text-slate-500">
              View all registered users and their profile details.
            </p>
          </div>

          <div className="text-sm font-medium text-slate-600">
            Total Users:{" "}
            <span className="text-[var(--primary)]">{users.length}</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-[var(--muted)] bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[var(--muted)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
        />
      </div>

      {/* States */}
      {loading ? (
        <div className="rounded-2xl border border-[var(--muted)] bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Loading users...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-[var(--muted)] bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          No users found.
        </div>
      ) : (
        // ✅ FIXED SCROLL AREA
        <div className="w-full overflow-x-auto rounded-2xl border border-[var(--muted)] bg-white shadow-sm">
          <div className="min-w-[1400px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--primary-light)]/20 text-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold">Gender</th>
                  <th className="px-6 py-4 font-semibold">DOB</th>
                  <th className="px-6 py-4 font-semibold">Address</th>
                  <th className="px-6 py-4 font-semibold">City</th>
                  <th className="px-6 py-4 font-semibold">Pincode</th>
                  <th className="px-6 py-4 font-semibold">Created At</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-[var(--muted)] hover:bg-[var(--primary-light)]/10 transition"
                  >
                    {/* 🔥 Sticky first column */}
                    <td className="sticky left-0 bg-white px-6 py-4 font-medium text-slate-800">
                      {user.name || "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">{user.email || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{user.phone || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{user.gender || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(user.dob)}
                    </td>

                    <td className="px-6 py-4 max-w-[240px] text-slate-600">
                      <div className="truncate" title={user.address || "-"}>
                        {user.address || "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">{user.city || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{user.pincode || "-"}</td>

                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={actionLoadingId === user.id}
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-60"
                      >
                        {actionLoadingId === user.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}