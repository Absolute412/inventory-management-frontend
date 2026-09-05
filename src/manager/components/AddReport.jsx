/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useReports } from "../../hooks/useReports";
import { initialReportForm } from "../constants/report";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { useAuth } from "../../hooks/useAuth";
import { Selects } from "./Selects";
import { useBranches } from "../../hooks/useBranches";
import { useInventory } from "../../hooks/useInventory";

const getInitialFormData = (
  editingReport,
  presetReportDate,
  presetSubmittedBy,
  presetSachetProduced,
  presetBottledProduced,
  presetItems,
  defaultSubmittedBy,
) => {
  if (editingReport) {
    return {
      reportDate: editingReport.reportDate
        ? editingReport.reportDate.slice(0, 10)
        : "",
      submittedBy: editingReport.user?.name ?? "",
      sachetProduced: editingReport.sachetProduced ?? "",
      bottledProduced: editingReport.bottledProduced ?? "",
      items: (editingReport.items ?? []).map((reportItem) => ({
        itemId: reportItem.itemId,
        name: reportItem.item?.name ?? "",
        unit: reportItem.item?.unit ?? "",
        openingStock: reportItem.openingStock ?? 0,
        stockAdded: reportItem.stockAdded ?? "",
        soldOrUsed: reportItem.soldOrUsed ?? "",
      })),
    };
  }

  return {
    ...initialReportForm,
    reportDate: presetReportDate || "",
    submittedBy: presetSubmittedBy || defaultSubmittedBy || "",
    sachetProduced: presetSachetProduced,
    bottledProduced: presetBottledProduced,
    items: presetItems || [],
  };
};

export const AddReport = ({
  editingReport,
  selectedBranch: defaultBranch,
  presetReportDate,
  presetSubmittedBy,
  presetSachetProduced,
  presetBottledProduced,
  presetItems,
  onSaved,
  onCancelEdit,
  onClose,
}) => {
  const { user } = useAuth();
  const { accessibleBranches } = useBranches();
  const { inventory, loadingInventory, inventoryError } = useInventory();
  const { addReport, updateReport } = useReports();
  const defaultSubmittedBy = presetSubmittedBy || user?.name || "";

  const [formData, setFormData] = useState(() =>
    getInitialFormData(
      editingReport,
      presetReportDate,
      presetSubmittedBy,
      presetSachetProduced,
      presetBottledProduced,
      presetItems,
      defaultSubmittedBy,
    ),
  );

  const [submitting, setSubmitting] = useState(false);
  const [selectedReport, setSelectedReport] = useState(() => {
    if (editingReport) {
      return {
        id: editingReport.user?.id,
        name: editingReport.user?.name,
      };
    }

    if (user?.name) {
      return { id: user.id, name: user.name };
    }

    return null;
  });
  const [selectedBranch, setSelectedBranch] = useState(null);

  useEffect(() => {
    if (
      editingReport ||
      !["WATER", "BUILDING_MATERIALS"].includes(selectedBranch?.branchType)
    ) {
      return;
    }

    const branchItems = inventory.filter(
      (item) => item.branchId === selectedBranch.id,
    );

    setFormData((prev) => ({
      ...prev,
      items: branchItems.map((item) => ({
        itemId: item.id,
        name: item.name,
        unit: item.unit,
        openingStock: item.currentStock,
        stockAdded: "",
        soldOrUsed: "",
      })),
    }));
  }, [editingReport, selectedBranch, inventory]);

  useEffect(() => {
    if (accessibleBranches.length === 0) return;

    if (editingReport?.branch) {
      const branch = accessibleBranches.find(
        (b) => b.id === editingReport.branch.id,
      );

      setSelectedBranch(branch ?? null);
    } else {
      setSelectedBranch(defaultBranch ?? accessibleBranches[0]);
    }
  }, [accessibleBranches, editingReport, defaultBranch]);

  const managerOptions = user?.name ? [{ id: user.id, name: user.name }] : [];

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
  };

  const handleSelect = (report) => {
    setSelectedReport(report);
    setFormData((prev) => ({
      ...prev,
      submittedBy: report?.name || "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (itemId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.itemId === itemId
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reportDate || !formData.submittedBy) {
      toast.error("Please fill in the report date and submitted by.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        reportDate: formData.reportDate,
        submittedBy: selectedReport?.id,
        sachetProduced: Number(formData.sachetProduced || 0),
        bottledProduced: Number(formData.bottledProduced || 0),
        branchId: selectedBranch?.id,
        items: formData.items.map((item) => ({
          itemId: item.itemId,
          stockAdded: Number(item.stockAdded || 0),
          soldOrUsed: Number(item.soldOrUsed || 0),
        })),
      };

      if (editingReport) {
        await updateReport(editingReport.id, payload);
        toast.success("Report updated");
      } else {
        await addReport(payload);
        toast.success("Report added");
      }

      setFormData(initialReportForm);
      onSaved?.();
      onClose?.();
    } catch (err) {
      toast.error(err?.message || "Could not save report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow)">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 rounded-full p-2 transition hover:bg-(--surface-muted) cursor-pointer"
      >
        <Icon icon="material-symbols:close-rounded" />
      </button>

      <h2 className="mb-4 text-lg font-semibold">
        {editingReport ? "Edit Report" : "Generate Daily Report"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-h-110 overflow-y-auto"
      >
        {selectedBranch?.branchType === "BUILDING_MATERIALS" && (
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

        <div>
          <label className="mb-1 block text-sm font-medium">Submitted by</label>
          <Selects
            items={managerOptions}
            value={selectedReport}
            onChange={handleSelect}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Report date</label>
          <input
            type="date"
            name="reportDate"
            value={formData.reportDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5"
          />
        </div>

        {selectedBranch?.branchType === "WATER" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Sachets Produced
              </label>
              <input
                type="number"
                min="0"
                name="sachetProduced"
                placeholder="0"
                value={formData.sachetProduced}
                onChange={handleChange}
                className="w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Bottles Produced
              </label>
              <input
                type="number"
                min="0"
                name="bottledProduced"
                placeholder="0"
                value={formData.bottledProduced}
                onChange={handleChange}
                className="w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5"
              />
            </div>
          </div>
        )}

        {["WATER", "BUILDING_MATERIALS"].includes(
          selectedBranch?.branchType,
        ) && (
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">Inventory</h3>
              <p className="text-xs text-(--text-muted)">
                Enter the stock added and quantity sold or used for each item.
              </p>
            </div>

            {loadingInventory && (
              <p className="text-sm text-(--text-muted)">
                Loading inventory...
              </p>
            )}

            {inventoryError && (
              <p className="text-sm text-red-500">{inventoryError}</p>
            )}

            {!loadingInventory &&
              !inventoryError &&
              formData.items.length === 0 && (
                <p className="rounded-xl border border-(--border) p-4 text-sm text-(--text-muted)">
                  No inventory items found for this branch.
                </p>
              )}

            <div className="space-y-3">
              {formData.items.map((item) => {
                const openingStock = Number(item.openingStock || 0);
                const stockAdded = Number(item.stockAdded || 0);
                const soldOrUsed = Number(item.soldOrUsed || 0);

                const remainingStock = openingStock + stockAdded - soldOrUsed;

                return (
                  <div
                    key={item.itemId}
                    className="rounded-xl border border-(--border) bg-(--surface-elevated) p-4"
                  >
                    <div className="mb-3">
                      <p className="font-medium">{item.name}</p>

                      <p className="text-xs text-(--text-muted)">
                        Current stock: {openingStock}
                        {item.unit ? ` ${item.unit}` : ""}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium">
                          Opening Stock
                        </label>

                        <input
                          type="number"
                          value={openingStock}
                          readOnly
                          className="w-full cursor-not-allowed rounded-xl border border-(--border) bg-(--surface-muted) px-3 py-2.5"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium">
                          Stock Added
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={item.stockAdded}
                          onChange={(e) =>
                            handleItemChange(
                              item.itemId,
                              "stockAdded",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          className="w-full rounded-xl border border-(--border) bg-(--surface) px-3 py-2.5"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium">
                          Sold / Used
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={item.soldOrUsed}
                          onChange={(e) =>
                            handleItemChange(
                              item.itemId,
                              "soldOrUsed",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          className="w-full rounded-xl border border-(--border) bg-(--surface) px-3 py-2.5"
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-(--border) pt-3 text-sm">
                      <span className="font-medium">Remaining Stock</span>

                      <span
                        className={
                          remainingStock < 0
                            ? "font-semibold text-red-500"
                            : "font-semibold"
                        }
                      >
                        {remainingStock}
                        {item.unit ? ` ${item.unit}` : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className="
            flex-1 rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold text-white transition duration-200 
            hover:-translate-y-0.5 hover:bg-(--accent-strong) disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {submitting
              ? "Saving"
              : editingReport
                ? "Save changes"
                : "Generate Report"}
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData(initialReportForm);
              onCancelEdit?.();
              onClose?.();
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
