import { useNavigate, useLocation } from "react-router-dom";
import { BrainIcon } from "../icons/BrainIcon";
import { MenuIcon } from "../icons/MenuIcon";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Button } from "./Button";

interface NavbarProps {
    onMenuClick?: () => void;
    onAddContent?: () => void;
    showMenuButton?: boolean;
}

export function Navbar({ onMenuClick, onAddContent, showMenuButton = true }: NavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

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
                            />
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
