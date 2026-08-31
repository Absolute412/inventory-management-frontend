import { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

export const Settings = () => {
    const { user, updateProfile, updatePassword } = useAuth();

    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [initialName, setInitialName] = useState(user?.name ?? "");
    const [initialEmail, setInitialEmail] = useState(user?.email ?? "");

    const [savingUser, setSavingUser] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const canUpdatePassword = currentPassword && newPassword && confirmPassword && !savingPassword;

    const avatarLabel = useMemo(() => {
        const base = (name || user?.name || user?.email || "").trim();
        return base ? base.charAt(0).toUpperCase() : "?";
    }, [name, user]);

    const isProfileDirty = useMemo(() => {
        return name.trim() !== initialName.trim() || email.trim() !== initialEmail.trim();
    }, [name, email, initialName, initialEmail]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        if (!isProfileDirty) return;

        const cleanName = name.trim();
        const cleanEmail = email.trim();

        if (!cleanName || !cleanEmail) {
            toast.error("Name and email are required");
            return;
        }

        try {
            setSavingUser(true);
            
            await updateProfile({
                name: cleanName,
                email: cleanEmail,
            });

            setName(cleanName);
            setEmail(cleanEmail);
            setInitialName(cleanName);
            setInitialEmail(cleanEmail);

            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Could not update profile");
        } finally {
            setSavingUser(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
        }

        try {
            setSavingPassword(true);
            await updatePassword({
                currentPassword,
                newPassword,
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            toast.success("Password updated");
        } catch (err) {
            const message = err?.response?.data?.detail || "Could not update password.";
            toast.error(message)
        } finally {
            setSavingPassword(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-(--accent)/10 text-lg font-bold text-(--accent)">
                    {avatarLabel}
                </div>

                <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="mt-1 text-sm text-(--text-muted)">
                        Manage your profile and account security.
                    </p>
                </div>
            </div>

            {/* Profile */}
            <section className="rounded-(--radius) border border-(--border) bg-(--surface-muted) p-4 sm:p-6 shadow-(--shadow)">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">Edit Profile</h2>
                    <p className="text-sm text-(--text-muted)">Update your personal account information.</p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div>
                         <label className="text-xs font-semibold text-(--text-muted)">Name</label>
                        <input 
                            type="text" 
                            placeholder="Update name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="
                            w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text-main) 
                            outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4 focus:ring-(--accent-soft)"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-(--text-muted)">Email</label>
                        <input 
                            type="text" 
                            placeholder="Update email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="
                            w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text-main) 
                            outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4 focus:ring-(--accent-soft)"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={!isProfileDirty || savingUser}
                            className="
                            rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold text-white transition 
                            hover:bg-(--accent-strong) cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {savingUser ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </section>

            {/* Security */}
            <section className="rounded-(--radius) border border-(--border) bg-(--surface-muted) p-4 sm:p-6 shadow-(--shadow)">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">Change Password</h2>
                    <p className="text-sm text-(--text-muted)">Update your password.</p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div>
                        <label className="text-xs font-semibold text-(--text-muted)">Current Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="
                                w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text-main) 
                                outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4 focus:ring-(--accent-soft)"
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
                        <label className="text-xs font-semibold text-(--text-muted)">New Password</label>
                        <div className="relative">
                            <input 
                                type={showNewPassword ? "text" : "password"} 
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="
                                w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text-main) 
                                outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4 focus:ring-(--accent-soft)"
                            />

                            <button
                                type="button"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) transition hover:text-(--text) cursor-pointer"
                            >
                                <Icon 
                                    icon={showNewPassword ? "material-symbols:visibility-off" : "material-symbols:visibility"} 
                                    className="text-xl"
                                />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-(--text-muted)">Confirm new Password</label>
                        <div className="relative">
                            <input 
                                type={showConfirmNewPassword ? "text" : "password"} 
                                placeholder="Re-enter new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="
                                w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text-main) 
                                outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4 focus:ring-(--accent-soft)"
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) transition hover:text-(--text) cursor-pointer"
                            >
                                <Icon 
                                    icon={showConfirmNewPassword ? "material-symbols:visibility-off" : "material-symbols:visibility"} 
                                    className="text-xl"
                                />
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={!canUpdatePassword}
                            className="
                            rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold text-white transition 
                            hover:bg-(--accent-strong) cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {savingPassword ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};