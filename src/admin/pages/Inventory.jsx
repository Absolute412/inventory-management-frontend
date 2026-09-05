import { useMemo, useState } from "react";
import { useInventory } from "../../hooks/useInventory";
import { useBranches } from "../../hooks/useBranches";
import { toast } from "sonner";
import { Selects } from "../../manager/components/Selects";
import { InventoryOverview } from "../../manager/components/InventoryOverview";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { InventoryTable } from "../../manager/components/InventoryTable";
import { AddInventory } from "../../manager/components/AddInventory";
import { ConfirmationModal } from "../../components/ConfirmationModal";

export const Inventory = () => {
    const { branches } = useBranches();
    const { inventory, deleteInventoryItem } = useInventory();
    const { formatNumber } = useAdminDashboard();

    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(() => {
        const saved = localStorage.getItem("selectedAdminInventoryBranch");
        return saved ? JSON.parse(saved) : null;
    });

    const selectedBranchForView = useMemo(() => {
        if (branches.length === 0) return null;

        const exists = branches.find((branch) => branch.id === selectedBranch?.id);

        return exists ?? branches[0];
    }, [branches, selectedBranch]);

    const normalizedItems = useMemo(() => {
        return inventory.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            unit: item.unit,
            branchId: item.branch?.id,
            branch: item.branch,
            currentStock: Number(item.currentStock ?? 0),
            minimumStock: Number(item.minimumStock ?? 0),
        }));
    }, [inventory]);

    const handleBranchChange = (branch) => {
        setSelectedBranch(branch);
        localStorage.setItem("selectedAdminInventoryBranch", JSON.stringify(branch));
    };

    const visibleItems = useMemo(() => {
        if (!selectedBranchForView) return [];

        return normalizedItems.filter((item) => item.branchId === selectedBranchForView.id);
    }, [normalizedItems, selectedBranchForView]);

    const handleAdd = () => {
        setEditingItem(null);
        setIsOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsOpen(true);
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteInventoryItem(itemToDelete.id);
            toast.success("Inventory item deleted");
            setItemToDelete(null);
        } catch (err) {
            toast.error(err.message || "Could not delete inventory item");
        }
    };

    const totalItems = visibleItems.length;

    const totalStock = visibleItems.reduce((sum, item) => sum + item.currentStock, 0);

    const lowStockCount = visibleItems.filter((item) => 
        item.currentStock <= item.minimumStock
    ).length;

    return (
        <>
            <div className="mb-6 max-w-sm">
                <label className="mb-4 block text-sm font-semibold">Select Branch</label>

                <Selects
                    items={branches}
                    value={selectedBranch}
                    onChange={handleBranchChange}
                />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold">
                    Branch:{" "}
                    <span className="text-2xl text-(--accent)">
                        {selectedBranchForView?.name}
                    </span>
                </h2>

                <InventoryOverview
                    totalItems={totalItems}
                    lowStockCount={lowStockCount}
                    totalStock={totalStock}
                    formatNumber={formatNumber}
                    onAddClick={handleAdd}
                />

                <InventoryTable
                    inventoryItems={visibleItems}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onAddClick={handleAdd}
                />
            </div>

            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
                >
                    <div
                    className="pointer-events-auto flex w-full max-w-2xl items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => e.stopPropagation()}
                    >
                    <AddInventory
                        editingInventory={editingItem}
                        selectedBranch={selectedBranchForView}
                        onClose={() => setIsOpen(false)}
                    />
                    </div>
                </div>
                )}

                {itemToDelete && (
                    <div
                        onClick={() => setItemToDelete(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
                    >
                        <div
                            className="pointer-events-auto w-full max-w-sm"
                            role="dialog"
                            aria-modal="true"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ConfirmationModal
                                title="Delete Item"
                                message="Are you sure you want to delete this item? This action cannot be undone."
                                confirmText="Delete"
                                cancelText="Cancel"
                                variant="danger"
                                onCancel={() => setItemToDelete(null)}
                                onConfirm={handleDeleteConfirm}
                            />
                        </div>
                    </div>
                )}
        </>
    );
};