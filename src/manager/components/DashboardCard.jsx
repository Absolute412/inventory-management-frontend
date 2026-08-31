import { Icon } from "@iconify/react";

export const DashboardCard = ({ title, subTitle, icon, children, className="" }) => (
    <div className={`rounded-(--radius) border border-(--border) bg-(--surface-muted) p-5 shadow-(--shadow) ${className}`}>
        <div className="flex items-center justify-between gap-4">
            <div>
                <p className="text-sm font-semibold text-(--accent-strong)">{title}</p>
                <h2 className="text-xl font-bold">{subTitle}</h2>
            </div>
            {icon && <Icon icon={icon} className="text-3xl text-(--accent)" />}
        </div>

        {children}
    </div>
);