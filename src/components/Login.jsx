import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

export const Login = () => {
    const { login } = useAuth();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) return;

        try {
            const cleanEmail = email.trim();

            if (!cleanEmail || !password.trim()) {
                console.error("FIelds cannot be empty");
                return;
            }

            setSubmitting(true);

            const user = await login(cleanEmail, password);

            toast.success("Login successful");

            navigate(user.role === "ADMIN" ? "/admin" : "/manager", { replace: true });
        } catch (err) {
            const message = err.response?.data?.detail || err.response?.data || "Login failed";
            
            toast.error(typeof message === "string" ? message : "Login failed");
            console.error(typeof message === "string" ? message : "Login failed");
        } finally {
            setSubmitting(false);
        }
    };
  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-10">
        <div className="
            w-full max-w-md rounded-2xl border border-(--border) bg-(--surface-elevated) p-6 shadow-lg 
            backdrop-blur transition duration-300 hover:shadow-xl
        ">
            <h1 className="text-2xl text-(--text) font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-(--text-muted)">Log in to continue tracking.</p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <input 
                    type="email" 
                    placeholder="Enter email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text) 
                    outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4
                    focus:ring-(--accent-soft)"
                />
                <div className="relative">
                    <input 
                        type={showPassword ? "text" : "password" }
                        placeholder="Enter password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text) 
                        outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4
                        focus:ring-(--accent-soft)"
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
                <button
                    type="submit"
                    disabled={submitting}
                    className="
                    w-full rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold 
                    text-white transition duration-200 hover:-translate-y-0.5 
                    hover:bg-(--accent-strong) cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? "Logging in..." : "Login"}
                </button>
                {/* <p className="text-sm text-(--text-muted)">
                    Not a member?
                    <Link 
                        to="/signup"
                        className="ml-1 font-semibold text-(--accent) transition hover:text-(--accent-strong)"
                    >
                        Sign up now
                    </Link>
                </p> */}
            </form>
        </div>
    </main>
  )
}
