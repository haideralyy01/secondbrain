import { DeleteIcon } from "../icons/DeleteIcon";
import { NoteIcon } from "../icons/NoteIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";

interface CardProps {
    title: string;
    body?: string;
    link?: string;
    type: "twitter" | "youtube" | "note";
}
export function Card({title,body, link, type}: CardProps) {
    return (
        <div className="bg-white border-b-gray-600 rounded-md shadow-md outline-slate-200 p-4 max-w-80">
            <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
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
            <div className="pt-4">
                { type === "youtube" && <iframe className="w-full" src={link?.replace("watch", "embed").replace("?v=", "/")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> }
                
                { type === "twitter" && <blockquote className="twitter-tweet">
                    <a href={link?.replace("x.com", "twitter.com")}></a>
                </blockquote> }

                { type === "note" && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-gray-700">
                        {body}
                    </div>
                )}
            </div>
        </div>
    );
}