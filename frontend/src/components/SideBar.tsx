import { type ReactElement } from "react";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { CrossIcon } from "../icons/CrossIcon";

interface SideBarItemProps {
    text: string;
    icon: ReactElement;
    isActive?: boolean;
    onClick?: () => void;
}

function SideBarItem({ text, icon, isActive, onClick }: SideBarItemProps) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                ${isActive
                    ? "bg-[#e8e5f5] text-[#7164c0] border border-[#7164c0]/30 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
                }`}
        >
            <span className={`flex-shrink-0 w-5 h-5 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 ${isActive ? "text-[#7164c0]" : "text-gray-500"}`}>
                {icon}
            </span>
            <span>{text}</span>
        </button>
    );
}

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
    activeItem?: string;
    onItemClick?: (item: string) => void;
}

function AllIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
    );
}

export function SideBar({ isOpen, onClose, activeItem = "all", onItemClick }: SideBarProps) {
    const navItems = [
        { id: "all", text: "All Content", icon: <AllIcon /> },
        { id: "tweets", text: "Tweets", icon: <TwitterIcon /> },
        { id: "videos", text: "Videos", icon: <YoutubeIcon /> },
        { id: "documents", text: "My Notes", icon: <DocumentIcon /> },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:relative top-0 left-0 z-50 lg:z-auto h-full w-64 bg-white border-r border-gray-200 
                    flex flex-col shrink-0 transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                {/* Close button — mobile only */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 lg:hidden">
                    <span className="text-sm font-semibold text-gray-700">Menu</span>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-gray-500 hover:text-gray-700"
                    >
                        <CrossIcon />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <SideBarItem
                            key={item.id}
                            text={item.text}
                            icon={item.icon}
                            isActive={activeItem === item.id}
                            onClick={() => onItemClick?.(item.id)}
                        />
                    ))}
                </nav>
            </aside>
        </>
    );
}