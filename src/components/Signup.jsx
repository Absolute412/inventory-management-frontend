import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"
import { useState } from "react";
import { toast } from "sonner";

export const Signup = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) return;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const cleanName = name.trim();
            const cleanEmail = email.trim();
            
            if (!cleanName || !cleanEmail || !password.trim()) {
                toast.error("All fields required");
                return;
            }

            setSubmitting(true);

            await signup(cleanName, cleanEmail, password);
            toast.success("Signup successful. Please login");

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 800);
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.detail || err.response?.data || "Signup failed";
            
            toast.error(typeof message === "string" ? message : "Signup failed");
            console.error(typeof message === "string" ? message : "Signup failed");
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
            <h1 className="text-2xl text-(--text) font-bold">Create account</h1>
            <p className="mt-1 text-sm text-(--text-muted)">Start tracking and recording </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <input 
                    type="text" 
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text) 
                    outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4
                    focus:ring-(--accent-soft)"
                />

                <input 
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text) 
                    outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4
                    focus:ring-(--accent-soft)"
                />

                <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text) 
                    outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4
                    focus:ring-(--accent-soft)"
                />

                <input 
                    type="password" 
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--text) 
                    outline-none transition duration-200 focus:-translate-y-0.5 focus:border-(--accent) focus:ring-4
                    focus:ring-(--accent-soft)"
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="
                    w-full rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold 
                    text-white transition duration-200 hover:-translate-y-0.5 
                    hover:bg-(--accent-strong) cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? "Signing up..." : "Signup"}
                </button>

                <p className="text-sm text-(--text-muted)">
                    Already have an account?{" "}
                    <Link 
                        to="/login" 
                        className="ml-1 font-semibold text-(--accent) transition hover:text-(--accent-strong)"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    </main>
  )
}
