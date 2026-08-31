import { Icon } from "@iconify/react";

export const UserOverview = ({ onAddClick, totalUsers, adminCount, managerCount }) => {
    return (
        <section className="space-y-4 rounded-(--radius) border border-(--border) bg-(--surface-muted) p-6 shadow-(--shadow)">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-(--accent-strong)">Admin Users</p>
                    <h1 className="text-2xl font-bold">User overview</h1>
                    <p className="mt-2 text-sm text-(--text-muted)">
                        Manage system users, roles, and branch access from one place.
                    </p>
                </div>

                <button
                    onClick={onAddClick}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-(--accent) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--accent-strong)"
                >
                    <Icon icon="material-symbols:add" className="text-lg" />
                    Add User
                </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
                <article className="rounded-(--radius) border border-(--border) bg-(--surface) p-4">
                    <p className="text-sm font-semibold text-(--text-muted)">Total Users</p>
                    <h2 className="mt-3 text-3xl font-bold">
                        {totalUsers}
                    </h2>
                </article>

                <article className="rounded-(--radius) border border-(--border) bg-(--surface) p-4">
                    <p className="text-sm font-semibold text-(--text-muted)">Admin count</p>
                    <h2 className="mt-3 text-3xl font-bold">
                        {adminCount}
                    </h2>
                </article>

                <article className="rounded-(--radius) border border-(--border) bg-(--surface) p-4">
                    <p className="text-sm font-semibold text-(--text-muted)">Manager count</p>
                    <h2 className="mt-3 text-3xl font-bold">
                        {managerCount}
                    </h2>
                </article>
            </div>
        </section>
    );
};