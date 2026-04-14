export default function LoanApplicationsPage() {
  return (
    <div className="space-y-6">
      <input
        placeholder="Search applications..."
        className="rounded-xl border border-[var(--muted)] px-4 py-2 focus:border-[var(--primary)] outline-none"
      />

      <div className="rounded-2xl border border-[var(--muted)] bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--primary-light)]/20">
            <tr>
              <th className="p-4">Applicant</th>
              <th>Email</th>
              <th>Loan Type</th>
              <th>Status</th>
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