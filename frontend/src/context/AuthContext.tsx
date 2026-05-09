import axios from "axios";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    token?: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On mount, check localStorage for existing session
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const isAuthenticated = !!user;

    async function login(email: string, password: string) {
        try {
            const res = await axios.post("http://localhost:3000/api/login", {
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
            throw err instanceof Error ? err : new Error("Login failed");
        }
    }

    async function signup(username: string, email: string, password: string) {
        try {
            const res = await axios.post("http://localhost:3000/api/signup", {
                username,
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
            throw err instanceof Error ? err : new Error("Signup failed");
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
