import { Icon } from "@iconify/react";

export const ComplaintDesk = ({ unresolvedComplaints, formatDate, showBranchPills }) => (
  <article className="rounded-(--radius) border border-(--border) bg-(--surface-muted) p-5 shadow-(--shadow)">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-(--accent-strong)">Complaint Desk</p>
        <h2 className="text-xl font-bold">Needs your attention</h2>
      </div>
      <Icon icon="mdi:message-badge-outline" className="text-3xl text-(--danger)" />
    </div>

    <div className="mt-5">
      {unresolvedComplaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--border) bg-(--surface) px-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--success)/10">
          <Icon
            icon="solar:check-circle-bold-duotone"
            className="text-3xl text-(--success)"
          />
        </div>

        <h3 className="mt-4 text-sm font-bold">
          All clear
        </h3>

        <p className="mt-1 max-w-sm text-sm text-(--text-muted)">
          There are no unresolved complaints requiring your attention.
        </p>
      </div>
      ) : (
        <div className="mt-5 space-y-3">
          {unresolvedComplaints.map((complaint) => {
            const branchName = complaint.branch?.name || "Unknown branch";

            return (
              <div
                key={complaint.id}
                className="rounded-2xl border border-(--border) bg-(--surface) p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-bold">{complaint.title}</h3>
                    <p className="mt-1 text-sm text-(--text-muted)">{complaint.description}</p>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span
                      className={
                        complaint.status === "RESOLVED"
                          ? "rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-600"
                          : "rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-(--danger)"
                      }
                    >
                      {complaint.status === "RESOLVED" ? "Resolved" : "Unresolved"}
                    </span>

                    {showBranchPills && (
                      <span className="w-fit rounded-full bg-(--surface-elevated) px-3 py-1 text-[11px] font-semibold text-(--text-muted)">
                        {branchName}
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-xs font-semibold text-(--text-muted)">
                  Created {formatDate(complaint.createdAt)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </article>
);
