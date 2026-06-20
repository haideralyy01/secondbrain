import { useEffect } from "react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { NoteIcon } from "../icons/NoteIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { EditIcon } from "../icons/EditIcon";

function getYoutubeEmbedUrl(link?: string) {
    if (!link) return "";

    try {
        const url = new URL(link);

        if (url.hostname.includes("youtu.be")) {
            const videoId = url.pathname.replace("/", "");
            return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
        }

        if (url.pathname.includes("/embed/")) {
            return link;
        }

        if (url.pathname.includes("/shorts/")) {
            const videoId = url.pathname.split("/shorts/")[1]?.split("/")[0];
            return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
        }

        const videoId = url.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : link;
    } catch {
        return link;
    }
}

function getTwitterEmbedUrl(link?: string) {
    if (!link) return "";

    try {
        const url = new URL(link.replace("x.com", "twitter.com"));
        return url.toString();
    } catch {
        return link.replace("x.com", "twitter.com");
    }
}

function loadTwitterWidgets() {
    if (document.getElementById("twitter-wjs")) {
        return;
    }

    const script = document.createElement("script");
    script.id = "twitter-wjs";
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);
}

interface CardProps {
    _id?: string;
    title: string;
    body?: string;
    link?: string;
    type: "twitter" | "youtube" | "note";
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
}
export function Card({ _id, title, body, link, type, onDelete, onEdit }: CardProps) {
    useEffect(() => {
        if (type === "twitter") {
            loadTwitterWidgets();
            const twttr = (window as any).twttr;
            if (twttr && twttr.widgets) {
                twttr.widgets.load();
            } else {
                const interval = setInterval(() => {
                    const loadedTwttr = (window as any).twttr;
                    if (loadedTwttr && loadedTwttr.widgets) {
                        loadedTwttr.widgets.load();
                        clearInterval(interval);
                    }
                }, 100);
                return () => clearInterval(interval);
            }
        }
    }, [type, link]);

    return (
        <div className="bg-white border-b-gray-600 rounded-md shadow-md outline-slate-200 p-4 w-full flex flex-col">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-x-2 flex-1 min-w-0 mr-2">
                    {type === "youtube" && (
                        <YoutubeIcon />
                    )}
                    {type === "twitter" && (
                        <TwitterIcon />
                    )}
                    {type === "note" && (
                        <NoteIcon />
                    )}
                    <div className="text-md font-medium text-gray-800 truncate">
                        {title}
                    </div>
                </div>
                <div className="flex items-center gap-x-3 shrink-0">
                    {link && (
                        <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="cursor-pointer text-gray-500 hover:text-indigo-600 transition-colors"
                            title="Open link"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                        </a>
                    )}
                    {onEdit && _id && (
                        <button 
                            onClick={() => onEdit(_id)} 
                            className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                            title="Edit card"
                        >
                            <EditIcon />
                        </button>
                    )}
                    {onDelete && _id && (
                        <div 
                            className="cursor-pointer text-gray-500 hover:text-red-500 transition-colors" 
                            onClick={() => onDelete(_id)}
                            title="Delete card"
                        >
                            <DeleteIcon />
                        </div>
                    )}
                </div>
            </div>
            <div className="pt-4">
                { type === "youtube" && <iframe className="w-full aspect-video rounded-md" src={getYoutubeEmbedUrl(link)} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> }
                
                { type === "twitter" && <blockquote className="twitter-tweet">
                    <a href={getTwitterEmbedUrl(link)}></a>
                </blockquote> }

                { type === "note" && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                        {body}
                    </div>
                )}
                {body && (type === "youtube" || type === "twitter") && (
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                    {body}
                    </div>
                )}
            </div>
        </div>
    );
}