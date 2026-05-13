import { useEffect } from "react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { NoteIcon } from "../icons/NoteIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";

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
    title: string;
    body?: string;
    link?: string;
    type: "twitter" | "youtube" | "note";
}
export function Card({title,body, link, type}: CardProps) {
    useEffect(() => {
        if (type === "twitter") {
            loadTwitterWidgets();
        }
    }, [type, link]);

    return (
        <div className="bg-white border-b-gray-600 rounded-md shadow-md outline-slate-200 p-4 max-w-80 max-h-96 h-80 overflow-hidden flex flex-col">
            <div className="flex justify-between">
                <div className="flex items-center gap-x-2 w-72">
                    {type === "youtube" && (
                        <YoutubeIcon />
                    )}
                    {type === "twitter" && (
                        <TwitterIcon />
                    )}
                    {type === "note" && (
                        <NoteIcon />
                    )}
                    <div className="text-md">
                        {title}
                    </div>
                </div>
                <div className="flex items-center gap-x-4">
                    <a href={link} target="._blank" className="cursor-pointer">
                        <ShareIcon />
                    </a>
                    <div className="cursor-pointer">
                        <DeleteIcon />
                    </div>
                </div>
            </div>
            <div className="pt-4 flex-1 overflow-auto scrollbar-hide">
                { type === "youtube" && <iframe className="w-full" src={getYoutubeEmbedUrl(link)} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> }
                
                { type === "twitter" && <blockquote className="twitter-tweet">
                    <a href={getTwitterEmbedUrl(link)}></a>
                </blockquote> }

                { type === "note" && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-gray-700">
                        {body}
                    </div>
                )}
                {body && (type === "youtube" || type === "twitter") && (
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
                    {body}
                    </div>
                )}
            </div>
        </div>
    );
}