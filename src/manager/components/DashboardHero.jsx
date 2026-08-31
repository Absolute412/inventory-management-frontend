export const DashboardHero = ({ latestReport, branchName, branchConfig, managerName, formatDate }) => (
  <section className="hero-section">
    <div className="absolute right-6 top-6 hidden h-28 w-28 rounded-full bg-(--accent-soft) blur-2xl md:block" />
    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface) px-3 py-1 text-xs font-semibold text-(--accent-strong)">
          <span className="h-2 w-2 rounded-full bg-(--success)" />
          {latestReport ? "Submitted" : "No report yet"}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-(--text) md:text-5xl">
          Manager command center
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-(--text-muted) md:text-base">
          Live branch overview for {branchName}, built from {branchConfig.summary}.
        </p>
      </div>

      <div className="grid gap-3 rounded-(--radius) border border-(--border) bg-(--surface)/80 p-4 backdrop-blur md:min-w-72">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-(--text-muted)">Manager</span>
          <span className="font-semibold">{managerName}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-(--text-muted)">Branch</span>
          <span className="font-semibold">{branchName}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-(--text-muted)">Report</span>
          <span className="rounded-full bg-(--accent-soft) px-3 py-1 text-xs font-bold text-(--accent-strong)">
            {latestReport ? formatDate(latestReport.reportDate) : "None"}
          </span>
        </div>
      </div>
    </div>
  </section>
);
