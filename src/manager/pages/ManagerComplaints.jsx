import { useMemo, useState } from "react";
import { useComplaints } from "../../hooks/useComplaints";
import { ComplaintList } from "../components/ComplaintList";
import { ComplaintOverview } from "../components/ComplaintOverview";
import { toast } from "sonner";
import { AddComplaints } from "../components/AddComplaints";
import { formatDate } from "../utils/date";
import { useAuth } from "../../hooks/useAuth";
import { useBranches } from "../../hooks/useBranches";
import { Selects } from "../components/Selects";
import { ConfirmationModal } from "../../components/ConfirmationModal";

export const ManagerComplaints = () => {
    const { user } = useAuth();
    const { accessibleBranches } = useBranches();
    const { complaints, loadingComplaints, complaintsError, deleteComplaint } = useComplaints();

    const [isOpen, setIsOpen] = useState(false);
    const [editingComplaint, setEditingCompaint] = useState(null);
    const [complaintToDelete, setComplaintToDelete] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(() => {
        const saved = localStorage.getItem("selectedComplaintBranch");

        return saved ? JSON.parse(saved) : null;
    });

    const selectedBranchForView = useMemo(() => {
        if (accessibleBranches.length === 0) return null;

        const exists = accessibleBranches.find((branch) => branch.id === selectedBranch?.id);

        return exists ?? accessibleBranches[0];
    }, [accessibleBranches, selectedBranch]);

    const normalizedComplaints = useMemo(() => {
        return complaints.map((complaint) => ({
            id: complaint.id,
            branchId: complaint.branch?.id,
            branch: complaint.branch,
            title: complaint.title,
            description: complaint.description,
            status: complaint.status,
            resolvedAt: complaint.resolvedAt,
            resolvedBy: complaint.resolvedBy,
            createdAt: complaint.createdAt,
        }));
    }, [complaints]);

    const handleBranchChange = (branch) => {
        setSelectedBranch(branch);
        localStorage.setItem("selectedComplaintBranch", JSON.stringify(branch));
    };

    const visibleComplaints = useMemo(() => {
        if (user.branch.branchType === "BUILDING_MATERIALS") {
            if (!selectedBranchForView) return [];

            return normalizedComplaints.filter((complaint) => complaint.branchId === selectedBranchForView.id);
        }

        return normalizedComplaints;
    }, [normalizedComplaints, selectedBranchForView, user]);

    const totalComplaints = visibleComplaints.length;
    const unresolvedComplaints = visibleComplaints.filter((c) => c.status === "UNRESOLVED").length;
    const resolvedComplaints = visibleComplaints.filter((c) => c.status === "RESOLVED").length;

    const handleAdd = () => {
        setEditingCompaint(null);
        setIsOpen(true);
    };

    const handleEdit = (complaint) => {
        setEditingCompaint(complaint);
        setIsOpen(true);
    }

    const handleDeleteClick = (complaint) => {
        setComplaintToDelete(complaint);
    };

    const handleDeleteConfirm = async () => {
        if (!complaintToDelete) return;

        try {
            await deleteComplaint(complaintToDelete.id);
            toast.success("Complaint deleted");
            setComplaintToDelete(null);
        } catch (err) {
            toast.error(err.message || "Could not delete complaint");
        }
    };

    if (loadingComplaints) return <p>Loading complaints...</p>;
    if (complaintsError) return <p>{complaintsError}</p>;

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

                <ComplaintOverview
                    onAddClick={handleAdd}
                    totalComplaints={totalComplaints} 
                    unresolvedComplaints={unresolvedComplaints}
                    resolvedComplaints={resolvedComplaints}
                />

                <ComplaintList 
                    formatDate={formatDate}
                    complaintItems={visibleComplaints}
                    onAddClick={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
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
                        <AddComplaints
                            editingComplaint={editingComplaint}
                            selectedBranch={selectedBranchForView}
                            onClose={() => setIsOpen(false)}
                        />
                    </div>
                </div>
            )}

            {complaintToDelete && (
                <div
                    onClick={() => setComplaintToDelete(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
                >
                    <div
                        className="pointer-events-auto w-full max-w-sm"
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ConfirmationModal
                            title="Delete Complaint"
                            message="Are you sure you want to delete this complaint ? This action cannot be undone."
                            confirmText="Delete"
                            cancelText="Cancel"
                            variant="danger"
                            onCancel={() => setComplaintToDelete(null)}
                            onConfirm={handleDeleteConfirm}
                        />
                    </div>
                </div>
            )}
        </>
    );
};