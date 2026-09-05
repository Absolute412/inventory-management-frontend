import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import { Selects } from "./Selects";

const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const parseReportDate = (value) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date;
};

const getYearMonthKey = (value) => {
  const date = parseReportDate(value);
  if (!date) return null;

  return `${date.getFullYear()}-${date.getMonth()}`;
};

export const ReportList = ({
  reportItems = [],
  formatDate,
  onAddClick = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const normalizedItems = useMemo(
    () =>
      reportItems.map((report) => ({
        ...report,
        submittedByLabel: report.user?.name || report.submittedBy || "Unknown",
        itemCount: report.items?.length || 0,
        branchName: report.branch?.name || report.branchName || "Branch",
      })),
    [reportItems],
  );

  const availablePeriods = useMemo(() => {
    const periods = normalizedItems
      .map((report) => getYearMonthKey(report.reportDate))
      .filter(Boolean);

    return [...new Set(periods)].sort((a, b) => {
      const [aYear, aMonth] = a.split("-").map(Number);
      const [bYear, bMonth] = b.split("-").map(Number);
      return new Date(bYear, bMonth) - new Date(aYear, aMonth);
    });
  }, [normalizedItems]);

  const latestPeriod =
    availablePeriods[0] ||
    `${new Date().getFullYear()}-${new Date().getMonth()}`;

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const [, month] = latestPeriod.split("-").map(Number);
    return month;
  });

  const [selectedYear, setSelectedYear] = useState(() => {
    const [year] = latestPeriod.split("-").map(Number);
    return year;
  });

  const [selectedReport, setSelectedReport] = useState(null);

  const yearOptions = useMemo(() => {
    const years = normalizedItems
      .map((report) => parseReportDate(report.reportDate)?.getFullYear())
      .filter((value) => Number.isFinite(value));

    return [...new Set(years)]
      .sort((a, b) => b - a)
      .map((year) => ({
        id: year,
        name: String(year),
      }));
  }, [normalizedItems]);

  const filteredReports = useMemo(
    () =>
      normalizedItems.filter((report) => {
        const date = parseReportDate(report.reportDate);
        if (!date) return false;

        return (
          date.getMonth() === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      }),
    [normalizedItems, selectedMonth, selectedYear],
  );

  const currentPeriodLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(new Date(selectedYear, selectedMonth, 1)),
    [selectedMonth, selectedYear],
  );

  const activePeriodIndex = availablePeriods.indexOf(
    `${selectedYear}-${selectedMonth}`,
  );

  const handlePreviousPeriod = () => {
    if (activePeriodIndex >= availablePeriods.length - 1) return;

    const targetKey = availablePeriods[activePeriodIndex + 1];
    if (!targetKey) return;

    const [nextYear, nextMonth] = targetKey.split("-").map(Number);
    setSelectedYear(nextYear);
    setSelectedMonth(nextMonth);
  };

  const handleNextPeriod = () => {
    if (activePeriodIndex <= 0) return;

    const targetKey = availablePeriods[activePeriodIndex - 1];
    if (!targetKey) return;

    const [nextYear, nextMonth] = targetKey.split("-").map(Number);
    setSelectedYear(nextYear);
    setSelectedMonth(nextMonth);
  };

  const isWaterBranch =
    selectedReport?.branch?.branchType === "WATER" ||
    selectedReport?.branchType === "WATER";

  const openSelectedReport = (report) => setSelectedReport(report);

  return (
    <section className="rounded-(--radius) border border-(--border) bg-(--surface-muted) p-6 shadow-(--shadow)">
      <div className="mb-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-(--text-muted)">
            Report archive
          </p>
          <h2 className="text-xl font-bold">Generated reports</h2>
        </div>

        {normalizedItems.length > 0 && (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="w-full max-w-55">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-(--text-muted)">
                Month
              </label>
              <Selects
                items={monthOptions.map((month, index) => ({
                  id: index,
                  name: month,
                }))}
                value={
                  monthOptions[selectedMonth]
                    ? { id: selectedMonth, name: monthOptions[selectedMonth] }
                    : { id: 0, name: monthOptions[0] }
                }
                onChange={(item) => setSelectedMonth(Number(item.id))}
                getLabel={(item) => item.name}
              />
            </div>

            <div className="w-full max-w-37.5">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-(--text-muted)">
                Year
              </label>
              <Selects
                items={yearOptions}
                value={
                  yearOptions.find((year) => year.id === selectedYear) ||
                  yearOptions[0]
                }
                onChange={(item) => setSelectedYear(Number(item.id))}
                getLabel={(item) => item.name}
              />
            </div>
          </div>
        )}
      </div>

      {normalizedItems.length === 0 ? (
        <div className="rounded-(--radius) border border-dashed border-(--border) bg-(--surface) px-6 py-10 text-center">
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
        <>
          {availablePeriods.length > 0 && (
            <div className="mb-5 flex items-center justify-between rounded-xl border border-(--border) bg-(--surface) px-3 py-2 shadow-(--shadow-sm)">
              <button
                type="button"
                onClick={handlePreviousPeriod}
                disabled={activePeriodIndex >= availablePeriods.length - 1}
                className="inline-flex items-center gap-2 rounded-xl border border-(--border) hover:bg-(--surface-elevated) px-3 py-2 text-sm font-medium text-(--text) transition disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                <Icon icon="mdi:chevron-left" className="text-lg" />
                Previous
              </button>

              <p className="text-sm font-semibold text-(--accent-strong)">
                {currentPeriodLabel}
              </p>

              <button
                type="button"
                onClick={handleNextPeriod}
                disabled={activePeriodIndex <= 0}
                className="inline-flex items-center gap-2 rounded-xl border border-(--border) hover:bg-(--surface-elevated) px-3 py-2 text-sm font-medium text-(--text) transition disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                Next
                <Icon icon="mdi:chevron-right" className="text-lg" />
              </button>
            </div>
          )}

          {filteredReports.length === 0 ? (
            <div className="rounded-(--radius) border border-dashed border-(--border) bg-(--surface) px-6 py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--surface-muted) text-(--text-muted)">
                <Icon icon="mdi:calendar-blank" className="text-3xl" />
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                No reports for {currentPeriodLabel}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-(--text-muted)">
                There are no submitted reports for this month. Try another
                period or add a new report.
              </p>

              <button
                type="button"
                onClick={onAddClick}
                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-(--accent) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--accent-strong)"
              >
                <Icon icon="material-symbols:add" className="text-lg" />
                Generate report
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-(--radius) border border-(--border) bg-(--surface) p-4 shadow-(--shadow-sm) transition hover:border-(--accent)/40 hover:bg-(--surface-elevated)"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => openSelectedReport(report)}
                      className="flex-1 cursor-pointer text-left"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-(--text)">
                            {report.reportDate
                              ? formatDate(report.reportDate)
                              : "-"}
                          </p>
                          <p className="mt-1 text-sm text-(--text-muted)">
                            Submitted by {report.submittedByLabel} •{" "}
                            {report.branchName}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-(--accent-strong)">
                          <span className="text-sm font-medium">
                            {report.itemCount} item
                            {report.itemCount === 1 ? "" : "s"}
                          </span>
                          <Icon icon="mdi:chevron-right" className="text-xl" />
                        </div>
                      </div>
                    </button>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(report)}
                        className="rounded-lg border border-(--border) bg-(--surface-muted) px-3 py-2 text-sm font-semibold transition hover:bg-(--surface-elevated) cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(report)}
                        className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {selectedReport && (
        <div
          onClick={() => setSelectedReport(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            className="w-full max-w-3xl overflow-hidden rounded-(--radius) border border-(--border) bg-(--surface-elevated) shadow-(--shadow)"
          >
            <div className="flex items-center justify-between border-b border-(--border) bg-(--surface) px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-(--text-muted)">
                  Report details
                </p>
                <h3 className="text-xl font-bold">
                  {selectedReport.reportDate
                    ? formatDate(selectedReport.reportDate)
                    : "-"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-(--border) bg-(--surface-muted) text-(--text) cursor-pointer"
                aria-label="Close report details"
              >
                <Icon icon="mdi:close" className="text-xl" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-5 custom-scrollbar">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-(--border) bg-(--surface) p-3">
                  <p className="text-xs uppercase tracking-[0.08em] text-(--text-muted)">
                    Submitted by
                  </p>
                  <p className="mt-2 font-semibold">
                    {selectedReport.submittedByLabel}
                  </p>
                </div>

                <div className="rounded-xl border border-(--border) bg-(--surface) p-3">
                  <p className="text-xs uppercase tracking-[0.08em] text-(--text-muted)">
                    Branch
                  </p>
                  <p className="mt-2 font-semibold">
                    {selectedReport.branchName}
                  </p>
                </div>

                <div className="rounded-xl border border-(--border) bg-(--surface) p-3">
                  <p className="text-xs uppercase tracking-[0.08em] text-(--text-muted)">
                    Report date
                  </p>
                  <p className="mt-2 font-semibold">
                    {selectedReport.reportDate
                      ? formatDate(selectedReport.reportDate)
                      : "-"}
                  </p>
                </div>

                <div className="rounded-xl border border-(--border) bg-(--surface) p-3">
                  <p className="text-xs uppercase tracking-[0.08em] text-(--text-muted)">
                    Inventory items
                  </p>
                  <p className="mt-2 font-semibold">
                    {selectedReport.itemCount}
                  </p>
                </div>
              </div>

              {isWaterBranch && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-(--border) bg-(--surface) p-3">
                    <p className="text-xs uppercase tracking-[0.08em] text-(--text-muted)">
                      Sachets produced
                    </p>
                    <p className="mt-2 text-2xl font-bold text-(--accent)">
                      {selectedReport.sachetProduced ?? 0}
                    </p>
                  </div>

                  <div className="rounded-xl border border-(--border) bg-(--surface) p-3">
                    <p className="text-xs uppercase tracking-[0.08em] text-(--text-muted)">
                      Bottles produced
                    </p>
                    <p className="mt-2 text-2xl font-bold text-(--accent)">
                      {selectedReport.bottledProduced ?? 0}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-(--accent-strong)">
                  Reported items
                </p>

                {selectedReport.items?.length > 0 ? (
                  <div className="overflow-hidden rounded-xl border border-(--border) bg-(--surface)">
                    <div className="hidden grid-cols-5 gap-3 border-b border-(--border) bg-(--surface-muted) px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-(--text-muted) md:grid">
                      <span>Item</span>
                      <span>Opening</span>
                      <span>Stock added</span>
                      <span>Sold / Used</span>
                      <span>Remaining</span>
                    </div>

                    <div className="divide-y divide-(--border)">
                      {selectedReport.items.map((item) => (
                        <div
                          key={item.id}
                          className="grid gap-3 px-4 py-3 md:grid-cols-5 md:items-center"
                        >
                          <div>
                            <p className="text-xs uppercase tracking-[0.08em] text-(--text-muted) md:hidden">
                              Item
                            </p>
                            <p className="font-medium">
                              {item.item?.name || "Unknown item"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.08em] text-(--text-muted) md:hidden">
                              Opening
                            </p>
                            <p>{item.openingStock ?? 0}</p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.08em] text-(--text-muted) md:hidden">
                              Stock added
                            </p>
                            <p>{item.stockAdded ?? 0}</p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.08em] text-(--text-muted) md:hidden">
                              Sold / Used
                            </p>
                            <p>{item.soldOrUsed ?? 0}</p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.08em] text-(--text-muted) md:hidden">
                              Remaining
                            </p>
                            <p>{item.remainingStock ?? 0}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-(--border) bg-(--surface) px-4 py-6 text-sm text-(--text-muted)">
                    No report items have been added yet.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-(--border) bg-(--surface) px-5 py-4">
              <button
                type="button"
                onClick={() => onEdit(selectedReport)}
                className="rounded-lg border border-(--border) bg-(--surface-muted) px-4 py-2 text-sm font-semibold transition hover:bg-(--surface-elevated) cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedReport(null);
                  onDelete(selectedReport);
                }}
                className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
