import { Icon } from "@iconify/react";
import { useMemo } from "react";

export const ReportList = ({
  reportItems = [],
  formatDate,
  onAddClick = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const normalizedItems = useMemo(() =>
    reportItems.map((report) => ({
    ...report,
    submittedByLabel: report.user?.name || report.submittedBy || "Unknown",
    itemCount: report.items?.length || 0,
  })), [reportItems]);

  return (
    <section className="rounded-(--radius) border border-(--border) bg-(--surface-muted) p-6 shadow-(--shadow)">
      <div className="mb-4">
          <p className="text-sm font-semibold text-(--text-muted)">Report list</p>
          <h2 className="text-xl font-bold">Generated reports</h2>
      </div>

      {normalizedItems.length === 0 ? (
        <div className="mt-6 rounded-(--radius) border border-dashed border-(--border) bg-(--surface) px-6 py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--accent)/10 text-(--accent)">
            <Icon icon="mdi:report-line" className="text-3xl" />
          </div>

          <h3 className="mt-4 text-lg font-semibold">No reports yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-(--text-muted)">
            This branch does not have any reports recorded yet. Add your first
            report.
          </p>

          <button
            onClick={onAddClick}
            className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-(--accent) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--accent-strong)"
          >
            <Icon icon="material-symbols:add" className="text-lg" />
            Generate your first report
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {normalizedItems.map((report) => (
            <article
              key={report.id}
              className="rounded-(--radius) border border-(--border) bg-(--surface) p-4 shadow-(--shadow-sm)"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-(--text-muted)">Report date</p>
                  <p className="text-lg font-semibold">
                    {report.reportDate ? formatDate(report.reportDate) : "-"}
                  </p>
                  <p className="mt-2 text-sm text-(--text-muted)">
                    Submitted by {report.submittedByLabel}
                  </p>
                  <p className="mt-2 text-sm text-(--text-muted)">
                    Report items: {report.itemCount}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(report)}
                    className="rounded-lg border border-(--border) hover:bg-(--surface-muted) px-3 py-2 text-sm font-semibold transition cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(report)}
                    className="rounded-lg text-white bg-rose-500 hover:bg-rose-600 px-3 py-2 text-sm font-semibold transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-4 max-h-[70vh] rounded-lg border border-(--border) bg-(--surface-muted) p-4 overflow-y-auto custom-scrollbar">
                <p className="text-sm font-semibold text-(--accent-strong)">
                  Reported items
                </p>
                {report.items?.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {report.items.map((item) => (
                      <div
                        key={item.id}
                        className="grid gap-2 rounded-lg border border-(--border) bg-(--surface) p-3 sm:grid-cols-4"
                      >
                        <div>
                          <p className="text-xs uppercase text-(--text-muted)">
                            Item
                          </p>
                          <p className="font-medium">{item.item?.name || "Unknown item"}</p>
                        </div>

                        <div>
                          <p className="text-xs uppercase text-(--text-muted)">
                            Opening stock
                          </p>
                          <p className="font-medium">{item.openingStock}</p>
                        </div>

                        <div>
                          <p className="text-xs uppercase text-(--text-muted)">
                            Sold / Used
                          </p>
                          <p className="font-medium">{item.soldOrUsed}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs uppercase text-(--text-muted)">
                            Remaining stock
                          </p>
                          <p className="font-medium">{item.remainingStock}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-(--text-muted)">
                    No report items have been added yet.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
