/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import Button from "./Button";
import { Download, X } from "lucide-react";

const MessageShareCard = ({ message, user, onClose }) => {
    const cardRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);
        try {
            const dataUrl = await toPng(cardRef.current, { cacheBust: true });
            download(dataUrl, `tokki-reply-${message._id}.png`);
        } catch (err) {
            console.error("Failed to generate image", err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-sm bg-gray-900 rounded-3xl p-6 border border-white/10 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition"
                >
                    <X className="w-6 h-6" />
                </button>

                <h3 className="text-xl font-bold text-white mb-4 text-center">
                    Reply via Story
                </h3>

                {/* The Card to be Captured */}
                <div
                    ref={cardRef}
                    className="aspect-[9/16] w-full rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
                    style={{
                        background: "linear-gradient(180deg, #FAFAFA 0%, #E5E5E5 100%)", // Light background for contrast
                    }}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    {/* Message Bubble */}
                    <div className="relative z-10 w-full bg-gradient-to-br from-rose-500 to-orange-500 rounded-3xl p-6 shadow-xl transform -rotate-2 mb-8 text-center text-white">








                        {/* 
            <div className="text-1xl font-bold break-words leading-tight">
                            &quot;{message.content}&quot;
                        </div> */}




                        <div
                            className="text-1xl font-bold leading-relaxed break-words whitespace-pre-wrap w-full max-h-[55vh] overflow-hidden text-center " >
                            &quot;{message.content}&quot;
                        </div>




                        <div className="mt-4 text-xs font-bold uppercase tracking-widest opacity-80">
                            Anonymous Message
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="z-10 text-center space-y-2">
                        <p className="text-gray-500 font-medium text-sm">
                            Reply anonymously at
                        </p>
                        <div className="bg-black text-white px-4 py-2 rounded-full font-bold text-sm shadow-md">
                            tokki-b2yd.vercel.app/u/{user.username}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <Button onClick={handleDownload} disabled={isGenerating}>
                        {isGenerating ? (
                            "Generating..."
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" /> Download Story
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MessageShareCard;
