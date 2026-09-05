import { Icon } from "@iconify/react";
import { useState } from "react";

export const ConfirmationModal = ({
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onCancel,
    onConfirm,
    variant = "danger",
}) => {
    const danger = variant === "danger";
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (loading) return;

        try {
            setLoading(true);
            await onConfirm();
        } finally {
            setLoading(false);
        }
    }
  return (
    <section 
        className="
        w-full max-w-sm mx-auto rounded-2xl border border-(--border) bg-(--surface) p-5 shadow-sm
        flex flex-col items-center space-y-4"
    >
        <div
            className={`
                flex h-14 w-14 items-center justify-center rounded-2xl border
                ${danger
                    ? "bg-rose-100 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 text-rose-700 dark:text-rose-400"
                    : "bg-(--surface-muted) border-(--border) text-(--text-muted)"
                }`}
            aria-hidden="true"
        >
            <Icon icon="si:warning-duotone" className="text-2xl" />
        </div>

        <h1 className="text-xl font-bold text-(--text-primary)">{title}</h1>

        <p className="text-(--text-muted) text-sm text-center">{message}</p>

        <div className="flex items-center gap-3">
            <button
                onClick={onCancel}
                className="
                px-5 py-2 rounded-lg text-sm font-semibold
                bg-(--surface-muted) hover:bg-(--surface-elevated) transition cursor-pointer"
            >
                {cancelText}
            </button>
            <button
                onClick={handleConfirm}
                disabled={loading}
                className={`
                px-5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                ${danger
                    ? "bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-950/60 dark:text-rose-200 dark:hover:bg-rose-900/70"
                    : "bg-(--primary) text-white hover:bg-(--primary-hover)"
                }`}
            >
                {loading ? "Processing..." : confirmText}
            </button>
        </div>
    </section>
  );
}
