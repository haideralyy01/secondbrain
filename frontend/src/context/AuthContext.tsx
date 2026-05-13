import axios from "axios";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    token?: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.response?.data?.msg || fallback;
    }

    if (error instanceof Error) {
        return error.message || fallback;
    }

    return fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On mount, check localStorage for existing session
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser && savedUser !== "undefined") {
            try {
                setUser(JSON.parse(savedUser));
            } catch (err) {
                console.error("Invalid user JSON:", err);
                localStorage.removeItem("user");
            }
        }
        setIsLoading(false);
    }, []);


    const isAuthenticated = !!user;

    async function login(email: string, password: string) {
        try {
            const res = await axios.post("http://localhost:3000/api/v1/signin", {
                email,
                password,
            });

            if (res.status === 200) {
                setUser(res.data.user);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
            } else {
                throw new Error(res.data.message || "Login failed");
            }
        } catch (err) {
            throw new Error(getErrorMessage(err, "Login failed"));
        }
    }

    async function signup(name: string, email: string, password: string) {
        try {
            const res = await axios.post("http://localhost:3000/api/v1/signup", {
                name,
                email,
                password,
            });

            if (res.status === 200) {
                setUser(res.data.user);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
            } else {
                throw new Error(res.data.message || "Signup failed");
            }
        } catch (err) {
            throw new Error(getErrorMessage(err, "Signup failed"));
        }
    }

    function logout() {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isLoading,
                isAuthenticated,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
