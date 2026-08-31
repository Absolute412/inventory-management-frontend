import { useInventory } from "../../hooks/useInventory";
import { InventoryOverview } from "../components/InventoryOverview";
import { InventoryTable } from "../components/InventoryTable";
import { toast } from "sonner";
import { AddInventory } from "../components/AddInventory";
import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useBranches } from "../../hooks/useBranches";
import { Selects } from "../components/Selects";
import { useManagerDashboard } from "../hooks/useManagerDashboard";
import { ConfirmationModal } from "../../components/ConfirmationModal";

export const ManagerInventory = () => {
  const { user } = useAuth();
  const { accessibleBranches } = useBranches();
  const { inventory, deleteInventoryItem } = useInventory();
  const { formatNumber } = useManagerDashboard();

  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(() => {
    const saved = localStorage.getItem("selectedInventoryBranch");

    return saved ? JSON.parse(saved) : null;
  });

  const selectedBranchForView = useMemo(() => {
    if (accessibleBranches.length === 0) return null;

    const exists = accessibleBranches.find((branch) => branch.id === selectedBranch?.id);
    
    return exists ?? accessibleBranches[0];
  }, [accessibleBranches, selectedBranch]);

  // console.log(inventory);

  const normalizedItems = useMemo(() => {
    return inventory.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      unit: item.unit,
      branchId: item.branch?.id,
      branch: item.branch,
      openingStock: Number(item.openingStock ?? 0),
      stockAdded: Number(item.stockAdded ?? 0),
      remainingStock: Number(item.remainingStock ?? 0),
      soldOrUsed: Number(item.soldOrUsed ?? 0),
    }));
  }, [inventory]);

  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
    localStorage.setItem("selectedInventoryBranch", JSON.stringify(branch));
  };
  
  const visibleItems = useMemo(() => {
    if (user.branch.branchType === "BUILDING_MATERIALS") {
      if (!selectedBranchForView) return [];

      return normalizedItems.filter((item) => item.branchId === selectedBranchForView.id);
    }

    return normalizedItems;
  }, [normalizedItems, selectedBranchForView, user]);

  const totalItems = visibleItems.length;

  const totalStock = visibleItems.reduce((sum, item) => sum + item.remainingStock, 0);
  const lowStockCount = visibleItems.filter((item) => {
    const totalAvailable = item.openingStock + item.stockAdded;
    return totalAvailable > 0 && item.remainingStock / totalAvailable < 0.35;
  }).length;

  const handleAdd = () => {
    setEditingItem(null);
    setIsOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsOpen(true);

    // console.log(item);
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
      toast.error(err?.message || "Could not delete inventory item");
    }
  };

  return (
    <>
      {user.branch.branchType === "BUILDING_MATERIALS" && (
        <div className="mb-6 max-w-sm">
          <label className="mb-4 block text-sm font-semibold">Select Branch</label>

          <Selects
            items={accessibleBranches}
            value={selectedBranchForView}
            onChange={handleBranchChange}
          />
        </div>
      )}

      <div className="space-y-6">
        {user.branch.branchType === "BUILDING_MATERIALS" && (
          <h2 className="text-xl font-bold">
            Branch:{" "}
            <span className="text-2xl text-(--accent)">
              {
                user.branch.branchType === "BUILDING_MATERIALS"
                  ? selectedBranchForView?.name
                  : user.branch.name
              }
            </span>
          </h2>
        )}
  
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

      {/* Add modal */}
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
