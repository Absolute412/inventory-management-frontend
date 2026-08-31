import { Icon } from "@iconify/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navByRole = {
    ADMIN: [
        { name: "Dashboard", path: "/admin", icon: <Icon icon="material-symbols:dashboard-outline-rounded" /> },
        { name: "Branches", path: "/branches", icon: <Icon icon="mdi:domain" /> },
        { name: "Users", path: "/users", icon: <Icon icon="mdi:users-outline" /> },
        { name: "Inventory", path: "/inventory", icon: <Icon icon="material-symbols:inventory" /> },
        { name: "Reports", path: "/reports", icon: <Icon icon="iconoir:reports" /> },
        { name: "Complaints", path: "/complaints", icon: <Icon icon="mdi:comment-alert-outline" /> },
    ],
    MANAGER: [
        { name: "Dashboard", path: "/manager", icon: <Icon icon="material-symbols:dashboard-outline-rounded" /> },
        { name: "Inventory", path: "/m-inventory", icon: <Icon icon="material-symbols:inventory" /> },
        { name: "Reports", path: "/m-reports", icon: <Icon icon="iconoir:reports" /> },
        { name: "Complaints", path: "/m-complaints", icon: <Icon icon="mdi:comment-alert-outline" /> },
    ],
};

export const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = navByRole[user?.role] ?? [];

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <>
            {isOpen && (
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close sidebar"
                    className="fixed inset-0 z-40 bg-black/20 lg:hidden"
                />
            )}

            <aside
                className={`
                    fixed left-0 inset-y-0 z-50 flex flex-col justify-between bg-(--surface-muted) shadow-lg transition-transform duration-300
                    lg:static lg:translate-x-0 lg:shadow-none lg:overflow-visible w-64 border border-(--border) lg:rounded-(--radius) rounded-r-(--radius)
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div className="flex flex-col">
                    <div className="border-b border-(--border) px-5 py-6">
                        <h1 className="mt-2 text-lg font-bold text-(--text) tracking-tight">Bixmind global resources</h1>
                    </div>

                    <div className="relative space-y-2 p-4 md:transition-[padding] md:duration-300 md:ease-in-out">
                        {navItems.map((nav) => (
                            <NavLink
                                key={nav.path}
                                to={nav.path}
                                onClick={() => {setIsOpen(false)}}
                                className={({ isActive }) => `
                                    group relative flex items-center gap-4 px-3 py-2 text-lg font-medium rounded-lg
                                    transition-[background-color,color,transform] duration-300 cursor-pointer
                                    ${isActive
                                        ? "bg-(--accent-soft) text-(--accent-strong) border-(--accent)/30"
                                        : "text-(--text-muted) hover:bg-(--surface)"
                                    }
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`
                                            text-xl transition-transform duration-300 ease-in-out md:scale-100
                                            ${isActive ? "text-(--accent)" : ""}
                                        `}>
                                            {nav.icon}
                                        </span>

                                        <span className="font-semibold text-base whitespace-nowrap md:max-w-40 md:opacity-100">
                                            {nav.name}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div className="flex p-4">
                    <button 
                        onClick={handleLogout}
                        className="w-full rounded-2xl bg-rose-600 hover:bg-rose-700 px-3 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                        <Icon icon="mdi:logout" className="text-lg" />
                        Sign out
                    </button>
                </div>
            </aside>
        </>
    );
};
