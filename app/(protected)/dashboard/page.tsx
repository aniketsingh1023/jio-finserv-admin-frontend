const summaryCards = [
  { title: "Total Users", value: "0" },
  { title: "Total Applications", value: "0" },
  { title: "Pending Applications", value: "0" },
  { title: "Approved Applications", value: "0" },
  { title: "Rejected Applications", value: "0" },
  { title: "Contact Submissions", value: "0" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-[var(--muted)] bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm text-slate-500">{card.title}</p>
            <h3 className="mt-3 text-3xl font-bold text-[var(--primary)]">
              {card.value}
            </h3>
          </div>
        ))}
      </section>

      <div className="rounded-2xl border border-[var(--muted)] bg-white p-6">
        Dashboard content will appear here
      </div>
    </div>
  );
}