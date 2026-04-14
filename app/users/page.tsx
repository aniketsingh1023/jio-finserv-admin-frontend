export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <input
          placeholder="Search users..."
          className="rounded-xl border border-[var(--muted)] px-4 py-2 focus:border-[var(--primary)] outline-none"
        />

        <button className="bg-[var(--primary)] text-white px-4 py-2 rounded-xl hover:bg-[var(--primary-dark)] transition">
          Add User
        </button>
      </div>

      <div className="rounded-2xl border border-[var(--muted)] bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--primary-light)]/20">
            <tr>
              <th className="p-4">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-[var(--muted)] hover:bg-[var(--primary-light)]/10">
              <td className="p-4">No data</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>
                <button className="text-[var(--primary)]">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}