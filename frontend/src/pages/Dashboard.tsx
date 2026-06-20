import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../components/Card";
import { CreateCardModel } from "../components/CreateContentModel";
import { SideBar } from "../components/SideBar";
import { Navbar } from "../components/Navbar";
import ShareLinkModal from "../components/ShareLinkModal";

type ContentType = "youtube" | "twitter" | "note";

type ContentItem = {
    _id: string;
    title: string;
    body?: string;
    link?: string;
    type: ContentType;
};

export function Dashboard() {
    const [modalOpen, setModalOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");
    const [allContent, setAllContent] = useState<ContentItem[]>([]);
    const [shareMessage, setShareMessage] = useState("");
    const [sharing, setSharing] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        async function loadContent() {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:3000/api/v1/contents", {
                headers: {
                    Authorization: token,
                },
            });

            setAllContent(res.data.content || []);
        }

        loadContent().catch((err) => {
            console.error("Failed to load content:", err);
        });
    }, []);

    function handleCreate(content: ContentItem) {
        setAllContent((current) => [content, ...current]);
    }

    // Edit flow: open modal with selected content to edit
    const [editContent, setEditContent] = useState<ContentItem | null>(null);

    function openEditModal(item: ContentItem) {
        setEditContent(item);
        setModalOpen(true);
    }

    function handleUpdate(content: ContentItem) {
        setAllContent((current) => current.map((c) => (c._id === content._id ? content : c)));
    }

    async function handleDelete(id: string) {
        // optimistic UI removal
        const previous = allContent;
        setAllContent((current) => current.filter((c) => c._id !== id));
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3000/api/v1/content/${id}`, {
                headers: { Authorization: token },
            });
        } catch (err) {
            console.error("Failed to delete content:", err);
            // revert on error
            setAllContent(previous);
        }
    }

    async function handleShareBrain() {
        try {
            setSharing(true);
            setShareMessage("");

            const token = localStorage.getItem("token");
            const res = await axios.post(
                "http://localhost:3000/api/v1/brain/share",
                { share: true },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            const url = `${window.location.origin}/share/${res.data.shareLink}`;
            setShareUrl(url);
            setShareModalOpen(true);
            setShareMessage(`Share link generated`);
        } catch (err) {
            console.error("Failed to create share link:", err);
            setShareMessage("Failed to create share link");
        } finally {
            setSharing(false);
        }
    }

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
                onShareBrain={handleShareBrain}
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
                    {shareMessage && (
                        <div className="mb-4 rounded-xl border border-[#7164c0]/20 bg-[#e8e5f5] px-4 py-3 text-sm text-[#4b3f8f]">
                            {sharing ? "Creating share link..." : shareMessage}
                        </div>
                    )}

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
                        <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-4">
                            {filteredContent.map((item) => (
                                <div key={item._id} className="break-inside-avoid mb-4">
                                    <Card
                                        _id={item._id}
                                        title={item.title}
                                        body={item.body}
                                        link={item.link}
                                        type={item.type}
                                        onDelete={handleDelete}
                                        onEdit={() => openEditModal(item)}
                                    />
                                </div>
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
            <CreateCardModel
                open={modalOpen}
                onClose={() => { setModalOpen(false); setEditContent(null); }}
                onCreate={handleCreate}
                contentToEdit={editContent}
                onUpdate={handleUpdate}
            />
            <ShareLinkModal
                open={shareModalOpen}
                shareUrl={shareUrl}
                onClose={() => setShareModalOpen(false)}
            />
        </div>
    );
}
