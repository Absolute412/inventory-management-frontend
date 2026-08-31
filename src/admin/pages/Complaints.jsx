import { useMemo, useState } from "react";import { useBranches } from "../../hooks/useBranches";
import { useComplaints } from "../../hooks/useComplaints";
import { toast } from "sonner";
import { Selects } from "../../manager/components/Selects";
import { ComplaintOverview } from "../../manager/components/ComplaintOverview";
import { ComplaintList } from "../../manager/components/ComplaintList";
import { formatDate } from "../../manager/utils/date";
import { AddComplaints } from "../../manager/components/AddComplaints";
import { ConfirmationModal } from "../../components/ConfirmationModal";

export const Complaints = () => {
    const { branches } = useBranches();
    const { 
        complaints, 
        resolveComplaint,
        reopenComplaint,
        deleteComplaint, 
        loadingComplaints, 
        complaintsError, 
    } = useComplaints();

    const [isOpen, setIsOpen] = useState(false);
    const [editingComplaint, setEditingCompaint] = useState(null);
    const [complaintToDelete, setComplaintToDelete] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(() => {
        const saved = localStorage.getItem("selectedAdminComplaintBranch");

        return saved ? JSON.parse(saved) : null;
    });

    const selectedBranchForView = useMemo(() => {
        if (branches.length === 0) return null;

        const exists = branches.find((branch) => branch.id === selectedBranch?.id);

        return exists ?? branches[0];
    }, [branches, selectedBranch]);

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
        localStorage.setItem("selectedAdminComplaintBranch", JSON.stringify(branch.id));
    };

    const visibleComplaints = useMemo(() => {
        if (!selectedBranchForView) return [];

        return normalizedComplaints.filter((complaint) => complaint.branchId === selectedBranchForView.id);
    }, [normalizedComplaints, selectedBranchForView]);

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

    const handleToggleComplaint = async (complaint) => {
        try {
            if (complaint.status === "RESOLVED") {
                await reopenComplaint(complaint.id);
                toast.success("Complaint reopened");
            } else {
                await resolveComplaint(complaint.id);
                toast.success("Complaint resolved");
            }
        } catch (err) {
            toast.error(err.message || "Could not update complaint");
        }
    };

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
            <div className="mb-6 max-w-sm">
                <label className="mb-4 block text-sm font-semibold">Select Branch</label>
    
                <Selects
                    items={branches}
                    value={selectedBranchForView}
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
                    onResolve={handleToggleComplaint}
                    onReopen={handleToggleComplaint}
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
                            message="Are you sure you want to delete this complaint? This action cannot be undone."
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