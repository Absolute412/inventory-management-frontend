import { Link } from "react-router-dom";
import { BRANCH_TYPE_CONFIG } from "../configs/branchConfig";
import { Icon } from "@iconify/react";

export const RecentReports = ({
  sortedReports,
  getReportMetrics,
  branchConfig,
  formatDate,
  formatNumber,
  showBranchPills,
  path,
}) => (
  <article className="rounded-(--radius) border border-(--border) bg-(--surface-muted) p-5 shadow-(--shadow)">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-(--accent-strong)">Recent Reports</p>
        <h2 className="text-xl font-bold">Latest submissions</h2>
      </div>

      <Link 
        to={path}
        className="rounded-full border border-(--border) bg-(--surface) hover:bg-(--surface-elevated) px-4 py-2 text-sm font-bold cursor-pointer"
      >
        View all
      </Link>
    </div>

    <div className="mt-5 overflow-hidden rounded-2xl border border-(--border)">
      {sortedReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-(--surface) px-6 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--surface-elevated)">
            <Icon icon="iconoir:reports" className="text-xl" />
          </div>

          <h3 className="mt-4 text-sm font-bold">
            No reports submitted yet
          </h3>

          <p className="mt-1 max-w-sm text-sm text-(--text-muted)">
            Your recent report submissions will appear here once a report has
            been submitted.
          </p>
        </div>
      ) : (
        sortedReports.slice(0, 3).map((report) => {
          const reportMetrics = getReportMetrics(report);
          const reportBranchName = report.branch?.name || "Unknown branch";
          const reportBranchType = report.branch?.branchType || report.branchType || "BUILDING_MATERIALS";
          const reportBranchConfig = BRANCH_TYPE_CONFIG[reportBranchType] || branchConfig;

          return (
            <div
              key={report.id}
              className="grid gap-3 border-b border-(--border) bg-(--surface) p-4 last:border-b-0 md:grid-cols-[1fr_auto_auto]"
            >
              <div>
                <h3 className="font-bold">{formatDate(report.reportDate)}</h3>
                <p className="text-xs text-(--text-muted)">Submitted by {report.submittedByLabel}</p>
                {showBranchPills && (
                  <span className="mt-2 inline-flex rounded-full bg-(--surface-elevated) px-3 py-1 text-[11px] font-semibold text-(--text-muted)">
                    {reportBranchName}
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold">
                {formatNumber(reportMetrics.primary)}{" "} 
                {reportBranchConfig.trendLabels.primary.toLowerCase()}
              </p>

              <p className="text-sm font-semibold">
                {formatNumber(reportMetrics.secondary)}{" "} 
                {reportBranchConfig.trendLabels.secondary.toLowerCase()}
              </p>
            </div>
          );
        })
      )}
    </div>
  </article>
);
