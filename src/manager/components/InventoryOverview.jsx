import { Icon } from "@iconify/react";

export const InventoryOverview = ({ onAddClick, totalItems, lowStockCount, totalStock, formatNumber }) => {

    return (
        <section className="space-y-4 rounded-(--radius) border border-(--border) bg-(--surface-muted) p-6 shadow-(--shadow)">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-(--accent-strong)">Manager Inventory</p>
                    <h1 className="text-2xl font-bold">Inventory overview</h1>
                    <p className="mt-2 text-sm text-(--text-muted)">
                        Review current stock levels and identify low-stock items before the next delivery.
                    </p>
                </div>

                <button
                    onClick={onAddClick}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-(--accent) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--accent-strong)"
                >
                    <Icon icon="material-symbols:add" className="text-lg" />
                    Add Item
                </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
                <article className="rounded-(--radius) border border-(--border) bg-(--surface) p-4">
                    <p className="text-sm font-semibold text-(--text-muted)">Total inventory items</p>
                    <h2 className="mt-3 text-3xl font-bold">
                        {totalItems}
                    </h2>
                </article>

                <article className="rounded-(--radius) border border-(--border) bg-(--surface) p-4">
                    <p className="text-sm font-semibold text-(--text-muted)">Low stock alerts</p>
                    <h2 className="mt-3 text-3xl font-bold text-(--warning)">
                        {lowStockCount}
                    </h2>
                </article>

                <article className="rounded-(--radius) border border-(--border) bg-(--surface) p-4">
                    <p className="text-sm font-semibold text-(--text-muted)">Remaining units</p>
                    <h2 className="mt-3 text-3xl font-bold">
                        {formatNumber(totalStock)}
                    </h2>
                </article>
            </div>
        </section>
    );
};