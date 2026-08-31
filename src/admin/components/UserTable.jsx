import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import { Dropdown } from "../../manager/components/Dropdown";

const sortOptions = ["Newest", "Oldest", "Name", "Email", "Role", "Branch"];

export const UserTable = ({
    users=[],
    onAddClick = () => {},
    onEdit = () => {},
    onDelete = () => {},
}) => {
    const [selectedRole, setSelectedRole] = useState("All Roles");
    const [sortBy, setSortBy] = useState("Role");

    const roleOptions = useMemo(() => {
        const roles = [...new Set(users.map((user) => user.role).filter(Boolean))];

        return ["All Roles", ...roles];
    }, [users]);

    const normalizedUsers = useMemo(() => {
        return (users || []).map((user) => ({
            ...user,
            branchName: user.branch?.name || "No branch",
        }));
    }, [users]);

    const filteredUsers = useMemo(() => {
        const visibleUsers = normalizedUsers.filter((user) =>
            selectedRole === "All Roles" ? true : user.role === selectedRole,
        );

        return [...visibleUsers].sort((a, b) => {
            if (sortBy === "Newest") {
                return (b.id ?? 0) - (a.id ?? 0);
            }

            if (sortBy === "Oldest") {
                return (a.id ?? 0) - (b.id ?? 0);
            }

            if (sortBy === "Name") {
                return (a.name ?? "").localeCompare(b.name ?? "");
            }

            if (sortBy === "Email") {
                return (a.email ?? "").localeCompare(b.email ?? "");
            }

            if (sortBy === "Role") {
                return (a.role ?? "").localeCompare(b.role ?? "");
            }

            return (a.branchName ?? "").localeCompare(b.branchName ?? "");
        });
    }, [normalizedUsers, selectedRole, sortBy]);

    return (
        <section className="rounded-(--radius) border border-(--border) bg-(--surface-muted) p-6 shadow-(--shadow)">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm font-semibold text-(--text-muted)">User list</p>
                    <h2 className="text-xl font-bold">Manage system users</h2>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Dropdown
                        icon="material-symbols:category"
                        filter={selectedRole}
                        options={roleOptions}
                        onSelect={(value) => setSelectedRole(value)}
                    />

                    <Dropdown
                        icon="mdi:sort"
                        filter={sortBy}
                        options={sortOptions}
                        onSelect={(value) => setSortBy(value)}
                    />
                </div>
            </div>

            {filteredUsers.length === 0 ? (
                <div className="mt-6 rounded-(--radius) border border-dashed border-(--border) bg-(--surface) px-6 py-10 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--accent)/10 text-(--accent)">
                        <Icon
                            icon="mdi:users-outline"
                            className="text-3xl"
                        />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold">
                        {users.length === 0 ? "No users yet" : "No matching users"}
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-(--text-muted)">
                        {users.length === 0
                            ? "No users have been added yet."
                            : "Try changing the role or sort selection to see more users."}
                    </p>

                    <button
                        onClick={onAddClick}
                        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-(--accent) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--accent-strong)"
                    >
                        <Icon icon="material-symbols:add" className="text-lg" />
                        Add your first user
                    </button>
                </div>
            ) : (
                <div className="mt-6 max-h-[70vh] overflow-x-auto overflow-y-auto custom-scrollbar">
                    <table className="min-w-full border-separate border-spacing-y-3 text-left">
                        <thead>
                            <tr className="text-sm uppercase tracking-[0.12em] text-(--text-muted)">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Branch</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="rounded-3xl bg-(--surface) shadow-(--shadow) transition hover:-translate-y-0.5"
                                >
                                    <td className="px-4 py-4 text-sm text-(--text-muted)">{user.name}</td>
                                    <td className="px-4 py-4 text-sm text-(--text-muted)">{user.email}</td>
                                    <td className="px-4 py-4 text-sm text-(--text-muted)">{user.role}</td>
                                    <td className="px-4 py-4 text-sm text-(--text-muted)">{user.branchName}</td>

                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2 text-(--text-muted)">
                                            <button 
                                                onClick={() => onEdit(user)}
                                                className="rounded-lg border border-(--border) hover:bg-(--surface-muted) px-3 py-2 text-sm font-semibold transition cursor-pointer"
                                            >
                                                Edit
                                            </button>

                                            <button 
                                                onClick={() => onDelete(user)} 
                                                className="rounded-lg text-white bg-rose-500 hover:bg-rose-600 px-3 py-2 text-sm font-semibold transition cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};
