export const ProductionChart = ({ sortedReports, getReportMetrics, branchConfig, maxTrendPrimary, maxTrendSecondary, formatDate }) => (
  <article className="rounded-(--radius) border border-(--border) bg-(--surface-muted) p-5 shadow-(--shadow)">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-(--accent-strong)">Production Pulse</p>
        <h2 className="text-xl font-bold">Latest output trend</h2>
      </div>
      <div className="flex gap-3 text-xs font-semibold text-(--text-muted)">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-(--accent)" />
          {branchConfig.trendLabels.primary}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-(--warning)" />
          {branchConfig.trendLabels.secondary}
        </span>
      </div>
    </div>

    <div className="mt-8 flex h-72 items-end gap-3 sm:gap-5">
      {sortedReports.slice(0, 6).map((report) => {
        const reportMetrics = getReportMetrics(report);
        return (
          <div key={report.id} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-56 w-full items-end justify-center gap-1.5 rounded-2xl bg-(--surface) px-2 pb-3">
              <div
                className="w-full max-w-8 rounded-t-full bg-(--accent)"
                style={{
                  height: `${Math.min(
                    100,
                    ((reportMetrics.primary ?? 0) / maxTrendPrimary) * 100,
                  )}%`,
                }}
                title={`${formatDate(report.reportDate)} ${branchConfig.trendLabels.primary}`}
              />
              <div
                className="w-full max-w-8 rounded-t-full bg-(--warning)"
                style={{
                  height: `${Math.min(
                    100,
                    ((reportMetrics.secondary ?? 0) / maxTrendSecondary) * 100,
                  )}%`,
                }}
                title={`${formatDate(report.reportDate)} ${branchConfig.trendLabels.secondary}`}
              />
            </div>
            <span className="text-xs font-bold text-(--text-muted)">
              {formatDate(report.reportDate)}
            </span>
          </div>
        );
      })}
    </div>
  </article>
);
