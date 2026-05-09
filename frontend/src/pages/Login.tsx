import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            setError("");
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 via-white to-[#e8e5f5]/30">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Sign in to access your second brain
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email
                            </label>
                            <input
                                ref={emailRef}
                                type="email"
                                placeholder="john@example.com"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#7164c0] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <input
                                ref={passwordRef}
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#7164c0] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-[#7164c0] text-white rounded-lg font-medium text-sm hover:bg-[#5f54a8] transition-colors cursor-pointer shadow-md shadow-[#7164c0]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <button
                            onClick={() => navigate("/signup")}
                            className="text-[#7164c0] font-medium hover:underline cursor-pointer"
                        >
                            Create one
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
