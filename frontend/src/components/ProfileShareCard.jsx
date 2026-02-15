/* eslint-disable react/prop-types */
import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import Button from './Button';
import { Download, X } from 'lucide-react';

const ProfileShareCard = ({ user, onClose }) => {
    const cardRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);
        try {
            const dataUrl = await toPng(cardRef.current, { cacheBust: true });
            download(dataUrl, `tokki-profile-${user.username}.png`);
        } catch (err) {
            console.error('Failed to generate image', err);
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

                <h3 className="text-xl font-bold text-white mb-4 text-center">Share Your Link</h3>

                {/* The Card to be Captured */}
                <div 
                    ref={cardRef}
                    className="aspect-[9/16] w-full rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #FF0080 0%, #7928CA 100%)',
                    }}
                >
                    {/* Decorative blurred circles for depth */}
                    <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-black/20 rounded-full blur-3xl"></div>

                    {user.photoURL ? (
                        <img 
                            src={user.photoURL} 
                            alt={user.username} 
                            className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover z-10"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-white text-rose-600 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg z-10">
                            {user.username[0].toUpperCase()}
                        </div>
                    )}

                    <div className="z-10 space-y-2">
                        <h2 className="text-white font-bold text-2xl drop-shadow-md">@{user.username}</h2>
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 text-white font-medium text-sm">
                            Send me anonymous messages! 👀
                        </div>
                    </div>

                    <div className="z-10 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-white/80 font-mono mt-auto mb-4">
                        tokki.app/u/{user.username}
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <Button onClick={handleDownload} disabled={isGenerating}>
                        {isGenerating ? 'Generating...' : <><Download className="w-4 h-4 mr-2" /> Download Story</>}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProfileShareCard;
