/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useInventory } from "../../hooks/useInventory";
import { initialForm } from "../constants/inventory";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Selects } from "./Selects";
import { getInventoryItems } from "../constants/getInventoryItems";
import { useAuth } from "../../hooks/useAuth";
import { useBranches } from "../../hooks/useBranches";

const getInitialFormData = (
  editingInventory,
  presetName,
  presetCategory,
  presetUnit,
) => {
  if (editingInventory) {
    return {
      name: editingInventory.name ?? "",
      category: editingInventory.category ?? "",
      unit: editingInventory.unit ?? "",
      currentStock: editingInventory.currentStock ?? "",
      minimumStock: editingInventory.minimumStock ?? "",
    };
  }

  return {
    ...initialForm,
    name: presetName || "",
    category: presetCategory || "",
    unit: presetUnit || "",
    currentStock: "",
    minimumStock: "",
  };
};

export const AddInventory = ({
  editingInventory,
  selectedBranch: defaultBranch,
  presetName = "",
  presetCategory = "",
  presetUnit = "",
  onSaved,
  onCancelEdit,
  onClose,
}) => {
  const { user } = useAuth();
  const { accessibleBranches } = useBranches();
  const { addInventoryItem, updateInventoryItem } = useInventory();

  const [formData, setFormData] = useState(() =>
    getInitialFormData(
      editingInventory,
      presetName,
      presetCategory,
      presetUnit,
    ),
  );
  const [submitting, setSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(() => {
    if (!editingInventory) return null;
    
    return {
      name: editingInventory.name,
      category: editingInventory.category,
      unit: editingInventory.unit,
    };
  });
  const [selectedBranch, setSelectedBranch] = useState(null);

  useEffect(() => {
    if (accessibleBranches.length === 0) return;

    if (editingInventory?.branch) {
      const branch = accessibleBranches.find((b) => b.id === editingInventory.branch.id);

      setSelectedBranch(branch ?? null);
    } else {
      setSelectedBranch(defaultBranch ?? accessibleBranches[0]);
    }
  }, [accessibleBranches, editingInventory, defaultBranch]);

  const branchType = selectedBranch?.branchType || user?.branch?.branchType || "WATER";

  const items = getInventoryItems(branchType);

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    setFormData((prev) => ({
      ...prev,
      name: item.name,
      category: item.category,
      unit: item.unit,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const currentStockValue = Number(formData.currentStock || 0);
      const minimumStockValue = Number(formData.minimumStock || 0);

      if (currentStockValue < 0 || minimumStockValue < 0) {
        throw new Error("Stock values cannot be negative");
      }

      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        unit: formData.unit.trim(),
        currentStock: currentStockValue,
        minimumStock: minimumStockValue,
        branchId: selectedBranch?.id,
      };

      if (editingInventory?.id) {
        await updateInventoryItem(editingInventory.id, payload);
        toast.success("Inventory item updated.");
      } else {
        await addInventoryItem(payload);
        toast.success("Inventory item added.");
      }

      setFormData(initialForm);
      onSaved?.();
      onClose?.();
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Could not save inventory item";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl max-h-110 overflow-y-auto rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow)">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 rounded-full p-2 transition hover:bg-(--surface-muted) cursor-pointer"
      >
        <Icon icon="material-symbols:close-rounded" />
      </button>

      <h2 className="mb-4 text-lg font-semibold">
        {editingInventory ? "Edit Inventory Item" : "Add Inventory Item"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {(user?.role === "ADMIN" || user?.branch?.branchType === "BUILDING_MATERIALS") && (
          <div>
            <label className="mb-1 block text-sm font-medium">Branch</label>
            <Selects 
              items={accessibleBranches}
              value={selectedBranch}
              onChange={handleBranchSelect}
              getLabel={(branch) => branch.name}
            />
          </div>
        )}

        <label className="mb-1 block text-sm font-medium">Item name</label>
        <Selects 
          items={items}
          value={selectedItem}
          onChange={handleSelect}
          getLabel={(item) => item.name}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Current stock</label>
            <input
              name="currentStock"
              type="number"
              min="0"
              value={formData.currentStock}
              onChange={handleChange}
              placeholder="0"
              className="w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm outline-none transition duration-200 focus:border-(--accent) focus:ring-4 focus:ring-(--accent)"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Minimum stock</label>
            <input
              name="minimumStock"
              type="number"
              min="0"
              value={formData.minimumStock}
              onChange={handleChange}
              placeholder="0"
              className="w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm outline-none transition duration-200 focus:border-(--accent) focus:ring-4 focus:ring-(--accent)"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className="
            flex-1 rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold text-white transition duration-200 
            hover:-translate-y-0.5 hover:bg-(--accent-strong) disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {submitting
              ? "Saving..."
              : editingInventory
                ? "Save changes"
                : "Add Inventory item"}
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData(initialForm);
              onCancelEdit?.();
              onClose?.()
            }}
            className="
            rounded-xl border border-(--border) bg-(--surface-elevated) px-4 py-2.5 text-sm font-semibold 
            transition duration-200 hover:bg-(--surface-muted) cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
