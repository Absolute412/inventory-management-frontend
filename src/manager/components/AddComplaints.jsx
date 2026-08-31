/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useComplaints } from "../../hooks/useComplaints";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { useAuth } from "../../hooks/useAuth";
import { useBranches } from "../../hooks/useBranches";
import { Selects } from "./Selects";

const initialComplaintForm = {
    title: "",
    description: "",
};

const getInitialFormData = ({
    editingComplaint,
    presetTitle,
    presetDescription,
}) => {
    if (editingComplaint) {
        return {
            title: editingComplaint.title ?? "",
            description: editingComplaint.description ?? "",
        };
    }

    return {
        ...initialComplaintForm,
        title: presetTitle || "",
        description: presetDescription || "",
    }
};

export const AddComplaints = ({
    editingComplaint,
    selectedBranch: defaultBranch,
    presetTitle,
    presetDescription,
    onSaved,
    onCancelEdit,
    onClose,
}) => {
    const { user } = useAuth();
    const { accessibleBranches } = useBranches();
    const { addComplaint, updateComplaint } = useComplaints();

    const [formData, setFormData] = useState(() =>
        getInitialFormData({
            editingComplaint,
            presetTitle,
            presetDescription,
        }),
    );

    const [submitting, setSubmitting] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);

    useEffect(() => {
        if (accessibleBranches.length === 0) return;

        if (editingComplaint?.branch) {
            const branch = accessibleBranches.find((b) => b.id === editingComplaint.branch.id);

            setSelectedBranch(branch ?? null);
        } else {
            setSelectedBranch(defaultBranch ?? accessibleBranches[0]);
        }
    }, [accessibleBranches, editingComplaint, defaultBranch]);

    const handleBranchSelect = (branch) => {
        setSelectedBranch(branch);
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
        
        if (!formData.title || !formData.description) {
            toast.error("All fields required");
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                branchId: selectedBranch?.id,
            };

            if (editingComplaint) {
                await updateComplaint(editingComplaint.id, payload);
                toast.success("Complaint updated");
            } else {
                await addComplaint(payload);
                toast.success("Complaint added");
            }

            setFormData(initialComplaintForm);
            onSaved?.();
            onClose?.();
        } catch (err) {
            toast.error(err?.message || "Could not save complaint.");
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
                {editingComplaint ? "Edit Complaint" : "Add Complaint"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {(user?.role === "ADMIN" || user.branch.branchType === "BUILDING_MATERIALS") && (
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
                    <label className="mb-1 block text-sm font-medium">Title</label>
                    <input 
                        type="text" 
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter title"
                        className="
                        w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm 
                        outline-none transition duration-200 focus:border-(--accent) focus:ring-4 focus:ring-(--accent)"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Description</label>
                    <input 
                        type="text" 
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                        className="
                        w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm 
                        outline-none transition duration-200 focus:border-(--accent) focus:ring-4 focus:ring-(--accent)"
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
                            : editingComplaint
                                ? "Save Changes"
                                : "Add Complaint"
                        }
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setFormData(initialComplaintForm);
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