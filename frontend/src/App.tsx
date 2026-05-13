import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { SharedBrain } from "./pages/SharedBrain";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Navbar showMenuButton={false} />
            {children}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/share/:shareLink"
                        element={<SharedBrain />}
                    />
                    <Route
                        path="/login"
                        element={
                            <AuthLayout>
                                <Login />
                            </AuthLayout>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <AuthLayout>
                                <Signup />
                            </AuthLayout>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
