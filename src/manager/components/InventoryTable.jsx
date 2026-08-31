import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import { Dropdown } from "./Dropdown";

const sortOptions = ["Most Remaining", "Least Remaining", "Category", "Name"];
const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);

export const InventoryTable = ({ 
    inventoryItems = [],
    onAddClick = () => {},
    onEdit = () => {},
    onDelete = () => {},
}) => {
    const categoryOptions = useMemo(() => {
        return [
            "All Categories",
            ...new Set(inventoryItems.map(item => item.category)),
        ];
    }, [inventoryItems]);

    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [sortBy, setSortBy] = useState("Most Remaining");

    const normalizedItems = useMemo(() =>
        inventoryItems.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          unit: item.unit,
          branch: item.branch,
          branchName: item.branch?.name || "Main Branch",
          openingStock: Number(item.openingStock ?? 0),
          stockAdded: Number(item.stockAdded ?? 0),
          remainingStock: Number(item.remainingStock ?? 0),
          soldOrUsed: Number(item.soldOrUsed ?? 0),
        })),
    
      [inventoryItems]);

      const filteredItems = useMemo(() => {
        const items = normalizedItems.filter((item) =>
            selectedCategory === "All Categories"
                ? true
                : item.category === selectedCategory,
            );

            return [...items].sort((a, b) => {
                if (sortBy === "Most Remaining") {
                    return b.remainingStock - a.remainingStock;
                }

                if (sortBy === "Least Remaining") {
                    return a.remainingStock - b.remainingStock;
                }

                if (sortBy === "Category") {
                    return a.category.localeCompare(b.category);
                }

                return a.name.localeCompare(b.name);
            }
        );
    }, [normalizedItems, selectedCategory, sortBy]);

    return (
        <section className="rounded-(--radius) border border-(--border) bg-(--surface-muted) p-6 shadow-(--shadow)">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm font-semibold text-(--text-muted)">Inventory list</p>
                    <h2 className="text-xl font-bold">Current stock by item</h2>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Dropdown 
                        icon="material-symbols:category"
                        filter={selectedCategory}
                        options={categoryOptions}
                        onSelect={(value) => setSelectedCategory(value)}
                    />

                    <Dropdown 
                        icon="mdi:sort"
                        filter={sortBy}
                        options={sortOptions}
                        onSelect={(value) => setSortBy(value)}
                    />
                </div>
            </div>

            {filteredItems.length === 0 ? (
                <div className="mt-6 rounded-(--radius) border border-dashed border-(--border) bg-(--surface) px-6 py-10 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--accent)/10 text-(--accent)">
                        <Icon
                            icon="material-symbols:inventory-2-outline-rounded"
                            className="text-3xl"
                        />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold">No inventory items yet</h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-(--text-muted)">
                        This branch does not have any inventory items recorded yet.
                        Add your first item to start tracking stock.
                    </p>

                    <button
                        onClick={onAddClick}
                        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-(--accent) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--accent-strong)"
                    >
                        <Icon icon="material-symbols:add" className="text-lg" />
                        Add your first item
                    </button>
                </div>
            ) : (
                <div className="mt-6 max-h-[70vh] overflow-x-auto overflow-y-auto custom-scrollbar">
                    <table className="min-w-full border-separate border-spacing-y-3 text-left">
                        <thead>
                            <tr className="text-sm uppercase tracking-[0.12em] text-(--text-muted)">
                                <th className="px-4 py-3">Item</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Opening</th>
                                <th className="px-4 py-3">Added</th>
                                <th className="px-4 py-3">Used</th>
                                <th className="px-4 py-3">Remaining</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredItems.map((item) => {
                                const totalAvailable = item.openingStock + item.stockAdded;

                                const percent = totalAvailable > 0
                                    ? Math.round((item.remainingStock / totalAvailable) * 100)
                                    : 0;
                                
                                const status = percent <= 20
                                    ? "Critical" 
                                    : percent <= 35
                                        ? "Low" : "Healthy";

                                const statusColor = status === "Critical"
                                    ? "bg-(--danger) text-white"
                                    :  status === "Low"
                                        ? "bg-(--warning) text-white"
                                        : "bg-(--success) text-white"

                                return (
                                    <tr
                                        key={item.id}
                                        className="rounded-3xl bg-(--surface) shadow-(--shadow) transition hover:-translate-y-0.5"
                                    >
                                        <td className="w-48 px-4 py-4 align-top">
                                            <div className="text-sm font-medium">{item.name}</div>
                                            <p className="mt-1 text-xs text-(--text-muted)">{item.unit}</p>
                                        </td>

                                        <td className="px-4 py-4 text-sm text-(--text-muted)">
                                            {item.category}
                                        </td>

                                        {/* Total */}
                                        <td className="px-4 py-4 text-sm text-(--text-muted)">
                                            {formatNumber(item.openingStock)}
                                        </td>

                                        {/* Stock added */}
                                        <td className="px-4 py-4 text-sm text-(--text-muted)">
                                            {formatNumber(item.stockAdded)}
                                        </td>

                                        {/* Used */}
                                        <td className="px-4 py-4 text-sm text-(--text-muted)">
                                            {formatNumber(item.soldOrUsed)}
                                        </td>

                                        {/* Remaining */}
                                        <td className="px-4 py-4">
                                            <div className="text-sm font-semibold">
                                                {formatNumber(item.remainingStock)}
                                            </div>
                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-(--surface-muted)">
                                            <div
                                                className="h-full rounded-full bg-(--accent)"
                                                style={{ width: `${percent}%` }}
                                            />
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white ${statusColor}`}
                                            >
                                                {status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                        <div className="flex items-center gap-2 text-(--text-muted)">
                                            <button 
                                                onClick={() => onEdit(item)}
                                                className="rounded-lg border border-(--border) hover:bg-(--surface-muted) px-3 py-2 text-sm font-semibold transition cursor-pointer"
                                            >
                                                Edit
                                            </button>

                                            <button 
                                                onClick={() => onDelete(item)} 
                                                className="rounded-lg text-white bg-rose-500 hover:bg-rose-600 px-3 py-2 text-sm font-semibold transition cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};