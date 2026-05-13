interface Props {
    open: boolean;
    shareUrl?: string;
    onClose: () => void;
}

export function ShareLinkModal({ open, shareUrl, onClose }: Props) {
    if (!open) return null;

    async function copyLink() {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
        } catch (err) {
            console.error("Copy failed", err);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Share link</h3>
                        <p className="text-sm text-gray-500 mt-1">Anyone with this link can view your public brain.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 rounded-md"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="mt-4">
                    <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 break-words">
                        {shareUrl || "-"}
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                        <a
                            href={shareUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2 rounded-md bg-white border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Open
                        </a>
                        <button
                            onClick={copyLink}
                            className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                        >
                            Copy link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShareLinkModal;
