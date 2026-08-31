import { useState } from "react";
import { useBranches } from "../../hooks/useBranches";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Selects } from "../../manager/components/Selects";

const initialBranchForm = {
  name: "",
  branchType: "",
};

const getInitialFormData = ({
  editingBranch,
  presetName,
  presetBranchType,
}) => {
  if (editingBranch) {
    return {
      name: editingBranch.name ?? "",
      branchType: editingBranch.branchType ?? "",
    };
  }

  return {
    ...initialBranchForm,
    name: presetName || "",
    branchType: presetBranchType || "",
  };
};

const branchTypeOptions = [
  { id: "WATER", name: "Water" },
  { id: "BUILDING_MATERIALS", name: "Building Materials" },
];

export const AddBranch = ({
  editingBranch,
  presetName,
  presetBranchType,
  onSaved,
  onCancelEdit,
  onClose,
}) => {
  const { addBranch, updateBranch } = useBranches();

  const [formData, setFormData] = useState(() =>
    getInitialFormData({
      editingBranch,
      presetName,
      presetBranchType,
    }),
  );

  const [submitting, setSubmitting] = useState(false);

  const selectedBranchType =
    branchTypeOptions.find((item) => item.id === formData.branchType) || null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBranchTypeChange = (item) => {
    setFormData((prev) => ({
      ...prev,
      branchType: item.id,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.branchType) {
      toast.error("All fields required");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        branchType: formData.branchType.trim(),
      };

      if (editingBranch) {
        await updateBranch(editingBranch.id, payload);
        toast.success("Branch updated");
      } else {
        await addBranch(payload);
        toast.success("Branch added");
      }

      setFormData(initialBranchForm);
      onSaved?.();
      onClose?.();
    } catch (err) {
      toast.error(err?.message || "Could not save branch.");
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
        {editingBranch ? "Edit Branch" : "Add Branch"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Name"
            className="
            w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm 
            outline-none transition duration-200 focus:border-(--accent) focus:ring-4 focus:ring-(--accent)"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Branch Type</label>
          <Selects
            items={branchTypeOptions}
            value={selectedBranchType}
            onChange={handleBranchTypeChange}
            getLabel={(item) => item.name}
          />
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
              ? "Saving"
              : editingBranch
                ? "Save Changes"
                : "Add Branch"}
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData(initialBranchForm);
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
