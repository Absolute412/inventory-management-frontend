import { Icon } from "@iconify/react";

export const InventorySnapshot = ({ visibleItems, formatNumber, showBranchPills }) => {
  return (
    <article className="rounded-(--radius) border border-(--border) bg-(--surface-muted) p-5 shadow-(--shadow)">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-(--accent-strong)">Inventory Snapshot</p>
          <h2 className="text-xl font-bold">Latest stock status</h2>
        </div>
        <Icon icon="solar:box-bold-duotone" className="text-3xl text-(--accent)" />
      </div>

      {visibleItems.length === 0 ? (
        <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--border) bg-(--surface) px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--surface-elevated)">
                <Icon
                    icon="solar:box-minimalistic-bold-duotone"
                    className="text-3xl text-(--text-muted)"
                />
            </div>

            <h3 className="mt-4 text-sm font-bold">
                No inventory items yet
            </h3>

            <p className="mt-1 max-w-sm text-sm text-(--text-muted)">
                Inventory items will appear here once stock has been added to this branch.
            </p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
            {visibleItems.map((item) => {
                const totalAvailable = item.openingStock + item.stockAdded;
                const percent = totalAvailable > 0
                    ? Math.min(100, Math.round((item.remainingStock / totalAvailable) * 100))
                    : 0;
                const branchName = item.branchName || "Unknown branch";

                return (
                    <div
                        key={item.id}
                        className="rounded-2xl border border-(--border) bg-(--surface) p-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="font-bold">{item.name}</h3>
                                <p className="text-xs text-(--text-muted)">
                                    {item.category} - {item.unit}
                                </p>
                                {showBranchPills && (
                                    <span className="mt-2 inline-flex rounded-full bg-(--surface-elevated) px-3 py-1 text-[11px] font-semibold text-(--text-muted)">
                                    {branchName}
                                    </span>
                                )}
                            </div>
                            <span className="rounded-full bg-(--surface-elevated) px-3 py-1 text-xs font-bold">
                                {percent}% left
                            </span>
                        </div>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-(--surface-elevated)">
                            <div className="h-full rounded-full bg-(--accent)" style={{ width: `${percent}%` }} />
                        </div>
                        <div className="mt-3 flex justify-between text-xs text-(--text-muted)">
                            <span>Used {formatNumber(item.soldOrUsed)}</span>
                            <span>{formatNumber(item.remainingStock)} left</span>
                        </div>
                    </div>
                );
            })}
        </div>
        )}
    </article>
  );
};
