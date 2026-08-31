import { useState } from "react";
// import { useBranches } from "../../hooks/useBranches";
import { useUsers } from "../../hooks/useUsers";
import { toast } from "sonner";
import { UserOverview } from "../components/UserOverview";
import { UserTable } from "../components/UserTable";
import { AddUser } from "../components/AddUser";
import { ConfirmationModal } from "../../components/ConfirmationModal";

export const Users = () => {
    const { users, deleteUser } = useUsers();
    // const { branches } = useBranches();

    const [isOpen, setIsOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    const handleAdd = () => {
        setEditingUser(null);
        setIsOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setIsOpen(true);
     };

     const handleDeleteClick = (user) => {
        setUserToDelete(user);
     };

     const handleDeleteConfirm = async () => {
        if (!userToDelete) return;

        try {
            await deleteUser(userToDelete.id);
            toast.success("User deleted");
            setUserToDelete(null);
        } catch (err) {
            toast.error(err.message || "Could not delete user");
        }
    };

    const totalUsers = users.length;
    const adminCount = users.filter((user) => user.role === "ADMIN").length;
    const managerCount = users.filter((user) => user.role === "MANAGER").length;

    return (
        <>
            <div className="space-y-6">
                <UserOverview
                    onAddClick={handleAdd}
                    totalUsers={totalUsers}
                    adminCount={adminCount}
                    managerCount={managerCount}
                />

                <UserTable
                    users={users}
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
                        <AddUser
                            editingUser={editingUser}
                            onClose={() => setIsOpen(false)}
                        />
                    </div>
                </div>
            )}

            {userToDelete && (
                <div
                    onClick={() => setUserToDelete(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
                >
                    <div
                        className="pointer-events-auto w-full max-w-sm"
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ConfirmationModal
                            title="Delete User"
                            message="Are you sure you want to delete this user? This action cannot be undone."
                            confirmText="Delete"
                            cancelText="Cancel"
                            variant="danger"
                            onCancel={() => setUserToDelete(null)}
                            onConfirm={handleDeleteConfirm}
                        />
                    </div>
                </div>
            )}
        </>
    );
};