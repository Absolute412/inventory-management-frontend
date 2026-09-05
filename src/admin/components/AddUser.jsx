import { useEffect, useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Selects } from "../../manager/components/Selects";
import { useBranches } from "../../hooks/useBranches";

const initialUserForm = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    branchId: "",
};

const getInitialFormData = ({
    editingUser,
    presetName,
    presetEmail,
    presetRole,
}) => {
    if (editingUser) {
        return {
            name: editingUser.name ?? "",
            email: editingUser.email ?? "",
            password: "",
            confirmPassword: "",
            role: editingUser.role ?? "",
            branchId: String(editingUser.branchId ?? editingUser.branch?.id ?? ""),
        };
    }

    return {
        ...initialUserForm,
        name: presetName || "",
        email: presetEmail || "",
        password: "",
        confirmPassword: "",
        role: presetRole || "",
    };
};

const roleOptions = [
    { id: "ADMIN", name: "Admin" },
    { id: "MANAGER", name: "Manager" },
];

export const AddUser = ({
    editingUser,
    presetName,
    presetEmail,
    presetPassword,
    presetConfirmPassword,
    presetRole,
    onSaved,
    onCancelEdit,
    onClose,
}) => {
    const { addUser, updateUser } = useUsers();
    const { branches } = useBranches();

    const [formData, setFormData] = useState(() =>
        getInitialFormData({
            editingUser,
            presetName,
            presetEmail,
            presetPassword,
            presetConfirmPassword,
            presetRole
        }),
    );

    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(
            getInitialFormData({
                editingUser,
                presetName,
                presetEmail,
                presetPassword,
                presetConfirmPassword,
                presetRole,
            })
        );
    }, [
        editingUser,
        presetName,
        presetEmail,
        presetPassword,
        presetConfirmPassword,
        presetRole,
    ]);

    const branchOptions = branches.map((branch) => ({
        id: String(branch.id),
        name: branch.name,
    }));

    const selectedRole = 
        roleOptions.find((item) => item.id === formData.role) || null;

    const selectedBranch = 
        branchOptions.find((item) => item.id === String(formData.branchId)) || null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleRoleChange = (item) => {
        setFormData((prev) => ({
            ...prev,
            role: item.id,
            branchId: item.id === "ADMIN" ? "" : prev.branchId,
        }));
    };

    const handleBranchChange = (item) => {
        setFormData((prev) => ({
            ...prev,
            branchId: item.id,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanName = formData.name.trim();
        const cleanEmail = formData.email.trim();
        const cleanRole = formData.role.trim();
        const cleanBranchId = formData.branchId ? Number(formData.branchId) : undefined;

        if (!cleanName || !cleanEmail || !cleanRole) {
            toast.error("Name, email, and role are required");
            return;
        }

        if (cleanRole === "MANAGER" && !cleanBranchId) {
            toast.error("Branch is required for managers");
            return;
        }

        if (!editingUser) {
            if (!formData.password || !formData.confirmPassword) {
                toast.error("Password and confirm password are required");
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
        }

        setSubmitting(true);

        try {
            const basePayload = {
                name: cleanName,
                email: cleanEmail,
                role: cleanRole,
            };

            const payload = editingUser
                ? {
                    ...basePayload,
                    branchId: cleanRole === "MANAGER" ? cleanBranchId : null,
                }
                : {
                    ...basePayload,
                    ...(cleanRole === "MANAGER" && cleanBranchId
                        ? { branchId: cleanBranchId }
                        : {}),
                    password: formData.password,
                };

            if (editingUser) {
                await updateUser(editingUser.id, payload);
                toast.success("User updated");
            } else {
                await addUser(payload);
                toast.success("User added");
            }

            setFormData(initialUserForm);
            setShowPassword(false);
            setShowConfirmPassword(false);
            onSaved?.();
            onClose?.();
        } catch (err) {
            toast.error(err?.message || "Could not save user.");
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
                {editingUser ? "Edit User" : "Add User"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-110 overflow-y-auto">
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
                    <label className="mb-1 block text-sm font-medium">Email</label>
                    <input 
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter Email"
                        className="
                        w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm 
                        outline-none transition duration-200 focus:border-(--accent) focus:ring-4 focus:ring-(--accent)"
                    />
                </div>

                {!editingUser && (
                    <>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    className="
                                    w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm 
                                    outline-none transition duration-200 focus:border-(--accent) focus:ring-4 focus:ring-(--accent)"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) transition hover:text-(--text) cursor-pointer"
                                >
                                    <Icon 
                                        icon={showPassword ? "material-symbols:visibility-off" : "material-symbols:visibility"} 
                                        className="text-xl"
                                    />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Confirm Password</label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    className="
                                    w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm 
                                    outline-none transition duration-200 focus:border-(--accent) focus:ring-4 focus:ring-(--accent)"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) transition hover:text-(--text) cursor-pointer"
                                >
                                    <Icon 
                                        icon={showConfirmPassword ? "material-symbols:visibility-off" : "material-symbols:visibility"} 
                                        className="text-xl"
                                    />
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {formData.role === "MANAGER" && (
                    <div>
                        <label className="mb-1 block text-sm font-medium">Branch</label>
                        
                        <Selects
                            items={branchOptions}
                            value={selectedBranch}
                            onChange={handleBranchChange}
                            getLabel={(item) => item.name}
                        />
                    </div>
                )}

                <div>
                    <label className="mb-1 block text-sm font-medium">Role</label>
                    <Selects
                        items={roleOptions}
                        value={selectedRole}
                        onChange={handleRoleChange}
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
                        : editingUser
                            ? "Save Changes"
                            : "Add User"}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setFormData(initialUserForm);
                            setShowPassword(false);
                            setShowConfirmPassword(false);
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
