import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";

interface ModelProps {
    open: boolean;
    onClose: () => void;
}

type ContentType = "youtube" | "twitter" | "note";

export function CreateCardModel({ open, onClose }: ModelProps) {
    const [type, setType] = useState<ContentType>("note");
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<HTMLTextAreaElement>(null);

    function handleSubmit() {
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;
        const body = bodyRef.current?.value;

        // TODO: send data to backend
        console.log({ title, link, body, type });

        onClose()
    }

    if (!open) return null;

    return (
        <div>
            <div
                className="w-screen h-screen bg-slate-500/70 fixed top-0 left-0 z-40"
                onClick={onClose}
            />

            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
                <div className="bg-white rounded-lg shadow-xl p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Add New Content</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                        >
                            <CrossIcon />
                        </button>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                            Title
                        </label>
                        <input
                            ref={titleRef}
                            type="text"
                            placeholder="Enter a title..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#7164c0] focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                            Content Type
                        </label>
                        <div className="flex gap-2">
                            {(["youtube", "twitter", "note"] as ContentType[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setType(t)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize cursor-pointer transition-all ${type === t
                                            ? "bg-[#7164c0] text-white"
                                            : "bg-[#d9ddee] text-[#3730a3] hover:bg-[#c8ccdf]"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {(type === "youtube" || type === "twitter") && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                {type === "youtube" ? "YouTube Link" : "Tweet Link"}
                            </label>
                            <input
                                ref={linkRef}
                                type="url"
                                placeholder={
                                    type === "youtube"
                                        ? "https://www.youtube.com/watch?v=..."
                                        : "https://x.com/user/status/..."
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#7164c0] focus:border-transparent transition-all"
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">
                            {type === "note" ? "Note" : "About / Short Note"}
                        </label>
                        <textarea
                            ref={bodyRef}
                            rows={type === "note" ? 4 : 2}
                            placeholder={type === "note" ? "Write your note here..." : "Add a short description..."}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#7164c0] focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleSubmit}
                            className="bg-[#7164c0] text-white px-6 py-2 rounded-md font-light flex items-center cursor-pointer hover:bg-[#5f54a8] transition-colors"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}