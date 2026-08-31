import { useState } from "react";
import { AddBranch } from "../components/AddBranch";
import { BranchCards } from "../components/BranchCards";
import { BranchOverview } from "../components/BranchOverview";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { useBranches } from "../../hooks/useBranches";
import { toast } from "sonner";
import { ConfirmationModal } from "../../components/ConfirmationModal";

export const Branches = () => {
    const { 
        totalBranch,
        water,
        building,
        branchOverview
     } = useAdminDashboard();

     const { deleteBranch } = useBranches();

     const [isOpen, setIsOpen] = useState(false);
     const [editingBranch, setEditingBranch] = useState(null);
     const [branchToDelete, setBranchToDelete] = useState(null);

     const handleAdd = () => {
        setEditingBranch(null);
        setIsOpen(true);
     };

     const handleEdit = (branch) => {
        setEditingBranch(branch);
        setIsOpen(true);
     };

     const handleDeleteClick = (branch) => {
        setBranchToDelete(branch);
     };

     const handleDeleteConfirm = async () => {
        if (!branchToDelete) return;

        try {
            await deleteBranch(branchToDelete.id);
            toast.success("Branch deleted");
            setBranchToDelete(null);
        } catch (err) {
            toast.error(err.message || "Could not delete branch");
        }
     };

    return (
        <>
            <div className="space-y-6">
                <BranchOverview
                    onAddClick={handleAdd}
                    totalBranch={totalBranch}
                    water={water}
                    building={building}
                />

                <BranchCards 
                    onAddClick={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    branchOverview={branchOverview} 
                />
            </div>

            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
                >
                    <div
                        className="pointer-events-auto flex items-center justify-center w-full max-w-2xl"
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AddBranch
                            editingBranch={editingBranch}
                            onClose={() => setIsOpen(false)}
                        />
                    </div>
                </div>
            )}

            {branchToDelete && (
                <div
                    onClick={() => setBranchToDelete(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
                >
                    <div
                        className="pointer-events-auto w-full max-w-sm"
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ConfirmationModal
                            title="Delete Branch"
                            message={`Are you sure you want to delete "${branchToDelete.name}"? This action cannot be undone.`}
                            confirmText="Delete"
                            cancelText="Cancel"
                            variant="danger"
                            onCancel={() => setBranchToDelete(null)}
                            onConfirm={handleDeleteConfirm}
                        />
                    </div>
                </div>
            )}
        </>
    );
};