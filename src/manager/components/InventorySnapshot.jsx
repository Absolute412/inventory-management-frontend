import { Icon } from "@iconify/react";

export const InventorySnapshot = ({
  visibleItems,
  formatNumber,
  showBranchPills,
}) => {
  return (
    <article className="rounded-(--radius) border border-(--border) bg-(--surface-muted) p-5 shadow-(--shadow)">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-(--accent-strong)">
            Inventory Snapshot
          </p>
          <h2 className="text-xl font-bold">Latest stock status</h2>
        </div>
        <Icon
          icon="solar:box-bold-duotone"
          className="text-3xl text-(--accent)"
        />
      </div>

      {visibleItems.length === 0 ? (
        <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--border) bg-(--surface) px-6 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--surface-elevated)">
            <Icon
              icon="solar:box-minimalistic-bold-duotone"
              className="text-3xl text-(--text-muted)"
            />
          </div>

          <h3 className="mt-4 text-sm font-bold">No inventory items yet</h3>

          <p className="mt-1 max-w-sm text-sm text-(--text-muted)">
            Inventory items will appear here once stock has been added to this
            branch.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {visibleItems.map((item) => {
            const currentStock = Number(item.currentStock ?? 0);
            const minimumStock = Number(item.minimumStock ?? 0);

            const status =
              currentStock === 0
                ? "Out of stock"
                : currentStock < minimumStock
                  ? "Low stock"
                  : "Healthy";

            const statusColor =
              currentStock === 0
                ? "bg-(--danger) text-white"
                : currentStock < minimumStock
                  ? "bg-(--warning) text-white"
                  : "bg-(--success) text-white";

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

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor}`}
                  >
                    {status}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-2xl font-bold">
                    {formatNumber(currentStock)}
                  </p>
                  <p className="mt-1 text-xs text-(--text-muted)">
                    {item.unit} currently in stock
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-(--border) flex items-center justify-between">
                  <span className="text-xs text-(--text-muted)">
                    Minimum stock level
                  </span>
                  <span className="text-xs font-semibold text-(--accent)">
                    {formatNumber(minimumStock)} {item.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
};
