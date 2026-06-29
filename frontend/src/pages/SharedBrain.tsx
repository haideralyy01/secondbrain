import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "../components/Card";
import { BACKEND_URI } from "../config";

type ContentType = "youtube" | "twitter" | "note";

type ContentItem = {
    _id?: string;
    title: string;
    body?: string;
    link?: string;
    type: ContentType;
};

export function SharedBrain() {
    const { shareLink } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [creatorName, setCreatorName] = useState("");
    const [content, setContent] = useState<ContentItem[]>([]);

    useEffect(() => {
        async function loadSharedBrain() {
            if (!shareLink) {
                setError("Missing share link");
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${BACKEND_URI}/api/v1/brain/${shareLink}`);
                setCreatorName(res.data.name || res.data.email || "Anonymous");
                setContent(res.data.content || []);
            } catch (err) {
                setError("Shared brain not found");
            } finally {
                setLoading(false);
            }
        }

        loadSharedBrain();
    }, [shareLink]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
                Loading shared brain...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm max-w-md w-full">
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">Shared Brain</h1>
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b border-gray-200 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <p className="text-sm text-[#7164c0] font-medium">Shared Brain</p>
                    <h1 className="text-2xl font-bold text-gray-900">{creatorName}</h1>
                    <p className="text-sm text-gray-500 mt-1">Public view of shared notes and links</p>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {content.length > 0 ? (
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                        {content.map((item) => (
                            <div key={item._id} className="break-inside-avoid mb-4">
                                <Card
                                    title={item.title}
                                    body={item.body}
                                    link={item.link}
                                    type={item.type}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
                        No content shared yet.
                    </div>
                )}
            </main>
        </div>
    );
}