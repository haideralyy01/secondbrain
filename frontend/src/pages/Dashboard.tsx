import { useState } from "react";
import { Card } from "../components/Card";
import { CreateCardModel } from "../components/CreateContentModel";
import { SideBar } from "../components/SideBar";
import { Navbar } from "../components/Navbar";

// Dummy data — replace with real backend data later
const allContent = [
    {
        id: "1",
        title: "My Note",
        body: "This is a sample note card.",
        type: "note" as const,
    },
    {
        id: "2",
        title: "Twitter Post",
        link: "https://x.com/aayushchugh/status/2043568889926463549?s=20",
        type: "twitter" as const,
        body: "Twitter",
    },
    {
        id: "3",
        title: "YouTube Video",
        link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "youtube" as const,
        body: "youtube",
    },
];

export function Dashboard() {
    const [modalOpen, setModalOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");

    // Filter content based on sidebar selection
    const filteredContent = activeFilter === "all"
        ? allContent
        : allContent.filter((item) => {
            if (activeFilter === "tweets") return item.type === "twitter";
            if (activeFilter === "videos") return item.type === "youtube";
            if (activeFilter === "documents") return item.type === "note";
            return true;
        });

    // Label for the current filter
    const filterLabels: Record<string, string> = {
        all: "All Content",
        tweets: "Tweets",
        videos: "Videos",
        documents: "My Notes",
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Navbar at the top */}
            <Navbar
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                onAddContent={() => setModalOpen(true)}
            />

            {/* Content area: Sidebar + Main */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar below navbar */}
                <SideBar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    activeItem={activeFilter}
                    onItemClick={(item) => {
                        setActiveFilter(item);
                        setSidebarOpen(false);
                    }}
                />

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-4 lg:p-6">
                    {/* Section heading */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {filterLabels[activeFilter] || "All Content"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {filteredContent.length} item{filteredContent.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    {/* Cards grid */}
                    {filteredContent.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                            {filteredContent.map((item) => (
                                <Card
                                    key={item.id}
                                    title={item.title}
                                    body={item.body}
                                    link={item.link}
                                    type={item.type}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                            </svg>
                            <p className="text-lg font-medium">No content found</p>
                            <p className="text-sm mt-1">Try a different filter or add new content</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal */}
            <CreateCardModel open={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}
