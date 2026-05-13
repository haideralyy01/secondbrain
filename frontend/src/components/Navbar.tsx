import { useNavigate, useLocation } from "react-router-dom";
import { BrainIcon } from "../icons/BrainIcon";
import { MenuIcon } from "../icons/MenuIcon";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Button } from "./Button";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
    onMenuClick?: () => void;
    onAddContent?: () => void;
    onShareBrain?: () => void;
    showMenuButton?: boolean;
}

export function Navbar({ onMenuClick, onAddContent, onShareBrain, showMenuButton = true }: NavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const {user, logout, isAuthenticated} = useAuth();
    const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 lg:px-6">
                {/* Left: Menu + Logo */}
                <div className="flex items-center gap-3">
                    {showMenuButton && !isAuthPage && (
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <MenuIcon />
                        </button>
                    )}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <BrainIcon />
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                            Second Brain
                        </h1>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {isAuthPage ? (
                        <>
                            {location.pathname === "/login" ? (
                                <Button
                                    variant="primary"
                                    text="Sign Up"
                                    onClick={() => navigate("/signup")}
                                />
                            ) : (
                                <Button
                                    variant="secondary"
                                    text="Login"
                                    onClick={() => navigate("/login")}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            <Button
                                variant="primary"
                                text="Add content"
                                startIcon={<PlusIcon />}
                                onClick={onAddContent}
                            />
                            <Button
                                variant="secondary"
                                text="Share brain"
                                startIcon={<ShareIcon />}
                                onClick={onShareBrain}
                            />

                            {isAuthenticated && (
                                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                                    <span className="text-sm text-gray-600 hidden sm:inline">
                                        {user?.name}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
